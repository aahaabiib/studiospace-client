'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import PrivateRoute from '@/components/PrivateRoute';
import StudioForm from '@/components/StudioForm';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

function AddStudio() {
  const { user } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await apiFetch('/api/studios', { method: 'POST', body: values });
      toast.success('Studio listed successfully!');
      router.push('/my-listings');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Add New Studio</h1>
      <p className="mb-8 mt-2 text-slate-600 dark:text-slate-400">
        Share your space with creators. Fill in the details below to publish your listing.
      </p>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <StudioForm
          owner={{ name: user?.name, email: user?.email }}
          submitting={submitting}
          submitLabel="Publish Studio"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default function AddStudioPage() {
  return (
    <PrivateRoute>
      <AddStudio />
    </PrivateRoute>
  );
}