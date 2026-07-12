import { customAlphabet } from 'nanoid';

// Custom base-54 alphabet excluding similar characters (0, O, I, 1, l)
const ALPHABET = '23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
const ID_LENGTH = 10;

const generator = customAlphabet(ALPHABET, ID_LENGTH);

/**
 * Generates a unique, non-sequential, short URL identifier.
 * @returns {string} A 10-character unique string.
 */
export function generateUniqueId() {
  return generator();
}
