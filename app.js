import express from "express"

const app = express();

app.get('/', (res, req) => {
    req.send("hello world");
})

app.listen(3000, (res, req) => {
    console.log("ok")
})
