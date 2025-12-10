'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/lib/wallet';
import { WalletButton } from '@/components/WalletButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NoteCard } from '@/components/NoteCard';
import { NoteEditor } from '@/components/NoteEditor';
import { useConnect } from '@stacks/connect-react';
import {
  getNote,
  getNoteCount,
  isOwner,
  createNoteArgs,
  updateNoteContentArgs,
  updateNoteTitleArgs,
  deleteNoteArgs,
  NoteInput,
  Note,
} from '@/lib/contract';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '@/lib/config';
import { makeContractCall, AnchorMode, PostConditionMode } from '@stacks/transactions';
import { Plus, Search, Loader2 } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, address } = useWallet();
  const { doContractCall } = useConnect();
  const [notes, setNotes] = useState<(Note & { id: number })[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<(Note & { id: number }) | null>(null);
  const [noteCount, setNoteCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated && address) {
      loadNotes();
    }
  }, [isAuthenticated, address]);

  const loadNotes = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const count = await getNoteCount(address);
      setNoteCount(count);
      
      // Load all notes (in production, you'd want pagination)
      const loadedNotes: (Note & { id: number })[] = [];
      for (let i = 1; i <= count; i++) {
        const note = await getNote(i, address);
        if (note) {
          const owner = await isOwner(i, address, address);
          if (owner) {
            loadedNotes.push({ ...note, id: i });
          }
        }
      }
      setNotes(loadedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (noteInput: NoteInput) => {
    if (!address) return;
    
    try {
      await doContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'create-note',
        functionArgs: createNoteArgs(noteInput),
        onFinish: (data) => {
          console.log('Note created:', data);
          setShowEditor(false);
          loadNotes();
        },
        onCancel: () => {
          console.log('Transaction cancelled');
        },
      });
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async (noteInput: NoteInput) => {
    if (!address || !editingNote) return;

    try {
      // Update title and content separately if needed
      if (noteInput.title !== editingNote.title) {
        await doContractCall({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: 'update-note-title',
          functionArgs: updateNoteTitleArgs(editingNote.id, noteInput.title),
          onFinish: () => {
            console.log('Title updated');
          },
        });
      }

      if (noteInput.content !== editingNote.content) {
        await doContractCall({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: 'update-note-content',
          functionArgs: updateNoteContentArgs(editingNote.id, noteInput.content),
          onFinish: () => {
            console.log('Content updated');
            setShowEditor(false);
            setEditingNote(null);
            loadNotes();
          },
        });
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!address || !confirm('Are you sure you want to delete this note?')) return;

    try {
      await doContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'delete-note',
        functionArgs: deleteNoteArgs(noteId),
        onFinish: () => {
          console.log('Note deleted');
          loadNotes();
        },
      });
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                📝 Sorters
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Decentralized Note Keeper on Stacks Blockchain
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <WalletButton />
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes by title, content, or tags..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                onClick={() => {
                  setEditingNote(null);
                  setShowEditor(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
              >
                <Plus size={20} />
                New Note
              </button>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main>
          {!isAuthenticated ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Welcome to Sorters
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Connect your Stacks wallet to start storing your notes on the blockchain.
                  Your notes are yours forever - decentralized, immutable, and secure.
                </p>
                <WalletButton />
              </div>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-primary-600" size={48} />
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery ? 'No notes match your search.' : 'No notes yet. Create your first note!'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowEditor(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <Plus size={20} />
                  Create Note
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={(note) => {
                    setEditingNote(note);
                    setShowEditor(true);
                  }}
                  onDelete={handleDeleteNote}
                  isOwner={true}
                />
              ))}
            </div>
          )}
        </main>

        {/* Note Editor Modal */}
        {showEditor && (
          <NoteEditor
            initialNote={editingNote || undefined}
            onSave={editingNote ? handleUpdateNote : handleCreateNote}
            onCancel={() => {
              setShowEditor(false);
              setEditingNote(null);
            }}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  );
}

