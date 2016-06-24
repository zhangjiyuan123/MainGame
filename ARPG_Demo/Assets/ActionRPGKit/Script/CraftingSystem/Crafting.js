#pragma strict
var craftingListId : int[] = new int[3];
private var craftingData : CraftData[];
var itemDatabase : GameObject;
var craftingDatabase : GameObject;
private var player : GameObject;
var uiSkin : GUISkin;
var button : Texture2D;

private var itemdb : ItemData;
private var craftdb : CraftingData;

private var uiPage : int = 0;
private var page : int = 0;
private var maxPage : int = 1;
private var selection : int = 0;
private var showError : String = "";
private var enter : boolean = false;

private var itemQty1 : int;
private var itemQty2 : int;
private var itemQty3 : int;
private var itemQty4 : int;
private var itemQty5 : int;

function Start () {
	if(!player){
		player = GameObject.FindWithTag("Player");
	}
	itemdb = itemDatabase.GetComponent(ItemData);
	craftdb = craftingDatabase.GetComponent(CraftingData);
	
	GetCraftingData();
	//uiPage = 1;
}

function GetCraftingData(){
	craftingData = new CraftData[craftingListId.Length];
	var a : int = 0;
	while(a < craftingData.Length){
		craftingData[a] = craftdb.craftingData[craftingListId[a]];
		a++;
	}
	//Set Max Page
	maxPage = craftingData.Length / 9;
	if(craftingData.Length % 9 != 0){
		maxPage += 1;
	}
}

function Update () {
	if(Input.GetKeyDown("e") && enter){
		OnOffMenu();
	}
}

