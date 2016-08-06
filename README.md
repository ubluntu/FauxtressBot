PickupBot was down so here is a quick !sub

___

to run: clone, cd ./FauxtressBot/ and:

    npm install
    node ./bin/www

currently supports these commands:

	
    !add
    !remove
    !players <number>
    !teams (!list)
    !end

    when voting:
        !nominated
        !nominate <map_name>
        !vote <number>
        !captains
        	!red | !blue - choose your team
            !pick <player> -assign player to your team

TODO:

    !pickup <2v2 | 3v3 | 4v4>
        - have a different map list per bracket

        !duel <demo | solly> (!pickup 1v1, additional rules to track scores, map mulch_dm (sniper/2fortsniper?), restrict classes)
            !firstto <num>
            !rounds <num>
    !sub
    !cancelsub
    !admin - show pickup admin and active global admins
    !admin <message> - send message to active admin 

    commands for admins/captains

        !shuffle
            -randomize teams
        !hold
        !unhold
        !sendinfo
        !transfer
        !alias <map/player/server> <key> <alias>
        - key -> value pair for shorter names, ie:
            -destroy -> ff_destroy
            -ofire -> ff_openfire
            -prop -> ff_propinquity_b12345

    
    !deal // someone asked for poker, something to do while waiting for fill i guess
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