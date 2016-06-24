#pragma strict
var autoLoad : boolean = false;
var player : GameObject;
private var menu : boolean = false;
private var lastPosition : Vector3;
private var mainCam : Transform;
var oldPlayer : GameObject;

private var saveSlot : int = 0;

function Start () {
	 if(!player){
    	player = GameObject.FindWithTag ("Player");
    }
    saveSlot = PlayerPrefs.GetInt("SaveSlot");
    //GetComponent(Status).characterName = PlayerPrefs.GetString("Name" +saveSlot.ToString());
    //If PlayerPrefs Loadgame = 10 That mean You Start with Load Game Menu.
	//If You Set Autoload = true It will LoadGame when you start.
     if(PlayerPrefs.GetInt("Loadgame") == 10 || autoLoad){
   		 LoadGame();
   		 if(!autoLoad){
   			 //If You didn't Set autoLoad then reset PlayerPrefs Loadgame to 0 after LoadGame.
   		 	PlayerPrefs.SetInt("Loadgame", 0);
   		 }
    }

}

function Update () {
	if (Input.GetKeyDown(KeyCode.Escape)) {
		//Open Save Load Menu
		OnOffMenu();
	}

}

function OnOffMenu(){
	//Freeze Time Scale to 0 if Window is Showing
	if(!menu && Time.timeScale != 0.0){
			menu = true;
			Time.timeScale = 0.0;
			Screen.lockCursor = false;
	}else if(menu){
			menu = false;
			Time.timeScale = 1.0;
			Screen.lockCursor = true;
	}
}

function OnGUI(){
	if(menu){
		GUI.Box (Rect (Screen.width / 2 - 110,230,220,220), "Menu");
		if (GUI.Button (Rect (Screen.width / 2 - 45,285,90,40), "Save Game")) {
			SaveData();
			OnOffMenu();
		}
		
		if (GUI.Button (Rect (Screen.width / 2 - 45,335,90,40), "Load Game")) {
			LoadData();
			OnOffMenu();
		}
		
		if (GUI.Button (Rect (Screen.width / 2 - 45,385,90,40), "Quit Game")) {
			var cam : GameObject = GameObject.FindWithTag ("MainCamera");
			Destroy(cam);
			Destroy(player);
			Time.timeScale = 1.0;
			Application.LoadLevel ("Title");
		}
		
		if (GUI.Button (Rect (Screen.width / 2 + 55,235,30,30), "X")) {
			OnOffMenu();
		}
	}

}


