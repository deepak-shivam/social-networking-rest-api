const nodemailer = require('nodemailer');


const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  debug: true,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD
  }
})

const sendMail = async (email, secretToken, mode) => {
  try {
    if (mode == 'email') { 
      return await transport.sendMail({
        from: process.env.GMAIL_USERNAME,
        to: email,
        subject: "Email Confirmation",
        html: `
        <h1>Welcome </h1>
        <p>Thanks for creating an account. Click 
          <a href=http://localhost:3000/user/verifyEmail/${secretToken}>here</a> to confirm your account.
        </p> 
      `
      })
    }
    if (mode == 'OTP') {
      return await transport.sendMail({
        from: process.env.GMAIL_USERNAME,
        to: email,
        subject: "OTP Submission",
        html: `
        <h1>Reset Password</h1>
        <p> Here is your otp to change the password ${secretToken} </p>
      `
      })
    }
    if (mode = "deactivate")
       return await transport.sendMail({
        from: process.env.GMAIL_USERNAME,
        to: email,
        subject: "Account Deactivated",
        html: `<h1>Thank you!<strong>${secretToken}</strong> for using our app </h1>
        <p>You have successfully deactivated your account</p>
        <h1>Hope we will see you in future </h1>`
       })           
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = sendMail  