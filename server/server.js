const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors=require('cors')

const bp = require("body-parser")
const insertPhotosToDB=require("../insertPhotosToDB")


// require("dotenv/config")

app.use(cors());
app.use(bp.json());


const photosRoute = require("../routes/photos")


app.use("/photos", photosRoute);



app.get("/", async (req, res) => {
   res.send("Server is working")
}
)
   





mongoose.connect(
  'mongodb+srv://bejamas:bejamas@bejamas.2zoslfw.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true },
  (err) => {
    if (err) console.log(err);
    else console.log("mongdb is connected");
  }

);



const startServer = () => {

  app.listen(process.env.PORT||8080);
};

module.exports.startServer = startServer;
