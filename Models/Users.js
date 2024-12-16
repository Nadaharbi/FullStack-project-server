import mongoose from 'mongoose';

const UserSchema=mongoose.Schema({
    uname:{type:String,required:true},
    password:{type:String,required:true},
    email:{type:String,required:true},
    
});

const UserModel=mongoose.model("Users", UserSchema,"Users");
export default UserModel;