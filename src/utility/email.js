const nodemailer = require('nodemailer');


const createToken = require('./createToken');



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tech.syscomatic@gmail.com', // your email address
    pass: 'xaqt bebl vjfn qdcu' 
  }
});

exports.SendEmailUtility = async (EmailTo, EmailText, EmailSubject) => {
  let mailOptions = {
    from: 'BestElectronics-Technologies <tech.syscomatic@gmail.com>',
    to: EmailTo,
    subject: EmailSubject,
    text: EmailText,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        reject(err);
      } else {
        console.log('Email sent:', info.response);
        resolve(info);
      }
    });
  });
};

exports.otpMail = async (email, otp) => {
  const mailOptions = {
    from: 'tech.syscomatic@gmail.com',
    to: email,
    subject: 'OTP for Registration',
    html: `
      <p>Hello,</p>
      <p>Welcome to our platform! Your OTP is ${otp}</p>
    `
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending OTP email:', err);
        reject(err);
      } else {
        console.log('OTP email sent:', info.response);
        resolve(info);
      }
    });
  });
};



// exports.otpMail = async(email,otp)=>{

//   const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//           user: 'shahriartasin2000@gmail.com',
//           pass: process.env.EMAIL_PASS
//       }
//   });

//   const mailOptions = {
//       from: 'tech.syscomatic@gmail.com',
//       to: email,
//       subject: 'Otp for forget pass',
//       html: `
//           <p>Hello ,</p>
//           <p>Welcome to our platform! your otp is ${otp}</p>
          
//       `
//   };
//   await transporter.sendMail(mailOptions);
//   // res.status(200).json({ message: 'Email sent successfully' });
// }