function SaveData(){
			PlayerPrefs.SetInt("PreviousSave" +saveSlot.ToString(), 10);
			PlayerPrefs.SetString("Name" +saveSlot.ToString(), player.GetComponent(Status).characterName);
			PlayerPrefs.SetFloat("PlayerX", player.transform.position.x);
			PlayerPrefs.SetFloat("PlayerY", player.transform.position.y);
			PlayerPrefs.SetFloat("PlayerZ", player.transform.position.z);
			PlayerPrefs.SetInt("PlayerID" +saveSlot.ToString(), player.GetComponent(Status).characterId);
			PlayerPrefs.SetInt("PlayerLevel" +saveSlot.ToString(), player.GetComponent(Status).level);
			PlayerPrefs.SetInt("PlayerATK" +saveSlot.ToString(), player.GetComponent(Status).atk);
			PlayerPrefs.SetInt("PlayerDEF" +saveSlot.ToString(), player.GetComponent(Status).def);
			PlayerPrefs.SetInt("PlayerMATK" +saveSlot.ToString(), player.GetComponent(Status).matk);
			PlayerPrefs.SetInt("PlayerMDEF" +saveSlot.ToString(), player.GetComponent(Status).mdef);
			PlayerPrefs.SetInt("PlayerEXP" +saveSlot.ToString(), player.GetComponent(Status).exp);
			PlayerPrefs.SetInt("PlayerMaxEXP" +saveSlot.ToString(), player.GetComponent(Status).maxExp);
			PlayerPrefs.SetInt("PlayerMaxHP" +saveSlot.ToString(), player.GetComponent(Status).maxHealth);
			PlayerPrefs.SetInt("PlayerHP" +saveSlot.ToString(), player.GetComponent(Status).health);
			PlayerPrefs.SetInt("PlayerMaxMP" +saveSlot.ToString(), player.GetComponent(Status).maxMana);
		//	PlayerPrefs.SetInt("PlayerMP", player.GetComponent(Status).mana);
			PlayerPrefs.SetInt("PlayerSTP" +saveSlot.ToString(), player.GetComponent(Status).statusPoint);
			
			PlayerPrefs.SetInt("Cash" +saveSlot.ToString(), player.GetComponent(Inventory).cash);
			var itemSize : int = player.GetComponent(Inventory).itemSlot.length;
			var a : int = 0;
			if(itemSize > 0){
				while(a < itemSize){
					PlayerPrefs.SetInt("Item" + a.ToString() +saveSlot.ToString(), player.GetComponent(Inventory).itemSlot[a]);
					PlayerPrefs.SetInt("ItemQty" + a.ToString() +saveSlot.ToString(), player.GetComponent(Inventory).itemQuantity[a]);
					a++;
				}
			}
			
			var equipSize : int = player.GetComponent(Inventory).equipment.length;
			a = 0;
			if(equipSize > 0){
				while(a < equipSize){
					PlayerPrefs.SetInt("Equipm" + a.ToString() +saveSlot.ToString(), player.GetComponent(Inventory).equipment[a]);
					a++;
				}
			}
			PlayerPrefs.SetInt("WeaEquip" +saveSlot.ToString(), player.GetComponent(Inventory).weaponEquip);
			PlayerPrefs.SetInt("ArmoEquip" +saveSlot.ToString(), player.GetComponent(Inventory).armorEquip);
			//Save Quest
			var questSize : int = player.GetComponent(QuestStat).questProgress.length;
			PlayerPrefs.SetInt("QuestSize" +saveSlot.ToString(), questSize);
			a = 0;
			if(questSize > 0){
				while(a < questSize){
					PlayerPrefs.SetInt("Questp" + a.ToString() +saveSlot.ToString(), player.GetComponent(QuestStat).questProgress[a]);
					a++;
				}
			}
			var questSlotSize : int = player.GetComponent(QuestStat).questSlot.length;
			PlayerPrefs.SetInt("QuestSlotSize" +saveSlot.ToString(), questSlotSize);
			a = 0;
			if(questSlotSize > 0){
				while(a < questSlotSize){
					PlayerPrefs.SetInt("Questslot" + a.ToString() +saveSlot.ToString(), player.GetComponent(QuestStat).questSlot[a]);
					a++;
				}
			}
			//Save Skill Slot
			a = 0;
				while(a <= 2){
					PlayerPrefs.SetInt("Skill" + a.ToString() +saveSlot.ToString(), player.GetComponent(SkillWindow).skill[a]);
					a++;
			}
			//Skill List Slot
			a = 0;
			while(a < player.GetComponent(SkillWindow).skillListSlot.length){
				PlayerPrefs.SetInt("SkillList" + a.ToString() +saveSlot.ToString(), player.GetComponent(SkillWindow).skillListSlot[a]);
				a++;
			}
			
			print("Saved");
}


