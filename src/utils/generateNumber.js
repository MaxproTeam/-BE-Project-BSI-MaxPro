import crypto from 'crypto';

function generateUniqueNumber() {
    return Math.floor(crypto.randomBytes(4).readUInt32BE(0) % 1000000); // Random number between 0 and 999999
}

export default generateUniqueNumber;