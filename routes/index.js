var express = require( 'express' );
var passport = require( 'passport' );
var Account = require( '../models/account' );
var Punch = require( '../models/punch' );
var router = express.Router();
var df = require( '../public/javascripts/dateformat.js' );
var bcrypt = require( 'bcrypt-nodejs' );
var async = require( 'async' );
var crypto = require( 'crypto' );
var flash = require( 'connect-flash' );
var nodemailer = require( 'nodemailer' );
var sendmailTransport = require( 'nodemailer-sendmail-transport' );



router.get( '/', function ( req, res ) {
	if ( req.isAuthenticated() ) {
		if ( !req.user.pin || !req.user.email || !req.user.contact_phone ) {
			req.flash( 'error', 'Your user profile is missing some important information:' );
			res.redirect( '/profile' );
		}
	}
	res.render( 'index', {
		user: req.user,
		error: req.flash( 'error' ),
		messages: req.flash( 'info' ),
	} );
} );

router.get( '/register', function ( req, res ) {
	res.render( 'register', {} );
} );



router.post( '/register', function ( req, res, next ) {

	var now = new Date();
	//now.setTime(user.timestamp);

	var dateString = now.format( "isoDate" ) + " " + now.format( "isoTime" );


	Account.register( new Account( {
		username: req.body.username,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		contact_phone: req.body.contact_phone,
		email: req.body.email,
		pin: req.body.pin,
		status: 'OUT',
		timestamp: dateString,
		last_activity: 'Registered',
		admin: false,
	} ), req.body.password, function ( err, account ) {
		if ( err ) {
			if ( err.message.startsWith( "E11000" ) ) {
				return res.render( 'register', { error: err.message } );
			} else return res.render( 'register', {
				error: err.message
			} );
		}

		passport.authenticate( 'local' )( req, res, function () {
			req.session.save( function ( err ) {
				if ( err ) {
					return next( err );
				}
				res.redirect( '/' );
			} );
		} );
	} );
} );


router.get( '/login', function ( req, res ) {
	res.render( 'login', {
		user: req.user,
		error: req.flash( 'error' ),
		messages: req.flash( 'info' ),
	} );
} );

router.post( '/login', passport.authenticate( 'local', {
	failureRedirect: '/login',
	failureFlash: true
} ), function ( req, res, next ) {
	req.session.save( function ( err ) {
		if ( err ) {
			return next( err );
		}
		res.redirect( '/' );
	} );
} );

router.get( '/logout', function ( req, res, next ) {
	req.logout();
	req.session.save( function ( err ) {
		if ( err ) {
			return next( err );
		}
		res.redirect( '/' );
	} );
} );



router.get( '/forgot', function ( req, res ) {
	res.render( 'forgot', {
		user: req.user,
		error: req.flash( 'error' ),
		messages: req.flash( 'info' ),
	} );
} );


router.post( '/forgot', function ( req, res, next ) {
	async.waterfall( [
		function ( done ) {
			crypto.randomBytes( 20, function ( err, buf ) {
				var token = buf.toString( 'hex' );
				done( err, token );
			} );
		},
		function ( token, done ) {
			Account.findOne( { email: req.body.email }, function ( err, user ) {
				if ( !user ) {
					req.flash( 'error', 'No account with that email address (' + req.body.email + ') exists.' );
					return res.redirect( '/forgot' );
				}

				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

				//console.log('found user '+user.username);

				user.save( function ( err ) {
					done( err, token, user );
				} );
			} );
		},
		function ( token, user, done ) {
			var sendmailTransport = nodemailer.createTransport( sendmailTransport );
			var mailOptions = {
				to: user.email,
				from: 'noreply@charsha.com',
				subject: req.headers.host + ' Password Reset',
				text: 'Hello #{user.username},\nYou are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
					'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
					'http://' + req.headers.host + '/reset/' + token + '\n\n' +
					'If you did not request this, please ignore this email and your password will remain unchanged.\n\nNote that this link is only valid for a limited time'
			};
			sendmailTransport.sendMail( mailOptions, function ( err ) {
				req.flash( 'info', 'An e-mail has been sent to ' + user.email + ' with further instructions.' );
				console.log( "sent password rest to " + user.email );
				done( err, 'done' );
			} );
		}

	], function ( err ) {
		if ( err ) return next( err );
		res.redirect( '/login' );
	} );
} );

