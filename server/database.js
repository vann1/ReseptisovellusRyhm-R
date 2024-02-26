const userUtils = require('./utils/userUtils')
const responseUtils = require('./utils/responseUtils')
const sql = require('mssql');
const config = require('./config/config')
const bcrypt = require('bcrypt'); // for password encrypting

const addUserToDatabase = async (req, res) => {
    const { username, email, password ,name } = req.body;
    if(!userUtils.validateUser(username, email, password ,name)) {
        return false;
    }
    const existingUser = await getUserFromDatabase(req, res);
    if(existingUser !== undefined) {
        return false;
    }
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const hashedPassword = await bcrypt.hash(password, 10);
            //query for database
        const query = `
            INSERT INTO [dbo].[users] (username, email, password, name)
            VALUES (@username, @email, @password, @name)
        `;
        
        await request
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, hashedPassword)
            .input('name', sql.NVarChar, name)
            .query(query);

        return true;
    }
    catch(error) {
        console.error('Error adding user to the database:', error);
        return false;
    }
}


const getUserFromDatabase = async (req, res) => {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const { email } = req.body;

        const query = `SELECT * FROM users WHERE email = @email`;
        //make database request for email
        const result = await request
        .input('email', sql.NVarChar, email)
        .query(query);
        //save user from database
        if(result.recordset.length > 0){
            const user = result.recordset[0];
            return user;
        }
        return undefined;
    }
    catch(error) {
        console.error('Error getting user from the database:', error);
    }
}


module.exports = {addUserToDatabase, getUserFromDatabase};