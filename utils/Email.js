const path = require('path');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../config/config.env` });

// new Email(user, url).sendWelcome();

module.exports = class Email {
  constructor(user, url, dataObj) {
    this.to = user.email;
    this.fristName = user.name.split(' ')[0];
    this.url = url;
    this.dataObj = dataObj;
    this.from = process.env.EMAIL_FROM;
  }

  newTransport() {
    // if (process.env.NODE_ENV === 'production') {
    //   //sendgrid
    //   return 1;
    // }
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
    try {
      const templatePath = path.join(__dirname, '../views/emails', `${template}.ejs`);
      console.log(templatePath);
      //1) Render the html based on ejs template
      const html = await ejs.renderFile(templatePath, {
        fristName: this.fristName,
        url: this.url,
        dataObj: this.dataObj,
        subject,
      });

      //2) Define email options
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
      };

      //3) Create a transport and send email
      await this.newTransport().sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendWelcome() {
    await this.send('Welcome', 'Welcome to the natours family');
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
  }

  async sendOt() {
    await this.send('otp', 'Your otp (valid for only 10 minutes)');
  }

  async sendverifyToken() {
    await this.send('verifyToken', 'Your verify code (valid for only 10 minutes)');
  }
};
