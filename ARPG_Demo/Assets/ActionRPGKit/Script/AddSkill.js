#pragma strict
var skillID : int = 1;

var learnType : progressType = progressType.Trigger;

function Start () {
	if(learnType == 0){
		var player : GameObject = GameObject.FindWithTag("Player");
		player.GetComponent(SkillWindow).AddSkill(skillID);
		Destroy(gameObject);
	}
}

function OnTriggerEnter (other : Collider) {
		//Pick up Item
	if (other.gameObject.tag == "Player") {
		if(learnType == 1){
			other.GetComponent(SkillWindow).AddSkill(skillID);
			Destroy (gameObject);
		}
 		
     }
 }