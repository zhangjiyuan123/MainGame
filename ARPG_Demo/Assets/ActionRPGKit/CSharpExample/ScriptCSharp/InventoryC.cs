using UnityEngine;
using System.Collections;

public class InventoryC : MonoBehaviour {
	
	private bool  menu = false;
	private bool  itemMenu = true;
	private bool  equipMenu = false;
	
	public int[] itemSlot = new int[16];
	public int[] itemQuantity = new int[16];
	public int[] equipment = new int[8];
	
	public int weaponEquip = 0;
	public bool  allowWeaponUnequip = false;
	public int armorEquip = 0;
	public bool  allowArmorUnequip = true;
	public GameObject[] weapon = new GameObject[1];
	
	public GameObject player;
	public GameObject database;
	public GameObject fistPrefab;
	
	public int cash = 500;
	
	public GUISkin skin;
	public Rect windowRect = new Rect (260 ,140 ,280 ,385);
	
	//private string hover = ""; 
	
	void  Start (){
		if(!player){
			player = this.gameObject;
		}
		ItemDataC dataItem = database.GetComponent<ItemDataC>();
		//Reset Power of Current Weapon & Armor
		player.GetComponent<StatusC>().addAtk = 0;
		player.GetComponent<StatusC>().addDef = 0;
		player.GetComponent<StatusC>().addMatk = 0;
		player.GetComponent<StatusC>().addMdef = 0;
		player.GetComponent<StatusC>().weaponAtk = 0;
		player.GetComponent<StatusC>().weaponMatk = 0;
		//Set New Variable of Weapon
		player.GetComponent<StatusC>().weaponAtk += dataItem.equipment[weaponEquip].attack;
		player.GetComponent<StatusC>().addDef += dataItem.equipment[weaponEquip].defense;
		player.GetComponent<StatusC>().weaponMatk += dataItem.equipment[weaponEquip].magicAttack;
		player.GetComponent<StatusC>().addMdef += dataItem.equipment[weaponEquip].magicDefense;
		//Set New Variable of Armor
		player.GetComponent<StatusC>().weaponAtk += dataItem.equipment[armorEquip].attack;
		player.GetComponent<StatusC>().addDef += dataItem.equipment[armorEquip].defense;
		player.GetComponent<StatusC>().weaponMatk += dataItem.equipment[armorEquip].magicAttack;
		player.GetComponent<StatusC>().addMdef += dataItem.equipment[armorEquip].magicDefense;
		player.GetComponent<StatusC>().CalculateStatus();
		
	}
	
	void  Update (){
		if (Input.GetKeyDown("i") || Input.GetKeyDown(KeyCode.Return) || Input.GetKeyDown(KeyCode.KeypadEnter)) {
			OnOffMenu();
			//AutoSortItem();
		}
	}
	
	public void  UseItem ( int id  ){
		ItemDataC dataItem = database.GetComponent<ItemDataC>();
		player.GetComponent<StatusC>().Heal(dataItem.usableItem[id].hpRecover , dataItem.usableItem[id].mpRecover);
		player.GetComponent<StatusC>().atk += dataItem.usableItem[id].atkPlus;
		player.GetComponent<StatusC>().def += dataItem.usableItem[id].defPlus;
		player.GetComponent<StatusC>().matk += dataItem.usableItem[id].matkPlus;
		player.GetComponent<StatusC>().mdef += dataItem.usableItem[id].mdefPlus;
		
		AutoSortItem();

	}
	
