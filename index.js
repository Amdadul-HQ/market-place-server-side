const express = require('express');
const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config()
const app = express()

const corsOption ={
    origin:["http://localhost:5173"],
    credential:true,
}
app.use(express.json())
app.use(cors(corsOption))


app.get('/',(req,res)=> {
    res.send('Server Side is running')
})

app.listen(port,()=> {
    console.log(`Server is running on :${port}`);
})