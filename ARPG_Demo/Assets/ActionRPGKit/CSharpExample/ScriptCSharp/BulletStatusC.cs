using UnityEngine;
using System.Collections;

public class BulletStatusC : MonoBehaviour {
	
	public int damage = 10;
	public int damageMax = 20;
	
	private int playerAttack = 5;
	public int totalDamage = 0;
	public int variance = 15;
	public string shooterTag = "Player";
	[HideInInspector]
	public GameObject shooter;
	
	public Transform Popup;
	
	public GameObject hitEffect;
	public bool  flinch = false;
	public bool  penetrate = false;
	private string popDamage = "";

	public enum AtkType {
		Physic = 0,
		Magic = 1,
	}
	
	public AtkType AttackType = AtkType.Physic;

	public enum Elementala{
		Normal = 0,
		Fire = 1,
		Ice = 2,
		Earth = 3,
		Lightning = 4,
	}
	public Elementala element = Elementala.Normal;
	
	void  Start (){
		if(variance >= 100){
			variance = 100;
		}
		if(variance <= 1){
			variance = 1;
		}

	}
	
	public void  Setting ( int str  ,   int mag  ,   string tag  ,   GameObject owner  ){
		//print ("GuSetLaew");
		if(AttackType == AtkType.Physic){
			playerAttack = str;
		}else{
			playerAttack = mag;
		}
		shooterTag = tag;
		shooter = owner;
		int varMin = 100 - variance;
		int varMax = 100 + variance;
		int randomDmg = Random.Range(damage, damageMax);
		totalDamage = (randomDmg + playerAttack) * Random.Range(varMin ,varMax) / 100;
	}

	
	void  OnTriggerEnter ( Collider other  ){  	
		//When Player Shoot at Enemy
		//GameObject dmgPop = new GameObject();
		//GameObject clone1 = new GameObject();
		if(shooterTag == "Player" && other.tag == "Enemy"){	  
			Transform dmgPop = Instantiate(Popup, other.transform.position , transform.rotation) as Transform;
			
			if(AttackType == AtkType.Physic){
				popDamage = other.GetComponent<StatusC>().OnDamage(totalDamage , (int)element);
			}else{
				popDamage = other.GetComponent<StatusC>().OnMagicDamage(totalDamage , (int)element);
			}
			if(shooter && shooter.GetComponent<ShowEnemyHealthC>()){
	    		shooter.GetComponent<ShowEnemyHealthC>().GetHP(other.GetComponent<StatusC>().maxHealth , other.gameObject , other.name);
	    	}
			dmgPop.GetComponent<DamagePopupC>().damage = popDamage;	
			
			if(hitEffect){
				Instantiate(hitEffect, transform.position , transform.rotation);
			}
			if(flinch){
				Vector3 dir = (other.transform.position - transform.position).normalized;
				//other.GetComponent<AIsetC>().Flinch(dir);
				other.SendMessage("Flinch" , dir , SendMessageOptions.DontRequireReceiver);
			}
			if(!penetrate){
				Destroy (gameObject);
			}
			//When Enemy Shoot at Player
		}else if(shooterTag == "Enemy" && other.tag == "Player" || shooterTag == "Enemy" && other.tag == "Ally"){  	
			if(AttackType == AtkType.Physic){
				popDamage = other.GetComponent<StatusC>().OnDamage(totalDamage , (int)element);
			}else{
				popDamage = other.GetComponent<StatusC>().OnMagicDamage(totalDamage , (int)element);
			}
			Transform dmgPop = Instantiate(Popup, transform.position , transform.rotation) as Transform;	
			dmgPop.GetComponent<DamagePopupC>().damage = popDamage;
			
			if(hitEffect){
				Instantiate(hitEffect, transform.position , transform.rotation);
			}
			if(flinch){
				Vector3 dir = (other.transform.position - transform.position).normalized;
				//other.GetComponent<AttackTriggerC>().Flinch(dir);
				other.SendMessage("Flinch" , dir , SendMessageOptions.DontRequireReceiver);
			}
			if(!penetrate){
				Destroy (gameObject);
			}
		}
	}
}