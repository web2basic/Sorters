# Sorters Smart Contract API

## Contract Interface

### Public Functions

#### `create-note`

Create a new note.

**Parameters:**
- `title` (string-ascii 200): Note title
- `content` (string-ascii 10000): Note content
- `tags` (list 10 (string-ascii 50)): List of tags
- `is-encrypted` (bool): Encryption flag

**Returns:** `(ok true)` on success

**Errors:**
- `ERR-INVALID-INPUT` (u1003): Invalid title or content
- `ERR-CONTENT-TOO-LONG` (u1005): Content exceeds maximum length
- `ERR-TAG-LIMIT-EXCEEDED` (u1004): Too many tags

**Example:**
```clarity
(contract-call? .sorters create-note 
    "My Note" 
    "This is my note content" 
    (list "personal" "important") 
    false
)
```

---

#### `update-note-content`

Update the content of an existing note.

**Parameters:**
- `note-id` (uint): ID of the note to update
- `new-content` (string-ascii 10000): New content

**Returns:** `(ok true)` on success

**Errors:**
- `ERR-NOTE-NOT-FOUND` (u1002): Note doesn't exist
- `ERR-NOT-AUTHORIZED` (u1001): Caller is not the note owner
- `ERR-CONTENT-TOO-LONG` (u1005): Content exceeds maximum length

**Example:**
```clarity
(contract-call? .sorters update-note-content 
    u1 
    "Updated content"
)
```

---

#### `update-note-title`

Update the title of an existing note.

**Parameters:**
- `note-id` (uint): ID of the note to update
- `new-title` (string-ascii 200): New title

**Returns:** `(ok true)` on success

**Errors:**
- `ERR-NOTE-NOT-FOUND` (u1002): Note doesn't exist
- `ERR-NOT-AUTHORIZED` (u1001): Caller is not the note owner
- `ERR-INVALID-INPUT` (u1003): Invalid title

**Example:**
```clarity
(contract-call? .sorters update-note-title 
    u1 
    "New Title"
)
```

---

#### `add-tag`

Add a tag to an existing note.

**Parameters:**
- `note-id` (uint): ID of the note
- `tag` (string-ascii 50): Tag to add

**Returns:** `(ok true)` on success

**Errors:**
- `ERR-NOTE-NOT-FOUND` (u1002): Note doesn't exist
- `ERR-NOT-AUTHORIZED` (u1001): Caller is not the note owner
- `ERR-TAG-LIMIT-EXCEEDED` (u1004): Maximum tags reached
- `ERR-INVALID-INPUT` (u1003): Invalid tag

**Example:**
```clarity
(contract-call? .sorters add-tag 
    u1 
    "urgent"
)
```

---

#### `update-tags`

Replace all tags for a note.

**Parameters:**
- `note-id` (uint): ID of the note
- `new-tags` (list 10 (string-ascii 50)): New list of tags

**Returns:** `(ok true)` on success

**Errors:**
- `ERR-NOTE-NOT-FOUND` (u1002): Note doesn't exist
- `ERR-NOT-AUTHORIZED` (u1001): Caller is not the note owner
- `ERR-TAG-LIMIT-EXCEEDED` (u1004): Too many tags

**Example:**
```clarity
(contract-call? .sorters update-tags 
    u1 
    (list "work" "project" "important")
)
```

---

#### `delete-note`

Delete a note permanently.

**Parameters:**
- `note-id` (uint): ID of the note to delete

**Returns:** `(ok true)` on success

**Errors:**
- `ERR-NOTE-NOT-FOUND` (u1002): Note doesn't exist
- `ERR-NOT-AUTHORIZED` (u1001): Caller is not the note owner

**Example:**
```clarity
(contract-call? .sorters delete-note u1)
```

---

### Read-Only Functions

#### `get-note`

Retrieve a note by ID.

**Parameters:**
- `note-id` (uint): ID of the note

**Returns:** Note struct or error

**Note Structure:**
```clarity
{
    owner: principal,
    title: (string-ascii 200),
    content: (string-ascii 10000),
    tags: (list 10 (string-ascii 50)),
    created-at: uint,
    updated-at: uint,
    is-encrypted: bool
}
```

**Errors:**
- `ERR-NOTE-NOT-FOUND` (u1002): Note doesn't exist

**Example:**
```clarity
(contract-call? .sorters get-note u1)
```

---

#### `get-note-owner`

Get the owner of a note.

**Parameters:**
- `note-id` (uint): ID of the note

**Returns:** `(ok principal)` or error

**Errors:**
- `ERR-NOTE-NOT-FOUND` (u1002): Note doesn't exist

**Example:**
```clarity
(contract-call? .sorters get-note-owner u1)
```

---

#### `get-note-count`

Get the total number of notes created.

**Parameters:** None

**Returns:** `(ok uint)` - Total note count

**Example:**
```clarity
(contract-call? .sorters get-note-count)
```

---

#### `is-owner`

Check if a user owns a note.

**Parameters:**
- `note-id` (uint): ID of the note
- `user` (principal): User address to check

**Returns:** `(ok bool)` - true if user owns the note

**Example:**
```clarity
(contract-call? .sorters is-owner 
    u1 
    'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
)
```

---

## Events

### `NoteCreated`

Emitted when a note is created.

**Parameters:**
- `note-id` (uint)
- `owner` (principal)
- `title` (string-ascii 200)

---

### `NoteUpdated`

Emitted when a note is updated.

**Parameters:**
- `note-id` (uint)
- `owner` (principal)
- `title` (string-ascii 200)

---

### `NoteDeleted`

Emitted when a note is deleted.

**Parameters:**
- `note-id` (uint)
- `owner` (principal)

---

### `TagAdded`

Emitted when a tag is added to a note.

**Parameters:**
- `note-id` (uint)
- `tag` (string-ascii 50)

---

## Error Codes

| Code | Constant | Description |
|------|----------|-------------|
| u1001 | ERR-NOT-AUTHORIZED | Caller is not authorized |
| u1002 | ERR-NOTE-NOT-FOUND | Note does not exist |
| u1003 | ERR-INVALID-INPUT | Invalid input parameter |
| u1004 | ERR-TAG-LIMIT-EXCEEDED | Tag limit exceeded |
| u1005 | ERR-CONTENT-TOO-LONG | Content exceeds maximum length |

---

## Usage Examples

### JavaScript/TypeScript (Stacks.js)

```typescript
import { callReadOnlyFunction, contractPrincipalCV, uintCV, stringAsciiCV, listCV, boolCV } from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';

const network = new StacksTestnet();
const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const contractName = 'sorters';

// Create a note
const createNote = async (title: string, content: string, tags: string[], isEncrypted: boolean) => {
  const functionArgs = [
    stringAsciiCV(title),
    stringAsciiCV(content),
    listCV(tags.map(tag => stringAsciiCV(tag))),
    boolCV(isEncrypted)
  ];
  
  // Use Stacks Connect or similar for transaction
};

// Get a note
const getNote = async (noteId: number) => {
  const result = await callReadOnlyFunction({
    network,
    contractAddress,
    contractName,
    functionName: 'get-note',
    functionArgs: [uintCV(noteId)],
    senderAddress: contractAddress
  });
  
  return result;
};
```

---

## Rate Limits

- No rate limits on read-only functions
- Transaction limits depend on network capacity
- Gas costs apply to all write operations

## Best Practices

1. **Always check ownership** before updating/deleting
2. **Validate inputs** on the frontend before submitting
3. **Handle errors** gracefully in your application
4. **Monitor events** for real-time updates
5. **Cache read-only data** to reduce API calls


