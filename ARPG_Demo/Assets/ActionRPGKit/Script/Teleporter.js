#pragma strict
var teleportToMap : String = "Level1";
var spawnPointName : String = "PlayerSpawnPoint"; //Use for Move Player to the SpawnPoint Position
//var spawnPosition : Vector3;

function Start () {

}

function OnTriggerEnter (other : Collider) {
		if(other.tag == "Player"){
			other.GetComponent(Status).spawnPointName = spawnPointName;
			ChangeMap();
		}

}

function ChangeMap(){
	Application.LoadLevel (teleportToMap);
}

@script AddComponentMenu ("Action-RPG Kit/Create Teleporter")