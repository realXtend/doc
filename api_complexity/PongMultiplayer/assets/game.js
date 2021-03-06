// !ref: local://PongGameLobby.ui
var gameUiRef = "local://PongGameLobby.ui"

engine.ImportExtension("qt.core");
engine.ImportExtension("qt.gui");

engine.IncludeFile("local://class.js");
engine.IncludeFile("local://json2.js");

// Commonly used data
var zeroVec = new float3(0, 0, 0);

/** @constant */
var msgBase = "pongmultiplayer-";
/** @constant */
var msgJoinGame = msgBase + "joingame";
/** @constant */
var msgClientMovement = msgBase + "clientmovement";
/** @constant */
var msgServerInfomation = msgBase + "serverinfo";

var GameServer = Class.extend(
/** @lends GameServer# */
{
    /**
     * @constructs
     */
    init: function()
    {        
        /** @type {array} */
        this.gameData = {};
        
        frame.Updated.connect(this.updateGame);
        me.Action(msgJoinGame).Triggered.connect(this.onClientJoin);
        me.Action(msgClientMovement).Triggered.connect(this.onClientMovement);
    },
    
    /** @param {number} clientId */
    getClient: function(clientId)
    { 
        return server.GetUserConnection(parseInt(clientId));
    },

    /** @param {number} clientId */    
    getClientName: function(clientId)
    {
        var clientIdInt = parseInt(clientId);
        if (clientIdInt == 0)
            return "CPU";
        var thisClient = server.GetUserConnection(clientIdInt);
        if (thisClient == null)
            return "Unknown";
        return thisClient.GetProperty("username");
    },
    
    /** @param {null} */
    createGame: function()
    { 
        data.p1_bat = scene.GetEntityByName("bat_a");
        data.p2_bat = scene.GetEntityByName("bat_b");
        data.ball = scene.GetEntityByName("ball");
        data.serverId = client.GetConnectionID();
        
        data.running = false;
        data.speed = 16;
        data.winscore = 2;
        data.gameTimeIter = 0.0;
        data.p1_client_id = null;
        data.p2_client_id = null;
        data.p1_score = 0;
        data.p2_score = 0;

        gameServer.resetGameState(); 
        
        console.LogInfo("Game created");
    },
    
    /** @param {null} */
    startGame: function()
    {
        if (!data.p1_client_id || !data.p2_client_id)
        {
            console.LogInfo("Cannot start game, players missing!");
            return;
        }

        // Give initial push
        // \todo randomize the direction
        var velVec = new float3(0, 0, 0);
        velVec.x = 10;
        velVec.z = 2;
        data.ball.rigidbody.SetLinearVelocity(velVec);
        
        data.speed = 16;
        data.gameTimeIter = 0.0;
        data.running = true;
    }, 
     
    /** @param {null} */
    stopGame: function()
    {
        gameServer.resetGameState();
        
        data.running = false;
        data.speed = 16;
        data.winscore = 2;
        data.gameTimeIter = 0.0;
        data.p1_client_id = null;
        data.p2_client_id = null;
        data.p1_score = 0;
        data.p2_score = 0;
    },
    
    /** @param {number} scoreClientId */
    finishRound: function(scoreClientId)
    {
        gameServer.resetGameState();
        
        if (data.p1_client_id == scoreClientId)
            data.p1_score += 1;
        else if (data.p2_client_id == scoreClientId)
            data.p2_score += 1;
        
        var gameState = {};
        gameState.key = "gamestate";
        gameState.value= [{ "number" : 1, "score" : data.p1_score.toString() }, 
                          { "number" : 2, "score" : data.p2_score.toString() }];
        me.Exec(4, msgServerInfomation, JSON.stringify(gameState));
        
        if (data.p1_score == data.winscore)
        {
            gameServer.finishGame(scoreClientId);
            return;
        }
        else if (data.p2_score == data.winscore)
        {            
            gameServer.finishGame(scoreClientId);
            return;
        }
            
        gameServer.startGame();
    },
    
    /** @param {number} winnerClientId */
    finishGame: function(winnerClientId)
    {
        gameServer.stopGame();
        
        var gameState = {};
        gameState.key = "gamefinished";
        gameState.value= {};
        gameState.value.message = "Game finished - Winner was " + gameServer.getClientName(winnerClientId) + "\nGame is open for new players";
        
        me.Exec(4, msgServerInfomation, JSON.stringify(gameState));
        
        console.LogInfo("Game finished");
    },
    
    /** @param {null} */
    resetGameState: function()
    {
        // Reset ball
        // \todo know the zero pos for ball in data
        var ballt = data.ball.placeable.transform;
        ballt.pos = zeroVec; 
        ballt.rot = zeroVec;
        data.ball.placeable.transform = ballt;
        
        // Reset speed 
        data.ball.rigidbody.SetLinearVelocity(zeroVec);
        
        // Reset bat positions
        var ta = data.p1_bat.placeable.transform;
        var tb = data.p2_bat.placeable.transform;
        var ball_z = data.ball.placeable.transform.pos.z;
        ta.pos.y = ball_y;
        tb.pos.y = ball_y;
        data.p1_bat.placeable.transform = ta;
        data.p2_bat.placeable.transform = tb;
    },
    
    /** @param {number} frametime The time elapsed since previous frame. */
    updateGame: function(frametime)
    {
        if (!data.running)
            return;

        // Current game state
        var t_p1 = data.p1_bat.placeable.transform;
        var t_p2 = data.p2_bat.placeable.transform;
        var t_b = data.ball.placeable.transform;
        var p_p1 = t_p1.pos;
        var p_p2 = t_p2.pos;
        var p_b = t_b.pos;
        var r_b = data.ball.rigidbody;

        // Update game speed
        data.gameTimeIter += frametime;
        if (data.gameTimeIter > 10.0)
        {
            data.speed *= 1.2;
            console.LogInfo(">> Speeding up the game to " + data.speed.toString());
            data.gameTimeIter = 0.0;
        }
        
        // Update ball
        var velVec = r_b.GetLinearVelocity();
        velVec = velVec.normalize().mul(data.speed);
        r_b.SetLinearVelocity(velVec);
        
        // Update ai bat(s)
        if (data.p1_client_id == data.serverId)
        {
            t_p1.pos.y = p_b.y;
            if (t_p1.pos.y > 10.0)
                t_p1.pos.y = 10.0
            if (t_p1.pos.y < -10.0)
                t_p1.pos.y = -10;
            data.p1_bat.placeable.transform = t_p1; 
        }
        if (data.p2_client_id == data.serverId)
        {
            t_p2.pos.y = p_b.y;
            if (t_p2.pos.y > 10.0)
                t_p2.pos.y = 10.0
            if (t_p2.pos.y < -10.0)
                t_p2.pos.y = -10;
            data.p2_bat.placeable.transform = t_p2; 
        }
        
        // Check if someone scored
        if (p_b.x < p_p1.x)
        {
            gameServer.finishRound(data.p2_client_id);
        }
        if (p_b.x > p_p2.x)
        {
            gameServer.finishRound(data.p1_client_id);
        }
    },
    
    // \todo add avatar/client name as param
    /** @param {number} clientId */
    onClientJoin: function(/**number*/ clientId)
    {   
        var response = {};
        response.key = "clientjoin";
        response.value = {};
                
        if (data.p1_client_id == null)
        {
            data.p1_client_id = clientId;
            response.value.result = true;
            response.value.number = 1;
        }
        else if (data.p2_client_id == null)
        {
            data.p2_client_id = clientId;
            response.value.result = true;
            response.value.number = 2;
        }
        else
        {
            response.value.result = false;
            response.value.number = 0;
        }
        
        response.value.id = clientId;
        response.value.name = gameServer.getClientName(clientId);       
        me.Exec(4, msgServerInfomation, JSON.stringify(response));

        if (response.value.result)
            console.LogInfo(">> Player #" + response.value.number + " is " + response.value.name);
        
        if (data.p1_client_id && data.p2_client_id)
        {
            var infoStartGame = {};
            infoStartGame.key = "startgame";
            infoStartGame.value= [{ "id" : data.p1_client_id, "name" : gameServer.getClientName(data.p1_client_id) }, 
                                  { "id" : data.p2_client_id, "name" : gameServer.getClientName(data.p2_client_id) }];
            me.Exec(4, msgServerInfomation, JSON.stringify(infoStartGame));
            gameServer.startGame();
        }
    },

    /** 
     * @param {number} clientId The id of the client that moved.
     * @param {string} direction constant for the movement direction ("up" / "down")
     */    
    onClientMovement: function(/**number*/ clientId, /**string*/ direction)
    {
        if (!data.running)
            return;
            
        var bat = null;
        if (data.p1_client_id == clientId)
            bat = data.p1_bat;
        else if (data.p2_client_id == clientId)
            bat = data.p2_bat;
        else
            return;
            
        var t = bat.placeable.transform;
        if (direction == "up")
            t.pos.y += 0.5;
        else
            t.pos.y -= 0.5;
        if (t.pos.y > 10.0)
            t.pos.y = 10.0
        if (t.pos.y < -10.0)
            t.pos.y = -10;
        bat.placeable.transform = t;
    }
});

