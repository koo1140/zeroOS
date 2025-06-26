import CryptoJS from 'crypto-js';

/**
 * Decrypts text that was encrypted with AES-256-CBC by the server.
 * The server prepends the IV (hex) to the ciphertext, separated by a colon.
 * @param {string} combinedCiphertext - The IV (hex) and ciphertext (base64), joined by ':'.
 * @param {string} secretKeyHex - The secret key used for encryption (hex encoded).
 * @returns {string|null} The decrypted original text, or null on error.
 */
export function decryptAES(combinedCiphertext, secretKeyHex) {
  try {
    const parts = combinedCiphertext.split(':');
    if (parts.length !== 2) {
      console.error("Invalid combined ciphertext format. Expected 'iv:ciphertext'.");
      return null;
    }
    const ivHex = parts[0];
    const ciphertextBase64 = parts[1];

    const key = CryptoJS.enc.Hex.parse(secretKeyHex);
    const iv = CryptoJS.enc.Hex.parse(ivHex);

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(ciphertextBase64) },
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7 // Standard padding
      }
    );

    const originalText = decrypted.toString(CryptoJS.enc.Utf8);

    if (!originalText) {
      // This can happen if the key is wrong or padding is incorrect,
      // leading to zero-length output after unpadding.
      console.error("Decryption resulted in empty or invalid string. Check key, IV, or ciphertext integrity.");
      return null;
    }
    return originalText;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}
