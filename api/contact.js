// /api/contact — Recibe el formulario de demo y avisa al equipo por correo con Amazon SES.
//
// Sin llaves guardadas: la función asume el rol IAM `simcii-web-contacto-ses` con el token OIDC
// de Vercel (proveedor oidc.vercel.com/umbingelelos-projects). Ese rol sólo puede enviar desde
// no-reply@accionet.cl (dominio accionet.cl verificado en SES, us-east-1, cuenta en producción).
//
// Variables opcionales en Vercel:
//   - CONTACT_TO_EMAIL    destinatarios separados por coma (por defecto, el equipo comercial)
//   - CONTACT_FROM_EMAIL  remitente (debe ser @accionet.cl)
//   - AWS_ROLE_ARN / AWS_REGION

const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');
const { awsCredentialsProvider } = require('@vercel/functions/oidc');

const ROLE_ARN = process.env.AWS_ROLE_ARN || 'arn:aws:iam::751849192484:role/simcii-web-contacto-ses';
const REGION = process.env.AWS_REGION || 'us-east-1';
const FROM = process.env.CONTACT_FROM_EMAIL || 'SIMCII <no-reply@accionet.cl>';
const TO = (process.env.CONTACT_TO_EMAIL || 'cristian@accionet.net,juanandres@accionet.net,juanpablo@accionet.net')
  .split(',').map((s) => s.trim()).filter(Boolean);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ses = new SESv2Client({ region: REGION, credentials: awsCredentialsProvider({ roleArn: ROLE_ARN }) });

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

  let body;
  try { body = await readBody(req); }
  catch { return res.status(400).json({ ok: false, error: 'Invalid JSON' }); }

  const email = (body.email || '').toString().trim().slice(0, 200);
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ ok: false, error: 'Email inválido' });
  }

  const referer = (req.headers.referer || '').toString().slice(0, 200);
  const userAgent = (req.headers['user-agent'] || '').toString().slice(0, 200);
  const recibido = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago', dateStyle: 'long', timeStyle: 'short' });

  const subject = `Solicitud de demo SIMCII · ${email}`;
  const text = [
    'Alguien pidió una demo en simcii.ai.',
    '',
    `Correo: ${email}`,
    `Recibido: ${recibido}`,
    `Página: ${referer || '—'}`,
    `Navegador: ${userAgent || '—'}`,
    '',
    'Responde este correo para escribirle directamente.',
  ].join('\n');
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;padding:24px;color:#1C1F22;">
      <h2 style="font-size:18px;margin:0 0 12px;">Solicitud de demo SIMCII</h2>
      <p style="margin:0 0 16px;">Alguien pidió una demo en simcii.ai. Responde este correo para escribirle directamente.</p>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 12px 6px 0;color:#5C605C;">Correo</td><td style="padding:6px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#5C605C;">Recibido</td><td style="padding:6px 0;">${escapeHtml(recibido)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#5C605C;">Página</td><td style="padding:6px 0;">${escapeHtml(referer || '—')}</td></tr>
      </table>
    </div>`;

  try {
    await ses.send(new SendEmailCommand({
      FromEmailAddress: FROM,
      Destination: { ToAddresses: TO },
      ReplyToAddresses: [email],
      Content: {
        Simple: {
          Subject: { Data: subject, Charset: 'UTF-8' },
          Body: { Text: { Data: text, Charset: 'UTF-8' }, Html: { Data: html, Charset: 'UTF-8' } },
        },
      },
    }));
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('SES error', err && err.name, err && err.message);
    return res.status(502).json({ ok: false, error: 'No se pudo enviar. Intenta nuevamente.' });
  }
};
