const isProd = process.env.NODE_ENV === 'production';

const authConfig = {
    sessionCookieName: process.env.SESSION_COOKIE_NAME || 'clinicflow_session',
    sessionSecret: process.env.SESSION_SECRET || 'dev_only_change_me',
    cookie:{
        httpOnly: true,
        sameSite: 'lax',
        secure: isProd,
    }
};

module.exports = {authConfig};