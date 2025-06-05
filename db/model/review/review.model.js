const Mongoose=require('mongoose');

const reviewSchema=new Mongoose.Schema({
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
},{ timestamps: true });

module.exports=reviewSchema;