#pragma strict
var mainGate : GameObject;
var button : Texture2D;
//var characterCG : Texture2D;
var textWindow : Texture2D;
var text : String = "Text Here";
var text2 : String = "Text Here";
var key : int = 0;
var moveX : float = 0.0;
var moveY : float  = 5.0;
var moveZ : float  = 0.0;

var duration : float = 1.0;

private var move : boolean = false;
private var talking : boolean = false;
private var enter : boolean = false;
private var complete : boolean = false;
private var wait : float = 0;

var textStyle : GUIStyle;

function Update () {
	if(move){
		mainGate.transform.Translate(moveX*Time.deltaTime, moveY*Time.deltaTime, moveZ*Time.deltaTime);
		if(wait >= duration){
				move = false;
				complete = true;
		}
	}
	
	if(Input.GetButtonDown("Fire1") && talking){
		talking = false;
		Time.timeScale = 1.0;
	}
	
	if(Input.GetKeyDown("e") && enter){
		if(talking){
			talking = false;
			Time.timeScale = 1.0;
		}else{
			if(key >= 2){
				wait += Time.deltaTime;
				move = true;
			}else{
				talking = true;
			}
		}
	}
	
			
}

function OnTriggerEnter (other : Collider) {
	if (other.gameObject.tag == "Player") {
		enter = true;
		talking = false;
	}
}

function OnTriggerExit  (other : Collider) {
	if (other.gameObject.tag == "Player") {
		enter = false;
		talking = false;
	}
}

function OnTriggerStay (other : Collider) {
	if (other.gameObject.tag == "Player") {
		if(complete){
			return;
		}	
	}
		
}

function OnGUI(){
	if(enter && !talking && !complete){
		GUI.DrawTexture(Rect(Screen.width / 2 - 130, Screen.height - 120, 260, 80), button);
	}
	if(talking){
		//GUI.DrawTexture(Rect(Screen.width - 385, Screen.height - 590, 385, 590), characterCG);
		GUI.DrawTexture(Rect(32, Screen.height - 245, 564, 220), textWindow);
		GUI.Label (Rect (55, Screen.height - 220, 500, 200), text , textStyle);
		GUI.Label (Rect (55, Screen.height - 185, 500, 200), text2 , textStyle);
	}
}