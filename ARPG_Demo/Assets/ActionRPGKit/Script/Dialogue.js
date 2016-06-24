#pragma strict
class TextDialogue{
	var textLine1 : String = "";
	var textLine2 : String = "";
	var textLine3 : String = "";
	var textLine4 : String = "";
}
var message : TextDialogue[] = new TextDialogue[1];

var button : Texture2D;
var textWindow : Texture2D;
@HideInInspector
var enter : boolean = false;
private var showGui : boolean = false;
@HideInInspector
var s : int = 0;
@HideInInspector
var player : GameObject;

@HideInInspector
var talkFinish : boolean = false;

var sendMessageWhenDone : String = "";

var textStyle : GUIStyle;
//-------------------------
private var str : String[] = new String[4];
private var line : int = 0;

private var wait : float = 0;
var delay : float = 0.05;
private var begin : boolean = false;
private var i: int = 0;
private var wordComplete : String[] = new String[4];
var freezeTime : boolean = true;

function Update () {
	if(Input.GetKeyDown("e") && enter){
		NextPage();
	}
	if(begin){
	  	if(wait >= delay){
	  		if(wordComplete[line].Length > 0)
	  			str[line] += wordComplete[line][i++];
	        wait = 0;
	        if(i >= wordComplete[line].Length && line > 2){
	        	begin = false;
	        }else if(i >= wordComplete[line].Length){
	        	i = 0;
	        	line++;
	        }
	     }else{
	      	//wait += Time.deltaTime;
	      	wait += Time.unscaledDeltaTime;
	     }
	 
	 }

}

function AnimateText(strComplete : String , strComplete2 : String , strComplete3 : String , strComplete4 : String){
	begin = false;
	i = 0;
	str[0] = "";
	str[1] = "";
	str[2] = "";
	str[3] = "";
	line = 0;
	wordComplete[0] = strComplete;
	wordComplete[1] = strComplete2;
	wordComplete[2] = strComplete3;
	wordComplete[3] = strComplete4;
	begin = true;
}

function OnTriggerEnter (other : Collider) {
	if(other.tag == "Player"){
		s = 0;
		talkFinish = false;
		player = other.gameObject;
		enter = true;
	}

}

function OnTriggerExit (other : Collider) {
	if(other.tag == "Player"){
		s = 0;
		enter = false;
		CloseTalk();
	}

}

function CloseTalk(){
		showGui = false;
		Time.timeScale = 1.0;
		Screen.lockCursor = true;
		s = 0;

}

function NextPage(){
	if(!enter){
		return;
	}
	if(begin){
		str[0] = wordComplete[0];
		str[1] = wordComplete[1];
		str[2] = wordComplete[2];
		str[3] = wordComplete[3];
		begin = false;
		return;
	}
	s++;
	if(s > message.Length){
		showGui = false;
		talkFinish = true;
		CloseTalk();
		if(sendMessageWhenDone != ""){
			gameObject.SendMessage(sendMessageWhenDone);
		}
	}else{
		if(freezeTime){
			Time.timeScale = 0.0;
		}
		talkFinish = false;
		Screen.lockCursor = false;
		showGui = true;
		AnimateText(message[s-1].textLine1 , message[s-1].textLine2 , message[s-1].textLine3 , message[s-1].textLine4);
	}
}

function OnGUI(){
	if(!player){
		return;
	}
	if(enter && !showGui){
		//GUI.DrawTexture(Rect(Screen.width / 2 - 130, Screen.height - 120, 260, 80), button);
		if (GUI.Button (Rect(Screen.width / 2 - 130, Screen.height - 180, 260, 80), button)){
			NextPage();
		}
	}
	
	if(showGui && s <= message.Length){
		GUI.DrawTexture(Rect(Screen.width /2 - 308, Screen.height - 255, 615, 220), textWindow);
		GUI.Label (Rect (Screen.width /2 - 263, Screen.height - 220, 500, 200), str[0] , textStyle);
		GUI.Label (Rect (Screen.width /2 - 263, Screen.height - 190, 500, 200), str[1] , textStyle);
		GUI.Label (Rect (Screen.width /2 - 263, Screen.height - 160, 500, 200), str[2] , textStyle);
		GUI.Label (Rect (Screen.width /2 - 263, Screen.height - 130, 500, 200), str[3] , textStyle);
		if (GUI.Button (Rect (Screen.width /2 + 150,Screen.height - 100,140,60), "Next")) {
			NextPage();
		}
	}

}