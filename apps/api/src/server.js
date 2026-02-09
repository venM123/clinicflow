const express = require('express');
const pool = require('./db');
const cookieParser = require('cookie-parser');
const { authConfig } = require('./config/auth');
const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(express.json());
app.use(cookieParser(authConfig.sessionSecret));
app.use('/auth', authRoutes);
app.get('/health', (req, res) =>{
    res.json({status: 'ok', service: 'clinicflow-api'});
});

app.get('/health/db', async (req, res)=>{
    try{
        //check the db.js its using const pool || thanks for correcting my typo there
        const [rows] = await pool.query('SELECT 1 as ok');
        res.json({ok:true, database: rows[0].ok === 1});
    }catch(error){
        res.status(500).json({ok:false,db:false, error: error.message});
    }
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});