#pragma strict
var cashMin : int = 10;
var cashMax : int = 50;
var duration : float = 30.0;
private var master : Transform;

var popup : Transform;

function Start () {
	master = transform.root;
	GetComponent(Collider).isTrigger = true;
	if(duration > 0){
		Destroy(master.gameObject, duration);
	}
}

function OnTriggerEnter (other : Collider) {
		//Pick up Item
	if (other.gameObject.tag == "Player") {
		AddCashToPlayer(other.gameObject);
     }
 }
 
 function AddCashToPlayer(other : GameObject){
 		var gotCash = Random.Range(cashMin , cashMax);
		other.GetComponent(Inventory).cash += gotCash;
		master = transform.root;
		
		if(popup){
			var pop : Transform = Instantiate(popup, transform.position , transform.rotation);
			pop.GetComponent(DamagePopup).damage = "Money " + gotCash.ToString();
		}
			
    	Destroy(master.gameObject);
 }
 
@script AddComponentMenu ("Action-RPG Kit/Create Pickup Cash")
