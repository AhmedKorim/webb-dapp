import { Note } from '@webb-tools/sdk-core';
import { Transaction } from '@webb-tools/abstract-api-provider';

export type Notes = Note[];
export type NoteGenPayload = {
  note: Note;
  anchorId: string;
  wrappableAssetIdentifier: string;
};

export type TransactParams = {
  /**
   * Recipient address
   * */
  recipient: string;
  /**
   * Public amount
   * */
  amount: string;
  /**
   * Input notes
   * */
  notes: Notes;
  /**
   * Anchor tree id or contract address
   * */
  anchorId: string;
  /**
   * Token identifier
   * Wrap asset identifier -> wrap
   * unWrap asset identifier -> unwrap
   * */
  wrapUnwrapAssetIdentifier: string;
};

/**
 *
 * VAnchor transaction abstract class
 * */
export abstract class VAnchorTransact<T> {
  constructor(protected inner: T) {}

  /**
   *
   * Transaction function
   * */
  abstract transact(params: TransactParams): Promise<Transaction<Notes>>;
  /**
   * Note Generation abstract
   *
   * */
  abstract generateNote(
    anchorId: string,
    destChainId: string,
    amount: string,
    wrappableAssetIdentifier: string
  ): Promise<NoteGenPayload>;
}
