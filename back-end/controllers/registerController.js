const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const dbConn = require('../config/dbConn');
const roles_list = require('../config/rolesList');

const handleNewUser = async (req, res) => {
    const { email, pwd } = req.body;
    if (!email || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    // check for duplicate usernames in the db
    //if (duplicate) return res.sendStatus(409); //Conflict 
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute(`SELECT COUNT(*) FROM trainingapp.users WHERE email = '${email}'`)
        if(results.rows[0] > 0){
           return res.sendStatus(409)
        }
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //store the new user
        await conn.execute(`INSERT INTO trainingapp.users (email) VALUES (:email)`, [email],{autoCommit: true})
        const newId = await conn.execute(`SELECT id FROM trainingapp.users WHERE email = :email AND INACTIVE_IND IS NULL OR INACTIVE_IND != 1`, [email],{ outFormat: oracledb.OUT_FORMAT_OBJECT })
        if(newId.rows.length<1){
            throw {message: "Error with registration, user not created."}
        }
        await conn.execute(`INSERT INTO trainingapp.users_pass (id, pass_hash) VALUES (:id, :hashedPwd)`, [newId.rows[0]['ID'], hashedPwd],{autoCommit: true})
        await conn.execute(`INSERT INTO trainingapp.users_roles (id, role_id) VALUES (:id, :role_id)`, [newId.rows[0]['ID'], roles_list.User],{autoCommit: true})
        console.log(newId.rows[0]['ID']);
        // const id = await (await conn.execute(`SELECT COUNT(*) FROM trainingapp.users WHERE email = '${email}'`)).rows[0].id
        // await conn.execute(`INSERT INTO trainingapp.users_pass (id, pass_hash) VALUES (${id}, '${hashedPwd}')`)
        res.status(201).json({'message': `${email} account successfully created.`})
        if(conn) {
            conn.close()
        }
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };