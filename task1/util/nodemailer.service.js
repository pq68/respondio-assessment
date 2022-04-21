const nodemailer = require('nodemailer');

const EmailService = {
    buyProductNotification: buyProductNotification,
}

async function buyProductNotification(product) {
    try {
        let transporter = nodemailer.createTransport({
            host : process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let bodyMessage = `sku = ${product.sku}<br/>name = ${product.name}<br/>type = ${product.type}<br/>price = ${product.price}<br/>shipping = ${product.shipping}<br/>description = ${product.description}<br/>manufacturer = ${product.manufacturer}<br/>model = ${product.model}<br/>`;
    
        let mailConfig = {
            from: '"Appelo" <abcjunehere@gmail.com>',
            to: process.env.EMAIL_NOTIFY.split(','),
            subject: 'Email Notification <BUY PRODUCT>',
            html: bodyMessage,
        }
        let info = await transporter.sendMail(mailConfig);
        return info;
      
    } catch(e) {
        throw Error('Error ' + e.message);
    }
}

module.exports = EmailService;