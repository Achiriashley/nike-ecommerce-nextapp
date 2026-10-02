import mongoose, {Schema} from "mongoose";

const subscriberSchema = new Schema({
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
}, {timestamps: true});

export default mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);