	public void  EquipItem ( int id  ,   int slot  ){
		GameObject wea = new GameObject ();
		if(id == 0){
			return;
		}
		if(!player){
			player = this.gameObject;
		}
		ItemDataC dataItem = database.GetComponent<ItemDataC>();
		//Backup Your Current Equipment before Unequip
		int tempEquipment = 0;
		
		if(dataItem.equipment[id].EquipmentType == 0){//Equipment = Weapon
			//Weapon Type
			tempEquipment = weaponEquip;
			weaponEquip = id;
			if(dataItem.equipment[id].attackPrefab){
				player.GetComponent<AttackTriggerC>().attackPrefab = dataItem.equipment[id].attackPrefab.transform;
			}
			//Change Weapon Mesh
			if(dataItem.equipment[id].model && weapon.Length > 0 && weapon[0] != null){
				int allWeapon = weapon.Length;
				int a = 0;
				if(allWeapon > 0 && dataItem.equipment[id].assignAllWeapon){
					while(a < allWeapon && weapon[a]){
						weapon[a].SetActive(true);
						wea = Instantiate(dataItem.equipment[id].model,weapon[a].transform.position,weapon[a].transform.rotation) as GameObject;
						wea.transform.parent = weapon[a].transform.parent;
						Destroy(weapon[a].gameObject);
						weapon[a] = wea;
						a++;
					}
				}else if(allWeapon > 0){
					while(a < allWeapon && weapon[a]){
						if(a == 0){
							weapon[a].SetActive(true);
							wea = Instantiate(dataItem.equipment[id].model,weapon[a].transform.position,weapon[a].transform.rotation) as GameObject;
							wea.transform.parent = weapon[a].transform.parent;
							Destroy(weapon[a].gameObject);
							weapon[a] = wea;
						}else{
							weapon[a].SetActive(false);
						}
						a++;
					}
				}
			}
		}else{
			//Armor Type
			tempEquipment = armorEquip;
			armorEquip = id;
		}
		if(slot <= equipment.Length){
			equipment[slot] = 0;
		}
		//Assign Weapon Animation to PlayerAnimation Script
		AssignWeaponAnimation(id);
		//Reset Power of Current Weapon & Armor
		player.GetComponent<StatusC>().addAtk = 0;
		player.GetComponent<StatusC>().addDef = 0;
		player.GetComponent<StatusC>().addMatk = 0;
		player.GetComponent<StatusC>().addMdef = 0;
		player.GetComponent<StatusC>().weaponAtk = 0;
		player.GetComponent<StatusC>().weaponMatk = 0;
		//Set New Variable of Weapon
		player.GetComponent<StatusC>().weaponAtk += dataItem.equipment[weaponEquip].attack;
		player.GetComponent<StatusC>().addDef += dataItem.equipment[weaponEquip].defense;
		player.GetComponent<StatusC>().weaponMatk += dataItem.equipment[weaponEquip].magicAttack;
		player.GetComponent<StatusC>().addMdef += dataItem.equipment[weaponEquip].magicDefense;
		//Set New Variable of Armor
		player.GetComponent<StatusC>().weaponAtk += dataItem.equipment[armorEquip].attack;
		player.GetComponent<StatusC>().addDef += dataItem.equipment[armorEquip].defense;
		player.GetComponent<StatusC>().weaponMatk += dataItem.equipment[armorEquip].magicAttack;
		player.GetComponent<StatusC>().addMdef += dataItem.equipment[armorEquip].magicDefense;
		
		player.GetComponent<StatusC>().CalculateStatus();
		AutoSortEquipment();
		AddEquipment(tempEquipment);
		
	}

	public void  RemoveWeaponMesh (){
		if(weapon.Length > 0 && weapon[0] != null){
			int allWeapon = weapon.Length;
			int a = 0;
			if(allWeapon > 0){
				while(a < allWeapon && weapon[a]){
					weapon[a].SetActive(false);
					//Destroy(weapon[a].gameObject);
					a++;
				}
			}
		}
	}
	
	public void  UnEquip ( int id  ){
		bool full = false;
		ItemDataC dataItem = database.GetComponent<ItemDataC>();
		if(!player){
			player = this.gameObject;
		}
		if(dataItem.equipment[id].model && weapon.Length > 0 && weapon[0] != null){
			full = AddEquipment(weaponEquip);
		}else{
			full = AddEquipment(armorEquip);
		}
		if(!full){
			if(dataItem.equipment[id].model && weapon.Length > 0 && weapon[0] != null){
				weaponEquip = 0;
				player.GetComponent<AttackTriggerC>().attackPrefab = fistPrefab.transform;
				if(weapon.Length > 0 && weapon[0] != null){
					int allWeapon = weapon.Length;
					int a = 0;
					if(allWeapon > 0){
						while(a < allWeapon && weapon[a]){
							weapon[a].SetActive(false);
							//Destroy(weapon[a].gameObject);
							a++;
						}
					}
				}
			}else{
				armorEquip = 0;
			}
			//Reset Power of Current Weapon & Armor
			player.GetComponent<StatusC>().addAtk = 0;
			player.GetComponent<StatusC>().addDef = 0;
			player.GetComponent<StatusC>().addMatk = 0;
			player.GetComponent<StatusC>().addMdef = 0;
			player.GetComponent<StatusC>().weaponAtk = 0;
			player.GetComponent<StatusC>().weaponMatk = 0;
			//Set New Variable of Weapon
			player.GetComponent<StatusC>().weaponAtk += dataItem.equipment[weaponEquip].attack;
			player.GetComponent<StatusC>().addDef += dataItem.equipment[weaponEquip].defense;
			player.GetComponent<StatusC>().weaponMatk += dataItem.equipment[weaponEquip].magicAttack;
			player.GetComponent<StatusC>().addMdef += dataItem.equipment[weaponEquip].magicDefense;
			//Set New Variable of Armor
			player.GetComponent<StatusC>().weaponAtk += dataItem.equipment[armorEquip].attack;
			player.GetComponent<StatusC>().addDef += dataItem.equipment[armorEquip].defense;
			player.GetComponent<StatusC>().weaponMatk += dataItem.equipment[armorEquip].magicAttack;
			player.GetComponent<StatusC>().addMdef += dataItem.equipment[armorEquip].magicDefense;
		} 
	}
	
