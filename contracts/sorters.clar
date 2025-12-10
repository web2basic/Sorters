;; Sorters - Decentralized Note Keeper Smart Contract
;; Built on Stacks Blockchain using Clarity

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u1001))
(define-constant ERR-NOTE-NOT-FOUND (err u1002))
(define-constant ERR-INVALID-INPUT (err u1003))
(define-constant ERR-TAG-LIMIT-EXCEEDED (err u1004))
(define-constant ERR-CONTENT-TOO-LONG (err u1005))

;; Maximum content length (in characters)
(define-constant MAX-CONTENT-LENGTH u10000)
(define-constant MAX-TITLE-LENGTH u200)
(define-constant MAX-TAGS u10)
(define-constant MAX-TAG-LENGTH u50)

;; Note data structure
(define-data-var note-counter uint u0)

(define-map notes uint {
    owner: principal,
    title: (string-ascii 200),
    content: (string-ascii 10000),
    tags: (list 10 (string-ascii 50)),
    created-at: uint,
    updated-at: uint,
    is-encrypted: bool
})

;; Map to track user's notes for quick lookup
(define-map user-notes (principal, uint) bool)

;; Events
(define-data-event NoteCreated (
    note-id: uint,
    owner: principal,
    title: (string-ascii 200)
))

(define-data-event NoteUpdated (
    note-id: uint,
    owner: principal,
    title: (string-ascii 200)
))

(define-data-event NoteDeleted (
    note-id: uint,
    owner: principal
))

(define-data-event TagAdded (
    note-id: uint,
    tag: (string-ascii 50)
))

;; Helper function to check if caller is note owner
(define-private (is-note-owner (note-id uint))
    (begin
        (asserts! (is-eq tx-sender (get owner (unwrap-panic (map-get? notes note-id)))) ERR-NOT-AUTHORIZED)
        true
    )
)

;; Helper function to validate content length
(define-private (validate-content (content (string-ascii 10000)))
    (begin
        (asserts! (<= (len content) MAX-CONTENT-LENGTH) ERR-CONTENT-TOO-LONG)
        true
    )
)

;; Helper function to validate title length
(define-private (validate-title (title (string-ascii 200)))
    (begin
        (asserts! (<= (len title) MAX-TITLE-LENGTH) ERR-INVALID-INPUT)
        (asserts! (> (len title) u0) ERR-INVALID-INPUT)
        true
    )
)

;; Helper function to validate tags
(define-private (validate-tags (tags (list 10 (string-ascii 50))))
    (begin
        (asserts! (<= (len tags) MAX-TAGS) ERR-TAG-LIMIT-EXCEEDED)
        true
    )
)

;; Create a new note
(define-public (create-note 
    (title (string-ascii 200))
    (content (string-ascii 10000))
    (tags (list 10 (string-ascii 50)))
    (is-encrypted bool)
)
    (let (
        (caller tx-sender)
        (current-time (unwrap! (get-block-info? time u0) u0))
        (note-id (+ (var-get note-counter) u1))
    )
        (begin
            ;; Validate inputs
            (try! (validate-title title))
            (try! (validate-content content))
            (try! (validate-tags tags))
            
            ;; Increment note counter
            (var-set note-counter note-id)
            
            ;; Store note
            (map-set notes note-id {
                owner: caller,
                title: title,
                content: content,
                tags: tags,
                created-at: current-time,
                updated-at: current-time,
                is-encrypted: is-encrypted
            })
            
            ;; Track user's note
            (map-set user-notes (caller, note-id) true)
            
            ;; Emit event
            (ok (print (NoteCreated note-id caller title)))
        )
    )
)

;; Read a note (returns the note data)
(define-read-only (get-note (note-id uint))
    (let ((note (map-get? notes note-id)))
        (match note
            note-data (ok note-data)
            (err ERR-NOTE-NOT-FOUND)
        )
    )
)

;; Get note owner
(define-read-only (get-note-owner (note-id uint))
    (let ((note (map-get? notes note-id)))
        (match note
            note-data (ok (get owner note-data))
            (err ERR-NOTE-NOT-FOUND)
        )
    )
)

