require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Email transporter (Gmail with explicit SMTP settings)
const emailTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
    dnsTimeout: 30000,
    tls: {
        rejectUnauthorized: false
    }
});

// Notification endpoint
app.post('/api/notify', async (req, res) => {
    const timestamp = new Date().toLocaleString();
    console.log(`💕 Valentine accepted at ${timestamp}!`);

    try {
        // Email to HER - the beautiful invitation
        await emailTransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO_HER,
            subject: '💌 Valentine\'s Day Awaits 💕',
            html: `
                <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: linear-gradient(145deg, #1a0a0e 0%, #2d1318 50%, #1a0a0e 100%); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.4);">
                    
                    <!-- Header with sparkles -->
                    <div style="background: linear-gradient(135deg, #ff6b95 0%, #ff8fab 50%, #ffc3d4 100%); padding: 40px 20px; text-align: center; position: relative;">
                        <div style="font-size: 2.5em; margin-bottom: 10px;">✨💖✨</div>
                        <h1 style="color: #fff; font-size: 2.5em; margin: 0; text-shadow: 2px 2px 10px rgba(0,0,0,0.2); letter-spacing: 2px;">Valentine's Day</h1>
                    </div>
                    
                    <!-- Main content -->
                    <div style="padding: 40px 30px; text-align: center;">
                        <p style="color: #ffd4e0; font-size: 1.4em; margin-bottom: 30px; line-height: 1.6;">
                            You are officially invited to celebrate<br>
                            <span style="color: #ff6b95; font-weight: bold;">the most romantic day of the year</span>
                        </p>
                        
                        <!-- Date card -->
                        <div style="background: linear-gradient(135deg, #ff6b95, #ff8fab); border-radius: 20px; padding: 30px; margin: 30px 0; box-shadow: 0 10px 30px rgba(255,107,149,0.3);">
                            <div style="color: #fff; font-size: 1.1em; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 10px;">Save The Date</div>
                            <div style="color: #fff; font-size: 2.8em; font-weight: bold; text-shadow: 2px 2px 10px rgba(0,0,0,0.2);">Thursday</div>
                            <div style="color: #fff; font-size: 1.8em; margin: 5px 0;">February 14th, 2026</div>
                        </div>
                        
                        <p style="color: #ff8fab; font-size: 1.3em; margin-top: 30px;">
                            Can't wait to spend this special day with you! 💕
                        </p>
                        
                        <!-- Hearts decoration -->
                        <div style="font-size: 2.5em; margin-top: 30px; letter-spacing: 10px;">
                            💗💖💗💖💗
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background: rgba(255,107,149,0.15); padding: 25px; text-align: center; border-top: 1px solid rgba(255,107,149,0.3);">
                        <p style="color: #ffc3d4; margin: 0; font-size: 1.3em;">
                            Love you my princess 💌
                        </p>
                    </div>
                </div>
            `
        });
        console.log('✅ Email to her sent!');

        // Email to YOU - notification that she said yes
        await emailTransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            subject: '💕 She Said Yes! Valentine Accepted! 💕',
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 40px; background: linear-gradient(135deg, #ff9a9e, #fecfef); border-radius: 20px;">
                    <h1 style="color: #e63974; font-size: 2.5em;">💖 She Said Yes! 💖</h1>
                    <p style="font-size: 1.3em; color: #333;">Your Valentine's invitation was accepted!</p>
                    <p style="color: #666;">Time: ${timestamp}</p>
                    <div style="margin-top: 30px; font-size: 3em;">💕🎉💕</div>
                </div>
            `
        });
        console.log('✅ Notification to you sent!');

        res.json({ success: true, message: 'Both emails sent!' });
    } catch (error) {
        console.error('❌ Email error:', error.message);
        res.json({ success: false, error: error.message });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n💕 Valentine's server running!`);
    console.log(`   Local: http://localhost:${PORT}`);
    console.log(`\n📧 Email configured: ${process.env.EMAIL_USER ? 'Yes' : 'No - check .env'}\n`);
});
