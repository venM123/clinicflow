const {getDb} = require('../db');

async function writeAudit({
    tenantId = null,
    actorUserId = null,
    action,
    entityType,
    entityId = null,
    req = null,
    details = null,
}) {
    try{
        const db = getDb();
        const ipAddress = req?.ip || null;
        const userAgent = req?.headers?.['user-agent'] || null;

        await db.query(
            `INSERT INTO audit_logs
            (tenant_id, actor_user_id, action, entity_type, entity_id, details_json, ip_address, user_agent,details)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                tenantId,
                actorUserId,
                action,
                entityType,
                entityId,
                details ? JSON.stringify(details):null,
                ipAddress,
                userAgent,
                //details ? JSON.stringify(details) : null,
            ]
        );
    }catch(error){
        console.error('Failed to write audit log:', error);
    }
}
module.exports = {
    writeAudit,
}