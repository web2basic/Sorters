'use client'

import { useState, useEffect } from 'react'
import { useConnect } from '@stacks/connect-react'
import { StacksMainnet, StacksTestnet } from '@stacks/network'
import { 
  callReadOnlyFunction,
  contractPrincipalCV,
  stringAsciiCV,
  uintCV,
  bufferCV,
  listCV,
  someCV,
  noneCV,
  standardPrincipalCV,
  PostConditionMode,
  createAssetInfo,
  FungibleConditionCode,
  makeStandardSTXPostCondition
} from '@stacks/transactions'
import { userSession } from './providers'
import NoteCard from './components/NoteCard'
import CreateNoteModal from './components/CreateNoteModal'
import { CONTRACT_ADDRESS, CONTRACT_NAME } from './config'

const CONTRACT = `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`

export default function Home() {
  const { doOpenAuth, doContractCall } = useConnect()
  const [userData, setUserData] = useState<any>(null)
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [network, setNetwork] = useState(new StacksTestnet())

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const data = userSession.loadUserData()
      setUserData(data)
    }
  }, [])

  useEffect(() => {
    if (userData) {
      loadNotes()
    }
  }, [userData])

  const handleSignIn = async () => {
    doOpenAuth({
      network: network,
      appDetails: {
        name: 'Sorters',
        icon: '/icon.png',
      },
      onFinish: (data) => {
        setUserData(data)
        loadNotes()
      },
    })
  }

  const handleSignOut = () => {
    userSession.signUserOut()
    setUserData(null)
    setNotes([])
  }

  const loadNotes = async () => {
    if (!userData) return
    setLoading(true)
    try {
      // TODO: Implement note fetching logic
      // You would need to track note IDs per user or iterate through all notes
      // For now, we'll show a placeholder
      setNotes([])
    } catch (error) {
      console.error('Error loading notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNote = async (title: string, content: string, encrypted: boolean, tags: string[], folder?: string) => {
    if (!userData) return

    const contentBuffer = Buffer.from(content, 'utf-8')
    const tagsList = listCV(tags.map(tag => stringAsciiCV(tag)))
    const folderOpt = folder ? someCV(stringAsciiCV(folder)) : noneCV()

    await doContractCall({
      network: network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'create-note',
      functionArgs: [
        stringAsciiCV(title),
        bufferCV(contentBuffer),
        encrypted ? true : false,
        tagsList,
        folderOpt
      ],
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log('Note created:', data)
        loadNotes()
        setShowCreateModal(false)
      },
      onCancel: () => {
        console.log('Transaction cancelled')
      },
    })
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Sorters</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Decentralized Notes Keeper on Stacks Blockchain
              </p>
            </div>
            <div className="flex gap-4 items-center">
              {userData ? (
                <>
                  <span className="text-sm">
                    {userData.profile?.stxAddress?.testnet || userData.profile?.stxAddress?.mainnet || 'Connected'}
                  </span>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Note
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </header>

        {userData ? (
          <div>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading notes...</p>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No notes yet. Create your first note!</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Note
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note, index) => (
                  <NoteCard key={index} note={note} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-4">Welcome to Sorters</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Store your important notes securely on the Stacks blockchain.
              Your notes are encrypted, decentralized, and truly yours.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">🔒 Secure</h3>
                <p className="text-gray-600">End-to-end encryption with blockchain security</p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">🌐 Decentralized</h3>
                <p className="text-gray-600">No central server, your data stays on-chain</p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">👥 Shareable</h3>
                <p className="text-gray-600">Share notes with read or write permissions</p>
              </div>
            </div>
            <button
              onClick={handleSignIn}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold"
            >
              Get Started
            </button>
          </div>
        )}

        {showCreateModal && (
          <CreateNoteModal
            onClose={() => setShowCreateModal(false)}
            onCreate={createNote}
          />
        )}
      </div>
    </main>
  )
}

