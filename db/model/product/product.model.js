const Mongoose=require('mongoose');


const productSchema=new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    categoryId:{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    stockQuantity: {
        type: Number,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: [{
        userId: {   
            type: Mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        comment: { type: String, required: true },
        rating: { type: Number, required: true, min: 0, max: 5 },
        createdAt: { type: Date, default: Date.now }
    }],
    image: {
        type: [String],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        required: true
    }
},{timestamps:true});


module.exports=productSchema;