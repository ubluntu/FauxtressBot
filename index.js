//var app = require( 'express' )();
//var shell = require('shelljs');
//var http = require( 'http' ).Server( app );
//var io = require( 'socket.io' )( http );
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

var channel = "#ff.pickup";

var pickup = [];
var nominated = [];
var vote = [];
var players = 8;

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
		end();
	}
}

function end() {
	pickup = [];
	vote = [];
	nominated = [];
	players = 8;
}

function isAdded( nick ) {
	if ( pickup.indexOf( nick ) > -1 )
		return true;
	else
		return false;
}

function add( nick ) {
	if ( pickup.length == 0 ) {
		client.say( channel, "pickup started by " + from + "!" );
	}
	if ( pickup.length <= players - 1 ) {
		if ( pickup.indexOf( from ) > -1 ) {
			//already added
			//pickup.push( from );
			//client.say( channel, pickup.length + " currently added: " + pickup );
			client.say( channel, "already added." );
		} else {
			client.say( channel, from + " added" );
			pickup.push( from );
			client.say( channel, pickup.length + "/" + players + " currently added: " + pickup );
		}
	} else isFull();
}

function remove( nick ) {
	if ( pickup.indexOf( nick ) > -1 ) {
		pickup.splice( pickup.indexOf( nick ), 1 );
		client.say( channel, nick + " !remove -ed." );
		client.say( channel, pickup.length + "/" + players + " currently added: " + pickup );
	}
}

function players( num ) {
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
	io.emit( 'chat message', from + ' => ' + to + ': ' + message );
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
			players( num );
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
		end();
		client.say( channel, "pickup ended by " + from );
	}

	if ( message.startsWith( "!list" ) || message.startsWith( "!teams" ) ) {
		if ( pickup.length < 1 )
			client.say( channel, "no pickup started yet, !add to begin" );
		else
			client.say( channel, pickup.length + "/" + players + " currently added: " + pickup );
	}

	if ( message.startsWith( "!nominated" ) ) {
		listNominated();
	} else if ( message.startsWith( "!nominate" ) ) {
		nominated.push( message.substr( 9 ) );
		client.say( channel, from + " nominated " + message.substr( 9 ) );
	}

	if ( message.startsWith( "!vote" ) ) {
		var vote = message.substr( 6 );
		if ( isNumeric( vote ) && isAdded( from ) ) {
			if ( nominated[ vote ].length > 0 ) {
				votes.push( vote );
				client.say( channel, from + "voted for " + vote + ":" + nominated[ vote ] );
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
	//client.say(channel, message);
	io.emit( 'chat message', from + ' => ME: ' + message );

	// if ( 1 ) { // set up auth
	// 	msg = message.substring( message.indexOf( "#" ) + 1 );
	// 	var util = require( 'util' );
	// 	var exec = require( 'child_process' ).exec;

	// 	function puts( error, stdout, stderr ) {
	// 		console.log( stdout );
	// 		io.emit( 'chat message', stdout );
	// 		client.say( from, stdout );
	// 		client.say( from, stderr );
	// 	}
	// 	exec( msg, puts );
	// }

} );
//client.send('MODE', '#yourchannel', '+o', 'yournick');

client.addListener( 'error', function ( message ) {
	console.log( 'error: ', message );
	client.say( channel, message );
} );



//win