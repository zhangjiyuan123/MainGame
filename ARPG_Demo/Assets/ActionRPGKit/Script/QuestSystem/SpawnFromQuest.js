#pragma strict
var questId : int = 1;
var spawnObject : GameObject;
var progressAbove : int = 0;	//Will spawn your spawnPrefab if your progression of the quest greater than this.
var progressBelow : int = 9999;	//Will spawn your spawnPrefab if your progression of the quest lower than this.
private var player : GameObject;

enum SpawmQType{
	Instantiate = 0,
	Active = 1,
	Deactivate = 2,
	Destroy = 3
}

var by : SpawmQType = SpawmQType.Instantiate;

function Start () {
	CheckCondition();
}

function CheckCondition(){
	if(by == SpawmQType.Instantiate){
		Spawn();
	}
	if(by == SpawmQType.Active){
		Activate();
	}
	if(by == SpawmQType.Deactivate){
		Deactivate();
	}
	if(by == SpawmQType.Destroy){
		DeleteObj();
	}
}

function Spawn(){
		player = GameObject.FindWithTag("Player");
		//The Function will automatic check If player have this quest(ID) in the Quest Slot or not.
		if(player){
			var qstat : QuestStat = player.GetComponent(QuestStat);
			if(qstat){
				var letSpawn : boolean = player.GetComponent(QuestStat).CheckQuestSlot(questId);
				var checkProgress : int = player.GetComponent(QuestStat).CheckQuestProgress(questId);
				
				if(letSpawn && checkProgress >= progressAbove && checkProgress < progressBelow){
					//Spawn your spawnObject if player have this quest in the quest slot.
					var m : GameObject = Instantiate(spawnObject , transform.position , transform.rotation);
					m.name = spawnObject.name;
				}
			}
		}
}

function Activate(){
	player = GameObject.FindWithTag("Player");
		//The Function will automatic check If player have this quest(ID) in the Quest Slot or not.
		if(player){
			var qstat : QuestStat = player.GetComponent(QuestStat);
			if(qstat){
				var letSpawn : boolean = player.GetComponent(QuestStat).CheckQuestSlot(questId);
				var checkProgress : int = player.GetComponent(QuestStat).CheckQuestProgress(questId);
				
				if(letSpawn && checkProgress >= progressAbove && checkProgress < progressBelow){
					//Active your spawnPrefab if player have this quest in the quest slot.
					spawnObject.SetActive(true);
				}
			}
		}
}

function Deactivate(){
	player = GameObject.FindWithTag("Player");
		//The Function will automatic check If player have this quest(ID) in the Quest Slot or not.
		if(player){
			var qstat : QuestStat = player.GetComponent(QuestStat);
			if(qstat){
				var letSpawn : boolean = player.GetComponent(QuestStat).CheckQuestSlot(questId);
				var checkProgress : int = player.GetComponent(QuestStat).CheckQuestProgress(questId);
				
				if(letSpawn && checkProgress >= progressAbove && checkProgress < progressBelow){
					//Deactivate your spawnPrefab if player have this quest in the quest slot.
					spawnObject.SetActive(false);
				}
			}
		}
}

function DeleteObj(){
	player = GameObject.FindWithTag("Player");
		//The Function will automatic check If player have this quest(ID) in the Quest Slot or not.
		if(player){
			var qstat : QuestStat = player.GetComponent(QuestStat);
			if(qstat){
				var letSpawn : boolean = player.GetComponent(QuestStat).CheckQuestSlot(questId);
				var checkProgress : int = player.GetComponent(QuestStat).CheckQuestProgress(questId);
				
				if(letSpawn && checkProgress >= progressAbove && checkProgress < progressBelow){
					//Destroy your spawnPrefab if player have this quest in the quest slot.
					Destroy(spawnObject);
				}
			}
		}
}
