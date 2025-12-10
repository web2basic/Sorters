import {
  callReadOnlyFunction,
  contractPrincipalCV,
  uintCV,
  stringAsciiCV,
  listCV,
  boolCV,
  cvToJSON,
  ClarityValue,
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
} from '@stacks/transactions';
import { network } from './wallet';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from './config';

export interface Note {
  owner: string;
  title: string;
  content: string;
  tags: string[];
  'created-at': number;
  'updated-at': number;
  'is-encrypted': boolean;
}

export interface NoteInput {
  title: string;
  content: string;
  tags: string[];
  isEncrypted: boolean;
}

/**
 * Get a note by ID
 */
export async function getNote(noteId: number, senderAddress: string): Promise<Note | null> {
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-note',
      functionArgs: [uintCV(noteId)],
      senderAddress,
    });

    const json = cvToJSON(result);
    if (json.value) {
      return parseNote(json.value);
    }
    return null;
  } catch (error) {
    console.error('Error fetching note:', error);
    return null;
  }
}

/**
 * Get note owner
 */
export async function getNoteOwner(noteId: number, senderAddress: string): Promise<string | null> {
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-note-owner',
      functionArgs: [uintCV(noteId)],
      senderAddress,
    });

    const json = cvToJSON(result);
    return json.value?.value || null;
  } catch (error) {
    console.error('Error fetching note owner:', error);
    return null;
  }
}

/**
 * Get total note count
 */
export async function getNoteCount(senderAddress: string): Promise<number> {
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-note-count',
      functionArgs: [],
      senderAddress,
    });

    const json = cvToJSON(result);
    return parseInt(json.value?.value || '0', 10);
  } catch (error) {
    console.error('Error fetching note count:', error);
    return 0;
  }
}

/**
 * Check if user owns a note
 */
export async function isOwner(
  noteId: number,
  userAddress: string,
  senderAddress: string
): Promise<boolean> {
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'is-owner',
      functionArgs: [uintCV(noteId), contractPrincipalCV(userAddress)],
      senderAddress,
    });

    const json = cvToJSON(result);
    return json.value?.value === true;
  } catch (error) {
    console.error('Error checking ownership:', error);
    return false;
  }
}

/**
 * Parse note from Clarity value
 */
function parseNote(value: any): Note {
  return {
    owner: value.owner?.value || '',
    title: value.title?.value || '',
    content: value.content?.value || '',
    tags: value.tags?.value?.map((tag: any) => tag.value) || [],
    'created-at': parseInt(value['created-at']?.value || '0', 10),
    'updated-at': parseInt(value['updated-at']?.value || '0', 10),
    'is-encrypted': value['is-encrypted']?.value || false,
  };
}

/**
 * Create contract call arguments for creating a note
 */
export function createNoteArgs(note: NoteInput): ClarityValue[] {
  return [
    stringAsciiCV(note.title),
    stringAsciiCV(note.content),
    listCV(note.tags.map(tag => stringAsciiCV(tag))),
    boolCV(note.isEncrypted),
  ];
}

/**
 * Create contract call arguments for updating note content
 */
export function updateNoteContentArgs(noteId: number, newContent: string): ClarityValue[] {
  return [
    uintCV(noteId),
    stringAsciiCV(newContent),
  ];
}

/**
 * Create contract call arguments for updating note title
 */
export function updateNoteTitleArgs(noteId: number, newTitle: string): ClarityValue[] {
  return [
    uintCV(noteId),
    stringAsciiCV(newTitle),
  ];
}

/**
 * Create contract call arguments for adding a tag
 */
export function addTagArgs(noteId: number, tag: string): ClarityValue[] {
  return [
    uintCV(noteId),
    stringAsciiCV(tag),
  ];
}

/**
 * Create contract call arguments for updating tags
 */
export function updateTagsArgs(noteId: number, tags: string[]): ClarityValue[] {
  return [
    uintCV(noteId),
    listCV(tags.map(tag => stringAsciiCV(tag))),
  ];
}

/**
 * Create contract call arguments for deleting a note
 */
export function deleteNoteArgs(noteId: number): ClarityValue[] {
  return [uintCV(noteId)];
}

