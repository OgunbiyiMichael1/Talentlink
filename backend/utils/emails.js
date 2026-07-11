const resend = require('../config/email')

const sendApplicationConfirmation = async (candidateEmail, jobTitle, companyName) => {
  await resend.emails.send({
    from: 'TalentLink <onboarding@resend.dev>',
    to: candidateEmail,
    subject: `Application Confirmed — ${jobTitle}`,
    html: `
      <h2>You applied successfully!</h2>
      <p>Hi there,</p>
      <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been received.</p>
      <p>You can log into TalentLink to track your application status.</p>
      <br/>
      <p>Good luck! 🚀</p>
      <p>— The TalentLink Team</p>
    `
  })
}

const sendNewApplicationAlert = async (employerEmail, candidateName, jobTitle) => {
  await resend.emails.send({
    from: 'TalentLink <onboarding@resend.dev>',
    to: employerEmail,
    subject: `New Application — ${jobTitle}`,
    html: `
      <h2>You have a new applicant!</h2>
      <p>Hi there,</p>
      <p><strong>${candidateName}</strong> just applied for your <strong>${jobTitle}</strong> position.</p>
      <p>Log into TalentLink to review their profile and resume.</p>
      <br/>
      <p>— The TalentLink Team</p>
    `
  })
}

const sendStatusUpdate = async (candidateEmail, jobTitle, status) => {
  await resend.emails.send({
    from: 'TalentLink <onboarding@resend.dev>',
    to: candidateEmail,
    subject: `Application Update — ${jobTitle}`,
    html: `
      <h2>Your application status has changed</h2>
      <p>Hi there,</p>
      <p>Your application for <strong>${jobTitle}</strong> has been updated to <strong>${status}</strong>.</p>
      <p>Log into TalentLink to view the full details.</p>
      <br/>
      <p>— The TalentLink Team</p>
    `
  })
}

const sendWelcomeEmail = async (email, first_name, role) => {
  await resend.emails.send({
    from: 'TalentLink <onboarding@resend.dev>',
    to: email,
    subject: 'Welcome to TalentLink! 🎉',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #014421, #009B77); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to TalentLink! 🎉</h1>
        </div>
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 12px 12px; border: 1px solid #E5E7EB;">
          <p style="color: #222222; font-size: 18px;">Hi ${first_name},</p>
          <p style="color: #4B5563; line-height: 1.6;">
            Welcome to TalentLink — where talent owners and talent finders meet. Your account has been created successfully as a <strong>${role}</strong>.
          </p>
          ${role === 'candidate' ? `
          <p style="color: #4B5563; line-height: 1.6;">Here's what you can do next:</p>
          <ul style="color: #4B5563; line-height: 2;">
            <li>Complete your profile and upload your resume</li>
            <li>Browse and apply to job listings</li>
            <li>Connect with employers and professionals</li>
            <li>Share updates on your feed</li>
          </ul>
          ` : `
          <p style="color: #4B5563; line-height: 1.6;">Here's what you can do next:</p>
          <ul style="color: #4B5563; line-height: 2;">
            <li>Complete your company profile and add your logo</li>
            <li>Post your first job listing</li>
            <li>Browse candidate profiles</li>
            <li>Connect with top talent</li>
          </ul>
          `}
          <div style="text-align: center; margin-top: 32px;">
            <a href="http://127.0.0.1:5501/frontend/dashboard.html" 
               style="background: #009B77; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
          <p style="color: #4B5563; margin-top: 32px; font-size: 14px;">
            — The TalentLink Team
          </p>
        </div>
      </div>
    `
  })
}

module.exports = { sendApplicationConfirmation, sendNewApplicationAlert, sendStatusUpdate, sendWelcomeEmail }