	void  OnGUI (){
		GUI.skin = skin;
		if(menu && itemMenu){
			windowRect = GUI.Window (1, windowRect, ItemWindow, "Items");
		}
		if(menu && equipMenu){
			windowRect = GUI.Window (1, windowRect, ItemWindow, "Equipment");
		}
		
		if(menu){
			if (GUI.Button ( new Rect(windowRect.x -50, windowRect.y +105,50,100), "Item")) {
				//Switch to Item Tab
				itemMenu = true;
				equipMenu = false;
			}
			if (GUI.Button ( new Rect(windowRect.x -50, windowRect.y +225,50,100), "Equip")) {
				//Switch to Equipment Tab
				equipMenu = true;
				itemMenu = false;	
			}
		}
		//hover = GUI.tooltip;
	}
	
	//-----------Item Window-------------
	void ItemWindow(int windowID){
		ItemDataC dataItem = database.GetComponent<ItemDataC>();
		if(menu && itemMenu){
			//GUI.Box ( new Rect(260,140,280,385), "Items");
			//Close Window Button
			if (GUI.Button ( new Rect(250,2,30,30), "X")) {
				OnOffMenu();
			}
			//Items Slot
			if (GUI.Button ( new Rect(30,115,50,50),new GUIContent (dataItem.usableItem[itemSlot[0]].icon, dataItem.usableItem[itemSlot[0]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[0]].description ))){
				if(!dataItem.usableItem[itemSlot[0]].unusable){
					UseItem(itemSlot[0]);
					if(itemQuantity[0] > 0){
						itemQuantity[0]--;
					}
					if(itemQuantity[0] <= 0){
						itemSlot[0] = 0;
						itemQuantity[0] = 0;
						AutoSortItem();
					}
				}
			}
			if(itemQuantity[0] > 0){
				GUI.Label ( new Rect(70, 150, 20, 20), itemQuantity[0].ToString()); //Quantity
			}
			
			if (GUI.Button ( new Rect(90,115,50,50),new GUIContent (dataItem.usableItem[itemSlot[1]].icon, dataItem.usableItem[itemSlot[1]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[1]].description ))){
				if(!dataItem.usableItem[itemSlot[1]].unusable){
					UseItem(itemSlot[1]);
					if(itemQuantity[1] > 0){
						itemQuantity[1]--;
					}
					if(itemQuantity[1] <= 0){
						itemSlot[1] = 0;
						itemQuantity[1] = 0;
						AutoSortItem();
					}
				}
			}
			if(itemQuantity[1] > 0){
				GUI.Label ( new Rect(130, 150, 20, 20), itemQuantity[1].ToString()); //Quantity
			}
			
			if (GUI.Button ( new Rect(150,115,50,50),new GUIContent (dataItem.usableItem[itemSlot[2]].icon, dataItem.usableItem[itemSlot[2]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[2]].description ))){
				if(!dataItem.usableItem[itemSlot[2]].unusable){
					UseItem(itemSlot[2]);
					if(itemQuantity[2] > 0){
						itemQuantity[2]--;
					}
					if(itemQuantity[2] <= 0){
						itemSlot[2] = 0;
						itemQuantity[2] = 0;
						AutoSortItem();
					}
				}
			}
			if(itemQuantity[2] > 0){
				GUI.Label ( new Rect(190, 150, 20, 20), itemQuantity[2].ToString()); //Quantity
			}
			
			if (GUI.Button ( new Rect(210,115,50,50),new GUIContent (dataItem.usableItem[itemSlot[3]].icon, dataItem.usableItem[itemSlot[3]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[3]].description ))){
				if(!dataItem.usableItem[itemSlot[3]].unusable){
					UseItem(itemSlot[3]);
					if(itemQuantity[3] > 0){
						itemQuantity[3]--;
					}
					if(itemQuantity[3] <= 0){
						itemSlot[3] = 0;
						itemQuantity[3] = 0;
						AutoSortItem();
					}
				}
			}
			if(itemQuantity[3] > 0){
				GUI.Label ( new Rect(250, 150, 20, 20), itemQuantity[3].ToString()); //Quantity
			}
			
			//-----------------------------
			if (GUI.Button ( new Rect(30,175,50,50),new GUIContent (dataItem.usableItem[itemSlot[4]].icon, dataItem.usableItem[itemSlot[4]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[4]].description ))){
				if(!dataItem.usableItem[itemSlot[4]].unusable){
					UseItem(itemSlot[4]);
					if(itemQuantity[4] > 0){
						itemQuantity[4]--;
					}
					if(itemQuantity[4] <= 0){
						itemSlot[4] = 0;
						itemQuantity[4] = 0;
						AutoSortItem();
					}
				}
			}
			if(itemQuantity[4] > 0){
				GUI.Label ( new Rect(70, 210, 20, 20), itemQuantity[4].ToString()); //Quantity
			}
			
			if (GUI.Button ( new Rect(90,175,50,50),new GUIContent (dataItem.usableItem[itemSlot[5]].icon, dataItem.usableItem[itemSlot[5]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[5]].description ))){
				if(!dataItem.usableItem[itemSlot[5]].unusable){
					UseItem(itemSlot[5]);
					if(itemQuantity[5] > 0){
						itemQuantity[5]--;
					}
					if(itemQuantity[5] <= 0){
						itemSlot[5] = 0;
						itemQuantity[5] = 0;
						AutoSortItem();
					}
				}
			}
			if(itemQuantity[5] > 0){
				GUI.Label ( new Rect(130, 210, 20, 20), itemQuantity[5].ToString()); //Quantity
			}
			
			if (GUI.Button ( new Rect(150,175,50,50),new GUIContent (dataItem.usableItem[itemSlot[6]].icon, dataItem.usableItem[itemSlot[6]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[6]].description ))){
				if(!dataItem.usableItem[itemSlot[6]].unusable){
					UseItem(itemSlot[6]);
					if(itemQuantity[6] > 0){
						itemQuantity[6]--;
					}
					if(itemQuantity[6] <= 0){
						itemSlot[6] = 0;
						itemQuantity[6] = 0;
						AutoSortItem();
					}
				}
			}
			if(itemQuantity[6] > 0){
				GUI.Label ( new Rect(190, 210, 20, 20), itemQuantity[6].ToString()); //Quantity
			}
			
			if (GUI.Button ( new Rect(210,175,50,50),new GUIContent (dataItem.usableItem[itemSlot[7]].icon, dataItem.usableItem[itemSlot[7]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[7]].description ))){
				if(!dataItem.usableItem[itemSlot[7]].unusable){
					UseItem(itemSlot[7]);
					if(itemQuantity[7] > 0){
						itemQuantity[7]--;
					}
					if(itemQuantity[7] <= 0){
						itemSlot[7] = 0;
						itemQuantity[7] = 0;
						AutoSortItem();
					}
				}
			}
			if(itemQuantity[7] > 0){
				GUI.Label ( new Rect(250, 210, 20, 20), itemQuantity[7].ToString()); //Quantity
			}
			//-----------------------------
			if (GUI.Button ( new Rect(30,235,50,50),new GUIContent (dataItem.usableItem[itemSlot[8]].icon, dataItem.usableItem[itemSlot[8]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[8]].description ))){
				if(!dataItem.usableItem[itemSlot[8]].unusable){
					UseItem(itemSlot[8]);
					if(itemQuantity[8] > 0){
						itemQuantity[8]--;
					}
					if(itemQuantity[8] <= 0){
						itemSlot[8] = 0;
						itemQuantity[8] = 0;
						AutoSortItem();
					}
				}
			}
			if(itemQuantity[8] > 0){
				GUI.Label ( new Rect(70, 270, 20, 20), itemQuantity[8].ToString()); //Quantity
			}
			
			if (GUI.Button ( new Rect(90,235,50,50),new GUIContent (dataItem.usableItem[itemSlot[9]].icon, dataItem.usableItem[itemSlot[9]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[9]].description ))){
				if(!dataItem.usableItem[itemSlot[9]].unusable){
					UseItem(itemSlot[9]);
					if(itemQuantity[9] > 0){
						itemQuantity[9]--;
					}
					if(itemQuantity[9] <= 0){
						itemSlot[9] = 0;
						itemQuantity[9] = 0;
						AutoSortItem();
					}
				}
			}
			if(itemQuantity[9] > 0){
				GUI.Label ( new Rect(130, 270, 20, 20), itemQuantity[9].ToString()); //Quantity
			}
			
			if (GUI.Button ( new Rect(150,235,50,50),new GUIContent (dataItem.usableItem[itemSlot[10]].icon, dataItem.usableItem[itemSlot[10]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[10]].description ))){
				if(!dataItem.usableItem[itemSlot[10]].unusable){
					UseItem(itemSlot[10]);
					if(itemQuantity[10] > 0){
						itemQuantity[10]--;
					}
					if(itemQuantity[10] <= 0){
						itemSlot[10] = 0;
						itemQuantity[10] = 0;
						AutoSortItem();
					}
				}
			}
			if(itemQuantity[10] > 0){
				GUI.Label ( new Rect(190, 270, 20, 20), itemQuantity[10].ToString()); //Quantity
			}
			
			if (GUI.Button ( new Rect(210,235,50,50),new GUIContent (dataItem.usableItem[itemSlot[11]].icon, dataItem.usableItem[itemSlot[11]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[11]].description ))){
				if(!dataItem.usableItem[itemSlot[11]].unusable){
					UseItem(itemSlot[11]);
					if(itemQuantity[11] > 0){
						itemQuantity[11]--;
					}
					if(itemQuantity[11] <= 0){
						itemSlot[11] = 0;
						itemQuantity[11] = 0;
						AutoSortItem();
					}
				}
			}
			if(itemQuantity[11] > 0){
				GUI.Label ( new Rect(250, 270, 20, 20), itemQuantity[11].ToString()); //Quantity
			}
			//-----------------------------
			if (GUI.Button ( new Rect(30,295,50,50),new GUIContent (dataItem.usableItem[itemSlot[12]].icon, dataItem.usableItem[itemSlot[12]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[12]].description ))){
				if(!dataItem.usableItem[itemSlot[12]].unusable){
					UseItem(itemSlot[12]);
					if(itemQuantity[12] > 0){
						itemQuantity[12]--;
					}
					if(itemQuantity[12] <= 0){
						itemSlot[12] = 0;
						itemQuantity[12] = 0;
						AutoSortItem();
					}
				}
			}
			if(itemQuantity[12] > 0){
				GUI.Label ( new Rect(70, 330, 20, 20), itemQuantity[12].ToString()); //Quantity
			}
			
			if (GUI.Button ( new Rect(90,295,50,50),new GUIContent (dataItem.usableItem[itemSlot[13]].icon, dataItem.usableItem[itemSlot[13]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[13]].description ))){
				if(!dataItem.usableItem[itemSlot[13]].unusable){
					UseItem(itemSlot[13]);
					if(itemQuantity[13] > 0){
						itemQuantity[13]--;
					}
					if(itemQuantity[13] <= 0){
						itemSlot[13] = 0;
						itemQuantity[13] = 0;
						AutoSortItem();
					}
				}
			}
			if(itemQuantity[13] > 0){
				GUI.Label ( new Rect(130, 330, 20, 20), itemQuantity[13].ToString()); //Quantity
			}
			
			if (GUI.Button ( new Rect(150,295,50,50),new GUIContent (dataItem.usableItem[itemSlot[14]].icon, dataItem.usableItem[itemSlot[14]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[14]].description ))){
				if(!dataItem.usableItem[itemSlot[14]].unusable){
					UseItem(itemSlot[14]);
					if(itemQuantity[14] > 0){
						itemQuantity[14]--;
					}
					if(itemQuantity[14] <= 0){
						itemSlot[14] = 0;
						itemQuantity[14] = 0;
						AutoSortItem();
					}
				}
			}
			if(itemQuantity[14] > 0){
				GUI.Label ( new Rect(190, 330, 20, 20), itemQuantity[14].ToString()); //Quantity
			}
			
			if (GUI.Button ( new Rect(210,295,50,50),new GUIContent (dataItem.usableItem[itemSlot[15]].icon, dataItem.usableItem[itemSlot[15]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[15]].description ))){
				if(!dataItem.usableItem[itemSlot[15]].unusable){
					UseItem(itemSlot[15]);
					if(itemQuantity[15] > 0){
						itemQuantity[15]--;
					}
					if(itemQuantity[15] <= 0){
						itemSlot[15] = 0;
						itemQuantity[15] = 0;
						AutoSortItem();
					}
				}
				
			}
			if(itemQuantity[15] > 0){
				GUI.Label ( new Rect(250, 330, 20, 20), itemQuantity[15].ToString()); //Quantity
			}
			GUI.Label ( new Rect(20, 355, 150, 50), "$ " + cash.ToString());
			GUI.Box ( new Rect(20,30,240,60), GUI.tooltip);
			//---------------------------
		}
		
		//---------------Equipment Tab----------------------------
		if(menu && equipMenu){
			//Close Window Button
			if (GUI.Button ( new Rect(250,2,30,30), "X")) {
				OnOffMenu();
			}
			//Weapon
			GUI.Label ( new Rect(20, 130, 150, 50), "Weapon");			
			if (GUI.Button ( new Rect(100,115,50,50),new GUIContent (dataItem.equipment[weaponEquip].icon, dataItem.equipment[weaponEquip].itemName + "\n" + "\n" + dataItem.equipment[weaponEquip].description ))){
				if(!allowWeaponUnequip || weaponEquip == 0){
					return;
				}
				UnEquip(weaponEquip);
			}
			//Armor
			GUI.Label ( new Rect(20, 190, 150, 50), "Armor");
			if (GUI.Button ( new Rect(100,175,50,50),new GUIContent (dataItem.equipment[armorEquip].icon, dataItem.equipment[armorEquip].itemName + "\n" + "\n" + dataItem.equipment[armorEquip].description ))){
				if(!allowArmorUnequip || armorEquip == 0){
					return;
				}
				UnEquip(armorEquip);
				
			}
			
			
			//--------Equipment Slot---------
			if (GUI.Button ( new Rect(30,235,50,50),new GUIContent (dataItem.equipment[equipment[0]].icon, dataItem.equipment[equipment[0]].itemName + "\n" + "\n" + dataItem.equipment[equipment[0]].description ))){
				EquipItem(equipment[0] , 0);
			}
			
			if (GUI.Button ( new Rect(90,235,50,50),new GUIContent (dataItem.equipment[equipment[1]].icon, dataItem.equipment[equipment[1]].itemName + "\n" + "\n" + dataItem.equipment[equipment[1]].description ))){
				EquipItem(equipment[1] , 1);
			}
			
			if (GUI.Button ( new Rect(150,235,50,50),new GUIContent (dataItem.equipment[equipment[2]].icon, dataItem.equipment[equipment[2]].itemName + "\n" + "\n" + dataItem.equipment[equipment[2]].description ))){
				EquipItem(equipment[2] , 2);
			}
			
			if (GUI.Button ( new Rect(210,235,50,50),new GUIContent (dataItem.equipment[equipment[3]].icon, dataItem.equipment[equipment[3]].itemName + "\n" + "\n" + dataItem.equipment[equipment[3]].description ))){
				EquipItem(equipment[3] , 3);
			}
			//-----------------------------
			if (GUI.Button ( new Rect(30,295,50,50),new GUIContent (dataItem.equipment[equipment[4]].icon, dataItem.equipment[equipment[4]].itemName + "\n" + "\n" + dataItem.equipment[equipment[4]].description ))){
				EquipItem(equipment[4] , 4);
			}
			
			if (GUI.Button ( new Rect(90,295,50,50),new GUIContent (dataItem.equipment[equipment[5]].icon, dataItem.equipment[equipment[5]].itemName + "\n" + "\n" + dataItem.equipment[equipment[5]].description ))){
				EquipItem(equipment[5] , 5);
			}
			
			if (GUI.Button ( new Rect(150,295,50,50),new GUIContent (dataItem.equipment[equipment[6]].icon, dataItem.equipment[equipment[6]].itemName + "\n" + "\n" + dataItem.equipment[equipment[6]].description ))){
				EquipItem(equipment[6] , 6);
			}
			
			if (GUI.Button ( new Rect(210,295,50,50),new GUIContent (dataItem.equipment[equipment[7]].icon, dataItem.equipment[equipment[7]].itemName + "\n" + "\n" + dataItem.equipment[equipment[7]].description ))){
				EquipItem(equipment[7] , 7);
			}
			GUI.Label ( new Rect(20, 355, 150, 50), "$ " + cash.ToString());
			GUI.Box ( new Rect(20,30,240,60), GUI.tooltip);
			
		}
		GUI.DragWindow (new Rect (0,0,10000,10000)); 
	}
	