function OnGUI(){
	GUI.skin = uiSkin;
	if(enter && uiPage == 0){
		GUI.DrawTexture(Rect(Screen.width / 2 - 130, Screen.height - 120, 260, 80), button);
	}
	
	if(uiPage == 1){
		//Show All Crafting List
		GUI.Box (Rect (Screen.width /2 - 215, 70 ,430,500), "Crafting Menu");
		if(GUI.Button(new Rect(Screen.width /2 + 175 ,75,33,33), "X")){
			OnOffMenu();
		}
		
		if(page + 0 < craftingData.Length){
			if(GUI.Button(new Rect(Screen.width /2 - 175,95,350,40), craftingData[page + 0].itemName)) {
	            selection = page + 0;
	            ShowItemQuantity();
	            uiPage = 2;
	        }
		}
		if(page + 1 < craftingData.Length){
			if(GUI.Button(new Rect(Screen.width /2 - 175,145,350,40), craftingData[page + 1].itemName)) {
	            selection = page + 1;
	            ShowItemQuantity();
	            uiPage = 2;
	        }
		}
		if(page + 2 < craftingData.Length){
			if(GUI.Button(new Rect(Screen.width /2 - 175,195,350,40), craftingData[page + 2].itemName)) {
	            selection = page + 2;
	            ShowItemQuantity();
	            uiPage = 2;
	        }
		}
		if(page + 3 < craftingData.Length){
			if(GUI.Button(new Rect(Screen.width /2 - 175,245,350,40), craftingData[page + 3].itemName)) {
	            selection = page + 3;
	            ShowItemQuantity();
	            uiPage = 2;
	        }
		}
		if(page + 4 < craftingData.Length){
			if(GUI.Button(new Rect(Screen.width /2 - 175,295,350,40), craftingData[page + 4].itemName)) {
	            selection = page + 4;
	            ShowItemQuantity();
	            uiPage = 2;
	        }
		}
		if(page + 5 < craftingData.Length){
			if(GUI.Button(new Rect(Screen.width /2 - 175,345,350,40), craftingData[page + 5].itemName)) {
	            selection = page + 5;
	            ShowItemQuantity();
	            uiPage = 2;
	        }
		}
		if(page + 6 < craftingData.Length){
			if(GUI.Button(new Rect(Screen.width /2 - 175,395,350,40), craftingData[page + 6].itemName)) {
	            selection = page + 6;
	            ShowItemQuantity();
	            uiPage = 2;
	        }
		}
		if(page + 7 < craftingData.Length){
			if(GUI.Button(new Rect(Screen.width /2 - 175,445,350,40), craftingData[page + 7].itemName)) {
	            selection = page + 7;
	            ShowItemQuantity();
	            uiPage = 2;
	        }
		}
		if(page + 8 < craftingData.Length){
			if(GUI.Button(new Rect(Screen.width /2 - 175,495,350,40), craftingData[page + 8].itemName)) {
	            selection = page + 8;
	            ShowItemQuantity();
	            uiPage = 2;
	        }
		}
	}
	
	//Show Ingredient
	if(uiPage == 2){
		GUI.Box (Rect (Screen.width /2 - 200, 70 ,400,300), craftingData[selection].itemName);
		if(GUI.Button(new Rect(Screen.width /2 + 155 ,75,40,40), "X")){
			showError = "";
			uiPage = 1;
		}
		
		GUI.Label (Rect (Screen.width /2 - 50, 330, 200, 100), showError);
		
		var ingrediantName1 : String;
		if(craftingData[selection].ingredient[0].itemType == 0){
			ingrediantName1 = itemdb.usableItem[craftingData[selection].ingredient[0].itemId].itemName;
			//-------------------
		}else if(craftingData[selection].ingredient[0].itemType == 1){
			ingrediantName1 = itemdb.equipment[craftingData[selection].ingredient[0].itemId].itemName;
			//-------------------
		}
		
		GUI.Label (Rect (Screen.width /2 - 180, 150, 500, 100), ingrediantName1);
		GUI.Label (Rect (Screen.width /2 + 10, 150, 500, 100), craftingData[selection].ingredient[0].quantity.ToString());
		GUI.Label (Rect (Screen.width /2 + 40, 150, 500, 100), "(" + itemQty1 + ")");
		
		//=========================================================
		
		if(craftingData[selection].ingredient.Length >= 2){
			var ingrediantName2 : String;
			if(craftingData[selection].ingredient[1].itemType == 0){
				ingrediantName2 = itemdb.usableItem[craftingData[selection].ingredient[1].itemId].itemName;
				//-------------------
			}else if(craftingData[selection].ingredient[1].itemType == 1){
				ingrediantName2 = itemdb.equipment[craftingData[selection].ingredient[1].itemId].itemName;
				//-------------------
			}
			
			GUI.Label (Rect (Screen.width /2 - 180, 170, 500, 100), ingrediantName2);
			GUI.Label (Rect (Screen.width /2 + 10, 170, 500, 100), craftingData[selection].ingredient[1].quantity.ToString());
			GUI.Label (Rect (Screen.width /2 + 40, 170, 500, 100), "(" + itemQty2 + ")");
		}
		//=========================================================
		
		if(craftingData[selection].ingredient.Length >= 3){
			var ingrediantName3 : String;
			if(craftingData[selection].ingredient[2].itemType == 0){
				ingrediantName3 = itemdb.usableItem[craftingData[selection].ingredient[2].itemId].itemName;
				//-------------------
			}else if(craftingData[selection].ingredient[2].itemType == 1){
				ingrediantName3 = itemdb.equipment[craftingData[selection].ingredient[2].itemId].itemName;
				//-------------------
			}
			
			GUI.Label (Rect (Screen.width /2 - 180, 190, 500, 100), ingrediantName3);
			GUI.Label (Rect (Screen.width /2 + 10, 190, 500, 100), craftingData[selection].ingredient[2].quantity.ToString());
			GUI.Label (Rect (Screen.width /2 + 40, 190, 500, 100), "(" + itemQty3 + ")");
		}
		//=========================================================
		
		if(craftingData[selection].ingredient.Length >= 4){
			var ingrediantName4 : String;
			if(craftingData[selection].ingredient[3].itemType == 0){
				ingrediantName4 = itemdb.usableItem[craftingData[selection].ingredient[3].itemId].itemName;
				//-------------------
			}else if(craftingData[selection].ingredient[3].itemType == 1){
				ingrediantName4 = itemdb.equipment[craftingData[selection].ingredient[3].itemId].itemName;
				//-------------------
			}
			
			GUI.Label (Rect (Screen.width /2 - 180, 210, 500, 100), ingrediantName4);
			GUI.Label (Rect (Screen.width /2 + 10, 210, 500, 100), craftingData[selection].ingredient[3].quantity.ToString());
			GUI.Label (Rect (Screen.width /2 + 40, 210, 500, 100), "(" + itemQty4 + ")");
		}
		//=========================================================
		
		if(craftingData[selection].ingredient.Length >= 5){
			var ingrediantName5 : String;
			if(craftingData[selection].ingredient[4].itemType == 0){
				ingrediantName5 = itemdb.usableItem[craftingData[selection].ingredient[4].itemId].itemName;
				//-------------------
			}else if(craftingData[selection].ingredient[4].itemType == 1){
				ingrediantName5 = itemdb.equipment[craftingData[selection].ingredient[4].itemId].itemName;
				//-------------------
			}
			
			GUI.Label (Rect (Screen.width /2 - 180, 230, 500, 100), ingrediantName5);
			GUI.Label (Rect (Screen.width /2 + 10, 230, 500, 100), craftingData[selection].ingredient[4].quantity.ToString());
			GUI.Label (Rect (Screen.width /2 + 40, 230, 500, 100), "(" + itemQty5 + ")");
		}
		//=========================================================
		
		if(GUI.Button(new Rect(Screen.width /2 -60 ,270,120,50), "Craft")){
			//uiPage = 1;
			var canCraft : boolean = CheckIngredients();
			if(canCraft){
				AddandRemoveItem();
			}
			ShowItemQuantity();
		}

	}

}

