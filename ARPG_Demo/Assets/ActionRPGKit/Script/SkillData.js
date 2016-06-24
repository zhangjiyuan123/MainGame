#pragma strict

class Skil {
		var skillName : String = "";
		var icon : Texture2D;
		var skillPrefab : Transform;
		var skillAnimation : AnimationClip;
		var manaCost : int = 10;
		var description : String = "";
}

var skill : Skil[] = new Skil[3];