	public bool AddItem ( int id ,  int quan  ){
		bool  full = false;
		bool  geta = false;
		
		int pt = 0;
		while(pt < itemSlot.Length && !geta){
			if(itemSlot[pt] == id){
				itemQuantity[pt] += quan;
				geta = true;
			}else if(itemSlot[pt] == 0){
				itemSlot[pt] = id;
				itemQuantity[pt] = quan;
				geta = true;
			}else{
				pt++;
				if(pt >= itemSlot.Length){
					full = true;
					print("Full");
				}
			}
			
		}
		
		return full;
		
	}
	
	public bool AddEquipment ( int id  ){
		bool  full = false;
		bool  geta = false;
		
		
		int pt = 0;
		while(pt < equipment.Length && !geta){
			if(equipment[pt] == 0){
				equipment[pt] = id;
				geta = true;
			}else{
				pt++;
				if(pt >= equipment.Length){
					full = true;
					print("Full");
				}
			}
			
		}
		
		return full;
		
	}
	//------------AutoSort----------
	public void  AutoSortItem (){
		int pt = 0;
		int nextp = 0;
		bool  clearr = false;
		while(pt < itemSlot.Length){
			if(itemSlot[pt] == 0){
				nextp = pt + 1;
				while(nextp < itemSlot.Length && !clearr){
					if(itemSlot[nextp] > 0){
						//Fine Next Item and Set
						itemSlot[pt] = itemSlot[nextp];
						itemQuantity[pt] = itemQuantity[nextp];
						itemSlot[nextp] = 0;
						itemQuantity[nextp] = 0;
						clearr = true;
					}else{
						nextp++;
					}
					
				}
				//Continue New Loop
				clearr = false;
				pt++;
			}else{
				pt++;
			}
			
		}
		
	}
	
