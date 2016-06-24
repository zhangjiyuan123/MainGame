#pragma strict
var expGain : int = 20;
var player : GameObject;
function Start () {
	if(!player){
    	player = GameObject.FindWithTag ("Player");
    }
    player.GetComponent(Status).gainEXP(expGain);
}