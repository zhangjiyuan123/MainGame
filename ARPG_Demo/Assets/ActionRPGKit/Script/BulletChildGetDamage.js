#pragma strict
var master : GameObject;

function Start () {
	GetComponent(BulletStatus).totalDamage = master.GetComponent(BulletStatus).totalDamage;
	GetComponent(BulletStatus).shooterTag = master.GetComponent(BulletStatus).shooterTag;
	
}
