#pragma strict
var player : GameObject;
//var mainCamPrefab : GameObject;
private var mainCam : Transform;

function Start () {
		//Check for Current Player in the scene
		var currentPlayer : GameObject = GameObject.FindWithTag ("Player");
		if(currentPlayer){
			// If there are the player in the scene already. Check for the Spawn Point Name
			// If it match then Move Player to the SpawnpointPosition
			var spawnPointName : String = currentPlayer.GetComponent(Status).spawnPointName;
			var spawnPoint : GameObject = GameObject.Find(spawnPointName);
			if(spawnPoint){
				currentPlayer.transform.position = spawnPoint.transform.position;
				currentPlayer.transform.rotation = spawnPoint.transform.rotation;
			}
			var oldCam : GameObject = currentPlayer.GetComponent(AttackTrigger).Maincam.gameObject;
			if(!oldCam){
				return;
			}
			var cam : GameObject[] = GameObject.FindGameObjectsWithTag("MainCamera"); 
    		for (var cam2 : GameObject in cam) { 
  			 	if(cam2 != oldCam){
  			 		Destroy(cam2.gameObject);
  			 	}
  			 }
			// If there are the player in the scene already. We will not spawn the new player.
			return;
		}
		//Spawn Player
		var spawnPlayer : GameObject = Instantiate(player, transform.position , transform.rotation);
		mainCam = GameObject.FindWithTag ("MainCamera").transform;
		var checkCam : ARPGcamera = mainCam.GetComponent(ARPGcamera);
		//Check for Main Camera
		if(mainCam && checkCam){
    		mainCam.GetComponent(ARPGcamera).target = spawnPlayer.transform;
		}/*else if(mainCam){
			Destroy (mainCam.gameObject);
		}*/
		
		Screen.lockCursor = true;
		//Set Target for All Enemy to Player
		/* var mon : GameObject[]; 
  		 mon = GameObject.FindGameObjectsWithTag("Enemy"); 
  			 for (var mo : GameObject in mon) { 
  			 	if(mo){
  			 		mo.GetComponent(AIset).followTarget = spawnPlayer.transform;
  			 	}
  			 }*/
}
