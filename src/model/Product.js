import mongoose, {Schema} from "mongoose";

const productSchema = new Schema({
    title : {type: String, required: true},
    // Stored as a string for compatibility with existing documents; read through toNumber().
    price: {type: String, required: true},
    category: {type: String, required: true},
    image: {type: String, required: true},
    description: {type: String, required: true},
    slug: {type: String, required: true, index: true},
    gender: {type: String, enum: ["men", "women", "kids", "unisex"]},
    colorway: {type: String},
    compareAtPrice: {type: Number},
    images: {type: [String], default: undefined},
    sizes: {type: [String], default: undefined},
    highlights: {type: [String], default: undefined},
    stock: {type: Number},
    featured: {type: Boolean, default: false},
    releasedAt: {type: Date},
}, {timestamps: true});

export default mongoose.models.Product || mongoose.model('Product', productSchema);
