'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/upload';
import { inputCls, btnPrimary, categories, amenitySuggestions } from '@/lib/ui';

const empty = {
  title: '',
  category: '',
  hourlyRate: '',
  securityDeposit: '',
  maxCapacity: '',
  location: '',
  imageURL: '',
  gallery: [],
  amenities: [],
  overview: '',
};

const labelCls = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300';

export default function StudioForm({ initial, owner, submitting, submitLabel, onSubmit }) {
  const [form, setForm] = useState({ ...empty, ...(initial || {}) });
  const [uploading, setUploading] = useState('');
  const [amenityInput, setAmenityInput] = useState('');

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleMain = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading('main');
    try {
      set('imageURL', await uploadImage(file));
      toast.success('Cover image uploaded');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading('');
    }
  };

  const handleGallery = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    setUploading('gallery');
    try {
      const urls = [];
      for (const f of files) urls.push(await uploadImage(f));
      setForm((f) => ({ ...f, gallery: [...f.gallery, ...urls] }));
      toast.success(`${urls.length} photo(s) uploaded`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading('');
    }
  };

  const addAmenity = (raw) => {
    const v = raw.trim();
    if (!v) return;
    if (form.amenities.some((a) => a.toLowerCase() === v.toLowerCase())) {
      setAmenityInput('');
      return;
    }
    set('amenities', [...form.amenities, v]);
    setAmenityInput('');
  };

  const removeAmenity = (a) => set('amenities', form.amenities.filter((x) => x !== a));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Studio title is required');
    if (!form.category) return toast.error('Please choose a category');
    if (!form.hourlyRate || Number(form.hourlyRate) <= 0) return toast.error('Enter a valid hourly rate');
    if (!form.location.trim()) return toast.error('Location is required');
    if (!form.imageURL) return toast.error('Please upload a cover image');
    if (form.overview.trim().length < 20) return toast.error('Overview should be at least 20 characters');

    onSubmit({
      title: form.title.trim(),
      category: form.category,
      hourlyRate: Number(form.hourlyRate),
      securityDeposit: Number(form.securityDeposit) || 0,
      maxCapacity: Number(form.maxCapacity) || 1,
      location: form.location.trim(),
      imageURL: form.imageURL,
      gallery: form.gallery,
      amenities: form.amenities,
      overview: form.overview.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className={labelCls}>Studio title *</label>
          <input className={inputCls} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Sunlit Loft Photo Studio" />
        </div>

        <div>
          <label className={labelCls}>Category *</label>
          <select className={inputCls} value={form.category} onChange={(e) => set('category', e.target.value)}>
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Location *</label>
          <input className={inputCls} value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. Banani, Dhaka" />
        </div>

        <div>
          <label className={labelCls}>Hourly rate (USD) *</label>
          <input type="number" min="1" className={inputCls} value={form.hourlyRate} onChange={(e) => set('hourlyRate', e.target.value)} placeholder="45" />
        </div>

        <div>
          <label className={labelCls}>Security deposit (USD)</label>
          <input type="number" min="0" className={inputCls} value={form.securityDeposit} onChange={(e) => set('securityDeposit', e.target.value)} placeholder="100" />
        </div>

        <div>
          <label className={labelCls}>Max capacity (people)</label>
          <input type="number" min="1" className={inputCls} value={form.maxCapacity} onChange={(e) => set('maxCapacity', e.target.value)} placeholder="8" />
        </div>
      </div>

      {/* Cover image */}
      <div>
        <label className={labelCls}>Cover image *</label>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-sm text-slate-500 transition hover:border-violet-500 dark:border-slate-700 sm:w-56">
            {uploading === 'main' ? <Loader2 className="animate-spin" /> : <Upload size={22} />}
            <span className="mt-2">{uploading === 'main' ? 'Uploading…' : 'Click to upload'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleMain} disabled={!!uploading} />
          </label>
          {form.imageURL && (
            <img src={form.imageURL} alt="Cover preview" className="h-32 w-full rounded-xl object-cover sm:w-56" />
          )}
        </div>
        <input
          className={`${inputCls} mt-3`}
          value={form.imageURL}
          onChange={(e) => set('imageURL', e.target.value)}
          placeholder="…or paste an image URL"
        />
      </div>

      {/* Gallery */}
      <div>
        <label className={labelCls}>Gallery photos (optional)</label>
        <div className="flex flex-wrap gap-3">
          {form.gallery.map((src, i) => (
            <div key={src + i} className="relative h-24 w-32">
              <img src={src} alt={`Gallery ${i + 1}`} className="h-full w-full rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => set('gallery', form.gallery.filter((_, idx) => idx !== i))}
                className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white"
                aria-label="Remove photo"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <label className="flex h-24 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-xs text-slate-500 hover:border-violet-500 dark:border-slate-700">
            {uploading === 'gallery' ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            <span className="mt-1">Add photos</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleGallery} disabled={!!uploading} />
          </label>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className={labelCls}>Amenities</label>
        <div className="mb-2 flex flex-wrap gap-2">
          {form.amenities.map((a) => (
            <span key={a} className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
              {a}
              <button type="button" onClick={() => removeAmenity(a)} aria-label={`Remove ${a}`}>
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <input
          className={inputCls}
          value={amenityInput}
          onChange={(e) => setAmenityInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              addAmenity(amenityInput);
            }
          }}
          placeholder="Type an amenity and press Enter"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {amenitySuggestions
            .filter((s) => !form.amenities.includes(s))
            .map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => addAmenity(s)}
                className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 hover:border-violet-500 dark:border-slate-700 dark:text-slate-400"
              >
                + {s}
              </button>
            ))}
        </div>
      </div>

      <div>
        <label className={labelCls}>Overview *</label>
        <textarea
          rows={5}
          className={inputCls}
          value={form.overview}
          onChange={(e) => set('overview', e.target.value)}
          placeholder="Describe the space, the lighting, the equipment included and house rules."
        />
      </div>

      {/* Read-only owner */}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={labelCls}>Host name</label>
          <input className={`${inputCls} cursor-not-allowed opacity-70`} value={owner?.name || ''} readOnly />
        </div>
        <div>
          <label className={labelCls}>Host email</label>
          <input className={`${inputCls} cursor-not-allowed opacity-70`} value={owner?.email || ''} readOnly />
        </div>
      </div>

      <button type="submit" disabled={submitting || !!uploading} className={`${btnPrimary} w-full py-3 sm:w-auto`}>
        {submitting && <Loader2 size={16} className="animate-spin" />}
        {submitLabel}
      </button>
    </form>
  );
}