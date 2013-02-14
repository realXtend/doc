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
