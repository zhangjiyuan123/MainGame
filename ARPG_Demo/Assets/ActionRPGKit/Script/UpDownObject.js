#pragma strict
var moveX : float = 0.0;
var moveY : float = 5.0;
var moveZ : float = 0.0;
private var wait : float = 0;
var duration : float = 1.0;

function Update () {
	
	transform.Translate(moveX*Time.deltaTime, moveY*Time.deltaTime, moveZ*Time.deltaTime);
	if(wait >= duration){
     moveX *= -1;
     moveY *= -1;
     moveZ *= -1;
      wait = 0;
      
   }else wait += Time.deltaTime;

}