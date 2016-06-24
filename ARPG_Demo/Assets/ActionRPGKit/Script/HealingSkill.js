#pragma strict
var hpRestore : int = 0;
var variance : int = 15;
var Popup : Transform;

enum buff{
		None = 0,
		Barrier = 1,
		MagicBarrier = 2,
		Brave = 3,
		Faith = 4
}
var buffs : buff = buff.None;
var statusAmount : int = 0;
var statusDuration : float = 5.5;

var shooterTag : String = "Player";
var hitEffect : GameObject;
private var target : GameObject;

function Start () {
			target = GetComponent(BulletStatus).shooter;
			ApplyEffect();
}

function ApplyEffect(){
		if(hpRestore > 0){
			if(variance >= 100){
				variance = 100;
			}
			if(variance <= 1){
				variance = 1;
			}
			var varMin : int = 100 - variance;
			var varMax : int = 100 + variance;
			hpRestore = hpRestore * Random.Range(varMin ,varMax) / 100;
	
			target.GetComponent(Status).Heal(hpRestore , 0);
			//Healing PopUp
			var popAmount : Transform = Instantiate(Popup, target.transform.position , transform.rotation);
			popAmount.GetComponent(DamagePopup).damage = hpRestore.ToString();
		}
		if(hitEffect){
    		Instantiate(hitEffect, target.transform.position , hitEffect.transform.rotation);
 		}
		
			//Call Function ApplyBuff in Status Script
			if(buffs != buff.None){
				target.GetComponent(Status).ApplyBuff(parseInt(buffs) ,statusDuration , statusAmount);
			}
			Destroy(gameObject);
}

@script RequireComponent(BulletStatus)