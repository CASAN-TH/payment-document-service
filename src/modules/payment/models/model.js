'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');


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
        enum: ['check', 'transfer', 'money']
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


PaymentSchema.pre('save', function (next) {
   
    if (this.isNew) {
        let payment = this;
        const startOfMonth = moment(this.date).startOf('month').format('YYYY-MM-DD');
        const endOfMonth = moment(this.date).endOf('month').format('YYYY-MM-DD');

        mongoose.model("Payment", PaymentSchema).find({ date: { $gte: startOfMonth, $lte: endOfMonth } }, function (err, data) {
            if (err) {
                next(err);
            }

            var year = new Date(payment.date).getFullYear();
            var month = new Date(payment.date).getMonth() + 1;
            var num = data.length + 1;
            var no = num.toString().padStart(3, "0");
            payment.no = year.toString() + '-' + month.toString() + '-' + no.toString();
            next();
        })
    } else {
        next();
    }

})



mongoose.model("Payment", PaymentSchema);