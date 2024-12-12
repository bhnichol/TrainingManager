const dbConnection = {
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        connectString: process.env.CONNECT_STRING
}

module.exports = dbConnection;
