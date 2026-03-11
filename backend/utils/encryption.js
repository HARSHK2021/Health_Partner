import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

const getEncryptionKey = () => {
  const key = process.env.FILE_ENCRYPTION_KEY;
  if (!key) {
    throw new Error('FILE_ENCRYPTION_KEY environment variable is required');
  }
  return crypto.createHash('sha256').update(key).digest();
};

export const encryptBuffer = (buffer) => {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Combine IV + AuthTag + EncryptedData into single buffer
  const combined = Buffer.concat([iv, authTag, encrypted]);
  
  return combined;
};

export const decryptBuffer = (encryptedBuffer) => {
  const key = getEncryptionKey();

  const iv = encryptedBuffer.slice(0, IV_LENGTH);
  const authTag = encryptedBuffer.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = encryptedBuffer.slice(IV_LENGTH + AUTH_TAG_LENGTH);
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  
  return decrypted;
};
export const generateSecureFileId = () => {
  return crypto.randomBytes(16).toString('hex');
};