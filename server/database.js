const userUtils = require('./utils/userUtils')
const responseUtils = require('./utils/responseUtils')
const sql = require('mssql');
const config = require('./config/config')
const bcrypt = require('bcrypt'); // for password encrypting

/**
 * Adds a user to the database.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {boolean} Returns true if the user is successfully added to the database, otherwise false.
 */
const addUserToDatabase = async (req, res) => {
    //First it gets user details from req.body
    const { username, email, password ,name } = req.body;
    //Checks if those user details were in correct format
    if(!userUtils.validateUser(username, email, password ,name)) {
        return false;
    }
    const existingUser = await getUserFromDatabase(req, res);
    //Checks if user already exists in the database
    if(existingUser !== undefined) {
        return false;
    }
    try {
        //creates connection to database
        await sql.connect(config);
        
        //initializes a new request object that is used to send SQL queries to the connected database using the sql module or library.
        const request = new sql.Request();

        //encrypts password for database
        const hashedPassword = await bcrypt.hash(password, 10);
        //query for database
        const query = `
            INSERT INTO [dbo].[users] (username, email, password, name)
            VALUES (@username, @email, @password, @name)
        `;
        //database request
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

/**
 * Retrieves a user from the database based on the provided email.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object|undefined} Returns the user object if found, otherwise returns undefined.
 */
const getUserFromDatabase = async (req, res) => {
    try {
        //creates connection to database
        await sql.connect(config);

        //initializes a new request object that is used to send SQL queries to the connected database using the sql module or library.
        const request = new sql.Request();

        //takes email from req.body
        const { email } = req.body;

        //query for database
        const query = `SELECT * FROM users WHERE email = @email`;
        //make database request for email
        const result = await request
        .input('email', sql.NVarChar, email)
        .query(query);
        //checks if the user existed in the database
        if(result.recordset.length > 0){
            //returns that user
            const user = result.recordset[0];
            return user;
        }
        //else returns undefined, which means user didnt exist in the database
        return undefined;
    }
    catch(error) {
        console.error('Error getting user from the database:', error);
    }
}


module.exports = {addUserToDatabase, getUserFromDatabase};