#pragma strict
var delay : float = 2.0;
var duration : float = 8.0;
private var show : boolean = false;

var text : String = "Text Here";
var textStyle : GUIStyle;

function Start () {
		yield WaitForSeconds(delay);
		show = true;
		yield WaitForSeconds(duration);
		show = false;
}


function OnGUI(){
	if(show){
		GUI.Label (Rect (Screen.width /2 -250, Screen.height /2 - 100, 500, 200), text , textStyle);
	}
}