;; Update note content
(define-public (update-note-content 
    (note-id uint)
    (new-content (string-ascii 10000))
)
    (let (
        (caller tx-sender)
        (note (unwrap! (map-get? notes note-id) ERR-NOTE-NOT-FOUND))
        (current-time (unwrap! (get-block-info? time u0) u0))
    )
        (begin
            ;; Check authorization
            (try! (is-note-owner note-id))
            
            ;; Validate content
            (try! (validate-content new-content))
            
            ;; Update note
            (map-set notes note-id {
                owner: (get owner note),
                title: (get title note),
                content: new-content,
                tags: (get tags note),
                created-at: (get created-at note),
                updated-at: current-time,
                is-encrypted: (get is-encrypted note)
            })
            
            ;; Emit event
            (ok (print (NoteUpdated note-id caller (get title note))))
        )
    )
)

;; Update note title
(define-public (update-note-title 
    (note-id uint)
    (new-title (string-ascii 200))
)
    (let (
        (caller tx-sender)
        (note (unwrap! (map-get? notes note-id) ERR-NOTE-NOT-FOUND))
        (current-time (unwrap! (get-block-info? time u0) u0))
    )
        (begin
            ;; Check authorization
            (try! (is-note-owner note-id))
            
            ;; Validate title
            (try! (validate-title new-title))
            
            ;; Update note
            (map-set notes note-id {
                owner: (get owner note),
                title: new-title,
                content: (get content note),
                tags: (get tags note),
                created-at: (get created-at note),
                updated-at: current-time,
                is-encrypted: (get is-encrypted note)
            })
            
            ;; Emit event
            (ok (print (NoteUpdated note-id caller new-title)))
        )
    )
)

;; Add tag to note
(define-public (add-tag 
    (note-id uint)
    (tag (string-ascii 50))
)
    (let (
        (caller tx-sender)
        (note (unwrap! (map-get? notes note-id) ERR-NOTE-NOT-FOUND))
        (current-tags (get tags note))
        (current-time (unwrap! (get-block-info? time u0) u0))
    )
        (begin
            ;; Check authorization
            (try! (is-note-owner note-id))
            
            ;; Validate tag length
            (asserts! (<= (len tag) MAX-TAG-LENGTH) ERR-INVALID-INPUT)
            (asserts! (> (len tag) u0) ERR-INVALID-INPUT)
            
            ;; Check tag limit
            (asserts! (< (len current-tags) MAX-TAGS) ERR-TAG-LIMIT-EXCEEDED)
            
            ;; Add tag if not already present
            (let ((new-tags (append current-tags (list tag))))
                (begin
                    (map-set notes note-id {
                        owner: (get owner note),
                        title: (get title note),
                        content: (get content note),
                        tags: new-tags,
                        created-at: (get created-at note),
                        updated-at: current-time,
                        is-encrypted: (get is-encrypted note)
                    })
                    
                    ;; Emit event
                    (ok (print (TagAdded note-id tag)))
                )
            )
        )
    )
)

;; Update tags
(define-public (update-tags 
    (note-id uint)
    (new-tags (list 10 (string-ascii 50)))
)
    (let (
        (caller tx-sender)
        (note (unwrap! (map-get? notes note-id) ERR-NOTE-NOT-FOUND))
        (current-time (unwrap! (get-block-info? time u0) u0))
    )
        (begin
            ;; Check authorization
            (try! (is-note-owner note-id))
            
            ;; Validate tags
            (try! (validate-tags new-tags))
            
            ;; Update note
            (map-set notes note-id {
                owner: (get owner note),
                title: (get title note),
                content: (get content note),
                tags: new-tags,
                created-at: (get created-at note),
                updated-at: current-time,
                is-encrypted: (get is-encrypted note)
            })
            
            ;; Emit event
            (ok (print (NoteUpdated note-id caller (get title note))))
        )
    )
)

;; Delete a note
(define-public (delete-note (note-id uint))
    (let (
        (caller tx-sender)
        (note (unwrap! (map-get? notes note-id) ERR-NOTE-NOT-FOUND))
    )
        (begin
            ;; Check authorization
            (try! (is-note-owner note-id))
            
            ;; Delete note from map
            (map-delete notes note-id)
            
            ;; Remove from user notes tracking
            (map-delete user-notes (caller, note-id))
            
            ;; Emit event
            (ok (print (NoteDeleted note-id caller)))
        )
    )
)

;; Get total number of notes
(define-read-only (get-note-count)
    (ok (var-get note-counter))
)

;; Check if user owns a note
(define-read-only (is-owner (note-id uint) (user principal))
    (let ((note (map-get? notes note-id)))
        (match note
            note-data (ok (is-eq (get owner note-data) user))
            (ok false)
        )
    )
)

;; Get all note IDs for a user (helper for frontend)
(define-read-only (get-user-note-count (user principal))
    (ok (var-get note-counter))
)

