const nodemailer = require('nodemailer');
const logger = require("./logger");
const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com", //hostname
    secure: true,
    port: 465,

    auth: {
        user: 'info@rigelabs.com',
        pass: "Killer@00"
    }
});
//create a email template instance using the node mailer transporter

async function newUser(full_name, address) {
    const mail_options = {
        from: 'info@rigelabs.com',
        to: address,
        subject: "Welcome to Karinga Massive Development Organization",
        attachments:[{
            filename:"kmdo_constitution.pdf",
            path:'https://raw.github.com/nodemailer/nodemailer/master/LICENSE'
        }],
        html: `<html>
                <head>
                <style>
                    img {display:flex;justify-content:centre, margin:auto}
                </style>
                </head>
                <body>
                 <img height="80px" width="80px" src='https://res.cloudinary.com/dwnxsji2z/image/upload/v1665880877/logo/icon-transparent_qdcqo9.ico' alt="logo" />
                <h2>Hello ${full_name}.</h2>
                <p>Welcome to Karinga Massive Development Organization, we are grateful to have you.</p>
                <p>You will not be able to access your account until its verified by the KMDO committee, you will be notified once done.</p>
                <address>
                Kind Regards,<br>
                Secretary KMDO<br>
                Get in Touch: <br>
                <a href="mailto:secretariat@waridi.org">secretariat@waridi.org</a><br>
                Website:<br>
                <a href={"www.waridi.org"}>www.waridi.org</a>
               
                </address>
                </body>
            </html>`
    }
    transporter.sendMail(mail_options).catch(err => {
        console.log(err.response)
        logger.error(`Error sending email : ${err.response}`)
    })
    
}
async function newUserNotify(full_name,area,village,occupation,contact,registration_number) {
    const mail_options = {
        from: 'info@rigelabs.com',
        to: 'committee@waridi.org',
        subject: "New Member Notification",
        html: `<html>
                <head>
                <style>
                    img {display:flex;justify-content:centre, margin:auto}
                </style>
                </head>
                <body>
                 <img height="80px" width="80px" src='https://res.cloudinary.com/dwnxsji2z/image/upload/v1665880877/logo/icon-transparent_qdcqo9.ico' alt="logo" />
                
                <p>A new member has registered to join Karinga Massive Development Organization.</p>
                <p>Go through these details in consideration to activation.</p>
                <address>
                    Full Name : ${full_name}.<br>
                    Contact : ${contact}.<br>
                    Occupation: ${occupation}.<br>
                    Village: ${village}.<br>
                    Area: ${area}.<br>
                    Registration Number: ${registration_number}.<br>
                </address>
                <p>The member will not be able to access their account until verified and activated.</p>
                <address>
                Kind Regards,<br>
                Secretary KMDO<br>
                Get in Touch: <br>
                <a href="mailto:secretariat@waridi.org">secretariat@waridi.org</a><br>
                Website:<br>
                <a href={"www.waridi.org"}>www.waridi.org</a>
               
                </address>
                </body>
            </html>`
    }
    transporter.sendMail(mail_options).catch(err => {
        console.log(err.response)
        logger.error(`Error sending email : ${err.response}`)
    })
    
}
async function sendOTPEmail(full_name, address, otp_code) {
    const mail_options = {
        from: 'info@rigelabs.com',
        to: address,
        subject: "One Time Code",
        html: `<html>
                <head>
                <style>
                    img {display:flex;justify-content:centre, margin:auto}
                </style>
                </head>
                <body>
                 <img height="80px" width="80px" src='https://res.cloudinary.com/dwnxsji2z/image/upload/v1665880877/logo/icon-transparent_qdcqo9.ico' alt="logo" />
                <h2>Hello ${full_name}.</h2>
                <p>You have requested for a one time use code to reset your password.</p>
                <p>Use this code, please note the code expires after 1 hr: </p>
                <h2>${otp_code}</h2>
                <h4>If you have not initialized this, kindly notify your area representative or contact the secretary.</h4>
                <address>
                Kind Regards,<br>
                Secretary KMDO<br>
                Get in Touch: <br>
                <a href="mailto:secretariat@waridi.org">secretariat@waridi.org</a><br>
                Website:<br>
                <a href={"www.waridi.org"}>www.waridi.org</a>
               
                </address>
                </body>
            </html>`
    }
    await transporter.sendMail(mail_options).catch(err => {
      
        logger.error(`Error sending email : ${err.response}`)
    })

}
async function accountStatusChange(full_name, address,old_status,status) {
    const mail_options = {
        from: 'info@rigelabs.com',
        to: address,
        subject: "Account Status Change",
        html: `<html>
                <head>
                <style>
                    img {display:flex;justify-content:centre, margin:auto}
                </style>
                </head>
                <body>
                 <img height="80px" width="80px" src='https://res.cloudinary.com/dwnxsji2z/image/upload/v1665880877/logo/icon-transparent_qdcqo9.ico' alt="logo" />
                <h2>Hello ${full_name}.</h2>
                <h3>Your Account status has been changed from ${old_status} to ${status}.</h3>
                <p>You will not be able to access your account if the account is not ACTIVE.</p>
                <p>For clarity contact your Area Representative.</p>
                <address>
                Kind Regards,<br>
                Secretary KMDO<br>
                Get in Touch: <br>
                <a href="mailto:secretariat@waridi.org">secretariat@waridi.org</a><br>
                Website:<br>
                <a href={"www.waridi.org"}>www.waridi.org</a>
               
                </address>
                </body>
            </html>`
    }
    transporter.sendMail(mail_options).catch(err => {
        console.log(err.response)
        logger.error(`Error sending email : ${err.response}`)
    })
    
}
async function auctionStartingAuctioneer(full_name,email,title) {
    const mail_options = {
        from: 'info@rigelabs.com',
        to: email,
        subject: "Auction Start Notification",
        html: `<html>
                <head>
                <style>
                    img {display:flex;justify-content:centre, margin:auto}
                </style>
                </head>
                <body>
                 <img height="80px" width="80px" src='https://res.cloudinary.com/dwnxsji2z/image/upload/v1665880877/logo/icon-transparent_qdcqo9.ico' alt="logo" />
                <h2>Hello ${full_name}.</h2>
                <h5>Your auction ${title} will start in 10 minutes.</h5>
                <p>Log in to your dashboard to view.</p>
                
                <address>
                Kind Regards,<br>
                Eris Auctions<br>
                Get in Touch: <br>
                <a href="mailto:info@eris.co.ke">info@eris.co.ke</a><br>
                Website:<br>
                <a href={"www.eris.co.ke"}>www.eris.co.ke</a>
               
                </address>
                </body>
            </html>`
    }
    transporter.sendMail(mail_options).catch(err => {
        console.log(err)
        logger.error(`Error sending email : ${err}`)
    })
    
}
async function auctionStartingBidder(full_name,email,title) {
    const mail_options = {
        from: 'info@rigelabs.com',
        to: email,
        subject: "Auction Start Notification",
        html: `<html>
                <head>
                <style>
                    img {display:flex;justify-content:centre, margin:auto}
                </style>
                </head>
                <body>
                 <img height="80px" width="80px" src='https://res.cloudinary.com/dwnxsji2z/image/upload/v1665880877/logo/icon-transparent_qdcqo9.ico' alt="logo" />
                <h2>Hello ${full_name}.</h2>
                <h5>Auction ${title} will start in 10 minutes.</h5>
                <p>Log in to your dashboard to view.</p>
                
                <address>
                Kind Regards,<br>
                Eris Auctions<br>
                Get in Touch: <br>
                <a href="mailto:info@eris.co.ke">info@eris.co.ke</a><br>
                Website:
                <a href="www.eris.co.ke">www.eris.co.ke</a>
               
                </address>
                </body>
            </html>`
    }
    transporter.sendMail(mail_options).catch(err => {
        console.log(err)
        logger.error(`Error sending email : ${err}`)
    })
    
}
async function newBidNotification(full_name,email,title,date,time) {
    const mail_options = {
        from: 'info@rigelabs.com',
        to: email,
        subject: `Bidding Notification ${bid_id}`,
        html: `<html>
                <head>
                <style>
                    img {display:flex;justify-content:centre, margin:auto}
                </style>
                </head>
                <body>
                 <img height="80px" width="80px" src='https://res.cloudinary.com/dwnxsji2z/image/upload/v1665880877/logo/icon-transparent_qdcqo9.ico' alt="logo" />
                <h2>Hello ${full_name}.</h2>
                <h5>We have received your bid on auction : ${title}.</h5>
                <h3>The bid will start on ${date} at ${time}</h3>
                <p>Log in to your dashboard to view.</p>
                
                <address>
                Kind Regards,<br>
                Eris Auctions<br>
                Get in Touch: <br>
                <a href="mailto:info@eris.co.ke">info@eris.co.ke</a><br>
                Website:<br>
                <a href={"www.eris.co.ke"}>www.eris.co.ke</a>
               
                </address>
                </body>
            </html>`
    }
    transporter.sendMail(mail_options).catch(err => {
        console.log(err.response)
        logger.error(`Error sending email : ${err.response}`)
    })
    
}
module.exports = {
    newUser, sendOTPEmail,newUserNotify,accountStatusChange,newBidNotification,auctionStartingBidder,auctionStartingAuctioneer
}