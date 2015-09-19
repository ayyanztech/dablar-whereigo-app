'use strict';

var app = require('../../app');
var request = require('supertest');

var newBar;

describe('Bar API:', function() {

  describe('GET /api/bars', function() {
    var bars;

    beforeEach(function(done) {
      request(app)
        .get('/api/bars')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          bars = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      bars.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/bars', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/bars')
        .send({
          name: 'New Bar',
          info: 'This is the brand new bar!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newBar = res.body;
          done();
        });
    });

    it('should respond with the newly created bar', function() {
      newBar.name.should.equal('New Bar');
      newBar.info.should.equal('This is the brand new bar!!!');
    });

  });

  describe('GET /api/bars/:id', function() {
    var bar;

    beforeEach(function(done) {
      request(app)
        .get('/api/bars/' + newBar._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          bar = res.body;
          done();
        });
    });

    afterEach(function() {
      bar = {};
    });

    it('should respond with the requested bar', function() {
      bar.name.should.equal('New Bar');
      bar.info.should.equal('This is the brand new bar!!!');
    });

  });

  describe('PUT /api/bars/:id', function() {
    var updatedBar

    beforeEach(function(done) {
      request(app)
        .put('/api/bars/' + newBar._id)
        .send({
          name: 'Updated Bar',
          info: 'This is the updated bar!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedBar = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBar = {};
    });

    it('should respond with the updated bar', function() {
      updatedBar.name.should.equal('Updated Bar');
      updatedBar.info.should.equal('This is the updated bar!!!');
    });

  });

  describe('DELETE /api/bars/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/bars/' + newBar._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when bar does not exist', function(done) {
      request(app)
        .delete('/api/bars/' + newBar._id)
        .expect(404)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
