import mongoose, {Schema} from "mongoose";

export const ORDER_STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

const orderItemSchema = new Schema({
    slug: {type: String, required: true},
    title: {type: String, required: true},
    colorway: {type: String},
    image: {type: String},
    size: {type: String},
    quantity: {type: Number, required: true, min: 1},
    unitPrice: {type: Number, required: true},
}, {_id: false});

const deliverySchema = new Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true},
    email: {type: String},
    city: {type: String, required: true},
    address: {type: String, required: true},
    notes: {type: String},
}, {_id: false});

const orderSchema = new Schema({
    userId: {type: String, index: true},
    email: {type: String},
    // Where and to whom the order is delivered (older orders may not have it).
    delivery: {type: deliverySchema},
    items: {type: [orderItemSchema], required: true},
    subtotal: {type: Number, required: true},
    shipping: {type: Number, required: true},
    total: {type: Number, required: true},
    currency: {type: String, required: true},
    provider: {type: String, enum: ["crypto", "mobile"], required: true},
    // Which service handled a "mobile" payment (campay or payunit), and its transaction reference.
    gateway: {type: String},
    paymentReference: {type: String, index: true},
    paymentUrl: {type: String},
    status: {type: String, enum: ORDER_STATUSES, default: "pending"},
}, {timestamps: true});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
