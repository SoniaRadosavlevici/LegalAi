const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'sonia.radosavlevici4444@gmail.com'

async function sendEmail({ to, subject, html }) {
  const res = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, html }),
  })
  return res.json()
}

export async function sendLawyerContactEmail({ lawyerName, lawyerProvince, senderName, senderEmail, message }) {
  return sendEmail({
    to: CONTACT_EMAIL,
    subject: `Lawyer Inquiry — ${lawyerName} (${lawyerProvince})`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#A8874A">New Lawyer Inquiry via LegalAI</h2>
        <p><strong>Lawyer:</strong> ${lawyerName}, ${lawyerProvince}</p>
        <hr/>
        <p><strong>From:</strong> ${senderName} &lt;${senderEmail}&gt;</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left:3px solid #A8874A;padding-left:12px;color:#555">${message}</blockquote>
      </div>
    `,
  })
}

export async function sendLawyerDraftReviewEmail({ senderEmail }) {
  return sendEmail({
    to: CONTACT_EMAIL,
    subject: `Lawyer Review Request — Contract Draft`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#A8874A">Lawyer Review Request</h2>
        <p>A user has requested a lawyer review their contract draft.</p>
        <p><strong>User Email:</strong> ${senderEmail}</p>
        <p>Please contact this user within 48 hours with a review quote.</p>
      </div>
    `,
  })
}

export async function sendContractReviewEmail({ contractTitle, contractContent, senderName, senderEmail, userPlan }) {
  return sendEmail({
    to: CONTACT_EMAIL,
    subject: `Contract Review Request — ${contractTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#A8874A">Contract Review Request</h2>
        <p><strong>Contract:</strong> ${contractTitle}</p>
        <p><strong>From:</strong> ${senderName} &lt;${senderEmail}&gt;</p>
        <p><strong>Plan:</strong> ${userPlan}</p>
        <hr/>
        <h3>Contract Content</h3>
        <pre style="white-space:pre-wrap;font-size:12px;background:#f5f5f5;padding:16px;border-radius:4px">${contractContent}</pre>
      </div>
    `,
  })
}
