#pragma strict
var targetHeightNormal : float = 1.6f;
var targetHeightRayCast : float = 1.2f;
	
function Update () {
	if(Input.GetKeyDown("p")){
		SwitchMode();
	}
}

function SwitchMode(){
	var atkTrigger : AttackTrigger = GetComponent(AttackTrigger);
	if(atkTrigger.aimingType == AimType.Normal){
			atkTrigger.aimingType = AimType.Raycast;
			if(atkTrigger.cameraZoomPoint){
				atkTrigger.Maincam.GetComponent(ARPGcamera).target = atkTrigger.cameraZoomPoint;
			}
			atkTrigger.Maincam.GetComponent(ARPGcamera).targetHeight = targetHeightRayCast;
			atkTrigger.Maincam.GetComponent(ARPGcamera).lockOn = true;
	}else{
			atkTrigger.aimingType = AimType.Normal;
			atkTrigger.Maincam.GetComponent(ARPGcamera).target = this.transform;
			atkTrigger.Maincam.GetComponent(ARPGcamera).targetHeight = targetHeightNormal;
			atkTrigger.Maincam.GetComponent(ARPGcamera).lockOn = false;
	}
}