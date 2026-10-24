const { Resend } = require("resend");
const env = require("../config/env");
const Inquiry = require("../models/Inquiry");
const asyncHandler = require("../utils/asyncHandler");
const escapeHtml = require("../utils/escapeHtml");

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

function renderEmail(inquiry) {
  const row = (label, value) =>
    `<tr><td style="padding:6px 12px;color:#555;font-weight:600">${label}</td><td style="padding:6px 12px">${escapeHtml(value) || "—"}</td></tr>`;

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px">
      <h2 style="color:#14532d">New website inquiry</h2>
      <table style="border-collapse:collapse">
        ${row("Name", inquiry.name)}
        ${row("Email", inquiry.email)}
        ${row("Phone", inquiry.phone)}
        ${row("Subject", inquiry.subject)}
      </table>
      <h3 style="margin-top:24px">Message</h3>
      <p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(inquiry.message)}</p>
    </div>`;
}

async function notify(inquiry) {
  if (!resend) return false;
  const { error } = await resend.emails.send({
    from: env.CONTACT_FROM_EMAIL,
    to: env.CONTACT_TO_EMAIL,
    replyTo: inquiry.email,
    subject: `Website inquiry: ${inquiry.subject || inquiry.name}`.slice(0, 150),
    html: renderEmail(inquiry),
  });
  if (error) {
    console.error("[contact] email delivery failed:", error);
    return false;
  }
  return true;
}

const THANK_YOU = { success: true, message: "Thank you! We'll get back to you shortly." };

exports.submit = asyncHandler(async (req, res) => {
  const { website, ...fields } = req.body;
  // Honeypot: the "website" field is hidden from people, so only bots fill it. Pretend it worked.
  if (website) return res.status(201).json(THANK_YOU);

  // The inquiry is persisted first so a mail outage never loses a lead.
  const inquiry = await Inquiry.create(fields);

  try {
    inquiry.emailDelivered = await notify(inquiry);
    if (inquiry.emailDelivered) await inquiry.save();
  } catch (err) {
    console.error("[contact] email delivery threw:", err);
  }

  res.status(201).json(THANK_YOU);
});