router.get( '/reset/:token', function ( req, res ) {
	Account.findOne( { resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function ( err, user ) {
		if ( !user ) {
			req.flash( 'error', 'Password reset token is invalid or has expired.' );
			return res.redirect( '/forgot' );
		}
		res.render( 'reset', {
			user: req.user
		} );
	} );
} );

router.post( '/reset/:token', function ( req, res ) {
	async.waterfall( [
		function ( done ) {
			Account.findOne( { resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function ( err, user ) {
				if ( !user ) {
					req.flash( 'error', 'Password reset token is invalid or has expired.' );
					return res.redirect( 'back' );
				}

				user.setPassword( req.body.password, function ( err, user ) { user.save(); } );
				user.resetPasswordToken = undefined;
				user.resetPasswordExpires = undefined;

				user.save( function ( err ) {
					req.logIn( user, function ( err ) {
						done( err, user );
					} );
				} );
			} );
		},
	], function ( err ) {
		res.redirect( '/' );
	} );
} );


router.get( '/profile', function ( req, res ) {
	if ( req.isAuthenticated() ) {
		Account.findOne( {
			username: req.session.passport.user
		}, function ( err, account ) {
			if ( err || account === null ) return console.error( err );

			if ( !req.user.pin ) {
				req.flash( 'error', 'Your profile does not have a PIN set' );
				req.user.pin = "";
			}
			if ( !req.user.email ) {
				req.flash( 'error', 'Your profile does not have an email address set' );
				req.user.email = "";
			}
			if ( !req.user.contact_phone ) {
				req.flash( 'error', 'Your profile does not have a phone number set' );
				req.user.contact_phone = "";
			}


			res.render( 'profile', {
				user: req.user,
				error: req.flash( 'error' ),
				messages: req.flash( 'info' ),
				admin: req.user.admin
			} );
		} );
	} else {
		req.flash( 'error', 'You must be logged in to view this page' );
		res.redirect( '/login' );
	}
} );

router.post( '/profile', function ( req, res ) {
	if ( req.isAuthenticated() ) {
		Account.findOne( {
			username: req.body.username,
		}, function ( err, account ) {

			if ( err || account === null ) return console.error( err );
			if ( !req.user.admin && req.user.username != req.body.username ) {
				req.flash( 'error', 'You can only update your own profile!' );
				res.redirect( '/profile' );
			}

			account.email = req.body.email;
			account.first_name = req.body.first_name;
			account.last_name = req.body.last_name;
			account.contact_phone = req.body.contact_phone;
			account.pin = req.body.pin;
			if ( req.user.admin )
				account.admin = req.body.admin;

			account.save( function ( err ) {
				if ( err ) {
					if ( err.message.startsWith( "E11000" ) ) {
						return res.render( 'profile', { error: "That value is already in use, please choose another", user: req.user, messages: req.flash( 'info' ) } );
					} else return res.render( 'profile', {
						error: err.message
					} );
				}
				req.flash( 'info', 'Profile Information Updated.' );
				res.redirect( '/profile' );
			} );

		} );
	} else {
		req.flash( 'error', 'You must be logged in to view this page' );
		res.redirect( '/login' );
	}
} );

router.get( '/details/:username', function ( req, res ) {
	if ( req.isAuthenticated() ) {
		if ( req.user.admin || req.user.username === req.params.username ) {

			res.render( 'details', {
				user: req.user,
				req_user: req.params.username,
				error: req.flash( 'error' ),
				messages: req.flash( 'info' ),
				users: account,
				data: punches,
				punchdata: JSON.stringify( punches )
			} );

		} else {
			req.flash( 'error', 'Only administrators can view/edit the profiles of other users' );
			res.redirect( '/' );
		}

	} else {
		req.flash( 'error', 'You must be logged in to view this page' );
		res.redirect( '/login' );
	}
} );

router.get( '/profile/:username', function ( req, res ) {
	if ( req.isAuthenticated() ) {
		if ( req.user.admin ) {
			Account.findOne( { username: req.params.username }, function ( err, account ) {
				res.render( 'profile', {
					user: account,
					error: req.flash( 'error' ),
					messages: req.flash( 'info' ),
					admin: req.user.admin
				} );
			} );
		} else {
			req.flash( 'error', 'Only administrators can view/edit the profiles of other users' );
			res.redirect( '/profile' );
		}

	} else {
		req.flash( 'error', 'You must be logged in to view this page' );
		res.redirect( '/login' );
	}

} );

router.get( '/admin/:first/:last', function ( req, res ) {
	// req.isAuthenticated() && req.session.passport.user == 'mpaon46@gmail.com' 

	if ( req.isAuthenticated() && req.user.admin ) {
		Punch.find( { in : {
				$gte: req.params.first,
				$lt: req.params.last
			}
		}, function ( err, punches ) {


			var o = {};

			var d = [];


			var punchdata = punches;
			for ( var i = 0; i < punchdata.length; ++i ) {
				if ( !o.hasOwnProperty( punchdata[ i ].username ) ) {
					Object.defineProperty( o, punchdata[ i ].username, {
						value: [],
						writable: true,
						enumerable: true,
						configurable: true
					} );
				}

				//
				//d.push( [ Date.parse( punchdata[ i ].in ), 1 ] );
				o[ punchdata[ i ].username ].push( [ Date.parse( punchdata[ i ].out ), ( Date.parse( punchdata[ i ].out ) - Date.parse( punchdata[ i ].in ) ) / 1000 / 60 / 60 ] );
			}

			var users = Object.keys( o );

			for ( var j = 0; j < users.length; ++j ) {
				d.push( o[ users[ j ] ] );
			}

			Account.find( {}, function ( err, account ) {
				//console.log( account );
				res.render( 'admin', {
					user: req.user,
					error: req.flash( 'error' ),
					messages: req.flash( 'info' ),
					users: account,
					data: JSON.stringify( d ),
					userpunches: JSON.stringify( o ),
					first: req.params.first,
					last: req.params.last,
				} );
			} );
		} );
	}
} );


router.get( '/admin', function ( req, res ) {
	// req.isAuthenticated() && req.session.passport.user == 'mpaon46@gmail.com' 

	if ( req.isAuthenticated() && req.user.admin ) {
		Punch.find( {}, function ( err, punches ) {


			var o = {};

			var d = [];


			var punchdata = punches;
			for ( var i = 0; i < punchdata.length; ++i ) {
				if ( !o.hasOwnProperty( punchdata[ i ].username ) ) {
					Object.defineProperty( o, punchdata[ i ].username, {
						value: [],
						writable: true,
						enumerable: true,
						configurable: true
					} );
				}

				//
				//d.push( [ Date.parse( punchdata[ i ].in ), 1 ] );
				o[ punchdata[ i ].username ].push( [ Date.parse( punchdata[ i ].out ), ( Date.parse( punchdata[ i ].out ) - Date.parse( punchdata[ i ].in ) ) / 1000 / 60 / 60 ] );
			}

			var users = Object.keys( o );

			for ( var j = 0; j < users.length; ++j ) {
				d.push( o[ users[ j ] ] );
			}

			Account.find( {}, function ( err, account ) {
				//console.log( account );
				res.render( 'admin', {
					user: req.user,
					error: req.flash( 'error' ),
					messages: req.flash( 'info' ),
					users: account,
					userpunches: JSON.stringify( o ),
					data: JSON.stringify( d ),
				} );
			} );
		} );


	} else {
		req.flash( 'error', 'you need permission to view this page' );
		res.redirect( '/login' );
	}
} );


module.exports = router;