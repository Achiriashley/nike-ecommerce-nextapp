import mongoose , {Schema} from "mongoose";

const userSchema = new Schema({
    firstName : {type: String, required: true},
    lastName : {type: String, required: true},
    email : {type: String,
         required: true, 
         unique: true}, // ensure email uniqueness
    phone : {type: String, 
        required: true ,
         unique: true}, // ensure phone uniqueness
    password : {type: String, required: true},
    profileImage : {type: String, required: false},

}, {timestamps: true});

export default mongoose.models.User || mongoose.model('User', userSchema);