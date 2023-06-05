const express = require("express")
const dotenv= require("dotenv")
const app = express();
dotenv.config()

app.use(express.json());
const messages=[];
const authMiddleware = (req, res, next)=>{
    const headers = req.headers;
    console.log("middleware")
    const secretHeader = headers['x-secret'];
    if(secretHeader !== process.env.WEBHOOK_SECRET){
        return res.sendStatus(401);
    }

    next();
}

app.post("/api/get-info", authMiddleware, async(req, res)=>{
    const data = req.body;

    messages.push(data)
    return res.sendStatus(200)
})

app.get('/', async(req, res)=>{
    return res.json(messages)
})

app.listen(5000, ()=>{console.log(`Server running on port ${5000}`)})