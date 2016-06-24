#pragma strict
var minimapCam : GameObject;
private var state : boolean = true;

function Update () {
	if(Input.GetKeyDown("m") && minimapCam){
			OnOffCamera();
	}

}

function OnOffCamera(){
	if(minimapCam.activeSelf == true){
			//minimapCam.active = false; 
			minimapCam.SetActive(false);
	}else{
			//minimapCam.active = true;
			minimapCam.SetActive(true);
	}
}