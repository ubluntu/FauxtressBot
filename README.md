PickupBot was down so here is a quick !sub

___

to run, clone and:

    npm install
    node index.js

currently supports these commands:

	
    !add
    !remove
    !players <number>
    !teams (!list)
    !nominated
    !nominate <map_name>
    !end
    !vote <number>
    !captain
    	!red | !blue <player>

TODO:

    !pickup <2v2 | 3v3 | 4v4>

    !duel <demo | solly> (!pickup 1v1, map mulch_dm (sniper/2fortsniper?), restrict classes)
        !firstto <num>
        !rounds <num>

    !sub
    !pick <player>
    !shuffle
    !map <map_name>
    !hold
    !unhold
    !transfer
    !sendinfo
    !cancelsub
    
    !deal
	    !bet <$>
	    !call
	    !fold

    npm install steam // steamclient for node, msg bot to !add !teams ...
    npm install srcds-rcon // to get chat !admin !map <mapname> !restart !teams ...
        - use this to get in game events and info (scores, kills, steam_ids...)


    -get a map list for each bracket (1v1,2v2,3v3,4v4)
	-parse logs for stats
	-set up a 2v2 leaderboard/ladder (maps?)
	-http interface webchat/click to add/launch