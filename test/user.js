const User = require('../server/models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../server');

chai.use(chaiHttp);

describe('User controller', () => {
    describe('GET /all', () => {
        it('should get all users with categories', done => {
            chai.request(server)
                .get('/user/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('array');
                    res.body.data.forEach(user => {
                        user.should.have.property('name');
                        user.should.have.property('pending');
                        user.should.have.property('banned');
                        user.should.have.property('category');
                        user.should.not.have.property('nickname');
                        user.category.should.be.a('object');
                    });
                    done();
                });
        });
    });
    describe('GET /categoryUsers/:categoryId', () => {
        it('should get base or accepted,not banned, register ended users with categories and stats', done => {
            const category = { name: 'Flowers' };

            chai.request(server)
                .post('/category/')
                .send(category)
                .end((error, response) => {
                    chai.request(server)
                        .get(`/user/categoryUsers/${response.body.newCategory[0].id}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            res.body.forEach(user => {
                                user.should.be.a('object');
                                user.should.have.property('pending');
                                user.pending.should.satisfy(pending => {
                                    return pending === 'base' || pending === 'accepted';
                                });
                                user.should.have.property('banned');
                                user.banned.should.be.eql(false);
                                user.should.have.property('registerEnded');
                                user.registerEnded.should.be.eql(true);
                                user.should.have.property('category');
                                user.category.should.be.a('object');
                                user.should.have.property('DailyStat');
                                user.DailyStat.should.be.a('object');
                                user.should.have.property('WeeklyStat');
                                user.WeeklyStat.should.be.a('object');
                                user.should.have.property('MonthlyStat');
                                user.MonthlyStat.should.be.a('object');
                            });
                            done();
                        });
                });
        });
    });
    describe('GET /one/:id', () => {
        it('should return info about user with id', done => {
            const category = { name: 'Flowers' };

            chai.request(server)
                .post('/category/')
                .send(category)
                .end((error, response) => {
                    chai.request(server)
                        .get(`/user/one/${response.body.newCategory[0].id}`)
                        .end((err, res) => {
                            done();
                        });
                });
        });
    });
});
