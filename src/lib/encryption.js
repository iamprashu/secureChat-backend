import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENC_KEY;
const ALGORITHM = "aes-256-cbc";

export const encryptMessage = (text) => {
  if (!text) return text;

  try {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    return text;
  }
};

export const decryptMessage = (encryptedText) => {
  if (!encryptedText) return encryptedText;

  try {
    const parts = encryptedText.split(":");
    if (parts.length !== 2) return encryptedText;

    const iv = Buffer.from(parts[0], "hex");
    const encrypted = parts[1];
    const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    return encryptedText;
  }
};