function ShowItemQuantity(){
	var a : int = 0;
	
	if(craftingData[selection].ingredient[0].itemType == 0){
		//Usable
		a = player.GetComponent(Inventory).FindItemSlot(craftingData[selection].ingredient[0].itemId);
		if(a <= player.GetComponent(Inventory).itemSlot.Length){
			itemQty1 = player.GetComponent(Inventory).itemQuantity[a];
		}else{
			itemQty1 = 0;
		}
	}else if(craftingData[selection].ingredient[0].itemType == 1){
		//Equipment
		a = player.GetComponent(Inventory).FindEquipmentSlot(craftingData[selection].ingredient[0].itemId);
		if(a <= player.GetComponent(Inventory).equipment.Length){
			itemQty1 = 1;
		}else{
			itemQty1 = 0;
		}
	}
	
	//=========================================================
	if(craftingData[selection].ingredient.Length >= 2){
		if(craftingData[selection].ingredient[1].itemType == 0){
			//Usable
			a = player.GetComponent(Inventory).FindItemSlot(craftingData[selection].ingredient[1].itemId);
			if(a <= player.GetComponent(Inventory).itemSlot.Length){
				itemQty2 = player.GetComponent(Inventory).itemQuantity[a];
			}else{
				itemQty2 = 0;
			}
		}else if(craftingData[selection].ingredient[1].itemType == 1){
			//Equipment
			a = player.GetComponent(Inventory).FindEquipmentSlot(craftingData[selection].ingredient[1].itemId);
			if(a <= player.GetComponent(Inventory).equipment.Length){
				itemQty2 = 1;
			}else{
				itemQty2 = 0;
			}
		}
	}
	//=========================================================
	if(craftingData[selection].ingredient.Length >= 3){
		if(craftingData[selection].ingredient[2].itemType == 0){
			//Usable
			a = player.GetComponent(Inventory).FindItemSlot(craftingData[selection].ingredient[2].itemId);
			if(a <= player.GetComponent(Inventory).itemSlot.Length){
				itemQty3 = player.GetComponent(Inventory).itemQuantity[a];
			}else{
				itemQty3 = 0;
			}
		}else if(craftingData[selection].ingredient[2].itemType == 1){
			//Equipment
			a = player.GetComponent(Inventory).FindEquipmentSlot(craftingData[selection].ingredient[2].itemId);
			if(a <= player.GetComponent(Inventory).equipment.Length){
				itemQty3 = 1;
			}else{
				itemQty3 = 0;
			}
		}
	}
	//=========================================================
	if(craftingData[selection].ingredient.Length >= 4){
		if(craftingData[selection].ingredient[3].itemType == 0){
			//Usable
			a = player.GetComponent(Inventory).FindItemSlot(craftingData[selection].ingredient[3].itemId);
			if(a <= player.GetComponent(Inventory).itemSlot.Length){
				itemQty4 = player.GetComponent(Inventory).itemQuantity[a];
			}else{
				itemQty4 = 0;
			}
		}else if(craftingData[selection].ingredient[3].itemType == 1){
			//Equipment
			a = player.GetComponent(Inventory).FindEquipmentSlot(craftingData[selection].ingredient[3].itemId);
			if(a <= player.GetComponent(Inventory).equipment.Length){
				itemQty4 = 1;
			}else{
				itemQty4 = 0;
			}
		}
	}
	//=========================================================
	if(craftingData[selection].ingredient.Length >= 5){
		if(craftingData[selection].ingredient[4].itemType == 0){
			//Usable
			a = player.GetComponent(Inventory).FindItemSlot(craftingData[selection].ingredient[4].itemId);
			if(a <= player.GetComponent(Inventory).itemSlot.Length){
				itemQty5 = player.GetComponent(Inventory).itemQuantity[a];
			}else{
				itemQty5 = 0;
			}
		}else if(craftingData[selection].ingredient[4].itemType == 1){
			//Equipment
			a = player.GetComponent(Inventory).FindEquipmentSlot(craftingData[selection].ingredient[4].itemId);
			if(a <= player.GetComponent(Inventory).equipment.Length){
				itemQty5 = 1;
			}else{
				itemQty5 = 0;
			}
		}
	}
}