function LoadData(){
		//oldPlayer = GameObject.FindWithTag ("Player");
		var respawn : GameObject = GameObject.FindWithTag ("Player");
		
		respawn.GetComponent(Status).characterName = PlayerPrefs.GetString("Name" +saveSlot.ToString());
		lastPosition.x = PlayerPrefs.GetFloat("PlayerX");
		lastPosition.y = PlayerPrefs.GetFloat("PlayerY");
		lastPosition.z = PlayerPrefs.GetFloat("PlayerZ");
		respawn.transform.position = lastPosition;
		//var respawn : GameObject = Instantiate(player, lastPosition , transform.rotation);
		//respawn.GetComponent(Status).characterId = PlayerPrefs.GetInt("PlayerID" +saveSlot.ToString());
		respawn.GetComponent(Status).level = PlayerPrefs.GetInt("PlayerLevel" +saveSlot.ToString());
		respawn.GetComponent(Status).atk = PlayerPrefs.GetInt("PlayerATK" +saveSlot.ToString());
		respawn.GetComponent(Status).def = PlayerPrefs.GetInt("PlayerDEF" +saveSlot.ToString());
		respawn.GetComponent(Status).matk = PlayerPrefs.GetInt("PlayerMATK" +saveSlot.ToString());
		respawn.GetComponent(Status).mdef = PlayerPrefs.GetInt("PlayerMDEF" +saveSlot.ToString());
		respawn.GetComponent(Status).mdef = PlayerPrefs.GetInt("PlayerMDEF" +saveSlot.ToString());
		respawn.GetComponent(Status).exp = PlayerPrefs.GetInt("PlayerEXP" +saveSlot.ToString());
		respawn.GetComponent(Status).maxExp = PlayerPrefs.GetInt("PlayerMaxEXP" +saveSlot.ToString());
		respawn.GetComponent(Status).maxHealth = PlayerPrefs.GetInt("PlayerMaxHP" +saveSlot.ToString());
		respawn.GetComponent(Status).health = PlayerPrefs.GetInt("PlayerHP" +saveSlot.ToString());
		//respawn.GetComponent(Status).health = PlayerPrefs.GetInt("PlayerMaxHP");
		respawn.GetComponent(Status).maxMana = PlayerPrefs.GetInt("PlayerMaxMP" +saveSlot.ToString());
		respawn.GetComponent(Status).mana = PlayerPrefs.GetInt("PlayerMaxMP" +saveSlot.ToString());
		respawn.GetComponent(Status).statusPoint = PlayerPrefs.GetInt("PlayerSTP" +saveSlot.ToString());
		mainCam = GameObject.FindWithTag ("MainCamera").transform;
		//mainCam.GetComponent(ARPGcamera).target = respawn.transform;
		//-------------------------------
		respawn.GetComponent(Inventory).cash = PlayerPrefs.GetInt("Cash" +saveSlot.ToString());
		var itemSize : int = player.GetComponent(Inventory).itemSlot.length;
			var a : int = 0;
			if(itemSize > 0){
				while(a < itemSize){
					respawn.GetComponent(Inventory).itemSlot[a] = PlayerPrefs.GetInt("Item" + a.ToString() +saveSlot.ToString());
					respawn.GetComponent(Inventory).itemQuantity[a] = PlayerPrefs.GetInt("ItemQty" + a.ToString() +saveSlot.ToString());
					//-------
					a++;
				}
			}
			
			var equipSize : int = player.GetComponent(Inventory).equipment.length;
			a = 0;
			if(equipSize > 0){
				while(a < equipSize){
					respawn.GetComponent(Inventory).equipment[a] = PlayerPrefs.GetInt("Equipm" + a.ToString() +saveSlot.ToString());
					a++;
				}
			}
			respawn.GetComponent(Inventory).weaponEquip = 0;
			respawn.GetComponent(Inventory).armorEquip = PlayerPrefs.GetInt("ArmoEquip" +saveSlot.ToString());
		if(PlayerPrefs.GetInt("WeaEquip" +saveSlot.ToString()) == 0){
			respawn.GetComponent(Inventory).RemoveWeaponMesh();
		}else{
			respawn.GetComponent(Inventory).EquipItem(PlayerPrefs.GetInt("WeaEquip" +saveSlot.ToString()) , respawn.GetComponent(Inventory).equipment.Length + 5);
		}
			//----------------------------------
		//Screen.lockCursor = true;
		
		 var mon : GameObject[]; 
  		 mon = GameObject.FindGameObjectsWithTag("Enemy"); 
  			 for (var mo : GameObject in mon) { 
  			 	if(mo){
  			 		mo.GetComponent(AIset).followTarget = respawn.transform;
  			 	}
  			 }
		
		//Load Quest
		respawn.GetComponent(QuestStat).questProgress = new int[PlayerPrefs.GetInt("QuestSize" +saveSlot.ToString())];
		var questSize : int = respawn.GetComponent(QuestStat).questProgress.length;
			a = 0;
			if(questSize > 0){
				while(a < questSize){
					respawn.GetComponent(QuestStat).questProgress[a] = PlayerPrefs.GetInt("Questp" + a.ToString() +saveSlot.ToString());
					a++;
				}
			}
			
		respawn.GetComponent(QuestStat).questSlot = new int[PlayerPrefs.GetInt("QuestSlotSize" +saveSlot.ToString())];
		var questSlotSize : int = respawn.GetComponent(QuestStat).questSlot.length;
			a = 0;
			if(questSlotSize > 0){
				while(a < questSlotSize){
					respawn.GetComponent(QuestStat).questSlot[a] = PlayerPrefs.GetInt("Questslot" + a.ToString() +saveSlot.ToString());
					a++;
				}
			}
			
			//Load Skill Slot
			a = 0;
			while(a <= 2){
				respawn.GetComponent(SkillWindow).skill[a] = PlayerPrefs.GetInt("Skill" + a.ToString() +saveSlot.ToString());
				a++;
			}
			//Skill List Slot
			a = 0;
			while(a < player.GetComponent(SkillWindow).skillListSlot.length){
				player.GetComponent(SkillWindow).skillListSlot[a] = PlayerPrefs.GetInt("SkillList" + a.ToString() +saveSlot.ToString());
				a++;
			}
			respawn.GetComponent(SkillWindow).AssignAllSkill();
		//---------------Set Target to Minimap--------------
  		var minimap : GameObject = GameObject.FindWithTag("Minimap");
  		if(minimap){
  			var mapcam : GameObject = minimap.GetComponent(MinimapOnOff).minimapCam;
  			mapcam.GetComponent(MinimapCamera).target = respawn.transform;
  		}
			
		player = GameObject.FindWithTag ("Player");
		/*if(oldPlayer){
			Destroy(gameObject);
		}*/
}

