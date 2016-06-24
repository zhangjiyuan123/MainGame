#pragma strict
class PlayerData{
	var playerName : String = "";
	var playerPrefab : GameObject;
	var characterSelectModel : GameObject;
	var description : TextDialogue;
	var guiDescription : Texture2D;
}
var player : PlayerData[] = new PlayerData[3];