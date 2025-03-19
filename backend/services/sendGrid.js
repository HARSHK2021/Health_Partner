import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY)



 const mailSender = async(email,title,body,text)=>{
    sgMail.setApiKey(process.env.GRID_API_KEY)
    try{
        await sgMail.send({
            to: `${email}`,
            from: process.env.EMAIL_FROM,
            subject: `${title}`,
            text: `${text}`, // plain text body
            html: `${body}`,
          
        })
        // console.log("Email sent successfully")
      
    }catch(error){
        console.error(error)
         return { success: false, message: "Failed to send email" };
    }




}

export default mailSender;
