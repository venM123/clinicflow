const express = require('express');
const {pool,getDb} = require('../db');
const {verifyPassword} = require('../auth/password');

const router = express.Router();


router.post('/login', async (req,res) =>{
    try{
        const {email, password} = req.body || {};
        if(!email || !password)
        {
            return res.status(400).json({error: 'Email and password are required'});
        }
        const db = getDb();
        const [rows] = await db.query(
            `SELECT id, tenant_id, email, password_hash, role,status
            FROM users
            WHERE tenant_id = ? AND email = ? AND deleted_at is NULL LIMIT 1`, [1, email]
        );

        const user = rows?.[0];
        if(!user || user.status !== 'active')
        {
            return res.status(401).json({error: 'Invalid email or password'});
        }

        const ok = await verifyPassword(password,user.password_hash);
        if(!ok)
        {
            return res.status(401).json({error: 'Invalid email or password'});
        }
        return res.status(200).json({
            message: 'Login Credentials Valid',
            user: {
                id: user.id,
                tenant_id: user.tenant_id,
                email: user.email,
                role: user.role,
            }
        });
    }catch(error){  
        console.error('Login error:', error);
        return res.status(500).json({error: 'An error occurred while processing your request'});
    }
});

module.exports = router;