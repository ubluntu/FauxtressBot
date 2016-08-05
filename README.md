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

    !alias <maps/player/server> <key> <alias>
        - key -> value pair for shorter names, ie:
            -destroy -> ff_destroy
            -ofire -> ff_openfire
            -prop -> ff_propinquity_b12345

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

    npm install steam 
        - have the bot respond to !add in steam chat
        - bot changes nick in steam chat to reflect current pickup status (0/8, 3/8, 7/8 etc)
    npm install srcds-rcon 
        - use this to get in game events and info (scores, kills, steam_ids...)
        - to get chat !admin !map <mapname> !restart !teams ...

    -get a map list for each bracket (1v1,2v2,3v3,4v4)
	-parse logs for stats
	-set up a 1v/2v/3v/4v leaderboard/ladder (maps?)
	-http interface webchat/click to add/launch