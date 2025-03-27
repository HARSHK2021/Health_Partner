import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';
import mongoose from 'mongoose';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Encryption/Decryption Utilities
const IV_LENGTH = 16; // AES block size

const encryptBuffer = (buffer) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.FILE_ENCRYPTION_KEY),
    iv
  );
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

const decryptToBuffer = (encryptedData) => {
  const [ivHex, encryptedHex] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.FILE_ENCRYPTION_KEY),
    iv
  );
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, 'hex')),
    decipher.final()
  ]);
};

// Controller Functions
export const uploadMedicalRecord = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const userName = req.user.firstName.toLowerCase().replace(/\s+/g, '_');
    
    // Process files
    const uploadEncryptedFile = async (file, folderType) => {
      const encrypted = encryptBuffer(file.buffer);
      const folder = `medicalrecords/${userName}_${userId}/${folderType}`;
      
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${Buffer.from(encrypted).toString('base64')}`, 
        {
          folder,
          resource_type: 'auto',
          type: 'private'
        }
      );
      return result.secure_url;
    };

    // Upload all files in parallel
    const [prescriptionUrls, reportUrls] = await Promise.all([
      Promise.all(
        (req.files?.prescriptionImages || []).map(file => 
          uploadEncryptedFile(file, 'prescriptions')
      ),
      Promise.all(
        (req.files?.medicalReports || []).map(file => 
          uploadEncryptedFile(file, 'reports'))
    ]);

    // Save record
    const newRecord = new MedicalRecord({
      user: userId,
      ...req.body,
      prescriptionImages: prescriptionUrls,
      medicalReports: reportUrls
    });

    const savedRecord = await newRecord.save({ session });
    await User.findByIdAndUpdate(
      userId,
      { $push: { medicalHistory: savedRecord._id } },
      { session }
    );

    await session.commitTransaction();
    res.status(201).json(savedRecord);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ 
      message: 'Failed to create record',
      error: error.message 
    });
  } finally {
    session.endSession();
  }
};

export const getMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findOne({
      _id: req.params.id,
      user: req.user._id // Ensure ownership
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Decrypt files
    const decryptFile = async (url) => {
      const publicId = url.split('/').pop().split('.')[0];
      const encryptedData = await cloudinary.api.resource(publicId, {
        type: 'private',
        resource_type: 'image'
      }).then(res => Buffer.from(res.secure_url, 'base64').toString('utf-8'));

      return decryptToBuffer(encryptedData);
    };

    const [prescriptionImages, medicalReports] = await Promise.all([
      Promise.all(record.prescriptionImages.map(decryptFile)),
      Promise.all(record.medicalReports.map(decryptFile))
    ]);

    res.json({
      ...record.toObject(),
      prescriptionImages,
      medicalReports
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch record',
      error: error.message 
    });
  }
};