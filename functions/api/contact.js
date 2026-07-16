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

  if (!name || !email) {
    return json({ success: false, message: 'Name and email are required.' }, 400);
  }

  if (!isValidEmail(email)) {
    return json({ success: false, message: 'Please enter a valid email address.' }, 400);
  }

  return json({
    success: true,
    message: 'Verified',
  });
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
