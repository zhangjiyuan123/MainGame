#pragma strict
class CraftData{
	var itemName : String = "";
	var ingredient : Ingredients[] = new Ingredients[2];
	var gotItem : Ingredients;
}

class Ingredients{
	var itemId : int = 1;
	var itemType : ItType = ItType.Usable;
	var quantity : int = 1;
}

var craftingData : CraftData[] = new CraftData[3];
