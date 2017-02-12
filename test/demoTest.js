var server = require('../app.js');
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;

chai.use(chaiHttp)


describe("Test Demo", function () {
    it("Validate login credentials", function (done) {
        var data = {
            username: 'admin',
            password: 'admin'
        };
        chai.request(server)
            .post('/CheckUser')
            .send(data)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.data).to.equal('Valid User');
                done();
            });
    });

    it("Registration for already registerd user", function (done) {
        var data = {
            username: 'tarun',
            email: 'tarun@gmail.com'
        };
        chai.request(server)
            .post('/CheckregisterUser')
            .send(data)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.data).to.equal('This username has already taken');
                done();
            });
    });


    it("Registration for new user", function (done) {
        var data = {
            username: 'xyz',
            email: 'xyz@gmail.com'

        };
        chai.request(server)
            .post('/CheckregisterUser')
            .send(data)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.data).to.contain('Encrypted Password');
                done();
            });
    });

    it("Service location", function (done) {
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
    });
});