import express from "express";
import pic from './routes/pic-route.js';

const app = express();

app.use('/pic', pic)

app.listen(3000, (req, res) => {
    console.log("ok")
})
