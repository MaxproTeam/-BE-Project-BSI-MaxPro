import dotenv from "dotenv";
dotenv.config()

const config = {
    port: process.env.PORT || 3000,
    api_key : process.env.API_KEY,
    database_conn : process.env.DB_CONNECTION,
    database_host : process.env.DB_HOST,
    database_port : process.env.DB_PORT,
    database : process.env.DB_DATABASE,
    database_username : process.env.DB_USERNAME,
    database_password : process.env.DB_PASSWORD,
    encrypt_key: process.env.ENCRYPTION_KEY,
    encrypt_iv: process.env.ENCRYPTION_IV,
    session_secret : process.env.SESSION_SECRET,
    session_expired : process.env.SESSION_EXPIRED,
    cors_origin : process.env.CORS_ORIGIN,
    cookie_parse : process.env.COOKIE_PARSER_SECRET
};

export default config;