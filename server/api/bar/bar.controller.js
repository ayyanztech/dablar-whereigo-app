/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/bars              ->  index
 * POST    /api/bars              ->  create
 * GET     /api/bars/:id          ->  show
 * PUT     /api/bars/:id          ->  update
 * DELETE  /api/bars/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');

//var Promise = require('bluebird');
//var Bar = Promise.promisifyAll( require('./bar.model') );
var async = require('async');
var Bar = require('./bar.model');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) { 
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}


// Gets a list of Bars
exports.getFrom = function(req, res) {

  var yelp = require('yelp').createClient({
    consumer_key: "5qHvTJw1trlBHjiaO5c5MA",
    consumer_secret: "i3w3Yegccf6-fRcfXQaNOe2QyKU",
    token: "0eziob5K1v4Bsw1Qr3Y-DIfyRoHMopJC",
    token_secret: "z-RIw3PO_tc3p2HsRhVh7j9XqMg"
  });
   
  yelp.search({category_filter: "bars", location: req.params.location}, function (error, data) {
    if(error) { 
      return handleError(res, error); 
    }

    //recorrer la busqueda en Yelp    
    async.map(data.businesses, function (business, callback) {
      
      //por cada resultado de yelp busco si hay gente alli
      Bar.findAsync({yelpId: business.id}, function (err, bar) {
        if(err) { return err }
        
        if (bar && bar.length > 0) {
          business.usersIn = bar[0].usersIn; //pongo las personas que hay ahora
          business._id = bar[0]._id;  //inserto el id del bar de mi BD
        }
        else { 
          business.usersIn = [];
        }

        //devuelvo la llamada para el siguiente resultado yelp
        callback(null, business.id);
      })
     
    }, function (e, r) {
      //se devuelve la busqueda en yelp con los asistntes añadidos si los hay...
      return res.status(200).json(data);
    });
  });
};

// Gets a list of Bars
exports.index = function(req, res) {
  Bar.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
  
};

// Gets a single Bar from the DB
exports.show = function(req, res) {
  Bar.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Bar in the DB
exports.create = function(req, res) {
  Bar.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Bar in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  } 
  Bar.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(function (entity) {
      entity.usersIn = req.body.usersIn;
      return entity.saveAsync()
        .spread(function(updated) {
          return updated;
        });
    })
    .then(responseWithResult(res))
    .catch(handleError(res));
/*  
  Bar.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
*/
};

// Deletes a Bar from the DB
exports.destroy = function(req, res) {
  Bar.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
