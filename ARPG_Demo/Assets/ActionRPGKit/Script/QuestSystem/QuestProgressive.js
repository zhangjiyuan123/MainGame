#pragma strict
var questId : int = 1;
private var player : GameObject;

enum progressType{
	Auto = 0,
	Trigger = 1
}

var type : progressType = progressType.Auto;

function Start () {
	if(type == progressType.Auto){
		player = GameObject.FindWithTag("Player");
		//Increase the progress of the Quest ID
		//The Function will automatic check If player have this quest(ID) in the Quest Slot or not.
		var qstat : QuestStat = player.GetComponent(QuestStat);
		if(qstat){
			player.GetComponent(QuestStat).Progress(questId);
		}
		
	}

}

function OnTriggerEnter (other : Collider) {
    if(other.tag == "Player" && type == progressType.Trigger){
    	//Increase the progress of the Quest ID
		//The Function will automatic check If player have this quest(ID) in the Quest Slot or not.
    	var qstat : QuestStat = other.GetComponent(QuestStat);
		if(qstat){
			var c : boolean = other.GetComponent(QuestStat).Progress(questId);
			if(c){
				Destroy(gameObject);
			}
		}
    
    }

}