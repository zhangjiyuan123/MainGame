#pragma strict
private var flying : int = 0; //0 = Idle , 1 = Flying Down , 2 = Fly Up
private var onGround : boolean = false;
private var target : Transform;
private var distance : float = 0.0;
var flyDownRange : float = 5.5;
var flyUpRange : float = 8.5;
var flyingSpeed : float = 8.0;
var flyUpHeight : float = 7.0;
var landingDelay : float = 0.4;
private var currentHeight : float = 0.0;

var flyDownAnimation : AnimationClip;
var flyUpAnimation : AnimationClip;
var landingAnimation : AnimationClip;
private var mainModel : GameObject;

private var useMecanim : boolean = false;
private var animator : Animator; //For Mecanim
private var ai : AIset;

function Start () {
	ai	=	GetComponent(AIset);
	mainModel = GetComponent(AIset).mainModel;
	GetComponent(CharacterMotor).enabled = false;
	useMecanim = GetComponent(AIset).useMecanim;
	if(!mainModel){
		mainModel = this.gameObject;
	}
	//-------Check for Mecanim Animator-----------
	if(useMecanim){
		animator = ai.animator;
		if(!animator){
			animator = mainModel.GetComponent(Animator);
		}
	}
}

function GetDestination() : Vector3{
        var destination : Vector3 = target.position;
        destination.y = transform.position.y;
        return destination;
}

function Update () {
	if(!target && GetComponent(AIset).followTarget){
		target = GetComponent(AIset).followTarget;
	}
	if(!target){
		return;
	}
	var controller : CharacterController = GetComponent(CharacterController);
	if(flying == 1){
		if(!useMecanim && flyDownAnimation){
        	//If using Legacy Animation
        	mainModel.GetComponent.<Animation>().CrossFade(flyDownAnimation.name, 0.2f);
        }else{
			animator.SetBool("flyDown" , true);
		}
		var direction : Vector3 = transform.TransformDirection(Vector3.down);
     	controller.Move(direction * flyingSpeed * Time.deltaTime);
		return;
	}
	if(flying == 2){
		if(!useMecanim && flyUpAnimation){
        	//If using Legacy Animation
        	mainModel.GetComponent.<Animation>().CrossFade(flyUpAnimation.name, 0.2f);
        }else{
			animator.SetBool("flyUp" , true);
		}
		direction = transform.TransformDirection(Vector3.up);
     	controller.Move(direction * flyingSpeed * Time.deltaTime);
     	
		if(transform.position.y >= currentHeight + flyUpHeight){
			ai.freeze = false;
			flying = 0;
			//onGround = false;
		}
		return;
	}
	
	distance = (transform.position - GetDestination()).magnitude;
	if (distance <= flyDownRange && !onGround) {
		FlyDown();
	}
	if (distance >= flyUpRange && onGround) {
		FlyUp();
	}

}

function FlyDown(){
	ai.freeze = true;
	flying = 1;
}

function FlyUp(){
	onGround = false;
	GetComponent(CharacterMotor).enabled = false;
	currentHeight = transform.position.y;
	ai.freeze = true;
	flying = 2;
}

function OnControllerColliderHit(hit: ControllerColliderHit){
	if(flying == 1){
		Landing();
	}
}

function Landing(){
	GetComponent(CharacterMotor).enabled = true;
	if(landingAnimation && !useMecanim){
		//For Legacy Animation
		mainModel.GetComponent.<Animation>().Play(landingAnimation.name);
	}else if(useMecanim){
		//For Mecanim Animation
		animator.Play(landingAnimation.name);
	}
	yield WaitForSeconds(landingDelay);
	ai.freeze = false;
	flying = 0;
	onGround = true;
}

@script RequireComponent (AIset)
