const {internalServerError, notFound, ok} = require('../utils/responseUtils')
const {} = require('../database')
const nodemailer = require("nodemailer");
require("dotenv").config();


const sendEmail = async (req,res) => {
    const {recipePageAddress, senderEmail, reciverEmail} = req.body;
    
    try {
    const mailOptions = {
        from: senderEmail,
        to: reciverEmail,
        subject: 'Ressu Reseptisovellus',
        text: `Käyttäjä ${senderEmail} jakoi reseptin sinulle. Katsele reseptiä tästä osoitteesta ${recipePageAddress}`
    };

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'ressureseptisovellus@gmail.com',
            pass: process.env.EMAIL_PASSWORD
        }
    });

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Virhe sähköpostin lähetyksessä 1:', error);
            return internalServerError(res, "Sähköpostin lähetys epäonnistui");
        } else {
            console.log('Sähköposti lähetetty:', info.response);
            return ok(res, "Sähköposti lähetetty onnistuneesti");
        }
    });
    }catch (error) {
        console.error('Virhe sähköpostin lähetyksessä:', error);
        return internalServerError(res, "Sähköpostin lähetys epäonnistui");
    }
}

module.exports = {sendEmail}