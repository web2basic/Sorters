'use client';

import { Note } from '@/lib/contract';
import { Edit, Trash2, Tag, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: Note & { id: number };
  onEdit: (note: Note & { id: number }) => void;
  onDelete: (noteId: number) => void;
  isOwner: boolean;
}

export function NoteCard({ note, onEdit, onDelete, isOwner }: NoteCardProps) {
  const createdDate = new Date(note['created-at'] * 1000);
  const updatedDate = new Date(note['updated-at'] * 1000);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {note.title}
        </h3>
        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(note)}
              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors"
              title="Edit note"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
              title="Delete note"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
        {note.content}
      </p>

      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm"
            >
              <Tag size={12} />
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>Created {formatDistanceToNow(createdDate, { addSuffix: true })}</span>
        </div>
        {updatedDate.getTime() !== createdDate.getTime() && (
          <div className="flex items-center gap-1">
            <span>Updated {formatDistanceToNow(updatedDate, { addSuffix: true })}</span>
          </div>
        )}
      </div>

      {note['is-encrypted'] && (
        <div className="mt-3 inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-semibold">
          🔒 Encrypted
        </div>
      )}
    </div>
  );
}

