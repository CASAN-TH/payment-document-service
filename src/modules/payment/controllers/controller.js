'use strict';
var mongoose = require('mongoose'),
    model = require('../models/model'),
    mq = require('../../core/controllers/rabbitmq'),
    Payment = mongoose.model('Payment'),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    moment = require('moment'),
    _ = require('lodash');

exports.getList = function (req, res) {
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);
    var query = {};
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response);
    }
    query.skip = size * (pageNo - 1);
    query.limit = size;
    Payment.find({}, {}, query, function (err, datas) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: datas
            });
        };
    });
};

// exports.genDocNo = function (req, res, next) {
//     const startOfMonth = moment(req.body.date).startOf('month').format('YYYY-MM-DD');
//     const endOfMonth = moment(req.body.date).endOf('month').format('YYYY-MM-DD');
//     console.log(startOfMonth);
//     console.log(endOfMonth);

//     Payment.find({ date: { $gte: startOfMonth, $lte: endOfMonth } }, function (err, datas) {
//         if (err) {
//             return res.status(400).send({
//                 status: 400,
//                 message: errorHandler.getErrorMessage(err)
//             });
//         };
//         // console.log(datas.length);
//         var year = new Date(req.body.date).getFullYear();
//         var month = new Date(req.body.date).getMonth() + 1;
//         var num = datas.length + 1;
//         var no = num.toString().padStart(3, "0");
//         var docNo = year.toString() + '-' + month.toString() + '-' + no.toString();
//         // console.log(docNo);

//         req.body.no = docNo;
//         // console.log(datas);
//         next();
//     });
// };

exports.summary = function (req, res, next) {
    var total = 0

    for (let i = 0; i < req.body.lists.length; i++) {
        const item = req.body.lists[i];
        total += item.amount;
    }
    req.body.total = total
    next();
};

exports.create = function (req, res) {
    var newPayment = new Payment(req.body);
    newPayment.createby = req.user;
    newPayment.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
            /**
             * Message Queue
             */
            // mq.publish('exchange', 'keymsg', JSON.stringify(newOrder));
        };
    });
};

exports.getByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            status: 400,
            message: 'Id is invalid'
        });
    }

    Payment.findById(id, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.data = data ? data : {};
            next();
        };
    });
};

exports.read = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.data ? req.data : []
    });
};

exports.update = function (req, res) {
    var updPayment = _.extend(req.data, req.body);
    updPayment.updated = new Date();
    updPayment.updateby = req.user;
    updPayment.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.delete = function (req, res) {
    req.data.remove(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};
