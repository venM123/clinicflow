const bcrypt = require('bcryptjs');

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

async function hashPassword(plainPassword) {
    if(typeof plainPassword !== 'string' || plainPassword.length === 0)
    {
        throw new Error('Password must not be empty');
    }
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

async function verifyPassword(plainPassword, passwordHash)
{
    if(typeof plainPassword !== 'string' || plainPassword.length === 0)
    {
        return false;
    }
    if(typeof passwordHash === 'string' && passwordHash.length === 0)
    {
        return false;
    }
    return bcrypt.compare(plainPassword, passwordHash);
}
module.exports = {hashPassword, verifyPassword};


