import crypto from 'crypto';

const decrypt = (encryptedKey, key, iv) => {
    const encryptedText = Buffer.from(encryptedKey, 'base64');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted.toString();
}

export default decrypt;