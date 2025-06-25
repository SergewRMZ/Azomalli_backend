import crypto from 'crypto';

export const deriveKey = (password: string, salt: string) => {
  return new Promise<Buffer>((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 32, 'sha256', (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey);
    });
  });
};

export const encryptData = async (password: string, data: string) => {
  const salt = crypto.randomBytes(16);  
  const nonce = crypto.randomBytes(12); 

  const key = await deriveKey(password, salt.toString('hex'));

  const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce);
  let encrypted = cipher.update(data, 'utf8', 'base64'); 
  encrypted += cipher.final('base64');
  const authTag = cipher.getAuthTag();  

  const nonceBase64 = nonce.toString('base64');
  const saltBase64 = salt.toString('base64');
  const authTagBase64 = authTag.toString('base64');

  return {
    encryptedData: encrypted,
    nonce: nonceBase64,  
    salt: saltBase64,    
    authTag: authTagBase64,  
  };
};

export const decryptData = async (password: string, encryptedDataBase64: string, nonceBase64: string, saltBase64: string, authTagBase64: string) => {
  const encryptedData = Buffer.from(encryptedDataBase64, 'base64'); 
  const nonce = Buffer.from(nonceBase64, 'base64');
  const salt = Buffer.from(saltBase64, 'base64');
  const authTag = Buffer.from(authTagBase64, 'base64');

  const key = await deriveKey(password, salt.toString('hex'));

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedData);
  decrypted = Buffer.concat([decrypted, decipher.final()]); // Concatenar cualquier bloque final


  return decrypted.toString('utf-8');
};
