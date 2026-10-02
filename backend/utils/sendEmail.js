import nodemailer from 'nodemailer';

export const sendOTPEmail = async (email, otp) => {
    console.log(`\n========================================`);
    console.log(`📩 GMAIL VERIFICATION CODE for ${email}: [ ${otp} ]`);
    console.log(`========================================\n`);

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS.replace(/\s+/g, ''),
                },
            });

            await transporter.sendMail({
                from: `"AI Task Manager" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Your 6-Digit Verification Code',
                html: `
          <div style="font-family: sans-serif; background-color: #0b0f19; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 500px; margin: auto;">
            <h2 style="color: #6366f1;">AI Task Manager Verification</h2>
            <p>Welcome! Use this code to complete your verification:</p>
            <div style="background-color: #1e1b4b; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; letter-spacing: 6px; font-weight: bold; color: #a5b4fc;">${otp}</span>
            </div>
            <p style="color: #94a3b8; font-size: 12px;">This code expires in 60 seconds. If you did not request this, please ignore.</p>
          </div>
        `,
            });
            console.log(`✅ Live Gmail successfully sent to: ${email}`);
        } catch (error) {
            console.error('Nodemailer error:', error.message);
        }
    }
};
