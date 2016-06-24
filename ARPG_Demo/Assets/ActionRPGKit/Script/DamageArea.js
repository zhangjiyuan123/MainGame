#pragma strict
var damage : int = 50;

function OnTriggerEnter (other : Collider) {
		if (other.gameObject.tag == "Player") {
			other.GetComponent(Status).OnDamage(damage , 0);
		}
 }