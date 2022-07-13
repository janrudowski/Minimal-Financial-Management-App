import { customAlphabet } from 'nanoid';
const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const nanoid = customAlphabet(alphabet, 16);

const randomNumbers = customAlphabet('0123456789', 10);

export function invoice() {
  return `MGL0${randomNumbers()}`;
}
