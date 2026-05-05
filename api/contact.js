// /api/contact — Recibe el form del CTA y envía correo a juanpablo@accionet.net
// Requiere variables de entorno en Vercel:
//   - RESEND_API_KEY        (https://resend.com → API Keys)
//   - CONTACT_FROM_EMAIL    (opcional, ej. "SIMCII <bitacora@simcii.com>" — debe ser dominio verificado en Resend)
//   - CONTACT_TO_EMAIL      (opcional, default juanpablo@accionet.net)

const TO_EMAIL_DEFAULT = 'juanpablo@accionet.net';
const FROM_EMAIL_DEFAULT = 'SIMCII Bitácora <onboarding@resend.dev>'; // dominio de pruebas de Resend
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body);
    let raw = '';
    req.on('data', (c) => { raw += c; if (raw.length > 1e6) req.destroy(); });
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, error: 'Email service not configured (missing RESEND_API_KEY)' });
  }

  let body;
  try { body = await readBody(req); }
  catch { return res.status(400).json({ ok: false, error: 'Invalid JSON' }); }

  const email = (body.email || '').toString().trim().slice(0, 200);
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ ok: false, error: 'Email inválido' });
  }

  const to = process.env.CONTACT_TO_EMAIL || TO_EMAIL_DEFAULT;
  const from = process.env.CONTACT_FROM_EMAIL || FROM_EMAIL_DEFAULT;
  const userAgent = (req.headers['user-agent'] || '').toString().slice(0, 200);
  const referer = (req.headers['referer'] || '').toString().slice(0, 200);
  const sentAt = new Date().toISOString();

  const subject = `Nueva solicitud SIMCII · ${email}`;
  const text = [
    'Nueva solicitud desde la bitácora SIMCII.',
    '',
    `Correo del solicitante: ${email}`,
    `Recibido: ${sentAt}`,
    `Origen: ${referer || '—'}`,
    `User-Agent: ${userAgent || '—'}`,
  ].join('\n');

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; padding: 24px; color:#15191C;">
      <h2 style="font-size: 18px; margin: 0 0 16px; color:#15191C;">Nueva solicitud SIMCII</h2>
      <p style="margin: 0 0 8px;">Alguien dejó su correo en la bitácora.</p>
      <table style="border-collapse: collapse; margin-top: 16px; font-size: 14px;">
        <tr><td style="padding: 6px 12px 6px 0; color:#666;">Correo</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding: 6px 12px 6px 0; color:#666;">Recibido</td><td style="padding: 6px 0;">${escapeHtml(sentAt)}</td></tr>
        <tr><td style="padding: 6px 12px 6px 0; color:#666;">Origen</td><td style="padding: 6px 0;">${escapeHtml(referer || '—')}</td></tr>
      </table>
    </div>
  `;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from, to: [to], reply_to: email, subject, text, html,
      }),
    });

    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      console.error('Resend error', r.status, detail);
      return res.status(502).json({ ok: false, error: 'No se pudo enviar el correo' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact handler error', err);
    return res.status(500).json({ ok: false, error: 'Error interno' });
  }
};
