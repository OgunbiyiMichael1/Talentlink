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

module.exports = { sendApplicationConfirmation, sendNewApplicationAlert, sendStatusUpdate }