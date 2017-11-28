const Category = require('../server/models/category');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../server');

chai.use(chaiHttp);

describe('Category controller', () => {
    describe('GET /all', () => {
        it('it should GET all the books', done => {
            chai.request(server)
                .get('/category/all')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.data.length.should.not.be.eql(0);
                    done();
                });
        });
    });

    describe('GET /', () => {
        it('should get accepted and base categories for front', done => {
            chai.request(server)
                .get('/category/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.data.should.be.a('array');
                    res.body.data.forEach(category => {
                        category.should.have.property('id');
                        category.should.have.property('value');
                    });
                    done();
                });
        });
    });

    describe('POST /', () => {
        it('shold not save without name', done => {
            const category = {};

            chai.request(server)
                .post('/category/')
                .send(category)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
        it('should save new category', done => {
            const category = {
                name: 'Flowers'
            };

            chai.request(server)
                .post('/category/')
                .send(category)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.not.have.property('error');
                    res.body.newCategory[0].should.have.property('name');
                    res.body.newCategory[0].should.have.property('pending')
                    res.body.newCategory[0].should.have.property('id');
                    done();
                });
        });
    });

    describe('PUT /:id', () => {
        it('should not edit pending of category without access-token', done => {
            const editFields = { pending: 'accepted' };
            const category = { name: 'Flowers' };

            chai.request(server)
                .post('/category/')
                .send(category)
                .end((error, response) => {
                    chai.request(server)
                        .put(`/category/${response.body.newCategory[0].id}`)
                        .send(editFields)
                        .end((err, res) => {
                            res.should.have.status(503);
                            res.should.have.property('error');
                            done();
                        });
                });
        });

        it('should edit pending of category', done => {
            const editFields = { pending: 'accepted' };
            const category = { name: 'Flowers' };

            chai.request(server)
                .post('/category/')
                .send(category)
                .end((error, response) => {
                    chai.request(server)
                        .put(`/category/${response.body.newCategory[0].id}`)
                        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTExMjUwMDQwLCJleHAiOjE1MTE4NTQ4NDB9.O6fqUbAemzWoLAHfRg_cX_k_peE0gLd3IkIEx-RV62g')
                        .send(editFields)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.success.should.be.eql(true);
                            done();
                        });
                });
        });
    });

    describe('DELETE /:id', () => {
        it('should not delete category without access-token', done => {
            const category = { name: 'Flowers' };

            chai.request(server)
                .post('/category/')
                .send(category)
                .end((error, response) => {
                    chai.request(server)
                        .delete(`/category/${response.body.newCategory[0].id}`)
                        .end((err, res) => {
                            res.should.have.status(503);
                            res.should.have.property('error');
                            done();
                        });
                });
        });

        it('should delete category', done => {
            const category = { name: 'Flowers' };

            chai.request(server)
                .post('/category/')
                .send(category)
                .end((error, response) => {
                    chai.request(server)
                        .delete(`/category/${response.body.newCategory[0].id}`)
                        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTExMjUwMDQwLCJleHAiOjE1MTE4NTQ4NDB9.O6fqUbAemzWoLAHfRg_cX_k_peE0gLd3IkIEx-RV62g')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.success.should.be.eql(true);
                            done();
                        });
                });
        });
    });
});
