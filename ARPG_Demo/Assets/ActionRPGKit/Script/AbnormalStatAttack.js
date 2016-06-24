#pragma strict
enum AbStat{
	Poison = 0,
	Silence = 1,
	Stun = 2,
	WebbedUp = 3,
}

var inflictStatus : AbStat = AbStat.Poison;

var chance : int = 100;
var statusDuration : float = 5.5;

private var shooterTag : String = "Player";

function Start () {
		shooterTag = GetComponent(BulletStatus).shooterTag;
}


function OnTriggerEnter (other : Collider) {  	
    //When Player Shoot at Enemy		   
    if(shooterTag == "Player" && other.tag == "Enemy"){
    	InflictAbnormalStats(other.gameObject);
		//When Enemy Shoot at Player
    }else if(shooterTag == "Enemy" && other.tag == "Player"){  	
		InflictAbnormalStats(other.gameObject);
    }
}

function InflictAbnormalStats(target : GameObject){
	if(chance > 0){
		var ran = Random.Range(0,100);
		if(ran <= chance){
			//Call Function ApplyAbnormalStat in Status Script
			target.GetComponent(Status).ApplyAbnormalStat(parseInt(inflictStatus) ,statusDuration);
		}
	}

}

@script RequireComponent(BulletStatus)