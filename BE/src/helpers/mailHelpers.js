const { createTransport } = require("nodemailer");

const sendApproveAccount = async (email, name, OTP) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Approval Required</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #eee5da;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #679089;
                }
                h3 {
                    color: #f18966;
                }
                h2 {
                    color: #f18966;
                }
                p {
                    line-height: 1.5;
                }
                a {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 20px;
                    background-color: #679089;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 4px;
                }
                a:hover {
                    background-color: #557b6d;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Hello, ${name}!</h1>
                <p>We need your confirmation to approve your account registration.</p>
                <p>Please input the otp below to approve your account and complete the setup process: </p>
                <p>If you did not request this or have any questions, feel free to contact our support team.</p>
                <p style="font-style: italic;">Best regards,</p>
                <h2>Your OTP: ${OTP}</h2>
                <h3>Etutor CO.,LTD</h3>
            </div>
        </body>
        </html>
    `;

  await transport.sendMail({
    from: process.env.Gmail,
    to: email,
    subject: "Account Approval Required",
    html,
  });
};

const sendForgotPassword = async (email, name, OTP) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });
  const html = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Your verify code</title>
          <style>
              body{
                  font-family: Arial, san-serif;
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
              }
              .container{
                  background-color: #eee5da;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  text-align: center;
              }
               h1{
                  color: #679089;
               }
               p{
                  margin-bottom: 20px;
               }
               .otp{
                  font-size: 36px;
                  color: #f18966;
                  margin-bottom: 30px;
               }
          </style>
        </head>
        <body>
         <div class="container">
          <h1>New Password</h1>
          <p>Hello ${name} your verify code for reset password is:</p>
          <p class="Password" style="color: #f18966; font-weigth: bold;">${OTP}</p>
         </div>
        </body>
      </html>
      `;

  await transport.sendMail({
    from: process.env.Gmail,
    to: email,
    subject: subject,
    html,
  });
};

module.exports = { sendApproveAccount, sendForgotPassword };
