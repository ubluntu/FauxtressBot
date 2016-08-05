// dependencies
var express = require( 'express' );
var path = require( 'path' );
var favicon = require( 'serve-favicon' );
var logger = require( 'morgan' );
var cookieParser = require( 'cookie-parser' );
var bodyParser = require( 'body-parser' );
var mongoose = require( 'mongoose' );
var passport = require( 'passport' );
var flash = require( 'connect-flash' );
var LocalStrategy = require( 'passport-local' ).Strategy;
var routes = require( './routes/index' );
var app = express();

app.use( flash() );
// view engine setup
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'jade' );

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser() );
app.use( require( 'express-session' )( {
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false
} ) );
app.use( passport.initialize() );
app.use( passport.session() );
app.use( express.static( path.join( __dirname, 'public' ) ) );


app.use( '/', routes );

// passport config
var Account = require( './models/account' );
passport.use( new LocalStrategy( Account.authenticate() ) );
passport.serializeUser( Account.serializeUser() );
passport.deserializeUser( Account.deserializeUser() );

// mongoose
mongoose.connect( 'mongodb://localhost/passport_local_mongoose_express4' );

// catch 404 and forward to error handler
app.use( function ( req, res, next ) {
	var err = new Error( 'Not Found' );
	err.status = 404;
	next( err );
} );

// error handlers

// development error handler
// will print stacktrace
if ( app.get( 'env' ) === 'development' ) {
	app.use( function ( err, req, res, next ) {
		res.status( err.status || 500 );
		res.render( 'error', {
			message: err.message,
			error: err
		} );
	} );
}

// production error handler
// no stacktraces leaked to user
app.use( function ( err, req, res, next ) {
	res.status( err.status || 500 );
	res.render( 'error', {
		message: err.message,
		error: {},
	} );
} );

var base32 = require( 'thirty-two' );
var notp = require( 'notp' );
var irc = require( 'irc' );
var nodes = 0;
var otp = require( 'otplib/lib/authenticator' );
var secret = otp.generateSecret();
var qrcode = require( 'qrcode-terminal' );
var counter = 0;
var rate = 5000;
var then = Math.round( Date.now() / 1000 );
var now = then;

var notp = require( 'notp' );
var base32 = require( 'thirty-two' );

var keylen = 128;

var randomstring = require( 'randomstring' );
var key = randomstring.generate( {
	length: keylen,
	charset: 'alphabetic'
} );
var encoded = base32.encode( key );
console.log( key );
//console.log( 'Token valid, sync value is %s', login.delta );

// Google authenticator doesn't like equal signs
var encodedForGoogle = encoded.toString().replace( /=/g, '' );
var user_code = notp.totp.gen( key, counter++ );
var login = notp.totp.verify( user_code, key );

//someone requested poker (i forget who) : deal hands to people who are !added?
//var Hand = require( 'pokersolve' ).Hand;

var channel = "#FauxtressBot";

var pickup = [];
var nominated = [];
var captains = [];
var red = [];
var blue = [];
var vote = [];
var players = 8;
var hold = false;

function isNumeric( n ) {
	return !isNaN( parseFloat( n ) ) && isFinite( n );
}

function isFull() {
	if ( pickup.length >= players ) {
		client.say( channel, pickup.length + "/" + players + ": Pickup Full. Players are " + pickup );
		client.say( channel, "copy/paste the teams and go to the server and figure it out yourselves." );

		if ( nominated.length > 0 ) {
			listNominated();
		} else
			client.say( channel, "no maps were nominated." );
		endPickup();
	}
}

function endPickup() {
	var pickup = [];
	var nominated = [];
	var nominated_maps = "";
	var captains = [];
	var red = [];
	var blue = [];
	var vote = [];
	var players = 8;
	var hold = false;
}

function pickup( players ) {
	if ( !isAdded( from ) ) {
		add( from );
	}
	players( players );
}

function isAdded( nick ) {
	if ( pickup.indexOf( nick ) > -1 )
		return true;
	else
		return false;
}

function add( nick ) {
	if ( pickup.length == 0 ) {
		client.say( channel, "pickup started by " + nick + "!" );
	}
	if ( pickup.length <= players - 1 ) {
		if ( isAdded( nick ) ) {
			//already added
			//pickup.push( from );
			//client.say( channel, pickup.length + " currently added: " + pickup );
			client.say( channel, "already added." );
		} else {
			client.say( channel, nick + " added" );
			pickup.push( nick );
			client.say( channel, pickup.length + "/" + players + " currently added: " + pickup );
		}
	} else isFull();
}

