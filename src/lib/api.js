export async function apiFetch(endpoint, options = {}) {
  const { body, headers, ...rest } = options;

  const res = await fetch(endpoint, {
    credentials: 'include',
    cache: 'no-store',
    ...rest,
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: body && typeof body !== 'string' ? JSON.stringify(body) : body,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const err = new Error(data?.message || 'Something went wrong. Please try again.');
    err.status = res.status;
    throw err;
  }
  return data;
}