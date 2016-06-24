#pragma strict
var waypoints : Transform[] = new Transform[3];
var speed : float = 4.0;
private var state : int = 0; //0 = Idle , 1 = Moving , 2 = MoveToWaypoint.
var movingAnimation : AnimationClip;
var idleAnimation : AnimationClip;
var mainModel : GameObject;

var idleDuration : Vector2 = new Vector2(1.5 , 2.5);
var moveDuration : Vector2 = new Vector2(1.0 , 2.0);

private var waitDuration : float = 3.0;
private var wait : float = 0;
var freeze : boolean = false;
private var headToPoint : Transform;
private var distance : float = 0.0;
var randomWaypoints : boolean = true;
private var step : int = 0;

function Start () {
	if(waypoints.Length > 1){
		for (var go : Transform in waypoints) {
			go.parent = null;
		}
	}
	if(!mainModel){
		mainModel = this.gameObject;
	}
}

function Update () {
	if(freeze){
		return;
	}
	if(state >= 1){//Moving
		var controller : CharacterController = GetComponent(CharacterController);
		var forward : Vector3 = transform.TransformDirection(Vector3.forward);
     	controller.Move(forward * speed * Time.deltaTime);
    }
    	//----------------------------
		if(wait >= waitDuration && state == 0){
			if(waypoints.Length > 1){
				//Set to Moving Mode.
				if(randomWaypoints){
					RandomWaypoint();
				}else{
					WaypointStep();
				}
			}else{
				//Set to Moving Mode.
				RandomTurning();
			}
		}
		//-------------------------------------
		if(wait >= waitDuration && state == 1){
			 //Set to Idle Mode.
			if(idleAnimation){
				 mainModel.GetComponent.<Animation>().CrossFade(idleAnimation.name, 0.2f);
			}
			wait = 0;
			waitDuration = Random.Range(idleDuration.x , idleDuration.y);
			state = 0;
		}
		//----------------------------------------
		if(state == 2){
			var destination : Vector3 = headToPoint.position;
		    destination.y = transform.position.y;
		  	transform.LookAt(destination);
		  	
			distance = (transform.position - GetDestination()).magnitude;
			if (distance <= 0.2) {
				//Set to Idle Mode.
				if(idleAnimation){
					 mainModel.GetComponent.<Animation>().CrossFade(idleAnimation.name, 0.2f);
				}
				wait = 0;
				waitDuration = Random.Range(idleDuration.x , idleDuration.y);
				state = 0;
			}
		
		}
		wait += Time.deltaTime;
		//-----------------------------

}

function RandomTurning(){
		var dir : float = Random.Range(0 , 360);
		transform.eulerAngles.y = dir;
		if(movingAnimation){
			mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
		}
		wait = 0; // Reset wait time.
		waitDuration = Random.Range(moveDuration.x , moveDuration.y);
		state = 1; // Change State to Move.

}

function RandomWaypoint(){
	headToPoint = waypoints[Random.Range(0, waypoints.Length)];
	if(movingAnimation){
		mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
	}
  				   
	wait = 0; // Reset wait time.
	state = 2; // Change State to Move.
}

function WaypointStep(){
	headToPoint = waypoints[step];
	if(movingAnimation){
		mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
	}
  				   
	wait = 0; // Reset wait time.
	state = 2; // Change State to Move.
	
	if(step >= waypoints.Length -1){
		step = 0;
	}else{
		step++;
	}
}

function GetDestination() : Vector3{
        var destination : Vector3 = headToPoint.position;
        destination.y = transform.position.y;
        return destination;
}

@script RequireComponent (CharacterMotor)
