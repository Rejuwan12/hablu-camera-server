const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const app = express();
require('dotenv').config();
const port = process.env.PORT || 4000


// middleware
app.use(cors())
app.use(express.json())

// mongodb

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.anrbjpf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1, // Add this line
});


const dbConnect = async () => {
    try {
        client.connect();
        console.log('database connected successfully')
    } catch (error) {
        console.log(error.name, error.message)
    }
};

dbConnect();
// api

app.get('/', (req,res)=>{
    res.send('Server Is Running....')

});

app.listen(port,()=>{
    console.log(`Server Is Running On Port: ${port}`)
})