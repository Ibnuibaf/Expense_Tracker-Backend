import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
dotenv.config()

export async function sendVerificationMail(email, message) {
    try {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.verifyAppEmail,
          pass: process.env.verifyAppPassword,
        },
      });
      const mailOptions = {
        from: process.env.verifyAppEmail,
        to: email,
        subject: "Warning !, Your meet your budget",
        html: `<p>Hey There!. You have come to meet your budget of a Category<br> 
          <b>${message}</b> </p><br>`,
      };
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.log("Error occurred");
          console.log(err);
          return {
            status: 500,
            data: {
              success: false,
              message: "server error",
            },
          };
        } else {
          console.log("Code is sent");
        }
      });
      return {
        status: 200,
        data: {
          success: true,
          message: "Warning Mail send",
        },
      };
    } catch (error) {
        console.error(error);
      return {
        status: 500,
        data: {
          success: false,
          message: error.message,
        },
      };
    }
  }