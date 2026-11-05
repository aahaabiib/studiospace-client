'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import PrivateRoute from '@/components/PrivateRoute';
import StudioForm from '@/components/StudioForm';
import { DetailsSkeleton } from '@/components/Skeletons';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { btnPrimary } from '@/lib/ui';

function EditStudio() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch(`/api/studios/${id}`)
      .then((res) => setStudio(res.data))
      .catch(() => setStudio(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await apiFetch(`/api/studios/${id}`, { method: 'PUT', body: values });
      toast.success('Studio updated successfully');
      router.push('/my-listings');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DetailsSkeleton />;

  if (!studio || studio.ownerEmail !== user?.email) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {studio ? 'You can only edit your own studios' : 'Studio not found'}
        </h1>
        <Link href="/my-listings" className={`${btnPrimary} mt-6`}>
          Back to My Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Edit Studio</h1>
      <p className="mb-8 mt-2 text-slate-600 dark:text-slate-400">Update the details of your listing.</p>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <StudioForm
          initial={studio}
          owner={{ name: studio.ownerName, email: studio.ownerEmail }}
          submitting={submitting}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default function EditStudioPage() {
  return (
    <PrivateRoute>
      <EditStudio />
    </PrivateRoute>
  );
}