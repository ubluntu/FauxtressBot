var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var Punch = new Schema( {
	username: String,
	in : Date,
	out: Date
} );


module.exports = mongoose.model( 'Punch', Punch );