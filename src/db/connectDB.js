import mongoose from 'mongoose';

export const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_DB )

    } catch (error) {
        console.log('MONGO ERROR CONNECTION:', error );
    }
}
export default connectDB;