var GameClient = Class.extend(
/** @lends GameClient# */
{
    /**
     * @constructs
     */
    init: function()
    {
        /** @type {array} gameData The game data dict */
        this.gameData = {};
  
        /** @type {number} myId The connection ID */
        this.gameData.myId = client.GetConnectionID();

        /** @property {boolean} running */
        this.gameData.running = false;
 
        this.initUi();
        
        me.Action(msgServerInfomation).Triggered.connect(this.onServerData);
    },
    
    /** @method */
    /** @param {null} */
    initUi: function()
    {
        /** @property {UiWidget} widget The GUI widget ('HUD' (?)) */
        var widget = ui.LoadFromFile(gameUiRef, false);
        widget.setParent(ui.MainWindow());
        widget.setWindowFlags(Qt.Tool);
        widget.button_join.clicked.connect(this.joinGamePushed);
        widget.button_add_cpu.clicked.connect(this.addCpuPlayer);
        
        this.gameData.widget = widget;
        
        widget.show(); // remove
    },
    

    /** @method */
    resetClient: function()
    {
        data.widget.p1_name.text = "";
        data.widget.p2_name.text = "";
        data.widget.p1_score.text = "0";
        data.widget.p2_score.text = "0";
        data.widget.button_join.enabled = true;
        data.widget.button_add_cpu.enabled = true;
        this.gameData.running = false;
    },
    
    /** @method */
    joinGamePushed: function() 
    {
        if (data.running)
            return;
        
        // Make a Local input mapper if there is none yet
        if (!me.GetComponent("EC_InputMapper", "PongInput")) 
        {        
            var inputMapper = me.GetOrCreateComponent("EC_InputMapper", "PongInput", 2, false);
            inputMapper.contextPriority = 101;
            inputMapper.takeMouseEventsOverQt = false;
            inputMapper.takeKeyboardEventsOverQt = false;
            inputMapper.modifiersEnabled = false;
            inputMapper.keyrepeatTrigger = true; 
            inputMapper.executionType = 1;
            inputMapper.RegisterMapping("R", "Move(up)", 1);
            inputMapper.RegisterMapping("F", "Move(down)", 1);
        }
        me.Action("Move").Triggered.connect(gameClient.onMovement);
        me.Exec(2, msgJoinGame, data.myId);
    },
    
    /** @method */
    addCpuPlayer: function()
    {
        if (data.running)
            return;
            
        me.Exec(2, msgJoinGame, 0);
    },
    
    /** 
     * @method
     * @param {string} direction The movement direction string constant ("up"/"down")
     */
    onMovement: function(direction)
    {
        if (!data.running)
            return;
            
        me.Exec(2, msgClientMovement, data.myId, direction);
    },
    
    /** 
     * @method
     * @param {string} jsonData
     */
    onServerData: function(jsonData)
    {
        var sd = JSON.parse(jsonData);
        var myIdString = data.myId.toString();
        
        /////// JOIN
        if (sd.key == "clientjoin")
        {
            if (sd.value.id == myIdString)
            {
                if (sd.value.result)
                {
                    data.widget.button_join.enabled = false;
                }
                else
                    console.LogInfo(">> Could not join game");
            }
            if (sd.value.result)
            {
                eval("data.widget.p" + sd.value.number + "_name.text = \"" + sd.value.name + "\"");
                if (data.widget.p1_name.text == "")
                    data.widget.label_status.text = "Waiting for player 1";
                if (data.widget.p2_name.text == "")
                    data.widget.label_status.text = "Waiting for player 2";
            }
        }
        
        ////// GAME STATE
        if (sd.key == "gamestate")
        {
            for (var i in sd.value)
            {
                var playerstate = sd.value[i];
                eval("data.widget.p" + playerstate.number + "_score.text = " + playerstate.score);
            }
        }
        
        if (sd.key == "gamefinished")
        {
            data.widget.label_status.text = sd.value.message;
            gameClient.resetClient();
        }
        
        ////// START GAME 
        if (sd.key == "startgame")
        {
            data.widget.button_join.enabled = false;
            data.widget.button_add_cpu.enabled = false;
        
            for (var i in sd.value)
            {
                var player = sd.value[i];
                if (player.id == data.myId.toString())
                {
                    console.LogInfo(">> Game started");                    
                    data.running = true;
                }
            }
            
            data.widget.label_status.text = "Game ongoing";
        }
    }
}); 

if (server.IsRunning()) 
{
    var gameServer = new GameServer();
    var data = gameServer.gameData;
    
    gameServer.createGame();
}
else if (!framework.IsHeadless())
{
    var gameClient = new GameClient();
    var data = gameClient.gameData;
    
    gameClient.resetClient();
}
