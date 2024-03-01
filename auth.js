const jwt=require('jsonwebtoken');

const jwtAuthMiddleaware=(req,res,next)=>{

  try{

  const tokenFound=req.headers.authorization;

  if(!tokenFound){
    return res.status(400).json({error:"token not found"})
  }

  const token=req.headers.authorization.split(" ")[1];

  const decoded=jwt.verify(token,process.env.SECRET);

  req.user=decoded;
  next();
  }
  catch(error){
    res.status(500).json({error:error.message})
  }
}

const generateToken=(userPayload)=>{
  return jwt.sign(userPayload,process.env.SECRET)
}

module.exports={jwtAuthMiddleaware,generateToken}