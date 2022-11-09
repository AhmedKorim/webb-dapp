export interface SpendNotesTableContainerProps {}

export interface SpendNoteDataType {
  /**
   * Asset chain
   */
  chain: string;

  /**
   * Symbol of the governed (webb<xxx>) asset
   */
  governedTokenSymbol: string;

  /**
   * The external url of assets pair
   */
  assetsUrl: string;

  /**
   * The note balance
   */
  balance: number;

  /**
   * Created time
   */
  createdTime: Date;

  /**
   * Subsepent deposits
   */
  subsequentDeposits: number;

  /**
   * The actual note
   */
  note: string;
}
