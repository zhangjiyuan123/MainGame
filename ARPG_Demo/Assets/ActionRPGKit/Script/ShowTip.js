#pragma strict
var tip : Texture2D;
private var show : boolean = true;

function Update () {
		if(Input.GetKeyDown("h")){
			if(show){
				show = false;
			}else{
				show = true;
			}
		}

}

function OnGUI () {
	if(show){
			GUI.DrawTexture(Rect(Screen.width -300,235,300,255), tip);
	}
}