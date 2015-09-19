'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var UserInSchema = new Schema(
		{ 
			userId: Schema.Types.ObjectId,
			updated: { type: Date, default: Date.now }
		} 
);

var BarSchema = new Schema({
  yelpId: String,
  usersIn: [ UserInSchema ]
});
/*
var BarSchema = new Schema({
  yelpId: String,
  usersIn: [{ userId: Schema.Types.ObjectId, updated: { type: Date, default: Date.now }  }]
});
*/
module.exports = mongoose.model('Bar', BarSchema);
