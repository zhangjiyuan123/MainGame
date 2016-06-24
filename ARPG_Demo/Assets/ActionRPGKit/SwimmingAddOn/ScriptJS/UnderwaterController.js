#pragma strict
private var motor : CharacterMotor;
var swimSpeed : float = 5.0;
private var mainModel : GameObject;
private var mainCam : GameObject;

//Animation
var swimIdle : AnimationClip;
var swimForward : AnimationClip;
var swimRight : AnimationClip;
var swimLeft : AnimationClip;
var swimBack : AnimationClip;

var animationSpeed : float = 1.0;
@HideInInspector
var surfaceExit : float = 0.0;

private var useMecanim : boolean = false;
private var animator : Animator;
private var moveHorizontalState : String = "horizontal";
private var moveVerticalState : String = "vertical";
private var jumpState : String = "jump";

function Start () {
	motor = GetComponent(CharacterMotor);
	useMecanim = GetComponent(AttackTrigger).useMecanim;
	
	mainModel = GetComponent(AttackTrigger).mainModel;
	if(!mainModel){
		mainModel = this.gameObject;
	}
	mainCam = GetComponent(AttackTrigger).Maincam.gameObject;
	if(!useMecanim){
		//If using Legacy Animation
		mainModel.GetComponent.<Animation>()[swimForward.name].speed = animationSpeed;
		mainModel.GetComponent.<Animation>()[swimRight.name].speed = animationSpeed;
		mainModel.GetComponent.<Animation>()[swimLeft.name].speed = animationSpeed;
		mainModel.GetComponent.<Animation>()[swimBack.name].speed = animationSpeed;
	}else{
		//If using Mecanim Animation
		animator = GetComponent(PlayerMecanimAnimation).animator;
		moveHorizontalState = GetComponent(PlayerMecanimAnimation).moveHorizontalState;
		moveVerticalState = GetComponent(PlayerMecanimAnimation).moveVerticalState;
		jumpState = GetComponent(PlayerMecanimAnimation).jumpState;
	}
	
}

function Update () {
	var stat : Status = GetComponent(Status);
	if(stat.freeze){
		motor.inputMoveDirection = Vector3(0,0,0);
		return;
	}
	if(Time.timeScale == 0.0){
        	return;
    }
    
    var controller : CharacterController = GetComponent(CharacterController);
	var swimUp : float;
	// Get the input vector from kayboard or analog stick
	if(Input.GetButton("Jump")){
		swimUp = 2.0f;
	}else{
		swimUp = 0.0f;
	}
	var directionVector : Vector3 = new Vector3(Input.GetAxis("Horizontal"), swimUp, Input.GetAxis("Vertical"));
	
	if (directionVector != Vector3.zero) {
		var directionLength : float = directionVector.magnitude;
		directionVector = directionVector / directionLength;

		directionLength = Mathf.Min(1, directionLength);
		directionLength = directionLength * directionLength;
		directionVector = directionVector * directionLength;
	}
	
	    if(Input.GetAxis("Vertical") != 0 && transform.position.y < surfaceExit ||  transform.position.y >= surfaceExit && Input.GetAxis("Vertical") > 0 && mainCam.transform.eulerAngles.x >= 25 && mainCam.transform.eulerAngles.x <= 180){
       		transform.rotation = mainCam.transform.rotation;
       }
	//motor.inputMoveDirection = transform.rotation * directionVector;
	controller.Move(transform.rotation * directionVector * swimSpeed * Time.deltaTime);
	
	    //-------------Animation----------------
	if(!useMecanim){
		//If using Legacy Animation
	    if (Input.GetAxis("Horizontal") > 0.1)
	      mainModel.GetComponent.<Animation>().CrossFade(swimRight.name);
	   else if (Input.GetAxis("Horizontal") < -0.1)
	      mainModel.GetComponent.<Animation>().CrossFade(swimLeft.name);
	   else if (Input.GetAxis("Vertical") > 0.1)
	      mainModel.GetComponent.<Animation>().CrossFade(swimForward.name);
	   else if (Input.GetAxis("Vertical") < -0.1)
	      mainModel.GetComponent.<Animation>().CrossFade(swimBack.name);
	   else
	      mainModel.GetComponent.<Animation>().CrossFade(swimIdle.name);
	      //----------------------------------------
    }else{
    	//If using Mecanim Animation
    	var h : float = Input.GetAxis("Horizontal");
		var v : float = Input.GetAxis("Vertical");
		animator.SetFloat(moveHorizontalState , h);
		animator.SetFloat(moveVerticalState , v);
    }
    
    //-------------------------------------------
}

function MecanimEnterWater(){
	useMecanim = GetComponent(AttackTrigger).useMecanim;
	animator = GetComponent(PlayerMecanimAnimation).animator;
	animator.SetBool(jumpState , false);
	animator.SetBool("swimming" , true);
	animator.Play(swimIdle.name);
}
function MecanimExitWater(){
	animator.SetBool("swimming" , false);
	animator.SetBool(jumpState , true);
	animator.Play(jumpState);
}


@script RequireComponent (PlayerInputController)