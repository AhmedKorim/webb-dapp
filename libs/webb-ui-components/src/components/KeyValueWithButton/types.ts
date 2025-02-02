import { WebbComponentBase } from '../../types';

import { LabelWithValueProps } from '../LabelWithValue/types';
import { UseCopyableReturnType } from '../../hooks';

export type KeyValueWithButtonSize = 'sm' | 'md';

type KeyValueWithButtonBasePickedKeys =
  | 'isHiddenLabel'
  | 'valueVariant'
  | 'labelVariant';

export type KeyValueWithButtonBaseProps = Pick<
  LabelWithValueProps,
  KeyValueWithButtonBasePickedKeys
>;

/**
 * The `KeyValueWithButton` props
 */
export interface KeyValueWithButtonProps
  extends Omit<WebbComponentBase, keyof KeyValueWithButtonBaseProps>,
    KeyValueWithButtonBaseProps {
  /**
   * The label value
   * @default ''
   */
  label?: string;

  /**
   * The `key` hash value
   */
  keyValue: string;

  /**
   * The component size
   * @default "md"
   */
  size?: 'sm' | 'md';

  /**
   * Whether format the value in the short form.
   * @default true
   */
  hasShortenValue?: boolean;

  /**
   * The shorten string function
   * @param value represents the value to shorten
   * @param chars number of displayed characters
   * @returns the shortened string
   */
  shortenFn?: (value: string, chars?: number) => string;
  copyProps?: UseCopyableReturnType;
  isHiddenValue?: boolean;
}
