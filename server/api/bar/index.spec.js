'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var barCtrlStub = {
  index: 'barCtrl.index',
  show: 'barCtrl.show',
  create: 'barCtrl.create',
  update: 'barCtrl.update',
  destroy: 'barCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var barIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './bar.controller': barCtrlStub
});

describe('Bar API Router:', function() {

  it('should return an express router instance', function() {
    barIndex.should.equal(routerStub);
  });

  describe('GET /api/bars', function() {

    it('should route to bar.controller.index', function() {
      routerStub.get
                .withArgs('/', 'barCtrl.index')
                .should.have.been.calledOnce;
    });

  });

  describe('GET /api/bars/:id', function() {

    it('should route to bar.controller.show', function() {
      routerStub.get
                .withArgs('/:id', 'barCtrl.show')
                .should.have.been.calledOnce;
    });

  });

  describe('POST /api/bars', function() {

    it('should route to bar.controller.create', function() {
      routerStub.post
                .withArgs('/', 'barCtrl.create')
                .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/bars/:id', function() {

    it('should route to bar.controller.update', function() {
      routerStub.put
                .withArgs('/:id', 'barCtrl.update')
                .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/bars/:id', function() {

    it('should route to bar.controller.update', function() {
      routerStub.patch
                .withArgs('/:id', 'barCtrl.update')
                .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/bars/:id', function() {

    it('should route to bar.controller.destroy', function() {
      routerStub.delete
                .withArgs('/:id', 'barCtrl.destroy')
                .should.have.been.calledOnce;
    });

  });

});
