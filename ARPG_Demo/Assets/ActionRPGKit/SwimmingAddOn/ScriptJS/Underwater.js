#pragma strict
//This script enables underwater effects. Attach to your Water GameObject
//The player must have UnderwaterController script attached
 
//Define variables
var surface : GameObject;
var surfaceEnterPlus : float = 0.4f;
var surfaceExitPlus : float = 0.95f;
var fogDensity : float = 0.04f;
var fogColor : Color = Color (0, 0.4, 0.7, 0.6);
var divingTime : float = 1.0f;
var hitEffect : GameObject;
 
//Underwater Fog Setting
private var defaultFog : boolean;
private var defaultFogColor : Color;
private var defaultFogDensity : float;
private var defaultLightColor : Color;
private var defaultLightIntensity : float;

//Underwater Light Setting
var mainLight : GameObject;
var underWaterLightColor : Color = Color (0, 0.4, 0.7, 0.6);
var underWaterIntensity : float = 0.5;
var cannotAttack : boolean = true;

private var onEnter : boolean = false;
private var onUnderwater : boolean = false;

private var mainCam : GameObject;
private var player : GameObject;
private var jumping : boolean = false;
 
function Start () {
	if(!mainCam){
		mainCam = GameObject.FindWithTag ("MainCamera");	//Finding your Main Camera
	}
	if(!surface){
		surface = this.gameObject;
	}
	defaultFog = RenderSettings.fog;
	defaultFogColor = RenderSettings.fogColor;
	defaultFogDensity = RenderSettings.fogDensity;
	if(mainLight){
		defaultLightColor = mainLight.GetComponent(Light).color;
		defaultLightIntensity = mainLight.GetComponent(Light).intensity;
	}
}
 
function Update () {
	if(!mainCam){
		mainCam = GameObject.FindWithTag ("MainCamera");
	}
	//Check if Main Camera is lower than water surface.
	if (mainCam.transform.position.y < surface.transform.position.y) {
		RenderSettings.fog = true;
		RenderSettings.fogColor = fogColor;
		RenderSettings.fogDensity = fogDensity;
		if(mainLight){
			mainLight.GetComponent(Light).color = underWaterLightColor;
			mainLight.GetComponent(Light).intensity = underWaterIntensity;
		}
	}else {
		RenderSettings.fog = defaultFog;
		RenderSettings.fogColor = defaultFogColor;
		RenderSettings.fogDensity = defaultFogDensity;
		if(mainLight){
			mainLight.GetComponent(Light).color = defaultLightColor;
			mainLight.GetComponent(Light).intensity = defaultLightIntensity;
		}
	}
	//------------------------------------------------------------------
	if(!player){
		player = GameObject.FindWithTag ("Player");
		return;
	}
	if(jumping && player){
		player.GetComponent(CharacterController).Move(Vector3.up * 6 * Time.deltaTime);
	}
	//Check if Player is lower than water surface.
	if (player.transform.position.y < surface.transform.position.y - surfaceEnterPlus && !onUnderwater) {
		if(hitEffect){
			Instantiate(hitEffect, player.transform.position , player.transform.rotation);
		}
		ActivateWaterController();
	}else if(onUnderwater && player.transform.position.y > surface.transform.position.y - surfaceExitPlus){
		ActivateGroundController();
	}
}
 
 function ActivateWaterController(){
 		if(onEnter){
 			return;
 		}
 		if(player.GetComponent(UnderwaterController)){
 				onEnter = true;
 				yield WaitForSeconds(divingTime);
	 			player.GetComponent(PlayerInputController).enabled = false;
				player.GetComponent(CharacterMotor).enabled = false;
				player.GetComponent(UnderwaterController).enabled = true;
				
				if(player.GetComponent(PlayerAnimation)){
	 				//If using Legacy Animation
	 				player.GetComponent(PlayerAnimation).enabled = false;
	 			}else{
	 				//If using Mecanim Animation
	 				player.GetComponent(PlayerMecanimAnimation).enabled = false;
	 				player.GetComponent(UnderwaterController).MecanimEnterWater();
	 			}
	 			
				player.GetComponent(UnderwaterController).surfaceExit = surface.transform.position.y - surfaceExitPlus - 0.7;
				if(cannotAttack){
					player.GetComponent(AttackTrigger).freeze = true;
				}
				onEnter = false;
				
 		}
 		onUnderwater = true;
}

function ActivateGroundController(){
		if(onEnter){
 			return;
 		}
 		if(player.GetComponent(UnderwaterController) && player.GetComponent(UnderwaterController).enabled == true){
 				onEnter = true;
 				jumping = true;
 				yield WaitForSeconds(0.2);
 				jumping = false;
	 			player.GetComponent(PlayerInputController).enabled = true;
	 			if(player.GetComponent(PlayerAnimation)){
	 				//If using Legacy Animation
	 				player.GetComponent(PlayerAnimation).enabled = true;
	 			}else{
	 				//If using Mecanim Animation
	 				player.GetComponent(PlayerMecanimAnimation).enabled = true;
	 				player.GetComponent(UnderwaterController).MecanimExitWater();
	 			}
				player.GetComponent(CharacterMotor).enabled = true;
				player.GetComponent(UnderwaterController).enabled = false;
				player.GetComponent(AttackTrigger).freeze = false;
				onEnter = false;
				
 		}
 		onUnderwater = false;
}

