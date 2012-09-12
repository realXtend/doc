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