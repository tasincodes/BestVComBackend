const nodemailer = require('nodemailer');


const createToken = require('./createToken');


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'tech.syscomatic@gmail.com',
    pass: 'uloa elbv qmkt aezf',
  },
});




exports.SendEmailUtility = async (EmailTo, EmailText, EmailSubject) => {
  let mailOptions = {
    from: 'BestElectronics-Technologies  <tech.syscomatic@gmail.com>',
    to: EmailTo,
    subject: EmailSubject,
    text: EmailText,
  };

  return new Promise((resolve) => {
    transporter.sendMail(mailOptions, (err, info) => {
      console.log({ info });
      if (err) {
        resolve(err);
      }
      resolve(info);
    });
  });
};



exports.otpMail = async(email,otp)=>{

  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'shahriartasin2000@gmail.com',
          pass: process.env.EMAIL_PASS
      }
  });

  const mailOptions = {
      from: 'tech.syscomatic@gmail.com',
      to: email,
      subject: 'Otp for forget pass',
      html: `
          <p>Hello ,</p>
          <p>Welcome to our platform! your otp is ${otp}</p>
          
      `
  };
  await transporter.sendMail(mailOptions);
  // res.status(200).json({ message: 'Email sent successfully' });
}



