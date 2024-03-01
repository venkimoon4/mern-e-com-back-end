const express=require('express');
const User = require('../Models/userSchema');
const bycrpt=require('bcrypt');

const { generateToken, jwtAuthMiddleaware } = require('../auth');

const router=express.Router();

router.post('/signup',async(req,res)=>{

  const {name,email,password,mobileno}=req.body;
  // const userEmail=data.email;

  try{
  const findUser=await User.findOne({email:email})
  if(findUser){
  return res.status(400).json({error:"This Email Id Already Exists"})
  }

  const salt=await bycrpt.genSalt();

  const hashedPassword=await bycrpt.hash(password,salt)

  const newUser=new User({name,email,password:hashedPassword,mobileno});
  
  const savedUser=await newUser.save();

  const payload={
    id:savedUser._id
  }

  const token=generateToken(payload,process.env.SECRET)

  res.status(200).json({email:savedUser.email,token:token})

  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})

router.post('/login',async(req,res)=>{

  try{
    const {email,password}=req.body;

    const findUser=await User.findOne({email:email});

    if(!findUser){
      return res.status(400).json({error:"Invalid UserId"})
    }

    const isMatched=await bycrpt.compare(password,findUser.password)

    if(!isMatched){
      return res.status(400).json({error:"Invalid Password"})
    }


    const payload={
      id:findUser._id
    }

    const token=generateToken(payload,process.env.SECRET)

    res.status(200).json({email:findUser.email,token:token})

  }
  catch(error){
    res.status(500).json({error:error.message})
  }

})


router.post('/cart',jwtAuthMiddleaware,async(req,res)=>{

  try{
    const {id}=req.user;
    const data=req.body;

    const findUser=await User.findById(id);

    if(!findUser){
      return res.status(400).json({error:"user not found"})
    }


    const existingItem=findUser.cart.find((item)=>item.name===data.name);


    if(existingItem){
      existingItem.quantity++
      findUser.markModified('cart'); 
      await findUser.save()
    }
    else{
      findUser.cart.push(data);
      await findUser.save()
    }

    res.status(200).json(findUser.cart);

  }
  catch(error){
    res.status(500).json({error:error.message})
  }
}
)

router.get('/cart',jwtAuthMiddleaware,async(req,res)=>{

  try{

    const {id}=req.user;

    const findUser=await User.findById(id);

    if(!findUser){
      return res.status(400).json({error:"user not found"})
    }

    res.status(200).json(findUser.cart);

  }
  catch(error){
    res.status(500).json({error:error.message})
  }

})


router.post('/cart/quantityincrement',jwtAuthMiddleaware,async(req,res)=>{

  try{
    const {id}=req.user;

    const data=req.body;
    
    const findUser= await User.findById(id);


    if(!findUser){
      return res.status(400).json({error:"user not found"})
    }

    const existingItem=findUser.cart.find((item)=>item.id===data.id);

    if(existingItem){
      existingItem.quantity++;
      findUser.markModified('cart'); 
      await findUser.save();
    }

    res.status(200).json(existingItem);

  }
  catch(error){
    res.status(500).json({error:error.message})
  }

})



router.post('/cart/quantitydecrement',jwtAuthMiddleaware,async(req,res)=>{

  try{
    const {id}=req.user;

    const data=req.body;
    
    const findUser= await User.findById(id);


    if(!findUser){
      return res.status(400).json({error:"user not found"})
    }

    const existingItem=findUser.cart.find((item)=>item.id===data.id);

    if(existingItem){
      existingItem.quantity--;
      findUser.markModified('cart'); 
      await findUser.save();
    }

    res.status(200).json(existingItem);

  }
  catch(error){
    res.status(500).json({error:error.message})
  }

})


router.delete('/cart/:id',jwtAuthMiddleaware,async(req,res)=>{

  try{

    const productId=req.params.id;

    const {id}=req.user;

    const findUser=await User.findById(id);

    if(!findUser){
      return res.status(500).json({error:"user not found"})
    }
    

    const index=findUser.cart.findIndex((item)=>item.id===productId);

    if(index===-1){
      return res.status(400).json({error:"Item Index Not Found"})
    }

    const deleteItem=findUser.cart.splice(index,1);
    await findUser.save();
    res.status(200).json(deleteItem)

  }
  catch(error){
    res.status(500).json({error:error.message})
  }

})


//===============Shipping==============================//

router.post('/shipping',jwtAuthMiddleaware,async(req,res)=>{

  try{

    const {id}=req.user;
    const data=req.body;
    const findUser=await User.findById(id);

    if(!findUser){
      return res.status(400).json({error:"user not found"})
    }

    findUser.shipping={
      firstName:data.firstName || findUser.shipping.firstName,
      lastName:data.lastName || findUser.shipping.lastName,
      address:data.address || findUser.shipping.address,
      country:data.country || findUser.shipping.country,
      zipcode:data.zipcode || findUser.shipping.zipcode,
      city:data.city || findUser.shipping.city,
      state:data.state || findUser.shipping.state,
    }

    const savedShipping=await findUser.save();

    res.status(200).json(savedShipping);

  }catch(error){
    res.status(500).json({error:error.message})
  }

})


//=================Payment==========================//

router.post('/payment',jwtAuthMiddleaware,async(req,res)=>{

  try{
   const {id}=req.user;

   const data=req.body;

   const findUser=await User.findById(id);

   if(!findUser){
    return res.status(400).json({error:"user not found"})
   }

   findUser.payments.push(data);
   await findUser.save();
   const payment=findUser.payments;
   res.status(200).json(payment)

  }
  catch(error){
    res.status(500).json({error:error.message})
  }

})

router.post('/myorder',jwtAuthMiddleaware,async(req,res)=>{
  try{

    const {id}=req.user;
    const data=req.body;

    const findUser=await User.findById(id);

    if(!findUser){
      return res.status(400).json({error:"user not found"})
    }

    findUser.orders.push(...data);
    await findUser.save();
    const myOrders=findUser.orders;
    res.status(200).json(myOrders)
  }
  catch(error){
  res.status(500).json({error:error.message})
  }
})

router.get('/myorder',jwtAuthMiddleaware,async(req,res)=>{

  try{

    const {id}=req.user;

    const findUser=await User.findById(id);

    if(!findUser){
      return res.status(400).json({error:"user not found"})
    }

    const myOrders=findUser.orders;
    res.status(200).json(myOrders);

  }
  catch(error){
  res.status(500).json({error:error.message})
  }

})


//==========================Delete All Items In The Cart After Payment===============//

router.delete('/clearcart',jwtAuthMiddleaware,async(req,res)=>{

  try{
  const {id}=req.user;
  const findUser=await User.findById(id);
  findUser.cart=[];
  await findUser.save();
  res.status(200).json(findUser.cart)
  }
  catch(error){
    res.status(500).json({error:error.message})
  }

})


module.exports=router