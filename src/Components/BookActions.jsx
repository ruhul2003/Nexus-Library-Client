'use client';

import { useTransition } from 'react';
import { PencilToSquare, EyeSlash, TrashBin } from '@gravity-ui/icons';

export default function BookActions({
  bookId,
  hasPrivilegedAccess,
  onUnpublish,
  onDelete,
}) {
  const [isPending, startTransition] = useTransition();

  const handleUnpublish = () => {
    if (!confirm("Are you sure you want to unpublish this book?")) return;
    
    startTransition(() => onUnpublish(bookId));
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to permanently delete this book?\n\nThis action cannot be undone.")) return;
    
    startTransition(() => onDelete(bookId));
  };

  if (!hasPrivilegedAccess) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
      <a
        href={`/books/${bookId}/edit`}
        className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl text-sm shadow-lg transition"
      >
        <PencilToSquare className="w-4 h-4" /> Edit Asset
      </a>

      <button
        type="button"
        onClick={handleUnpublish}
        disabled={isPending}
        className="w-full inline-flex items-center justify-center gap-2 bg-amber-600/20 border border-amber-500/30 text-amber-400 font-bold py-4 rounded-2xl text-sm transition hover:bg-amber-600/30 disabled:opacity-50"
      >
        <EyeSlash className="w-4 h-4" /> Unpublish
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="w-full inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-2xl text-sm shadow-lg transition disabled:opacity-50"
      >
        <TrashBin className="w-4 h-4" /> Delete Volume
      </button>
    </div>
  );
}