const CONTACT_TO = 'contact@panthra.ca';
const CONTACT_FROM = 'noreply@panthra.ca';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function cleanLine(value) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendViaCloudflareEmail(env, message) {
  if (!env.EMAIL?.send) {
    throw new Error('EMAIL binding is not configured.');
  }

  return env.EMAIL.send(message);
}

async function sendViaCloudflareApi(env, message) {
  const token = env.CLOUDFLARE_API_TOKEN;
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;

  if (!token || !accountId) {
    throw new Error('Cloudflare Email API is not configured.');
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/send`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: message.to,
        from: message.from,
        subject: message.subject,
        text: message.text,
        reply_to: message.replyTo,
      }),
    }
  );

  let result = null;
  try {
    result = await response.json();
  } catch (_) {
    result = null;
  }

  if (!response.ok || !result?.success) {
    const details = result?.errors?.[0]?.message || response.statusText;
    throw new Error(`Cloudflare Email API error: ${details}`);
  }
}

async function sendViaResend(env, message) {
  if (!env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured.');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: message.from,
      to: [message.to],
      subject: message.subject,
      text: message.text,
      reply_to: message.replyTo,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend error (${response.status}): ${errorBody}`);
  }
}

async function verifyTurnstile(env, token, request) {
  if (!env.TURNSTILE_SECRET_KEY) {
    return true;
  }

  if (!token) {
    return false;
  }

  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET_KEY);
  body.append('response', token);

  const remoteIp = request.headers.get('CF-Connecting-IP');
  if (remoteIp) {
    body.append('remoteip', remoteIp);
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });

  let result = null;
  try {
    result = await response.json();
  } catch (_) {
    result = null;
  }

  return result?.success === true;
}

export async function onRequestPost({ request, env }) {
  let data;

  try {
    data = await request.json();
  } catch (_) {
    return json({ success: false, message: 'Invalid request body.' }, 400);
  }

  if (data._honey) {
    return json({ success: true, message: 'Thank you — your message has been sent.' });
  }

  const turnstileValid = await verifyTurnstile(env, data.turnstileToken, request);
  if (!turnstileValid) {
    return json(
      { success: false, message: 'Security verification failed. Please try again.' },
      403
    );
  }

  const name = cleanLine(data.name);
  const email = cleanLine(data.email);
  const company = cleanLine(data.company) || 'Not provided';
  const message = String(data.message || '').trim() || 'No message provided.';
  const services = cleanLine(data.services) || 'Not specified';

  if (!name || !email) {
    return json({ success: false, message: 'Name and email are required.' }, 400);
  }

  if (!isValidEmail(email)) {
    return json({ success: false, message: 'Please enter a valid email address.' }, 400);
  }

  const to = env.CONTACT_TO_EMAIL || CONTACT_TO;
  const from = env.CONTACT_FROM_EMAIL || CONTACT_FROM;
  const subject = `New inquiry from ${name} — PANTHRA website`;
  const text = [
    'New contact form submission from panthra.ca',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company}`,
    `Service Interest: ${services}`,
    '',
    'Message:',
    message,
    '',
    '---',
    `Submitted: ${new Date().toISOString()}`,
  ].join('\n');

  const emailMessage = {
    to,
    from,
    replyTo: email,
    subject,
    text,
  };

  try {
    if (env.EMAIL?.send) {
      await sendViaCloudflareEmail(env, emailMessage);
    } else if (env.CLOUDFLARE_API_TOKEN && env.CLOUDFLARE_ACCOUNT_ID) {
      await sendViaCloudflareApi(env, emailMessage);
    } else if (env.RESEND_API_KEY) {
      await sendViaResend(env, emailMessage);
    } else {
      throw new Error('No email provider configured.');
    }

    return json({
      success: true,
      message: 'Thank you — your message has been sent.',
    });
  } catch (error) {
    console.error('Contact form send failed:', error);

    return json(
      {
        success: false,
        message: 'Unable to send your message right now. Please email contact@panthra.ca directly.',
      },
      500
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    },
  });
}
