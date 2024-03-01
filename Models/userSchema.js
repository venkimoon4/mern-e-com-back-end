const mongoose=require('mongoose');

const userSchema=mongoose.Schema({

  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  mobileno:{
    type:String,
    required:true
  },
  cart:{
    type:[],
    default:[]
  },
  shipping:{
    firstName:{
      type:String,
    },
    lastName:{
      type:String,
    },
    address:{
      type:String,
    },
    country:{
      type:String,
    },
    zipcode:{
      type:String,
    },
    city:{
      type:String
    },
    state:{
      type:String,
    }
  },
  payments:{
    type:[],
    default:[]
  },
  orders:{
    type:[],
    default:[]
  }
})

const User=mongoose.model('User',userSchema);

module.exports=User;