#pragma strict
//This Script use for multiple quests in 1 NPC
var questClients : GameObject[] = new GameObject[2];
var questStep : int = 0;
private var enter : boolean = false;
var button : Texture2D;
private var player : GameObject;
private var questData : GameObject;

function Start () {

}

function Update () {
		if(Input.GetKeyDown("e") && enter){
				var q : boolean = questClients[questStep].GetComponent(QuestClient).ActivateQuest(player);
				if(q && questStep < questClients.Length){
					questClients[questStep].GetComponent(QuestClient).enter = false; //Reset Enter Variable of last client
					questStep++;
					if(questStep >= questClients.Length){
						questStep = questClients.Length -1;
						return;
					}
					questClients[questStep].GetComponent(QuestClient).s = 0;
					enter = true;
					questClients[questStep].GetComponent(QuestClient).enter = true;
				}
		}
}

function OnGUI(){
	if(!player){
		return;
	}
	if(enter){
		GUI.DrawTexture(Rect(Screen.width / 2 - 130, Screen.height - 120, 260, 80), button);
	}
}

function OnTriggerEnter (other : Collider) {
	if(other.tag == "Player"){
		player = other.gameObject;
		CheckQuestSequence();
			
		questClients[questStep].GetComponent(QuestClient).s = 0;
		enter = true;
		questClients[questStep].GetComponent(QuestClient).enter = true;
	}

}

function OnTriggerExit (other : Collider) {
	if(other.tag == "Player"){
		questClients[questStep].GetComponent(QuestClient).s = 0;
		enter = false;
		questClients[questStep].GetComponent(QuestClient).enter = false;
	}

}

function CheckQuestSequence(){
		var c : boolean = true;
		while(c == true){
			var id : int = questClients[questStep].GetComponent(QuestClient).questId;
			questData = questClients[questStep].GetComponent(QuestClient).questData;
			var qprogress : int = player.GetComponent(QuestStat).questProgress[id]; //Check Queststep
			var finish : int =	questData.GetComponent(QuestData).questData[id].finishProgress;
			if(qprogress >= finish + 9){ 
					questStep++;
					if(questStep >= questClients.Length){
						questStep = questClients.Length -1;
						c = false; // End Loop
					}
			}else{
				c = false; // End Loop
			}
		}
		//print("Quest Sequence = " + questStep);
}