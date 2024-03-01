const mongoose=require('mongoose');

// const mongoDBURLocal="mongodb://127.0.0.1:27017/e_commerce"

mongoose.connect(process.env.MongoDBAtlas);

const db=mongoose.connection;

db.on("connected",()=>{
  console.log("Connected To MongoDB Server")
})

db.on("error",()=>{
  console.log("Error in Connecting To MongoDB Server")
})
db.on("disconnected",()=>{
  console.log("Disconnected To MongoDB Server")
})

module.exports=db;