//Function LoadGame is unlike the Function LoadData.
//This Function will not spawn new Player.
function LoadGame(){
		player.GetComponent(Status).characterName = PlayerPrefs.GetString("Name" +saveSlot.ToString());
		player.GetComponent(Status).level = PlayerPrefs.GetInt("PlayerLevel" +saveSlot.ToString());
		player.GetComponent(Status).atk = PlayerPrefs.GetInt("PlayerATK" +saveSlot.ToString());
		player.GetComponent(Status).def = PlayerPrefs.GetInt("PlayerDEF" +saveSlot.ToString());
		player.GetComponent(Status).matk = PlayerPrefs.GetInt("PlayerMATK" +saveSlot.ToString());
		player.GetComponent(Status).mdef = PlayerPrefs.GetInt("PlayerMDEF" +saveSlot.ToString());
		player.GetComponent(Status).mdef = PlayerPrefs.GetInt("PlayerMDEF" +saveSlot.ToString());
		player.GetComponent(Status).exp = PlayerPrefs.GetInt("PlayerEXP" +saveSlot.ToString());
		player.GetComponent(Status).maxExp = PlayerPrefs.GetInt("PlayerMaxEXP" +saveSlot.ToString());
		player.GetComponent(Status).maxHealth = PlayerPrefs.GetInt("PlayerMaxHP" +saveSlot.ToString());
		player.GetComponent(Status).health = PlayerPrefs.GetInt("PlayerMaxHP" +saveSlot.ToString());
		player.GetComponent(Status).maxMana = PlayerPrefs.GetInt("PlayerMaxMP" +saveSlot.ToString());
		player.GetComponent(Status).mana = PlayerPrefs.GetInt("PlayerMaxMP" +saveSlot.ToString());	
		player.GetComponent(Status).statusPoint = PlayerPrefs.GetInt("PlayerSTP" +saveSlot.ToString());
		//mainCam = GameObject.FindWithTag ("MainCamera").transform;
		//mainCam.GetComponent(ARPGcamera).target = respawn.transform;
		//-------------------------------
		player.GetComponent(Inventory).cash = PlayerPrefs.GetInt("Cash" +saveSlot.ToString());
		var itemSize : int = player.GetComponent(Inventory).itemSlot.length;
			var a : int = 0;
			if(itemSize > 0){
				while(a < itemSize){
					player.GetComponent(Inventory).itemSlot[a] = PlayerPrefs.GetInt("Item" + a.ToString() +saveSlot.ToString());
					player.GetComponent(Inventory).itemQuantity[a] = PlayerPrefs.GetInt("ItemQty" + a.ToString() +saveSlot.ToString());
					//-------
					a++;
				}
			}
			
			var equipSize : int = player.GetComponent(Inventory).equipment.length;
			a = 0;
			if(equipSize > 0){
				while(a < equipSize){
					player.GetComponent(Inventory).equipment[a] = PlayerPrefs.GetInt("Equipm" + a.ToString() +saveSlot.ToString());
					a++;
				}
			}
			player.GetComponent(Inventory).weaponEquip = 0;
			player.GetComponent(Inventory).armorEquip = PlayerPrefs.GetInt("ArmoEquip" +saveSlot.ToString());
		if(PlayerPrefs.GetInt("WeaEquip" +saveSlot.ToString()) == 0){
			player.GetComponent(Inventory).RemoveWeaponMesh();
		}else{
			player.GetComponent(Inventory).EquipItem(PlayerPrefs.GetInt("WeaEquip" +saveSlot.ToString()) , player.GetComponent(Inventory).equipment.Length + 5);
		}
			//----------------------------------
		//Screen.lockCursor = true;
		
		 var mon : GameObject[]; 
  		 mon = GameObject.FindGameObjectsWithTag("Enemy"); 
  			 for (var mo : GameObject in mon) { 
  			 	if(mo){
  			 		mo.GetComponent(AIset).followTarget = player.transform;
  			 	}
  			 }
  		
  		//Load Quest
		player.GetComponent(QuestStat).questProgress = new int[PlayerPrefs.GetInt("QuestSize" +saveSlot.ToString())];
		var questSize : int = player.GetComponent(QuestStat).questProgress.length;
			a = 0;
			if(questSize > 0){
				while(a < questSize){
					player.GetComponent(QuestStat).questProgress[a] = PlayerPrefs.GetInt("Questp" + a.ToString() +saveSlot.ToString());
					a++;
				}
			}
			
		player.GetComponent(QuestStat).questSlot = new int[PlayerPrefs.GetInt("QuestSlotSize" +saveSlot.ToString())];
		var questSlotSize : int = player.GetComponent(QuestStat).questSlot.length;
			a = 0;
			if(questSlotSize > 0){
				while(a < questSlotSize){
					player.GetComponent(QuestStat).questSlot[a] = PlayerPrefs.GetInt("Questslot" + a.ToString() +saveSlot.ToString());
					a++;
				}
			}
			
			//Load Skill Slot
			a = 0;
			while(a <= 2){
				player.GetComponent(SkillWindow).skill[a] = PlayerPrefs.GetInt("Skill" + a.ToString() +saveSlot.ToString());
				a++;
			}
			//Skill List Slot
			a = 0;
			while(a < player.GetComponent(SkillWindow).skillListSlot.length){
				player.GetComponent(SkillWindow).skillListSlot[a] = PlayerPrefs.GetInt("SkillList" + a.ToString() +saveSlot.ToString());
				a++;
			}
			player.GetComponent(SkillWindow).AssignAllSkill();

		print("Loaded");
	
}