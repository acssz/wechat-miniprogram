const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
// 引入 nodemailer
const nodemailer = require('nodemailer')
// 创建一个SMTP客户端配置
const config = {
  host: 'smtp.office365.com', 
  port: 587,
  auth: {
    user: 'acsszBot@outlook.com', // 邮箱账号
    pass: 'bphsmghrncjvewuu' // 邮箱授权码
  }
};
// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(config);

// 云函数入口函数
exports.main = async (event, context) => {
  // 创建一个邮件对象
  var mail = {
    // 发件人，填写发件人邮箱
    from: 'acsszBot@outlook.com',
    // 主题
    subject: '激活学联卡',
    // 收件人
    to: event.content.mailbox,
    // 邮件内容，text或者html格式
    text: "验证码 "+event.content.text
  };
  let res = await transporter.sendMail(mail);
  return res;
}