	public void AutoSortEquipment (){
		int pt = 0;
		int nextp = 0;
		bool  clearr = false;
		while(pt < equipment.Length){
			if(equipment[pt] == 0){
				nextp = pt + 1;
				while(nextp < equipment.Length && !clearr){
					if(equipment[nextp] > 0){
						//Fine Next Item and Set
						equipment[pt] = equipment[nextp];
						equipment[nextp] = 0;
						clearr = true;
					}else{
						nextp++;
					}
					
				}
				//Continue New Loop
				clearr = false;
				pt++;
			}else{
				pt++;
			}
			
		}
		
	}
	
	
	void  OnOffMenu (){
		//Freeze Time Scale to 0 if Window is Showing
		if(!menu && Time.timeScale != 0.0f){
			menu = true;
			Time.timeScale = 0.0f;
			Screen.lockCursor = false;
			ResetPosition();
		}else if(menu){
			menu = false;
			Time.timeScale = 1.0f;
			Screen.lockCursor = true;
		}
		
	}
	
	void  AssignWeaponAnimation ( int id  ){
		ItemDataC dataItem = database.GetComponent<ItemDataC>();
		PlayerAnimationC playerAnim = player.GetComponent<PlayerAnimationC>();
		if(!playerAnim){
			//If use Mecanim
			AssignMecanimAnimation(id);
			return;
		}
		
		//Assign All Attack Combo Animation of the weapon from Database
		if(dataItem.equipment[id].attackCombo.Length > 0 && dataItem.equipment[id].attackCombo[0] != null && dataItem.equipment[id].EquipmentType == 0){
			int allPrefab = dataItem.equipment[id].attackCombo.Length;
			player.GetComponent<AttackTriggerC>().attackCombo = new AnimationClip[allPrefab];
			
			int a = 0;
			if(allPrefab > 0){
				while(a < allPrefab){
					player.GetComponent<AttackTriggerC>().attackCombo[a] = dataItem.equipment[id].attackCombo[a];
					player.GetComponent<AttackTriggerC>().mainModel.GetComponent<Animation>()[dataItem.equipment[id].attackCombo[a].name].layer = 15;
					a++;
				}
			}
			int watk = (int)dataItem.equipment[id].whileAttack;
			player.GetComponent<AttackTriggerC>().WhileAttackSet(watk);
			//Assign Attack Speed
			player.GetComponent<AttackTriggerC>().attackSpeed = dataItem.equipment[id].attackSpeed;
			player.GetComponent<AttackTriggerC>().atkDelay1 = dataItem.equipment[id].attackDelay;
		}
		
		if(dataItem.equipment[id].idleAnimation){
			player.GetComponent<PlayerAnimationC>().idle = dataItem.equipment[id].idleAnimation;
		}
		if(dataItem.equipment[id].runAnimation){
			playerAnim.run = dataItem.equipment[id].runAnimation;
		}
		if(dataItem.equipment[id].rightAnimation){
			playerAnim.right = dataItem.equipment[id].rightAnimation;
		}
		if(dataItem.equipment[id].leftAnimation){
			playerAnim.left = dataItem.equipment[id].leftAnimation;
		}
		if(dataItem.equipment[id].backAnimation){
			playerAnim.back = dataItem.equipment[id].backAnimation;
		}
		if(dataItem.equipment[id].jumpAnimation){
			player.GetComponent<PlayerAnimationC>().jump = dataItem.equipment[id].jumpAnimation;
		}
		playerAnim.AnimationSpeedSet();
		
	}
	
