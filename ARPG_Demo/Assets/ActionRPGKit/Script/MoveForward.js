#pragma strict
var Speed : float = 20;
var relativeDirection = Vector3.forward;
var duration : float = 1.0;

function Start () {
		Destroy (gameObject, duration);
}

function Update () {
	var absoluteDirection : Vector3 = transform.rotation * relativeDirection;
    transform.position += absoluteDirection *Speed* Time.deltaTime;

}