function CheckIngredients() : boolean{
	var a : int = 0;
	while(a < craftingData[selection].ingredient.Length){
		var item : boolean = player.GetComponent(Inventory).CheckItem(craftingData[selection].ingredient[a].itemId , craftingData[selection].ingredient[a].itemType, craftingData[selection].ingredient[a].quantity);
		if(!item){
			showError = "Not enought items";
			return false;
		}
		a++;
	}
	
	return true;
}

function AddandRemoveItem(){
	if(craftingData[selection].gotItem.itemType == 0){
		var full : boolean = player.GetComponent(Inventory).AddItem(craftingData[selection].gotItem.itemId , craftingData[selection].gotItem.quantity);
	}else if(craftingData[selection].gotItem.itemType == 1){
		full = player.GetComponent(Inventory).AddEquipment(craftingData[selection].gotItem.itemId);
	}
	
	//Remove Ingrediant Items
	if(!full){
		var a : int = 0;
		while(a < craftingData[selection].ingredient.Length){
			if(craftingData[selection].ingredient[a].itemType == 0){
				player.GetComponent(Inventory).RemoveItem(craftingData[selection].ingredient[a].itemId , craftingData[selection].ingredient[a].quantity);
				//------------------
			}else if(craftingData[selection].ingredient[a].itemType == 1){
				player.GetComponent(Inventory).RemoveEquipment(craftingData[selection].ingredient[a].itemId);
				//------------------
			}
			a++;
		}
		showError = "You Got " + craftingData[selection].itemName;
	
	}else{
		showError = "Inventory Full";
	}

}

function OnOffMenu(){
	//Freeze Time Scale to 0 if Window is Showing
	if(uiPage == 0 && Time.timeScale != 0.0){
		if(!player){
			player = GameObject.FindWithTag("Player");
		}
		uiPage = 1;
		Time.timeScale = 0.0;
		showError = "";
		Screen.lockCursor = false;
	}else if(uiPage >= 1){
		uiPage = 0;
		Time.timeScale = 1.0;
		Screen.lockCursor = true;
	}

}

function OnTriggerEnter (other : Collider) {
	if (other.gameObject.tag == "Player") {
		var inven : Inventory = other.GetComponent(Inventory);
		if(inven){
			player = other.gameObject;
			enter = true;
		}
		
	}
	
}

function OnTriggerExit  (other : Collider) {
	//if (other.gameObject.tag == "Player") {
	if (other.gameObject == player) {
		enter = false;
	}
}

