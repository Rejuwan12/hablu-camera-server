const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 4000;

// middleware
app.use(cors({
    origin:"http://localhost:5173",
    optionsSuccessStatus:200,
}));
app.use(express.json());

// mongodb

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.anrbjpf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1, // Add this line
});

const userCollection = client.db("habluCamera").collection("users");
const productCollection = client.db("habluCamera").collection("products");

const dbConnect = async () => {
  try {
    client.connect();
    console.log("database connected successfully");

    // get user

    app.get("/user/:email", async (req, res) => {
      const query = { email: req.params.email };
      const user = await userCollection.findOne(query);
      return res.send(user);
    });

    // insert user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User Already Exist" });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
  } catch (error) {
    console.log(error.name, error.message);
  }
};

dbConnect();

// api

app.get("/", (req, res) => {
  res.send("Server Is Running....");
});

// jwt

app.post("/authentication", async (req, res) => {
  const userEmail = req.body;
  const token = jwt.sign(userEmail, process.env.ACCESS_KEY_TOKEN, {
    expiresIn: "10d",
  });
  res.send({ token });
});

app.listen(port, () => {
  console.log(`Server Is Running On Port: ${port}`);
});
