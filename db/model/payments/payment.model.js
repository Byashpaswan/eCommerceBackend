const Mongoose=require('mongoose')

const paymentSchema=new Mongoose.Schema({
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    payment_method: {
        type: String,
        enum: ['Credit Card', 'PayPal', 'Bank Transfer'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    transaction_id: {
        type: String,
        required: true
    },
},{ timestamps: true });

module.exports=paymentSchema;