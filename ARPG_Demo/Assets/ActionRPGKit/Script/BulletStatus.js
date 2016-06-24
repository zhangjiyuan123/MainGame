#pragma strict
var damage : int = 10;
var damageMax : int = 20;

private var playerAttack : int = 5;
var totalDamage : int = 0;
var variance : int = 15;
var shooterTag : String = "Player";
@HideInInspector
var shooter : GameObject;

var Popup : Transform;

var hitEffect : GameObject;
var flinch : boolean = false;
var penetrate : boolean = false;
private var popDamage : String = "";

enum AtkType {
	Physic = 0,
	Magic = 1,
}

var AttackType : AtkType = AtkType.Physic;

enum Elementala{
	Normal = 0,
	Fire = 1,
	Ice = 2,
	Earth = 3,
	Lightning = 4,
}
var element : Elementala = Elementala.Normal;

function Start(){
	if(variance >= 100){
		variance = 100;
	}
	if(variance <= 1){
		variance = 1;
	}

}

function Setting(str : int , mag : int , tag : String , owner : GameObject){
	if(AttackType == AtkType.Physic){
		playerAttack = str;
	}else{
		playerAttack = mag;
	}
	shooterTag = tag;
	shooter = owner;
	var varMin : int = 100 - variance;
	var varMax : int = 100 + variance;
	var randomDmg : int = Random.Range(damage, damageMax);
	totalDamage = (randomDmg + playerAttack) * Random.Range(varMin ,varMax) / 100;
}

function OnTriggerEnter (other : Collider) {  	
    //When Player Shoot at Enemy		   
    if(shooterTag == "Player" && other.tag == "Enemy"){
    	var dmgPop : Transform = Instantiate(Popup, other.transform.position , transform.rotation);
    	
		if(AttackType == AtkType.Physic){
			popDamage = other.GetComponent(Status).OnDamage(totalDamage , parseInt(element));
		}else{
			popDamage = other.GetComponent(Status).OnMagicDamage(totalDamage , parseInt(element));
		}
		if(shooter && shooter.GetComponent(ShowEnemyHealth)){
    		shooter.GetComponent(ShowEnemyHealth).GetHP(other.GetComponent(Status).maxHealth , other.gameObject , other.name);
    	}
		dmgPop.GetComponent(DamagePopup).damage = popDamage;	
		
		if(hitEffect){
    		var clone1 : GameObject = Instantiate(hitEffect, transform.position , transform.rotation);
 		  }
 		 if(flinch){
 		 	var dir : Vector3 = (other.transform.position - transform.position).normalized;
 		 	//other.GetComponent(AIset).Flinch(dir);
 		 	other.SendMessage("Flinch" , dir , SendMessageOptions.DontRequireReceiver);
 		 }
		if(!penetrate){
 		 	 Destroy (gameObject);
 		 }
		//When Enemy Shoot at Player
    }else if(shooterTag == "Enemy" && other.tag == "Player" || shooterTag == "Enemy" && other.tag == "Ally"){  	
        if(AttackType == AtkType.Physic){
			popDamage = other.GetComponent(Status).OnDamage(totalDamage , parseInt(element));
		}else{
			popDamage = other.GetComponent(Status).OnMagicDamage(totalDamage , parseInt(element));
		}
		dmgPop = Instantiate(Popup, transform.position , transform.rotation);
		dmgPop.GetComponent(DamagePopup).damage = popDamage;
  		  
  		  if(hitEffect){
    		clone1 = Instantiate(hitEffect, transform.position , transform.rotation);
 		  }
 		  if(flinch){
 		    dir = (other.transform.position - transform.position).normalized;
 		 	//other.GetComponent(AttackTrigger).Flinch(dir);
 		 	other.SendMessage("Flinch" , dir , SendMessageOptions.DontRequireReceiver);
 		 }
 		 if(!penetrate){
 		 	 Destroy (gameObject);
 		 }
    }
}