const Mongoose=require('mongoose')


const orderSchema=new Mongoose.Schema({
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items:[
        {
            productId: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    total_amount:{
        type: Number,
        required: true
    },
    payment_status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    order_status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    shipping_address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        }
    },
});

module.exports=orderSchema