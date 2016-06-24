#pragma strict
var target : Transform;
var zoomMin : float = 20;
var zoomMax : float = 70;

function Start () {
	if(!target){
		yield WaitForSeconds(0.1);
    	target = GameObject.FindWithTag ("Player").transform;
    }

}

function Update () {
	if(!target){
    	return;
    }
  	transform.position = new Vector3(target.position.x ,transform.position.y ,target.position.z);
  	
  	if(Input.GetKeyDown(KeyCode.KeypadPlus) && GetComponent.<Camera>().orthographicSize >= zoomMin){
  		GetComponent.<Camera>().orthographic = true;
		GetComponent.<Camera>().orthographicSize -= 10;
  	}
  	if(Input.GetKeyDown(KeyCode.KeypadMinus) && GetComponent.<Camera>().orthographicSize <= zoomMax){
  		GetComponent.<Camera>().orthographic = true;
		GetComponent.<Camera>().orthographicSize += 10;
  	}
}

function FindTarget(){
	if(target){
		return;
	}
	var newTarget : Transform = GameObject.FindWithTag ("Player").transform;
	if(newTarget){
			target = newTarget;
	}
}