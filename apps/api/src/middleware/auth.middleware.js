const {authConfig} = require('../config/auth');
const {writeAudit} = require('../services/audit.service');
const {getDb} = require('../db');


async function requireAuth(req, res, next)
{
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
            return res.status(401).json({error: 'Invalid session data'});
        }

        const { uid, tid, role } = sessionData || {};

        if(!uid || !tid || !role)
        {
            return res.status(401).json({error: 'Invalid session data'});
        }

        const db = getDb();

        const [rows] = await db.query(
            `
            SELECT id, tenant_id, email,role, status
            FROM users
            WHERE id = ? AND tenant_id = ? AND status = 'active' AND deleted_at is NULL
            LIMIT 1`,[uid, tid]
        );

        const user = rows?.[0];
        if(!user)
        {
            return res.status(401).json({error: 'Not authenticated'});
        }
        req.auth = {
            uid: user.id,
            tid: user.tenant_id,
            email: user.email,
            role: user.role,
            status: user.status,
        }
        return next();
    }catch(error){
        console.error('Authentication error:', error);
        return res.status(500).json({error: 'An error occurred while processing your request'});
    }
}

function requireRole(...allowedRoles)
{
    return async (req, res, next) =>{
        const currentRole = req.auth?.role;
        if(!currentRole)
        {
            return res.status(401).json({error: 'Unauthorized'});
        }
        if(!allowedRoles.includes(currentRole))
        {
            await writeAudit({
                tenantId: req.auth?.tid || null,
                actorUserId: req.auth?.uid || null,
                action: 'auth.access.denied',
                entityType: 'auth_session',
                entityId: req.auth?.uid?String(req.auth.uid):null,
                //outcome: 'failure',
                req,
                details: {
                    result:'failure',
                    requiredRoles: allowedRoles,
                    actualRole: currentRole,
                },
            });
            return res.status(403).json({error: 'Forbidden'});
        }
        return next();
    };
}

module.exports ={
    requireAuth,
    requireRole,
};
