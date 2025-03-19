import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  export const sendMessage = async (phone,body)=>{
   try {
    let formattedPhone =  `+91${phone}`;
    const message = await twilioClient.messages.create({
        body: body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone, // User's phone number
      });
      console.log("Message sent successfully:", message.body);
   } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");

   }
   
  };