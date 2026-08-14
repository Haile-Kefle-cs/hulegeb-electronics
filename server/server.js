const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const https = require('https');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '..')));

// Email configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'hulgebmereja2017@gmail.com',
        pass: process.env.EMAIL_PASS || 'wuzxxmbhymyaaiac'
    },
    tls: { rejectUnauthorized: false }
});

// ==================== ETHIOPIAN SMS NOTIFICATION ====================
// Using Africa's Talking API (works in Ethiopia)
// Sign up free at https://africastalking.com

function sendEthiopianSMS(phoneNumber, message) {
    return new Promise((resolve, reject) => {
        // Format Ethiopian phone number
        let formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
        
        // Ethiopian formats:
        // 09XXXXXXXX → 2519XXXXXXXX
        // +2519XXXXXXXX → 2519XXXXXXXX
        // 2519XXXXXXXX → 2519XXXXXXXX
        // 9XXXXXXXX → 2519XXXXXXXX
        
        if (formattedPhone.startsWith('+251')) {
            formattedPhone = formattedPhone.substring(1);
        } else if (formattedPhone.startsWith('251')) {
            // Already correct
        } else if (formattedPhone.startsWith('0')) {
            formattedPhone = '251' + formattedPhone.substring(1);
        } else if (formattedPhone.length === 9 && formattedPhone.startsWith('9')) {
            formattedPhone = '251' + formattedPhone;
        }
        
        console.log(`📱 Sending SMS to: +${formattedPhone}`);
        
        // Africa's Talking API
        const data = JSON.stringify({
            username: process.env.AFRICAS_TALKING_USERNAME || 'sandbox',
            to: '+' + formattedPhone,
            message: message,
            from: 'Hulegeb'
        });
        
        const options = {
            hostname: 'api.africastalking.com',
            path: '/version1/messaging',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': process.env.AFRICAS_TALKING_API_KEY || 'YOUR_API_KEY_HERE',
                'Content-Length': Buffer.byteLength(data)
            }
        };
        
        const req = https.request(options, (res) => {
            let response = '';
            res.on('data', (chunk) => response += chunk);
            res.on('end', () => {
                console.log(`✅ SMS API Response:`, response);
                resolve(JSON.parse(response));
            });
        });
        
        req.on('error', (error) => {
            console.log(`⚠️ SMS API Error:`, error.message);
            // Fallback: Save to log
            saveSMSToLog(formattedPhone, message);
            resolve({ success: false, fallback: 'logged', phone: formattedPhone });
        });
        
        req.write(data);
        req.end();
    });
}

// Save SMS to log file (fallback)
function saveSMSToLog(phone, message) {
    const logFile = path.join(__dirname, 'ethiopian-sms-logs.json');
    let logs = [];
    try {
        logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    } catch(e) {
        logs = [];
    }
    
    logs.push({
        phone: '+' + phone,
        message: message,
        timestamp: new Date().toISOString(),
        status: 'pending'
    });
    
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    console.log(`✅ SMS saved to log for +${phone}`);
}

// ==================== ORDER STATUS (Email + Ethiopian SMS) ====================
app.post('/api/order-status', async (req, res) => {
    try {
        const { 
            orderId, 
            customerName, 
            customerEmail, 
            customerPhone, 
            status, 
            statusTextEn, 
            statusTextAm, 
            note 
        } = req.body;
        
        console.log(`📧 Processing notification for ${orderId}`);
        
        // EMAIL NOTIFICATION
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Order Status Update</h2>
                        <p>Hulegeb Electronics</p>
                    </div>
                    <div class="content">
                        <p>Dear <strong>${customerName}</strong>,</p>
                        <p>Your order status has been updated.</p>
                        <p><strong>Order ID:</strong> ${orderId}</p>
                        <p><strong>Status:</strong> ${statusTextEn}</p>
                        <p>${statusTextEn}</p>
                        <p>${statusTextAm}</p>
                        ${note ? `<p><strong>Note:</strong> ${note}</p>` : ''}
                        <p>Contact: hulgebmereja2017@gmail.com</p>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        await transporter.sendMail({
            from: '"Hulegeb Electronics" <hulgebmereja2017@gmail.com>',
            to: customerEmail,
            subject: `Order ${orderId} Status: ${statusTextEn}`,
            html: emailHtml
        });
        
        console.log(`✅ Email sent to ${customerEmail}`);
        
        // SMS NOTIFICATION (Ethiopian phone)
        let smsResult = { success: false };
        if (customerPhone) {
            const smsMessage = `Hulegeb Electronics: Your order ${orderId} is ${statusTextEn}. ${note || ''} Contact: 0911234567`;
            smsResult = await sendEthiopianSMS(customerPhone, smsMessage);
        }
        
        res.json({ 
            success: true, 
            emailSent: true, 
            smsSent: smsResult.success || false 
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ success: false });
    }
});

// ==================== ORDERS ====================
app.post('/api/orders', async (req, res) => {
    try {
        const order = req.body;
        
        const emailHtml = `
            <h2>New Order: ${order.orderId}</h2>
            <p><strong>Customer:</strong> ${order.name}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>City:</strong> ${order.city}</p>
            <p><strong>Total:</strong> ETB ${order.finalTotal?.toLocaleString()}</p>
        `;
        
        await transporter.sendMail({
            from: 'hulgebmereja2017@gmail.com',
            to: 'hulgebmereja2017@gmail.com',
            replyTo: order.email,
            subject: `New Order ${order.orderId} - ${order.name}`,
            html: emailHtml
        });
        
        console.log(`✅ Order email sent`);
        
        // Send SMS to admin about new order
        const adminSMS = `New order ${order.orderId} from ${order.name}. Total: ETB ${order.finalTotal}`;
        await sendEthiopianSMS('0911234567', adminSMS);
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// ==================== CONTACT ====================
app.post('/api/contact', async (req, res) => {
    try {
        const contact = req.body;
        await transporter.sendMail({
            from: 'hulgebmereja2017@gmail.com',
            to: 'hulgebmereja2017@gmail.com',
            replyTo: contact.email,
            subject: `Contact: ${contact.subject}`,
            html: `<p><strong>From:</strong> ${contact.name}</p><p><strong>Email:</strong> ${contact.email}</p><p>${contact.message}</p>`
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Get SMS logs
app.get('/api/sms-logs', (req, res) => {
    const logFile = path.join(__dirname, 'ethiopian-sms-logs.json');
    try {
        const logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
        res.json({ success: true, logs: logs });
    } catch(e) {
        res.json({ success: true, logs: [] });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📧 Email: hulgebmereja2017@gmail.com`);
    console.log(`📱 SMS: Ethiopian numbers supported (+251...)`);
});