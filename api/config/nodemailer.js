import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secure: false,
  port: 587,
  auth: {
    user: 'lucasoliveiradiello@gmail.com',
    pass: 'rmjl ywvv vzev rvuw',
  },

});
export default transporter;
