using UnityEngine;
using System.Collections;

public class ItemDataC : MonoBehaviour {
	
	[System.Serializable]
	public class Usable {
		public string itemName = "";
		public Texture2D icon;
		public GameObject model;
		public string description = "";
		public int price = 10;
		public int hpRecover = 0;
		public int mpRecover = 0;
		public int atkPlus = 0;
		public int defPlus = 0;
		public int matkPlus = 0;
		public int mdefPlus = 0;
		public bool unusable = false;
	} 
	[System.Serializable]
	public class Equip {
		public string itemName = "";
		public Texture2D icon;
		public GameObject model;
		public bool  assignAllWeapon = true;
		public string description = "";
		public int price = 10;
		public int weaponType = 0; //Use for Mecanim Weapon ID
		public int attack = 5;
		public int defense = 0;
		public int magicAttack = 0;
		public int magicDefense = 0;
		
		public enum EqType {
			Weapon = 0,
			Armor = 1,
		}
		public EqType EquipmentType = EqType.Weapon; 
		
		//Ignore if the equipment type is not weapons
		public GameObject attackPrefab;
		public AnimationClip[] attackCombo = new AnimationClip[3];
		public AnimationClip idleAnimation;
		public AnimationClip runAnimation;
		public AnimationClip rightAnimation;
		public AnimationClip leftAnimation;
		public AnimationClip backAnimation;
		public AnimationClip jumpAnimation;
		public enum whileAtk{
			MeleeFwd = 0,
			Immobile = 1,
			WalkFree = 2
		}
		public whileAtk whileAttack = whileAtk.MeleeFwd;
		public float attackSpeed = 0.18f;
		public float attackDelay = 0.12f;
	} 
	
	
	public Usable[] usableItem = new Usable[3];
	public Equip[] equipment = new Equip[3];
	
}