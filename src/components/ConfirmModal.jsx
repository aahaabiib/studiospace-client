'use client';
import { Loader2 } from 'lucide-react';
import Modal from './Modal';
import { btnDanger, btnOutline } from '@/lib/ui';

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  loading = false,
}) {
  return (
    <Modal open={open} onClose={loading ? () => {} : onClose} title={title}>
      <p className="text-sm text-slate-600 dark:text-slate-400">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button className={btnOutline} onClick={onClose} disabled={loading}>
          Keep it
        </button>
        <button className={btnDanger} onClick={onConfirm} disabled={loading}>
          {loading && <Loader2 size={16} className="animate-spin" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}