	void ResetPosition(){
		//Reset GUI Position when it out of Screen.
		if(windowRect.x >= Screen.width -30 || windowRect.y >= Screen.height -30 || windowRect.x <= -70 || windowRect.y <= -70 ){
			windowRect = new Rect (260 ,140 ,280 ,385);
		}
		
	}

	void  AssignMecanimAnimation (int id){
		ItemDataC dataItem = database.GetComponent<ItemDataC>();
		if(dataItem.equipment[id].EquipmentType == 0){
			int watk = (int)dataItem.equipment[id].whileAttack;
			player.GetComponent<AttackTriggerC>().WhileAttackSet(watk);
			//Assign Attack Speed
			player.GetComponent<AttackTriggerC>().attackSpeed = dataItem.equipment[id].attackSpeed;
			player.GetComponent<AttackTriggerC>().atkDelay1 = dataItem.equipment[id].attackDelay;
			//Set Weapon Type ID to Mecanim Animator and Set New Idle
			player.GetComponent<PlayerMecanimAnimationC>().SetWeaponType(dataItem.equipment[id].weaponType , dataItem.equipment[id].idleAnimation.name);
			
			int allPrefab = dataItem.equipment[id].attackCombo.Length;
			player.GetComponent<AttackTriggerC>().attackCombo = new AnimationClip[allPrefab];
			
			//Set Attack Animation
			int a = 0;
			if(allPrefab > 0){
				while(a < allPrefab){
					player.GetComponent<AttackTriggerC>().attackCombo[a] = dataItem.equipment[id].attackCombo[a];
					a++;
				}
			}
		}
		
	}
	//--------------------------------------------

