#pragma strict
var petPrefab : GameObject;
var additionY : float = 0.3;

function Start () {
	var source : GameObject = GetComponent(BulletStatus).shooter;
	if(source.GetComponent(AttackTrigger).pet){
		source.GetComponent(AttackTrigger).pet.GetComponent(Status).Death();
	}
	var spawnPoint : Vector3 = transform.position;
	spawnPoint.y += additionY;
	var pet : GameObject = Instantiate(petPrefab , spawnPoint , source.transform.rotation);
	pet.GetComponent(AIfriend).master = source.transform;
	source.GetComponent(AttackTrigger).pet = pet;
	Destroy(gameObject);
}

@script RequireComponent(BulletStatus)