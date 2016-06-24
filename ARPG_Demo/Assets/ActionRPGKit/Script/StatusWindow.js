#pragma strict
private var show : boolean = false;
var textStyle : GUIStyle;
var textStyle2 : GUIStyle;

//Icon for Buffs
var braveIcon : Texture2D;
var barrierIcon : Texture2D;
var faithIcon : Texture2D;
var magicBarrierIcon : Texture2D;

var skin : GUISkin;
var windowRect : Rect = new Rect (180, 170, 240, 320);
private var originalRect : Rect;

function Start(){
	originalRect = windowRect;
}

function Update () {
	if(Input.GetKeyDown("c")){
		OnOffMenu();
	}
}

function  OnGUI (){
		GUI.skin = skin;
		var stat : Status = GetComponent(Status);
		if(show){
			windowRect = GUI.Window (0, windowRect, StatWindow, "Status");
			
		}
		
		//Show Buffs Icon
		if(stat.brave){
			GUI.DrawTexture(new Rect(30,200,60,60), braveIcon);
		}
		if(stat.barrier){
			GUI.DrawTexture(new Rect(30,260,60,60), barrierIcon);
		}
		if(stat.faith){
			GUI.DrawTexture(new Rect(30,320,60,60), faithIcon);
		}
		if(stat.mbarrier){
			GUI.DrawTexture(new Rect(30,380,60,60), magicBarrierIcon);
		}
	}
	
function StatWindow(windowID : int){
			var stat : Status = GetComponent(Status);
			//GUI.Box ( new Rect(180,170,240,380), "Status");
			GUI.Label ( new Rect(20, 40, 100, 50), "Level" , textStyle);
			GUI.Label ( new Rect(20, 70, 100, 50), "STR" , textStyle);
			GUI.Label ( new Rect(20, 100, 100, 50), "DEF" , textStyle);
			GUI.Label ( new Rect(20, 130, 100, 50), "MATK" , textStyle);
			GUI.Label ( new Rect(20, 160, 100, 50), "MDEF" , textStyle);
			
			GUI.Label ( new Rect(20, 220, 100, 50), "EXP" , textStyle);
			GUI.Label ( new Rect(20, 250, 100, 50), "Next LV" , textStyle);
			GUI.Label ( new Rect(20, 280, 120, 50), "Status Point" , textStyle);
			//Close Window Button
			if (GUI.Button ( new Rect(200,5,30,30), "X")) {
				OnOffMenu();
			}
			//Status
			var lv : int = stat.level;
			var atk : int = stat.atk;
			var def : int = stat.def;
			var matk : int = stat.matk;
			var mdef : int = stat.mdef;
			var exp : int = stat.exp;
			var next : int = stat.maxExp - exp;
			var stPoint : int = stat.statusPoint;
			
			GUI.Label ( new Rect(30, 40, 100, 50), lv.ToString() , textStyle2);
			GUI.Label ( new Rect(70, 70, 100, 50), atk.ToString() , textStyle2);
			GUI.Label ( new Rect(70, 100, 100, 50), def.ToString() , textStyle2);
			GUI.Label ( new Rect(70, 130, 100, 50), matk.ToString() , textStyle2);
			GUI.Label ( new Rect(70, 160, 100, 50), mdef.ToString() , textStyle2);
			
			GUI.Label ( new Rect(95, 220, 100, 50), exp.ToString() , textStyle2);
			GUI.Label ( new Rect(95, 250, 100, 50), next.ToString() , textStyle2);
			GUI.Label ( new Rect(95, 280, 100, 50), stPoint.ToString() , textStyle2);
			
			if(stPoint > 0){
				if (GUI.Button ( new Rect(200,70,25,25), "+") && stPoint > 0) {
					GetComponent(Status).atk += 1;
					GetComponent(Status).statusPoint -= 1;
					GetComponent(Status).CalculateStatus();
				}
				if (GUI.Button ( new Rect(200,100,25,25), "+") && stPoint > 0) {
					GetComponent(Status).def += 1;
					GetComponent(Status).maxHealth += 5;
					GetComponent(Status).statusPoint -= 1;
					GetComponent(Status).CalculateStatus();
				}
				if (GUI.Button ( new Rect(200,130,25,25), "+") && stPoint > 0) {
					GetComponent(Status).matk += 1;
					GetComponent(Status).maxMana += 3;
					GetComponent(Status).statusPoint -= 1;
					GetComponent(Status).CalculateStatus();
				}
				if (GUI.Button ( new Rect(200,160,25,25), "+") && stPoint > 0) {
					GetComponent(Status).mdef += 1;
					GetComponent(Status).statusPoint -= 1;
					GetComponent(Status).CalculateStatus();
				}
			}
			GUI.DragWindow (new Rect (0,0,10000,10000)); 
}

function OnOffMenu(){
	//Freeze Time Scale to 0 if Status Window is Showing
	if(!show && Time.timeScale != 0.0){
			show = true;
			Time.timeScale = 0.0;
			ResetPosition();
			Screen.lockCursor = false;
			//Cursor.lockState
			//Cursor.visible
	}else if(show){
			show = false;
			Time.timeScale = 1.0;
			Screen.lockCursor = true;
	}
}

function ResetPosition(){
		//Reset GUI Position when it out of Screen.
		if(windowRect.x >= Screen.width -30 || windowRect.y >= Screen.height -30 || windowRect.x <= -70 || windowRect.y <= -70 ){
			windowRect = originalRect;
		}
		
}

@script RequireComponent (Status)