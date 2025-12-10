;; Sorters - Decentralized Notes Keeper
;; A Stacks blockchain smart contract for storing and managing encrypted notes

(define-constant ERR-NOT-AUTHORIZED (err u1001))
(define-constant ERR-NOTE-NOT-FOUND (err u1002))
(define-constant ERR-INVALID-INPUT (err u1003))
(define-constant ERR-STORAGE-LIMIT (err u1004))

(define-data-var owner principal (as-contract tx-sender))

;; Note structure
(define-map notes
  { id: uint }
  {
    owner: principal,
    title: (string-ascii 200),
    content: (buff 10000),
    encrypted: bool,
    tags: (list 10 (string-ascii 50)),
    folder: (optional (string-ascii 100)),
    created-at: uint,
    updated-at: uint,
    version: uint
  }
)

;; User's note IDs for quick lookup
(define-map user-notes
  { user: principal, note-id: uint }
  bool
)

;; Note counter
(define-data-var note-counter uint u0)

;; Folder structure for organization
(define-map folders
  { owner: principal, folder-name: (string-ascii 100) }
  {
    created-at: uint,
    note-count: uint
  }
)

;; Sharing permissions
(define-map shared-notes
  { note-id: uint, recipient: principal }
  {
    permission: (string-ascii 20), ;; "read" or "write"
    shared-at: uint
  }
)

;; Public functions

;; Create a new note
(define-public (create-note
    (title (string-ascii 200))
    (content (buff 10000))
    (encrypted bool)
    (tags (list 10 (string-ascii 50)))
    (folder (optional (string-ascii 100))))
  (let
    (
      (caller tx-sender)
      (note-id (+ (var-get note-counter) u1))
    )
    (begin
      (asserts! (> (len content) u0) ERR-INVALID-INPUT)
      (asserts! (<= (len content) u10000) ERR-STORAGE-LIMIT)
      (map-set notes
        { id: note-id }
        {
          owner: caller,
          title: title,
          content: content,
          encrypted: encrypted,
          tags: tags,
          folder: folder,
          created-at: block-height,
          updated-at: block-height,
          version: u1
        }
      )
      (map-set user-notes { user: caller, note-id: note-id } true)
      (var-set note-counter note-id)
      (match folder
        folder-name (map-set folders
          { owner: caller, folder-name: folder-name }
          {
            created-at: block-height,
            note-count: u1
          }
        )
        true
      )
      (ok note-id)
    )
  )
)

;; Update an existing note
(define-public (update-note
    (note-id uint)
    (title (string-ascii 200))
    (content (buff 10000))
    (tags (list 10 (string-ascii 50)))
    (folder (optional (string-ascii 100))))
  (let
    (
      (caller tx-sender)
      (note (map-get? notes { id: note-id }))
    )
    (begin
      (asserts! (is-some note) ERR-NOTE-NOT-FOUND)
      (let ((note-data (unwrap-panic note)))
        (asserts!
          (or
            (is-eq (get owner note-data) caller)
            (is-eq (get owner note-data) (as-contract tx-sender))
          )
          ERR-NOT-AUTHORIZED
        )
        (asserts! (<= (len content) u10000) ERR-STORAGE-LIMIT)
        (map-set notes
          { id: note-id }
          {
            owner: (get owner note-data),
            title: title,
            content: content,
            encrypted: (get encrypted note-data),
            tags: tags,
            folder: folder,
            created-at: (get created-at note-data),
            updated-at: block-height,
            version: (+ (get version note-data) u1)
          }
        )
        (ok true)
      )
    )
  )
)

;; Delete a note
(define-public (delete-note (note-id uint))
  (let
    (
      (caller tx-sender)
      (note (map-get? notes { id: note-id }))
    )
    (begin
      (asserts! (is-some note) ERR-NOTE-NOT-FOUND)
      (let ((note-data (unwrap-panic note)))
        (asserts!
          (is-eq (get owner note-data) caller)
          ERR-NOT-AUTHORIZED
        )
        (map-delete notes { id: note-id })
        (map-delete user-notes { user: caller, note-id: note-id })
        (ok true)
      )
    )
  )
)

;; Share a note with another user
(define-public (share-note
    (note-id uint)
    (recipient principal)
    (permission (string-ascii 20)))
  (let
    (
      (caller tx-sender)
      (note (map-get? notes { id: note-id }))
    )
    (begin
      (asserts! (is-some note) ERR-NOTE-NOT-FOUND)
      (let ((note-data (unwrap-panic note)))
        (asserts!
          (is-eq (get owner note-data) caller)
          ERR-NOT-AUTHORIZED
        )
        (asserts!
          (or
            (is-eq permission "read")
            (is-eq permission "write")
          )
          ERR-INVALID-INPUT
        )
        (map-set shared-notes
          { note-id: note-id, recipient: recipient }
          {
            permission: permission,
            shared-at: block-height
          }
        )
        (ok true)
      )
    )
  )
)

;; Revoke sharing access
(define-public (revoke-share (note-id uint) (recipient principal))
  (let
    (
      (caller tx-sender)
      (note (map-get? notes { id: note-id }))
    )
    (begin
      (asserts! (is-some note) ERR-NOTE-NOT-FOUND)
      (let ((note-data (unwrap-panic note)))
        (asserts!
          (is-eq (get owner note-data) caller)
          ERR-NOT-AUTHORIZED
        )
        (map-delete shared-notes { note-id: note-id, recipient: recipient })
        (ok true)
      )
    )
  )
)

;; Read functions

;; Get note by ID
(define-read-only (get-note (note-id uint))
  (let
    (
      (caller tx-sender)
      (note (map-get? notes { id: note-id }))
    )
    (if (is-none note)
      (ok none)
      (let ((note-data (unwrap-panic note)))
        (if (or
              (is-eq (get owner note-data) caller)
              (is-eq (get owner note-data) (as-contract tx-sender))
            )
          (ok (some note-data))
          (let ((share (map-get? shared-notes { note-id: note-id, recipient: caller })))
            (if (is-some share)
              (ok (some note-data))
              (ok none)
            )
          )
        )
      )
    )
  )
)

;; Get user's note count
(define-read-only (get-user-note-count (user principal))
  (ok (var-get note-counter))
)

;; Check if user has access to note
(define-read-only (has-access (note-id uint) (user principal))
  (let
    (
      (note (map-get? notes { id: note-id }))
    )
    (if (is-none note)
      (ok false)
      (let ((note-data (unwrap-panic note)))
        (ok (or
              (is-eq (get owner note-data) user)
              (is-some (map-get? shared-notes { note-id: note-id, recipient: user }))
            )
        )
      )
    )
  )
)

;; Get folder info
(define-read-only (get-folder (user principal) (folder-name (string-ascii 100)))
  (ok (map-get? folders { owner: user, folder-name: folder-name }))
)

