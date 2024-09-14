import mysql from 'mysql2';
import config from '../config/config.js';

const connection = mysql.createPool({
    host: config.database_host,
    user: config.database_username,
    password: config.database_password,
    database: config.database
});

const tryConn = () => {
    connection.getConnection((error, conn) => {
        if (error) {
            console.error('Error connecting to the database:', error);
            return;
        }
        console.log('Connected to the database');
        conn.release();
    });
};

tryConn();

export default connection.promise();