var server = require('../app.js');
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;

chai.use(chaiHttp)


describe("Test Demo", function () {
    it("Validate login credentials", function (done) {
        var data = {
            _id: 'vatsal thakar',
            password: 'vatsal'
        };
        chai.request(server)
            .post('/CheckUser')
            .send(data)
            .end(function (err, res) {
                console.log(res.data);
                expect(res).to.have.status(200);
                expect(res.body.data).to.equal('Valid');
                done();
            });
    });

    it("Registration for already registerd user", function (done) {
        var data = {
            _id: 'tarun',
            email: 'tarun@gmail.com'
        };
        chai.request(server)
            .post('/CheckregisterUser')
            .send(data)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.data).to.equal('data exist');
                done();
            });
    });


    it("Registration for new user", function (done) {
        var data = {
            _id: 'vatsal thakar',
            email: 'vatsal@gmail.com'

        };
        chai.request(server)
            .post('/CheckregisterUser')
            .send(data)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.data).to.contain('data exist');
                done();
            });
    });

    /*it("Service location", function (done) {
        var data = {
            location: '2541 West covina california 91792'

        };
        chai.request(server)
            .post('/locate')
            .send(data)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.data).to.contain('location');
                done();
            });
    });*/

    it("Validate forgot password", function (done) {
        var data = {
            email: 'djethwa2810@gmail.com'
        };
        chai.request(server)
            .post('/forgotPassword')
            .send(data)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.data).to.contain('Valid User');
                done();
            });
    });
    it("Forgot password send mail status", function (done) {
        var data = {
            email: 'djethwa2810@gmail.com'
        };
        chai.request(server)
            .post('/forgotPassword')
            .send(data)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.data).to.contain('Message sent');
                done();
            });
    });
});