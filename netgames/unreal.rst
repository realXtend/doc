no actual game but speculation about the class structure etc
http://forums.epicgames.com/threads/711680-Simple-Pong-game-from-scratch

--

ah no there is a somewhat working version! (on page 2)

----

class UPongGame extends GameInfo;

defaultproperties
{
	PlayerControllerClass=class'UPongPlayerController'
	bDelayedStart = false; // start the game, takes players out of waiting state
}

---

class UPongPlayerController extends PlayerController;

var UPaddle Paddle; //Paddle Player Owns


simulated function PostBeginPlay() {
	local vector loc;

	loc.X = -307.0;
	loc.Y = -22.0;
	loc.Z = 33.0;

	Paddle = Spawn(class'UPaddle',,,loc);	
}

state PlayerWalking {

	function PlayerMove(float DeltaTime)
	{
		local vector temp;
		
		super.PlayerMove(DeltaTime);

		//see if Player if pressing the left/right strafe button
		if(PlayerInput.aStrafe < 0) //Player pressing left
		{
			ClientMessage("Pressing Left");
			temp.Y= -2.0;
		}else if(PlayerInput.aStrafe > 0){ // Player pressing right
			ClientMessage("Pressing Right");
			temp.Y= 2.0;
		}

		Paddle.StaticMeshComponent.AddImpulse(temp);

		if(Paddle != none)
		{
			`log("move ball");
		}
	}
}

defaultproperties
{
	CameraClass=class'UPongCamera'
}

---

class UPongCamera extends Camera;

function UpdateViewTarget(out TViewTarget OutVT, float DeltaTime)
{
	local rotator ROT;
	local vector LOC;

	Rot.Pitch = (-90.0f     * DegToRad) * RadToUnrRot;
	Rot.Roll =  0;
	Rot.Yaw =   0;

	Loc.X = 0;
	Loc.Y = 0;
	Loc.Z = 512;

	OutVT.POV.Location = Loc;
	OutVT.POV.Rotation = Rot;
}

---

class UPaddle extends KActorSpawnable
	placeable;

simulated event PostBeginPlay()
{
	local RB_ConstraintActor OneDConstraint;

	super.PostBeginPlay();

	/*
	 * Allow the paddle to move left and right only
	 */
	OneDConstraint = Spawn(class'RB_ConstraintActorSpawnable', self, '',Location, rot(0,0,0));

	//limit the z and x, and only allow y, defualt for bLimited is 1
	OneDConstraint.ConstraintSetup.LinearYSetup.bLimited = 0;
	//Don't allow the Pawn to turn
	OneDConstraint.ConstraintSetup.bSwingLimited = true;
	//Init the Constraint and Constrain the Pawn
	OneDConstraint.InitConstraint(self, none);
	`log("Loading Paddle");
}

defaultproperties
{
	Begin Object name=StaticMeshComponent0
		StaticMesh=StaticMesh'CH_Pong.PaddleMesh'
		bNotifyRigidBodyCOllision=true
		HiddenGame=false
		ScriptRigidBodyCollisionThreshold = 0.0
		LightingChannels=(Dynamic=true)
		DepthPriorityGroup=SDPG_Foreground
	End Object
}

---

class UPongGoalVolume extends Volume
	placeable;

---
