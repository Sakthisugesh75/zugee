// lib/oauth-encryption.js
// Token encryption/decryption utilities for OAuth tokens

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;

// Get encryption key from environment
function getEncryptionKey() {
  const secret = process.env.OAUTH_ENCRYPTION_SECRET;
  
  if (!secret) {
    throw new Error('OAUTH_ENCRYPTION_SECRET environment variable is required');
  }

  // Derive a 32-byte key from the secret
  return crypto.pbkdf2Sync(secret, 'zugee-oauth-salt', 100000, 32, 'sha512');
}

/**
 * Encrypt OAuth tokens before storing in database
 * @param {string} token - The token to encrypt
 * @returns {string} Encrypted token in format: iv:authTag:encryptedData
 */
export function encryptToken(token) {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Return format: iv:authTag:encryptedData
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Token encryption error:', error);
    throw new Error('Failed to encrypt token');
  }
}

/**
 * Decrypt OAuth tokens retrieved from database
 * @param {string} encryptedToken - The encrypted token
 * @returns {string} Decrypted token
 */
export function decryptToken(encryptedToken) {
  try {
    const key = getEncryptionKey();
    const parts = encryptedToken.split(':');
    
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted token format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Token decryption error:', error);
    throw new Error('Failed to decrypt token');
  }
}

/**
 * Check if a token is encrypted
 * @param {string} token - The token to check
 * @returns {boolean}
 */
export function isEncryptedToken(token) {
  if (!token) return false;
  const parts = token.split(':');
  return parts.length === 3 && parts[0].length === IV_LENGTH * 2;
}
