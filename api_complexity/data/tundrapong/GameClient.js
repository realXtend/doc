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
