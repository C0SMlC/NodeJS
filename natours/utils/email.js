const nodemailer = require('nodemailer');
const postmarkTransport = require('nodemailer-postmark-transport');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.userEmail = user.email;
    this.userFirstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Pratik Pendurkar <${process.env.EMAIL_FROM}>`;
  }

  createTransporter() {
    if (process.env.NODE_ENV === 'production') {
      // Create a transport object using the Postmark transport layer.
      return nodemailer.createTransport(
        postmarkTransport({
          auth: {
            apiKey: '6def1c19-b840-460b-bfa7-c4d3464739cf',
          },
        })
      );
    }
    // Use the default SMTP transport for non-production environments.
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // 1. Render html based email template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.userFirstName,
      url: this.url,
      subject,
    });
    // 2. Define the email options
    const mailOptions = {
      from: this.from,
      to: this.userEmail,
      subject: subject,
      html,
      text: htmlToText.convert(html),
      // html
    };
    // 3. create a transport and send email
    await this.createTransporter().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome To The Natours Family!');
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Reset the password');
  }
};

// const sendEmail = async (options) => {
//   // 1. create transportar
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });
//   // 2. define the email options

//   const mailOptions = {
//     from: 'Pratik Pendurkar',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     // html
//   };
//   // 3. actually send the email
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
