const nodemailer = require('nodemailer')

const SendEmailUtility = async (mailTo, mailSub, mailHTML) => {
    let transporter = nodemailer.createTransport({
        host: 'mail.wp-codestudio.com',
        port: 465,
        secure: true,
        auth: {
            user: 'email@wp-codestudio.com',
            pass: '$yM.ANKa;6fz'
        }, tls: {
            rejectUnauthorized: false
        }
    })

    let mailOptoin = {
        from: 'Rocky Portfolio <email@wp-codestudio.com>',
        to: mailTo,
        subject: mailSub,
        html: mailHTML
    }

    return transporter.sendMail(mailOptoin)
}

// const SendEmailUtility = async (mailTo, mailSub, mailHTML) => {
//     let transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: 'designerrocky24@gmail.com',
//             pass: 'jazu mouq wwfp nlvh'
//         }
//     })

//     let mailOption = {
//         from: 'Rocky Portfolio <designerrocky24@gmail.com>',
//         to: mailTo,
//         subject: mailSub,
//         html: mailHTML
//     }

//     return await transporter.sendMail(mailOption)
// }


module.exports = SendEmailUtility;