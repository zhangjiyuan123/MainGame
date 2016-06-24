#pragma strict
class ItemDrop{
	var itemPrefab : GameObject;
	@Range (0, 100)
	var dropChance : int = 20;
}
var itemDropSetting : ItemDrop[] = new ItemDrop[1];
var randomPosition : float = 1.0;
var dropUpward : float = 0;

function Start () {
	for(var n = 0; n < itemDropSetting.Length ; n++){
		var ran : int = Random.Range(0 , 100);
		if(ran <= itemDropSetting[n].dropChance){
			var ranPos : Vector3 = transform.position; //Slightly Random x z position.
			ranPos.x += Random.Range(0.0,randomPosition);
			ranPos.z += Random.Range(0.0,randomPosition);
			ranPos.y += dropUpward;
			//Drop Item
			Instantiate(itemDropSetting[n].itemPrefab , ranPos , itemDropSetting[n].itemPrefab.transform.rotation);
		}
	}
	
}
