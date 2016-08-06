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

var irc = require( 'irc' );

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
var voting = false;

function isNumeric( n ) {
	return !isNaN( parseFloat( n ) ) && isFinite( n );
}

function isFull() {
	if ( pickup.length >= players ) {
		client.say( channel, pickup.length + "/" + players + ": Pickup Full. Players are " + pickup );

		if ( nominated.length > 0 ) {
			listNominated();
		} else
		//client.say( channel, "no maps were nominated." );
			voting = true;
		client.say( channel, "voting is now enabled. !nominate <maps> and !vote <number> !captains pick teams with !red or !blue then !pick <player>" );
	}
}

function endPickup() {
	pickup = [];
	nominated = [];
	nominated_maps = "";
	captains = [];
	red = [];
	blue = [];
	vote = [];
	players = 8;
	hold = false;
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
		captains.push( nick );
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
			client.say( channel, pickup.length + "/" + players + " pool: " + pickup );
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
			client.say( channel, "pickup killed. " + nick + "  ff ded." );
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
		//client.say( channel, "vote with !vote <number>, you know what you doing" );
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
	floodProtectionDelay: 1000,
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

	if ( message.startsWith( "!add" ) ) {
		add( from );
	}



	if ( message.startsWith( "!list" ) || message.startsWith( "!teams" ) ) {
		if ( pickup.length < 1 )
			client.say( channel, "no pickup started yet, !add to begin" );
		else {
			client.say( channel, pickup.length + "/" + players + " currently added: " + pickup );

			if ( red.length > 0 )
				client.say( channel, "red : \x034" + red + "\x03" );
			if ( blue.length > 0 )
				client.say( channel, "blue : \x032" + blue + "\x03" );
		}
	}

	if ( pickup.length > 0 ) {

		if ( message.startsWith( "!players" ) ) {
			num = message.substr( 9 );
			if ( isNumeric( num ) ) {
				setPlayers( num );
			} else {
				// couldnt parse int
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



	}


	if ( voting ) {
		if ( message.isNumeric && isAdded( from ) ) {
			vote.push( message - 1 );
			client.say( channel, from + " voted for " + nominated[ message - 1 ] );
		}

		if ( message.startsWith( '!pick ' ) && captains.indexOf( from ) > -1 ) {
			var picked = message.substr( 6 );
			if ( red.indexOf( from ) > -1 ) {
				red.push( picked );
				client.say( channel, picked + " assigned to team\x034 RED\x03." );
			}
			if ( blue.indexOf( from ) > -1 ) {
				blue.push( picked );
				client.say( channel, picked + " assigned to team\x032 BLUE\x03." );
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
				client.say( channel, from + " voted for " + nominated[ v - 1 ] );

			}
		}
		if ( message.startsWith( '!captain' && message.length == 8 ) ) {
			if ( captains.indexOf( from ) > -1 )
				captains.push( from );
		} else if ( message.startsWith( "!captain " ) ) {
			var nom = message.substr( 9 );
			if ( captains.indexOf( from ) > -1 && isAdded( nom ) )
				captains.push( nom );
		}

		if ( message.startsWith( '!captains' ) ) {
			client.say( channel, "captains: " + captains );
		}

		if ( message.startsWith( '!red' ) ) {
			if ( captains.indexOf( from ) > -1 ) {
				red.push( from );
				if ( blue.indexOf( from ) > -1 )
					blue.splice( blue.indexOf( from ) );
				client.say( channel, from + " assigned to team\x034 RED\x03." );
			}
		}


		if ( message.startsWith( '!blue' ) ) {
			if ( captains.indexOf( from ) > -1 ) {
				blue.push( from );
				if ( red.indexOf( from ) > -1 )
					red.splice( red.indexOf( from ) );
				client.say( channel, from + " assigned to team\x032 BLUE\x03." );
			}
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