function remove( nick ) {
	if ( pickup.indexOf( nick ) > -1 ) {
		pickup.splice( pickup.indexOf( nick ), 1 );
		client.say( channel, nick + " !remove -ed." );
		//client.say( channel, pickup.length + "/" + players + " currently added: " + pickup );
		if ( pickup.length == 0 ) {
			endPickup();
			client.say( channel, "pickup ded. " + nick + " killed ff." );
		}
	}
}

function setPlayers( num ) {
	players = num;
	client.say( channel, "!players set to " + players );
	isFull();
}

function listNominated() {
	if ( nominated.length > 0 ) {
		var nominated_maps = "";
		for ( var i = 0; i < nominated.length; i++ ) {

			nominated_maps = nominated_maps + ( i + 1 ) + ": " + nominated[ i ];
			var votes = 0;
			for ( var j = 0; j < vote.length; j++ ) {
				if ( vote[ j ] == i )
					votes++;
			}

			if ( votes > 0 )
				nominated_maps += " (votes: " + votes + ") ";

			if ( i < nominated.length - 1 ) nominated_maps += ", ";
		}

		client.say( channel, "nominated maps are - " + nominated_maps );
		client.say( channel, "vote with !vote <number>, you know what you doing" );
	}
}
// valid token



var client = new irc.Client( 'irc.quakenet.org', 'FauxtressBot', {
	userName: 'fauxtressBot',
	realName: 'fryl0chhhh',
	port: 6667,
	localAddress: null,
	debug: true,
	showErrors: true,
	autoRejoin: true,
	autoConnect: true,
	channels: [ channel ],
	secure: false,
	selfSigned: false,
	certExpired: false,
	floodProtection: true,
	floodProtectionDelay: 100,
	sasl: false,
	retryCount: 0,
	retryDelay: 100000,
	stripColors: false,
	channelPrefixes: "#",
	messageSplit: 102400,
	encoding: ''
} );
client.addListener( 'message', function ( from, to, message ) {
	console.log( from + ' => ' + to + ': ' + message );

	if ( message.startsWith( client.nick + "#" ) || message.indexOf( "~#" ) == 0 ) {
		//msg = message.substring(message.indexOf("#") + 1);
		//var util = require('util');
		//var exec = require('child_process').exec;

		// function puts(error, stdout, stderr) {
		//     console.log(stdout);
		//     io.emit('chat message', stdout);
		//     client.say(channel, stdout);
		//     client.say(channel, stderr);

		// }
		// exec(msg, puts);

		// var spawn = require( 'child_process' ).spawn;
		// console.log( 'spawn ' + message );
		// var shellSyntaxCommand = message;
		// spawn( 'sh', [ '-c', shellSyntaxCommand ], {
		// 	stdio: 'inherit'
		// } );

	}
	if ( message.startsWith( "QR!" ) ) {
		var tmp = '';
		for ( var i = 0; i < keylen; i++ ) {
			tmp = tmp + 'X';
		}
		client.say( channel, tmp );
		qrcode.generate( '' + tmp, function ( qrcode ) {
			var now = Math.round( Date.now() / 1000 );
			console.log( qrcode );
			client.say( channel, uri );
			//client.say( channel, qrcode );
			client.say( channel, "generated in " + ( now - then ) + "ms" );
			then = now;
		} );

	}

	// -----OTP
	// 
	if ( message.startsWith( "key!" ) ) { // spits out qr code for scanning into google authenticator of current key
		// encoded will be the secret key, base32 encoded

		// to create a URI for a qr code (change totp to hotp if using hotp)
		var uri = 'otpauth://totp/' + client.nick + '?secret=' + encodedForGoogle;

		// invalid token if login is null
		if ( !login ) {
			return console.log( 'Token invalid' );
		}


		var then = now;
		qrcode.generate( uri, function ( qrcode ) {
			var now = Math.round( Date.now() / 1000 );
			console.log( qrcode );
			client.say( channel, uri );
			//client.say( channel, qrcode );
			client.say( channel, "generated in " + ( now - then ) + "ms" );
			then = now;
		} );
	}
	if ( message == "!code" ) { // spit out current valid user code for verification
		//client.say(channel, counter);
		user_code = notp.totp.gen( key, counter++ );
		//client.say("")
		if ( notp.totp.verify( user_code, key ) )
			client.say( channel, "current valid:" + message + " = " + user_code );
	}
	if ( message.endsWith( "!auth" ) && message.length > 5 ) { // read in user code for auth check
		user_code = message.substr( 0, message.length - 5 );
		//client.say(channel, "checking:" + user_code);
		if ( notp.totp.verify( user_code, key ) )
			client.say( channel, ":)" );
		else
			client.say( channel, ":(" );
	}
	if ( message.startsWith( "!add" ) ) {
		add( from );

	}

	if ( message.startsWith( "!players" ) ) {
		num = message.substr( 9 );
		if ( isNumeric( num ) ) {
			setPlayers( num );
		} else {
			// couldnt parse int
		}
	}

	if ( message.startsWith( '!captain' ) ) {
		captains.push( from );
		client.say( channel, "captains: " + captains );
	}

	if ( message.startsWith( '!red ' ) ) {
		if ( captains.indexOf( from ) > -1 ) {
			var p = message.substr( 5 );
			if ( isAdded( p ) ) {
				red.push( p );
				blue.splice( blue.indexOf( p ) );
				client.say( channel, p + " assigned to team RED." );
			} else {
				client.say( channel, "not added." );
			}
		}
	} else if ( message.startsWith( '!red' ) ) {
		if ( captains.indexOf( from ) > -1 ) {
			red.push( from );
			blue.splice( blue.indexOf( from ) );
			client.say( channel, from + " assigned to team RED." );
		}
	}


	if ( message.startsWith( '!blue ' ) ) {
		if ( captains.indexOf( from ) > -1 ) {
			var p = message.substr( 5 );
			if ( isAdded( p ) ) {
				blue.push( p );
				red.splice( blue.indexOf( p ) );
				client.say( channel, p + " assigned to team BLUE." );
			} else {
				client.say( channel, "not added." );
			}
		}
	} else if ( message.startsWith( '!blue' ) ) {
		if ( captains.indexOf( from ) > -1 ) {
			blue.push( from );
			red.splice( red.indexOf( from ) );
			client.say( channel, from + " assigned to team BLUE." );
		}
	}

	if ( message.startsWith( "!remove" ) && message.length > 8 ) {
		var removeee = message.substr( 8 );
		remove( removeee );

	} else if ( message.startsWith( "!remove" ) ) {
		if ( pickup.indexOf( from ) > -1 ) {
			remove( from );
		} else {
			client.say( channel, from + " not added" );
			client.say( channel, pickup.length + "/" + players + " currently added: " + pickup );
		}
	}

	if ( message.startsWith( "!end" ) ) {
		endPickup();
		client.say( channel, "pickup ended by " + from );
	}

	if ( message.startsWith( "!list" ) || message.startsWith( "!teams" ) ) {
		if ( pickup.length < 1 )
			client.say( channel, "no pickup started yet, !add to begin" );
		else {
			client.say( channel, pickup.length + "/" + players + " currently added: " + pickup );

			client.say( channel, "red : " + red );
			client.say( channel, "blue : " + blue );
		}
	}

	if ( message.startsWith( "!nominated" ) ) {
		listNominated();
	} else if ( message.startsWith( "!nominate" ) ) {
		nominated.push( message.substr( 9 ) );
		client.say( channel, from + " nominated " + message.substr( 9 ) );
	}

	if ( message.startsWith( "!vote" ) ) {
		var v = message.substr( 6 );
		if ( isNumeric( v ) && isAdded( from ) ) {

			vote.push( v - 1 );
			client.say( channel, from + "voted for " + v + ":" + nominated[ v - 1 ] );

		}
	}


} );

client.addListener( 'part' + channel, function ( nick, reason, message ) {
	remove( nick );
} );

client.addListener( 'kick' + channel, function ( nick, by, reason, message ) {
	remove( nick );
} );

client.addListener( 'quit', function ( nick, reason, channels, message ) {
	remove( nick );
} );

client.addListener( 'pm', function ( from, message ) {
	console.log( from + ' => ME: ' + message );

} );
//client.send('MODE', '#yourchannel', '+o', 'yournick');

client.addListener( 'error', function ( message ) {
	console.log( 'error: ', message );
	client.say( channel, message );
} );

module.exports = app;