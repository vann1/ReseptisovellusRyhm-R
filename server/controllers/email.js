const {internalServerError, notFound, ok} = require('../utils/responseUtils')
const {} = require('../database')
const { isEmailRegistered } = require('../database');
const { addPasswordToDatabase } = require('../database');
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

async function sendPasswordRecoveryEmail(email) {
    try {
        const isRegistered = await isEmailRegistered(email);
        if (!isRegistered) {
            console.log('Email is not registered');
            return false; // Indicate that email is not registered
        }

        // Generate a new random password
        const newPassword = generateRandomPassword();

        // Add the new password to the database
        await addPasswordToDatabase(email, newPassword);

        // Send the password recovery email with the new password
        const mailOptions = {
            from: 'ressureseptisovellus@gmail.com',
            to: email,
            subject: 'Password Recovery',
            text: `Uusi salasanasi on: ${newPassword}`, // Include the new password in the email
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

        await transporter.sendMail(mailOptions);
        console.log('Password recovery email sent successfully');
        return true; // Indicate success
    } catch (error) {
        console.error('Error sending password recovery email:', error);
        throw error; // Throw the error to be handled by the caller
    }
}

function generateRandomPassword() {
    // Generate a random string of characters for the password
    const randomString = Math.random().toString(36).slice(-8);
    return randomString;
}

module.exports = {sendEmail, sendPasswordRecoveryEmail}