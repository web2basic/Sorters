'use client'

interface NoteCardProps {
  note: {
    id: number
    title: string
    content: string
    tags: string[]
    folder?: string
    createdAt: number
    updatedAt: number
    encrypted: boolean
  }
}

export default function NoteCard({ note }: NoteCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold">{note.title}</h3>
        {note.encrypted && (
          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
            🔒 Encrypted
          </span>
        )}
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {note.content}
      </p>
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      {note.folder && (
        <div className="text-sm text-gray-500 mb-2">
          📁 {note.folder}
        </div>
      )}
      <div className="text-xs text-gray-400 flex justify-between">
        <span>Created: {formatDate(note.createdAt)}</span>
        <span>Updated: {formatDate(note.updatedAt)}</span>
      </div>
    </div>
  )
}

