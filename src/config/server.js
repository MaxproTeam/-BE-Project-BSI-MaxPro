import express from "express";
import config from './config.js';

const startServer = (app) => {
    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
    });
}

export default startServer;