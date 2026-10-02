import mongoose, {Schema} from "mongoose";

const reviewSchema = new Schema({
    productSlug: {type: String, required: true, index: true},
    userId: {type: String, required: true},
    userName: {type: String, required: true},
    userImage: {type: String},
    rating: {type: Number, required: true, min: 1, max: 5},
    title: {type: String, required: true, maxlength: 120},
    body: {type: String, required: true, maxlength: 2000},
    size: {type: String},
}, {timestamps: true});

// One review per customer per product.
reviewSchema.index({productSlug: 1, userId: 1}, {unique: true});

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
