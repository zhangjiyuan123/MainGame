#pragma strict
var Speed : float = 20;
var relativeDirection = Vector3.forward;
var duration : float = 1.0;
var shooterTag : String = "Player";
var hitEffect : GameObject;

function Start () {
	hitEffect = GetComponent(BulletStatus).hitEffect;
	GetComponent(Rigidbody).isKinematic = true;
	Destroy();
}


function Update () {
	
	var absoluteDirection : Vector3 = transform.rotation * relativeDirection;
    transform.position += absoluteDirection *Speed* Time.deltaTime;


}

function Destroy(){
	Destroy (gameObject, duration);

}


function OnTriggerEnter (other : Collider) {

  if (other.gameObject.tag == "Wall") {
		if(hitEffect){
			Instantiate(hitEffect, transform.position , transform.rotation);
		}
    	Destroy (gameObject);
    	
	}
}

@script RequireComponent(BulletStatus)
@script RequireComponent(Rigidbody)
@script AddComponentMenu ("Action-RPG Kit/Create Bullet")
