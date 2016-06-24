#pragma strict
private var player : GameObject;

function Update () {
		if(!player){
				player = GameObject.FindWithTag("Player");
				if(player){
					Physics.IgnoreCollision(player.GetComponent.<Collider>(), GetComponent.<Collider>());
				}
		}
}