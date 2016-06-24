#pragma strict

class Usable {
		var itemName : String = "";
		var icon : Texture2D;
		var model : GameObject;
		var description : String = "";
		var price : int = 10;
		var hpRecover : int = 0;
		var mpRecover : int = 0;
		var atkPlus : int = 0;
		var defPlus : int = 0;
		var matkPlus : int = 0;
		var mdefPlus : int = 0;
		var unusable : boolean = false;
} 

class Equip {
		var itemName : String = "";
		var icon : Texture2D;
		var model : GameObject;
		var assignAllWeapon : boolean = true;
		var description : String = "";
		var price : int = 10;
		var weaponType : int = 0; //Use for Mecanim Weapon ID
		var attack : int = 5;
		var defense : int = 0;
		var magicAttack : int = 0;
		var magicDefense : int = 0;
		
		enum EqType {
			Weapon = 0,
			Armor = 1,
		}
		var EquipmentType : EqType = EqType.Weapon; 
		
		//Ignore if the equipment type is not weapons
		var attackPrefab : GameObject;
		var attackCombo : AnimationClip[] = new AnimationClip[3];
		var idleAnimation : AnimationClip;
  		var runAnimation : AnimationClip;
 		var rightAnimation : AnimationClip;
  		var leftAnimation : AnimationClip;
  		var backAnimation : AnimationClip;
  		var jumpAnimation : AnimationClip;
  		enum whileAtk{
			MeleeFwd = 0,
			Immobile = 1,
			WalkFree = 2
		}
		var whileAttack : whileAtk = whileAtk.MeleeFwd;
		var attackSpeed : float = 0.18;
		var attackDelay : float = 0.12;
} 


var usableItem : Usable[] = new Usable[3];
var equipment : Equip[] = new Equip[3];
