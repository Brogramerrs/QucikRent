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
});