import dotenv from "dotenv";
dotenv.config()

const config = {
    port: process.env.PORT || 3000,
    database_conn : process.env.DB_CONNECTION,
    database_host : process.env.DB_HOST,
    database_port : process.env.DB_PORT,
    database : process.env.DB_DATABASE,
    database_username : process.env.DB_USERNAME,
    database_password : process.env.DB_PASSWORD,
};

export default config;