const express = require('express');
const {pool,getDb} = require('../db');
const {verifyPassword} = require('../auth/password');
const {authConfig} = require('../config/auth');

const router = express.Router();

router.post('/auth-test', (req,res) =>{
    res.render('auth-test');
});

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
        const sessionPayload = {
            uid: user.id,
            tid: user.tenant_id,
            role: user.role,
        };

        res.cookie(authConfig.sessionCookieName, JSON.stringify(sessionPayload), {
            httpOnly: authConfig.cookie.httpOnly,
            sameSite: authConfig.cookie.sameSite,
            secure: authConfig.cookie.secure,
            signed: true,
            path:'/',
        });

        return res.status(200).json({
            message: 'Login Credentials Valid',
            user: {
                id: user.id,
                tenant_id: user.tenant_id,
                email: user.email,
                role: user.role,
                tenant_id: user.tenant_id,
            },
        });
    }catch(error){  
        console.error('Login error:', error);
        return res.status(500).json({error: 'An error occurred while processing your request'});
    }
});

router.get('/me', async (req,res) =>{
    try{
        const raw = req.signedCookies?.[authConfig.sessionCookieName];
        if(!raw)
        {
            return res.status(401).json({error: 'Not authenticated'});
        }

        let sessionData;
        try{
            sessionData = JSON.parse(raw);
        }catch(error){
            return res.status(400).json({error: 'Invalid session data'});
        }

        const{uid, tid, role } = sessionData || {};
        if(!uid || !tid || !role)
        {
            return res.status(400).json({error: 'Invalid session data'});
        }

        const db = getDb();
        const [rows] = await db.query(
            `SELECT id, tenant_id, email, role, status FROM users 
            WHERE id = ? AND tenant_id = ? AND status = 'active' AND deleted_at is NULL LIMIT 1`, [uid, tid]
        );
        const user = rows?.[0];
        if(!user)
        {
            return res.status(401).json({error: 'User not found or inactive'});
        }

        return res.status(200).json({
           authenticated:true,
           user:{
            id: user.id,
            tenant_id : user.tenant_id,
            email: user.email,
            role: user.role,
            status: user.status,
           },
        })

    }catch(error){
        console.error('Error in /me route:', error);
        return res.status(500).json({error: 'An error occurred while processing your request'});
    }
});
module.exports = router;