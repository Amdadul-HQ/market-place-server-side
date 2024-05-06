const express = require('express');
const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config()
const app = express()
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');


const corsOption ={
    origin:["http://localhost:5173"],
    credential:true,
}
app.use(cookieParser());
app.use(express.json())
app.use(cors(corsOption))


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p2unx4b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)


    const database = client.db("marketDB");
    const jobCollection = database.collection("jobs");
    const bidCollection = database.collection("bids");

    app.get('/jobs',async(req,res)=>{
        const cursor = jobCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/mypostedjob/:email',async(req,res)=>{
      const email = req.params.email;
      const qurey = {
        buyer_email: email
      }
      const result = await jobCollection.find(qurey).toArray()
      res.send(result)
    })

    app.post('/jobs',async(req,res)=>{
      const jobData = req.body;
      console.log(jobData);
      const result = await jobCollection.insertOne(jobData)
      res.send(result)
    })

    app.get('/jobs/:id',async(req,res)=> {
      const id = req.params.id;
      const qurey = {
        _id:new ObjectId(id)
      }
      const result = await jobCollection.findOne(qurey)
      res.send(result)
    })

    app.patch('/jobs/:id',async(req,res)=>{
      const id = req.params.id;
      const jobdata = req.body;
      console.log(jobdata);
      // return
      const qurey = {
        _id: new ObjectId(id)
      }
      const option = {upsert: true}
      const updateJob = {
        $set:{
          buyer_email: jobdata.upbuyer_email,
          buyer_name:jobdata.upbuyer_name,
          buyer_photo:jobdata.upbuyer_photo,
          job_title:jobdata.upjob_title,
          category:jobdata.upcategory,
          deadline:jobdata.updeadline,
          description:jobdata.updescription,
          min_price:jobdata.upmin_price,
          max_price:jobdata.upmax_price
        }
      }
      const result = await jobCollection.updateOne(qurey,updateJob,option)
      res.send(result)
    })

    app.delete('/jobs/:id',async(req,res)=> {
      const id = req.params.id;
      const qurey = {
        _id: new ObjectId(id)
      }
      const result = await jobCollection.deleteOne(qurey)
      res.send(result)
    })


    // Save bid in data base
    app.post('/bids',async(req,res)=> {
      const bidData = req.body;
      const result = await bidCollection.insertOne(bidData)
      res.send(result)
    })








    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=> {
    res.send('Server Side is running')
})

app.listen(port,()=> {
    console.log(`Server is running on :${port}`);
})