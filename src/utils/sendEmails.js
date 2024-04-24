import nodemailer from "nodemailer";

export async function sendEmail({to,subject,html,attachments=[]}){
  const transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 465,
      secure: true,
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
    

    if(html){
      const info = await transporter.sendMail({
        from: `"E-Commerce 👻" <${process.env.EMAIL}>`, 
        to , 
        subject , 
        html,
      });
      if(info.accepted.length>0)return true
    }else{
      const info = await transporter.sendMail({
        from: `"E-Commerce 👻" <${process.env.EMAIL}>`, 
        to , 
        subject , 
        html,
        attachments,
      });
      if(info.accepted.length>0)return true
    }
   
    
   
    return false
}
