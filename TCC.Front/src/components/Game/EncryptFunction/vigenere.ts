export function vigenereEncrypt(plainText: string) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let cipherText = '';
  let keyIndex = 0;
  let key = 'DANS'

  plainText = plainText.toUpperCase();
  key = key.toUpperCase();

  for (let i = 0; i < plainText.length; i++) {
    if (alphabet.includes(plainText[i])) {
      const plainIndex = alphabet.indexOf(plainText[i]);
      const keyIndexShift = alphabet.indexOf(key[keyIndex]);
      const cipherIndex = (plainIndex + keyIndexShift) % 26;
      cipherText += alphabet[cipherIndex];
      keyIndex = (keyIndex + 1) % key.length;
    } else {
      cipherText += plainText[i];
    }
  }

  return cipherText;
}