const mongoose = require('mongoose');
        const Product=require('../models/product')
        const User=require('../models/userModels')

        const orderSchema = new mongoose.Schema({
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: User,
                required: true
            },
            date: {
                type: Date,
                default: new Date(),
                required: true
            },
            totalAmount: {
                type: Number,
                required: true
            },
            paymentMethod: {
                type: String
            },
            items: [{
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: Product,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                },
                itemStatus:{
                    type:String,
                    default: "pending"
                }
            }],
            addresstoDeliver:{
                houseName : {
                    type : String,
                    required : true
                },
                place : {
                    type:String,
                    required : true
                },
                district : {
                    type:String,
                    required : true
                },
                pinCode : {
                    type:Number,
                    required : true
                },
                userEmail : {
                    type:String,
                    required : true
                },

            },
            orderStatus:{
                type:String,
                default: "Pending"
            },
            deliveredDate:{
                type:Date,
                default:''
            },
            // couponDiscount:{
            //     type:Number,
            //     default:0,
            // },
            paymentStatus:{
                type:String,
                default:'Pending'
            },
            is_active:{
                type:Boolean,
                required:true,
                default:true
            }
        });


        module.exports = mongoose.model('Order', orderSchema); 