export async function uploadImage(file) {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) throw new Error('Image upload key is missing. Add NEXT_PUBLIC_IMGBB_KEY to .env.local');
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file');
  if (file.size > 5 * 1024 * 1024) throw new Error('Image must be smaller than 5 MB');

  const fd = new FormData();
  fd.append('image', file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: 'POST',
    body: fd,
  });
  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.data?.url) {
    throw new Error(json?.error?.message || 'Image upload failed. Please try again.');
  }
  return json.data.url;
}