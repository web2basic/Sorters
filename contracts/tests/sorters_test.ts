import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';

Clarinet.test({
  name: "Can create a note",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        'sorters',
        'create-note',
        [
          types.ascii('My First Note'),
          types.buff(new Uint8Array([1, 2, 3, 4])),
          types.bool(false),
          types.list([]),
          types.none()
        ],
        wallet1.address
      )
    ]);

    block.receipts[0].result.expectOk().expectUint(1);
  }
});

Clarinet.test({
  name: "Can read own note",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    // Create a note
    let block = chain.mineBlock([
      Tx.contractCall(
        'sorters',
        'create-note',
        [
          types.ascii('Test Note'),
          types.buff(new Uint8Array([1, 2, 3])),
          types.bool(false),
          types.list([]),
          types.none()
        ],
        wallet1.address
      )
    ]);

    const noteId = block.receipts[0].result.expectOk().expectUint(1);

    // Read the note
    let readResult = chain.callReadOnlyFn(
      'sorters',
      'get-note',
      [types.uint(noteId)],
      wallet1.address
    );

    readResult.result.expectSome();
  }
});

Clarinet.test({
  name: "Cannot read other user's note without sharing",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;

    // Wallet1 creates a note
    let block = chain.mineBlock([
      Tx.contractCall(
        'sorters',
        'create-note',
        [
          types.ascii('Private Note'),
          types.buff(new Uint8Array([1, 2, 3])),
          types.bool(false),
          types.list([]),
          types.none()
        ],
        wallet1.address
      )
    ]);

    const noteId = block.receipts[0].result.expectOk().expectUint(1);

    // Wallet2 tries to read it
    let readResult = chain.callReadOnlyFn(
      'sorters',
      'get-note',
      [types.uint(noteId)],
      wallet2.address
    );

    readResult.result.expectNone();
  }
});

Clarinet.test({
  name: "Can share note with read permission",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;

    // Create note
    let block = chain.mineBlock([
      Tx.contractCall(
        'sorters',
        'create-note',
        [
          types.ascii('Shared Note'),
          types.buff(new Uint8Array([1, 2, 3])),
          types.bool(false),
          types.list([]),
          types.none()
        ],
        wallet1.address
      )
    ]);

    const noteId = block.receipts[0].result.expectOk().expectUint(1);

    // Share with wallet2
    block = chain.mineBlock([
      Tx.contractCall(
        'sorters',
        'share-note',
        [
          types.uint(noteId),
          types.principal(wallet2.address),
          types.ascii('read')
        ],
        wallet1.address
      )
    ]);

    block.receipts[0].result.expectOk().expectBool(true);

    // Wallet2 can now read
    let readResult = chain.callReadOnlyFn(
      'sorters',
      'get-note',
      [types.uint(noteId)],
      wallet2.address
    );

    readResult.result.expectSome();
  }
});

