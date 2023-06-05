const express = require("express")
const axios = require("axios")
const app = express();

app.use(express.json())

const webhooks = {
    MERGE:[],
    COMMIT:[],
    PUSH:[]
}

app.post("/api/webhooks", async(req, res)=>{
    const {payloadUrl, secret, eventTypes} = req.body;
    eventTypes.forEach(element => {
        webhooks[element].push({payloadUrl, secret});
    });
    return res.status(200)
})


app.post("/api/event-emulate", async(req, res)=>{
    const {type, data} = req.body;
    const webhookList = webhooks[type];

    for(let i=0; i<webhookList.length; i++){
        console.log(webhookList[i])
        const webhook = webhookList[i];
        const {payloadUrl, secret} = webhook; 
        try{
            await axios.post(payloadUrl, data, {
                headers: {
                    'x-secret': secret,
                }
            })

            console.log(data)
        }catch(err){
            console.log(err.message)
        }
    }

})

app.listen(3000, ()=>{console.log(`Server running on port ${3000}`)})