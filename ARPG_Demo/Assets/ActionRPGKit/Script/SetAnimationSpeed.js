#pragma strict
//For Legacy
var model : GameObject;
var animations : AnimationClip[] = new AnimationClip[1];
var speed : float = 1.5;

function Start () {
	if(!model){
		print("Please assign the model");
		return;
	}
	for(var i : int = 0; i < animations.Length; i++){
		model.GetComponent.<Animation>()[animations[i].name].speed = speed;
	}
}
