'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Payment = mongoose.model('Payment');

var credentials,
    token,
    mockup;

describe('Payment CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            "date": "2020-11-18",
            "name": "นาย กอ ขอ",
            "card_id": "1158988856985",
            "address": "13/554 casa-city",
            "lists": [
                {
                    "description": "คืนเงิน",
                    "amount": 300
                }
            ],
            "pay_type": "check",
            "pay_description": {
                "banking": "กรุงเทพฯ",
                "pay_no": "111",
                "date": "2020-11-13"
            }
        };
        credentials = {
            username: 'username',
            password: 'password',
            firstname: 'first name',
            lastname: 'last name',
            email: 'test@email.com',
            roles: ['user']
        };
        token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
            expiresIn: 2 * 60 * 60 * 1000
        });
        done();
    });

    it('should be Payment get use token', (done) => {
        request(app)
            .get('/api/payments')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                done();
            });
    });

    it('should be Payment get by id', function (done) {

        request(app)
            .post('/api/payments')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/payments/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        // console.log(resp.data.pay_description)
                        assert.equal(resp.status, 200);
                        // assert.equal(resp.data.date, mockup.date);
                        assert.equal(resp.data.name, mockup.name);
                        assert.equal(resp.data.card_id, mockup.card_id);
                        assert.equal(resp.data.address, mockup.address);
                        assert.equal(resp.data.lists.description, mockup.lists.description);
                        assert.equal(resp.data.lists.amount, mockup.lists.amount);
                        assert.equal(resp.data.pay_type, mockup.pay_type);
                        assert.equal(resp.data.pay_description.banking, mockup.pay_description.banking);
                        assert.equal(resp.data.pay_description.pay_no, mockup.pay_description.pay_no);
                        assert.equal(resp.data.pay_description.date, mockup.pay_description.date);
                        done();
                    });
            });
    });

    it('should be Payment post use token', (done) => {
        request(app)
            .post('/api/payments')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.status, 200);
                // assert.equal(resp.data.date, mockup.date);
                assert.equal(resp.data.name, mockup.name);
                assert.equal(resp.data.card_id, mockup.card_id);
                assert.equal(resp.data.address, mockup.address);
                assert.equal(resp.data.lists.description, mockup.lists.description);
                assert.equal(resp.data.lists.amount, mockup.lists.amount);
                assert.equal(resp.data.pay_type, mockup.pay_type);
                assert.equal(resp.data.pay_description.banking, mockup.pay_description.banking);
                assert.equal(resp.data.pay_description.pay_no, mockup.pay_description.pay_no);
                assert.equal(resp.data.pay_description.date, mockup.pay_description.date);
                done();
            });
    });

    it('should be payment put use token', function (done) {

        request(app)
            .post('/api/payments')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/payments/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        // assert.equal(resp.data.date, mockup.date);
                        assert.equal(resp.data.name, update.name);
                        assert.equal(resp.data.card_id, mockup.card_id);
                        assert.equal(resp.data.address, mockup.address);
                        assert.equal(resp.data.lists.description, mockup.lists.description);
                        assert.equal(resp.data.lists.amount, mockup.lists.amount);
                        assert.equal(resp.data.pay_type, mockup.pay_type);
                        assert.equal(resp.data.pay_description.banking, mockup.pay_description.banking);
                        assert.equal(resp.data.pay_description.pay_no, mockup.pay_description.pay_no);
                        assert.equal(resp.data.pay_description.date, mockup.pay_description.date);
                        done();
                    });
            });

    });

    it('should be get all Date', function (done) {
        request(app)
            .post('/api/payments')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;

                var mock2 = {
                    "date": "2020-11-18",
                    "name": "นาย กอ ขอ",
                    "card_id": "1158988856985",
                    "address": "13/554 casa-city",
                    "lists": [
                        {
                            "description": "คืนเงิน",
                            "amount": 300
                        },
                        {
                            "description": "คืนเงิน",
                            "amount": 700
                        }
                    ],
                    "pay_type": "check",
                    "pay_description": {
                        "banking": "กรุงเทพฯ",
                        "pay_no": "111",
                        "date": "2020-11-13"
                    }
                };

                request(app)
                    .post('/api/payments')
                    .set('Authorization', 'Bearer ' + token)
                    .send(mock2)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;

                        request(app)
                            .get('/api/payments')
                            .set('Authorization', 'Bearer ' + token)
                            .expect(200)
                            .end(function (err, res) {
                                if (err) {
                                    return done(err);
                                }
                                var resp = res.body;
                                // console.log(resp.data)
                                assert.equal(resp.status, 200);
                                // assert.equal(resp.data.date, mockup.date);
                                assert.equal(resp.data[0].name, mockup.name);
                                assert.equal(resp.data[0].card_id, mockup.card_id);
                                assert.equal(resp.data[0].address, mockup.address);
                                assert.equal(resp.data[0].lists.description, mockup.lists.description);
                                assert.equal(resp.data[0].lists.amount, mockup.lists.amount);
                                assert.equal(resp.data[0].pay_type, mockup.pay_type);
                                assert.equal(resp.data[0].pay_description.banking, mockup.pay_description.banking);
                                assert.equal(resp.data[0].pay_description.pay_no, mockup.pay_description.pay_no);
                                assert.equal(resp.data[0].pay_description.date, mockup.pay_description.date);
                                done();
                            });
                    });
            });
    })

    it('should be payment delete use token', function (done) {

        request(app)
            .post('/api/payments')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/payments/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    xit('should be payment get not use token', (done) => {
        request(app)
            .get('/api/payments')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    xit('should be payment post not use token', function (done) {

        request(app)
            .post('/api/payments')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    xit('should be payment put not use token', function (done) {

        request(app)
            .post('/api/payments')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/payments/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    xit('should be payment delete not use token', function (done) {

        request(app)
            .post('/api/payments')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/payments/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Payment.deleteMany().exec(done);
    });

});