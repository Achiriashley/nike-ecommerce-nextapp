import mongoose, {Schema} from "mongoose";

const productSchema = new Schema({
    title : {type: String, required: true},
    price: {type: String, required: true},
    category: {type: String, required: true},
    image: {type: String, required: true},
    description: {type: String, required: true},
    slug: {type: String, required: true},
}, {timestamps: true});

export default mongoose.models.Product || mongoose.model('Product', productSchema);