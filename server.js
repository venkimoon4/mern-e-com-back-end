const express=require('express');
const app=express();
require('dotenv/config.js');
const db=require('./db.js')
app.use(express.json())
const userRouter=require('./Routes/userRoutes.js')

const cors=require('cors');
app.use(cors())

app.use('/user',userRouter)


app.listen(3000,()=>{
  console.log('listening to port 3000')
})



