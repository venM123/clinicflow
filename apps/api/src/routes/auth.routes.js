const express = require('express');
const {pool,getDb} = require('../db');
const {verifyPassword} = require('../auth/password');
const {authConfig} = require('../config/auth');
const {requireAuth, requireRole} = require('../middleware/auth.middleware');
const {writeAudit} = require('../services/audit.service');

//const path = require('path');

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
            await writeAudit({
            tenantId: 1,
            actorUserId: null,
            action: 'auth.login',
            entityType:'auth_session',
            entityId: null,
            //outcome: 'failure',
            req,
            details: { result:'failure',reason:'Invalid Credentials',email},
            });
            
            return res.status(401).json({error: 'Invalid email or password'});
        }

        const ok = await verifyPassword(password,user.password_hash);
        if(!ok)
        {
            await writeAudit({
            tenantId: 1,
            actorUserId: null,
            action: 'auth.login',
            entityType:'auth_session',
            entityId: null,
            req,
            details: { result:'failure',reason:'Invalid Credentials',email},
            });
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
        await writeAudit({
                tenantId: user.tenant_id,
                actorUserId: user.id,
                action: 'auth.login',
                entityType:'auth_session',
                entityId: String(user.id),
                req,
                details: {
                    result:'success',
                    email: user.email,
                    role: user.role
                },
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

router.post('/logout', async (req,res) =>{
    try{
        res.clearCookie(authConfig.sessionCookieName, {
            httpOnly: authConfig.cookie.httpOnly,
            sameSite: authConfig.cookie.sameSite,
            secure: authConfig.cookie.secure,
            path: '/',
        });

        const authRaw = req.signedCookies?.[authConfig.sessionCookieName];
        let authData;
        try{
            authParsed = authRaw ? JSON.parse(authRaw) : null;
        }catch(error){
            authParsed = null;
        }
        await writeAudit({
            tenantId : authParsed?.tid || null,
            actorUserId: authParsed?.uid || null,
            action: 'auth.logout',
            entityType: 'auth_session',
            entityId: authParsed?.uid ? String (authParsed.uid) : null,
            //outcome: 'success',
            req,
            details: {
                result:'success',
            },
        });

        return res.status(200).json({message: 'Logged out successfully'});
    }catch(error){
        console.error('Logout error:', error);
        return res.status(500).json({error: 'An error occurred while processing your request'});
    }

});


router.get('/me', requireAuth, async (req,res) =>{
    return res.status(200).json({
        authenticated:true,
        user:{
        id: req.auth.uid,
        tenant_id : req.auth.tid,
        email: req.auth.email,
        role: req.auth.role,
        status: req.auth.status,
        },
    })
});

router.get('/admin-only', requireAuth, requireRole('super_admin'), async (req,res)=>{
    return res.status(200).json({
        ok:true,
        message: 'You have access to this admin-only route',
        user: req.auth,
    });
});
module.exports = router;