	public bool CheckItem(int id , int type, int qty){
		bool having = false;
		bool geta = false;
		//type 0 = Usable , 1 = Equipment
		
		int pt = 0;
		
		//================Usable==================
		if(type == 0){
			while(pt < itemSlot.Length && !geta){
				if(itemSlot[pt] == id){
					if(itemQuantity[pt] >= qty){
						having = true;
					}
					geta = true;
				}else{
					pt++;
				}
				//--------------------------
			}
		}
		//=================Equipment=================
		if(type == 1){
			while(pt < equipment.Length && !geta){
				if(equipment[pt] == id){
					having = true;
					geta = true;
				}else{
					pt++;
				}
				//--------------------------
			}
		}
		
		return having;
		
	}

	
	public int FindItemSlot(int id) {
		bool geta = false;
		int pt = 0;
		while(pt < itemSlot.Length && !geta){
			if(itemSlot[pt] == id){
				geta = true;
			}else{
				pt++;
				if(pt >= itemSlot.Length){
					pt = itemSlot.Length + 50;//No Item
					print("No Item");
				}
			}
			
		}
		
		return pt;
		
	}
	
	public int FindEquipmentSlot(int id){
		bool geta = false;
		int pt = 0;
		while(pt < equipment.Length && !geta){
			if(equipment[pt] == id){
				geta = true;
			}else{
				pt++;
				if(pt >= equipment.Length){
					pt = equipment.Length + 50;//No Item
					print("No Item");
				}
			}
			
		}
		
		return pt;
		
	}
	
	public bool RemoveItem(int id , int amount){
		bool haveItem = false;
		int slot = FindItemSlot(id);
		if(slot < itemSlot.Length){
			if(itemQuantity[slot] > 0){
				itemQuantity[slot] -= amount;
				haveItem = true;
			}
			if(itemQuantity[slot] <= 0){
				itemSlot[slot] = 0;
				itemQuantity[slot] = 0;
				AutoSortItem();
			}
		}
		return haveItem;
	}
	
	public bool RemoveEquipment(int id ){
		bool haveItem = false;
		int slot = FindEquipmentSlot(id);
		if(slot < equipment.Length){
			equipment[slot] = 0;
			AutoSortEquipment();
			haveItem = true;
		}
		return haveItem;
	}
	

}
