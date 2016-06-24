using UnityEngine;
using System.Collections;

[RequireComponent (typeof (BulletStatusC))]

public class SpawnPetC : MonoBehaviour {
	public GameObject petPrefab;
	public float additionY = 0.3f;
	
	void  Start (){
		GameObject source = GetComponent<BulletStatusC>().shooter;
		if(source.GetComponent<AttackTriggerC>().pet){
			source.GetComponent<AttackTriggerC>().pet.GetComponent<StatusC>().Death();
		}
		Vector3 spawnPoint = transform.position;
		spawnPoint.y += additionY;
		GameObject pet = Instantiate(petPrefab , spawnPoint , source.transform.rotation) as GameObject;
		pet.GetComponent<AIfriendC>().master = source.transform;
		source.GetComponent<AttackTriggerC>().pet = pet;
		Destroy(gameObject);
	}

}
