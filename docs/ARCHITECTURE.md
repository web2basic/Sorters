# Sorters Architecture

## Overview

Sorters is built on the Stacks blockchain using Clarity smart contracts for on-chain note storage and management. The architecture follows a decentralized, user-centric design where users maintain full ownership of their data.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  (React/Next.js - Wallet Integration, UI Components)        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Stacks Connect API
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    Stacks Blockchain                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Sorters Smart Contract (Clarity)             │  │
│  │  - Note Storage (Maps)                               │  │
│  │  - Access Control                                    │  │
│  │  - Event Emission                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Smart Contract Architecture

### Data Structures

1. **Notes Map**: Primary storage for all notes
   - Key: `uint` (note ID)
   - Value: Note struct containing owner, title, content, tags, timestamps

2. **User Notes Map**: Quick lookup for user's notes
   - Key: `(principal, uint)` (user address, note ID)
   - Value: `bool` (ownership flag)

3. **Note Counter**: Global counter for generating unique note IDs

### Core Functions

#### Public Functions
- `create-note`: Create a new note
- `update-note-content`: Update note content
- `update-note-title`: Update note title
- `add-tag`: Add a tag to a note
- `update-tags`: Replace all tags
- `delete-note`: Delete a note

#### Read-Only Functions
- `get-note`: Retrieve a note by ID
- `get-note-owner`: Get the owner of a note
- `get-note-count`: Get total number of notes
- `is-owner`: Check if a user owns a note

### Security Features

1. **Access Control**: All write operations verify ownership
2. **Input Validation**: Content length, title length, and tag limits
3. **Immutable Audit Trail**: All operations emit events
4. **No Central Authority**: Fully decentralized

## Data Flow

### Creating a Note

1. User fills form in frontend
2. Frontend calls `create-note` via Stacks Connect
3. User approves transaction in wallet
4. Transaction submitted to Stacks blockchain
5. Contract validates inputs and creates note
6. Event emitted for frontend to update UI

### Reading Notes

1. Frontend queries contract using `get-note`
2. Contract returns note data (read-only, no transaction needed)
3. Frontend displays note to user

### Updating/Deleting Notes

1. User initiates action in frontend
2. Frontend calls appropriate contract function
3. Contract verifies ownership
4. If authorized, operation executes
5. Event emitted for UI update

## Storage Considerations

### On-Chain Storage
- All note data stored on Stacks blockchain
- Immutable and permanent
- Transparent and verifiable
- Requires STX for transactions

### Limitations
- Content length limited to 10,000 characters
- Title limited to 200 characters
- Maximum 10 tags per note
- Each tag limited to 50 characters

### Cost Implications
- Creating a note: ~1 STX (varies with network)
- Updating a note: ~0.5 STX
- Reading notes: Free (read-only)
- Deleting a note: ~0.3 STX

## Event System

All operations emit events for:
- Frontend synchronization
- Indexing and search
- Analytics and monitoring
- Audit trails

### Event Types
- `NoteCreated`: Emitted when a note is created
- `NoteUpdated`: Emitted when a note is updated
- `NoteDeleted`: Emitted when a note is deleted
- `TagAdded`: Emitted when a tag is added

## Frontend Architecture

### Components
- **Wallet Connector**: Handles Stacks wallet integration
- **Note List**: Displays user's notes
- **Note Editor**: Create/edit note interface
- **Tag Manager**: Tag organization UI
- **Search/Filter**: Find notes by content or tags

### State Management
- React Context for wallet state
- Local state for UI components
- Contract queries for note data
- Event listeners for real-time updates

## Security Model

1. **Wallet-Based Authentication**: No passwords, uses Stacks wallet
2. **On-Chain Authorization**: Smart contract enforces ownership
3. **Immutable Records**: Cannot be tampered with
4. **Transparent Operations**: All actions visible on blockchain

## Scalability Considerations

1. **Pagination**: Frontend implements pagination for large note lists
2. **Indexing**: Off-chain indexer for fast search (optional)
3. **Batch Operations**: Future feature for bulk operations
4. **Layer 2**: Potential for L2 scaling solutions

## Future Enhancements

1. **IPFS Integration**: Store large content off-chain, hash on-chain
2. **Encryption**: Client-side encryption before storing
3. **Sharing**: Permission-based note sharing
4. **Collaboration**: Multi-user note editing
5. **Versioning**: Note history and version control

