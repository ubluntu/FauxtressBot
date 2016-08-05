var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;
var passportLocalMongoose = require( 'passport-local-mongoose' );

var Account = new Schema( {
	username: { type: String, unique: true },
	email: String,
	password: String,
	status: String,
	timestamp: String,
	last_activity: String,
	pin: { type: String, unique: true },
	first_name: String,
	last_name: String,
	contact_phone: String,
	admin: Boolean,
	resetPasswordToken: String,
	resetPasswordExpires: Date
} );

Account.plugin( passportLocalMongoose );

module.exports = mongoose.model( 'Account', Account );