#pragma strict
var rotateX : float = 0.0;
var rotateY : float = 5.0;
var rotateZ : float = 0.0;

function Update () {
	transform.Rotate(rotateX*Time.deltaTime,rotateY*Time.deltaTime,rotateZ*Time.deltaTime);
}