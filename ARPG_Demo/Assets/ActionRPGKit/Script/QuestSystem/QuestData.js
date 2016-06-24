#pragma strict
var itemData : GameObject;

class Quest {
		var questName : String = "";
		var icon : Texture2D;
		var description : String;
		var finishProgress : int = 5;
		var rewardCash : int = 100;
		var rewardExp : int = 100;
		var rewardItemID : int[];
		var rewardEquipmentID : int[];

}

var questData : Quest[] = new Quest[3];

function QuestClear(id : int , player : GameObject){
	//Get Rewards
	player.GetComponent(Inventory).cash += questData[id].rewardCash; //Add Cash
	player.GetComponent(Status).gainEXP(questData[id].rewardExp); //Get EXP

	if(questData[id].rewardItemID.Length > 0){	//Add Items
		var i : int = 0;
		while(i < questData[id].rewardItemID.Length){
			player.GetComponent(Inventory).AddItem(questData[id].rewardItemID[i] , 1);
			i++;
		}
	}
	
	if(questData[id].rewardEquipmentID.Length > 0){	//Add Equipments
		i = 0;
		while(i < questData[id].rewardEquipmentID.Length){
			player.GetComponent(Inventory).AddEquipment(questData[id].rewardEquipmentID[i]);
			i++;
		}
	
	}
		
}