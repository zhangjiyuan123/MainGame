#pragma strict
var border : Texture2D;
var hpBar : Texture2D;
private var enemyName : String = "";
var duration : float = 7.0;
private var show : boolean = false;

var borderWidth : int = 200;
var borderHeigh : int = 26;
var hpBarHeight : int = 20;
var hpBarY : float = 28.0;
var barMultiply : float = 1.8;
private var hpBarWidth : float;

var textStyle : GUIStyle;

private var maxHp : int;
private var hp : int;
private var wait : float;
private var target : GameObject;

function Start () {
	hpBarWidth = 100 * barMultiply;
}

function Update () {
	 if(show){
	  	if(wait >= duration){
	       show = false;
	     }else{
	      	wait += Time.deltaTime;
	     }
	 
	 }
	 if(show && !target){
	 	hp = 0;
	 }else if(show && target){
	 	hp = target.GetComponent(Status).health;
	 }

}

function OnGUI () {
	if(show){
		var hpPercent : int = hp * 100 / maxHp *barMultiply;
		GUI.DrawTexture(Rect(Screen.width /2 - borderWidth /2 , 25 , borderWidth, borderHeigh), border);
    	GUI.DrawTexture(Rect(Screen.width /2 - hpBarWidth /2 , hpBarY , hpPercent, hpBarHeight), hpBar);
    	GUI.Label (Rect (Screen.width /2 - hpBarWidth /2 , hpBarY, hpBarWidth, hpBarHeight), enemyName , textStyle);
	
	}

}

function GetHP(mhealth : int , mon : GameObject , monName : String){
	maxHp = mhealth;
	target = mon;
	enemyName = monName;
	wait = 0;
	show = true;

}