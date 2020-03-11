'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PaymentSchema = new Schema({
    no: {
        type: String
    },
    date: {
        type: Date
    },
    name: {
        type: String
    },
    card_id: {
        type: String
    },
    address: {
        type: String
    },
    lists: {
        type: [
            {
                no: {
                    type: String
                },
                description: {
                    type: String
                },
                amount: {
                    type: Number
                }
            }
        ]
    },
    total: {
        type: Number
    },
    total_text: {
        type: String
    },
    pay_type: {
        type: String,
        enum: ['check','transfer','money']
    },
    pay_description: {
        type: {
            banking: {
                type: String
            },
            pay_no: {
                type: String
            },
            date: {
                type: Date
            }
        }
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    createby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    },
    updateby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    }
});

mongoose.model("Payment", PaymentSchema);