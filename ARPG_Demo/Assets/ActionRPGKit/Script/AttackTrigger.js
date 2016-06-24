#pragma strict
var mainModel : GameObject;
var attackPoint : Transform;
var cameraZoomPoint : Transform; // For Raycast Mode
var attackPrefab : Transform;
var useMecanim : boolean = false;

enum whileAtk{
		MeleeFwd = 0,
		Immobile = 1,
		WalkFree = 2
}
var whileAttack : whileAtk = whileAtk.MeleeFwd;

enum AimType{
		Normal = 0,
		Raycast = 1
}
var aimingType : AimType = AimType.Normal;

var skillPrefab : Transform[] = new Transform[3];

private var atkDelay : boolean = false;
var freeze : boolean = false;

var skillIcon : Texture2D[] = new Texture2D[3];
var skillIconSize : int = 80;

var attackSpeed : float = 0.15;
private var nextFire : float = 0.0;
var atkDelay1 : float = 0.1;
var skillDelay : float = 0.3;

var attackCombo : AnimationClip[] = new AnimationClip[3];
var attackAnimationSpeed : float = 1.0;
var skillAnimation : AnimationClip[] = new AnimationClip[3];
var skillAnimationSpeed : float = 1.0;
var manaCost : int[] = new int[3];
private var hurt : AnimationClip;


private var meleefwd : boolean = false;
@HideInInspector
var isCasting : boolean = false;

private var c : int = 0;
private var conCombo : int = 0;

var Maincam : Transform;
var MaincamPrefab : GameObject;
var attackPointPrefab : GameObject;

private var str : int = 0;
private var matk : int = 0;

var aimIcon : Texture2D;
var aimIconSize : int = 40;

@HideInInspector
var flinch : boolean = false;
private var skillEquip : int  = 0;
private var knock : Vector3 = Vector3.zero;

class AtkSound{
		var attackComboVoice : AudioClip[] = new AudioClip[3];
		var magicCastVoice : AudioClip;
		var hurtVoice : AudioClip;
}
var sound : AtkSound;

@HideInInspector
var pet : GameObject;

function Awake () {
	gameObject.tag = "Player"; 
	if(!Maincam){
    	var newCam : GameObject = GameObject.FindWithTag ("MainCamera");
    	if(!newCam){
    		newCam = Instantiate(MaincamPrefab, transform.position , transform.rotation);
    	}
    	Maincam = newCam.transform;
    }
    
    if(!mainModel){
    	mainModel = this.gameObject;
    }
    //Assign This mainModel to Status Script
    GetComponent(Status).mainModel = mainModel;
    GetComponent(Status).useMecanim = useMecanim;
    //Check if Main Camera does not attached ARPGcamera Script. Destroy it and spawn New Camera from MainCamPrefab
    if(Maincam){
    	var checkCam : ARPGcamera = Maincam.GetComponent(ARPGcamera);
    	if (!checkCam) {
    		Destroy (Maincam.gameObject);
    		newCam = Instantiate(MaincamPrefab, transform.position , transform.rotation);
    		Maincam = newCam.transform;
    	}
    }else{
    		newCam = Instantiate(MaincamPrefab, transform.position , transform.rotation);
    		Maincam = newCam.transform;
    }
    
   		 // Set Target to ARPG Camera
    	if(!cameraZoomPoint || aimingType == AimType.Normal){
    		//cameraZoomPoint = this.transform;
    		Maincam.GetComponent(ARPGcamera).target = this.transform;
    	}else{
    		Maincam.GetComponent(ARPGcamera).target = cameraZoomPoint;
    	}
    	Maincam.GetComponent(ARPGcamera).targetBody = this.transform;
    	
	str = GetComponent(Status).addAtk;
	matk = GetComponent(Status).addMatk;
	//Set All Attack Animation'sLayer to 15
	var animationSize : int = attackCombo.length;
	var a : int = 0;
	if(animationSize > 0 && !useMecanim){
		while(a < animationSize && attackCombo[a]){
			mainModel.GetComponent.<Animation>()[attackCombo[a].name].layer = 15;
			a++;
		}
	}
	
//--------------------------------
	//Spawn new Attack Point if you didn't assign it.
    if(!attackPoint){
    	if(!attackPointPrefab){
    		print("Please assign Attack Point");
    		freeze = true;
    		return;
    	}
    	var newAtkPoint : GameObject = Instantiate(attackPointPrefab, transform.position , transform.rotation);
    	newAtkPoint.transform.parent = this.transform;
    	attackPoint = newAtkPoint.transform;	
    }
    if(!useMecanim){
    	hurt = GetComponent(PlayerAnimation).hurt;
    }
    if(aimingType == AimType.Raycast){//Auto Lock On for Raycast Mode
		Maincam.GetComponent(ARPGcamera).lockOn = true;
	}
}


function Update () {
	var stat : Status = GetComponent(Status);
	if(freeze || atkDelay || Time.timeScale == 0.0 || stat.freeze){
		return;
	}
	var controller : CharacterController = GetComponent(CharacterController);
	if (flinch){
		controller.Move(knock * 6* Time.deltaTime);
		return;
	}
		
	if (meleefwd){
		var lui : Vector3 = transform.TransformDirection(Vector3.forward);
		controller.Move(lui * 5 * Time.deltaTime);
	}
	
	if(aimingType == AimType.Raycast){
		Aiming();
	}else{
		attackPoint.transform.rotation = Maincam.GetComponent(ARPGcamera).aim;
	}
	var bulletShootout : Transform;
//----------------------------
	//Normal Trigger
		if (Input.GetButton("Fire1") && Time.time > nextFire && !isCasting) {
			if(Time.time > (nextFire + 0.5)){
				c = 0;
			}
		//Attack Combo
			if(attackCombo.Length >= 1){
				conCombo++;
				AttackCombo();
			}
		}
		//Magic
		if (Input.GetButtonDown("Fire2") && Time.time > nextFire && !isCasting && skillPrefab[skillEquip] && !stat.silence) {
			MagicSkill(skillEquip);
		}
		if(Input.GetKeyDown("1") && !isCasting && skillPrefab[0]){
			skillEquip = 0;
		}
		if(Input.GetKeyDown("2") && !isCasting && skillPrefab[1]){
			skillEquip = 1;
		}
		if(Input.GetKeyDown("3") && !isCasting && skillPrefab[2]){
			skillEquip = 2;
		}
		//------------------------------
		
}

function OnGUI () {
	if(aimingType == AimType.Normal){
		GUI.DrawTexture (Rect (Screen.width/2 - 16,Screen.height/2 - 90,aimIconSize,aimIconSize), aimIcon);
	}
	if(aimingType == AimType.Raycast){
		GUI.DrawTexture(Rect(Screen.width /2 -20, Screen.height /2 -20,40,40), aimIcon);
	}
	
	if(skillPrefab[skillEquip] && skillIcon[skillEquip]){
		GUI.DrawTexture (Rect (Screen.width -skillIconSize - 28,Screen.height - skillIconSize - 20,skillIconSize,skillIconSize), skillIcon[skillEquip]);
	}
	if(skillPrefab[0] && skillIcon[0]){
		GUI.DrawTexture (Rect (Screen.width -skillIconSize -50,Screen.height - skillIconSize -50,skillIconSize /2,skillIconSize /2), skillIcon[0]);
	}
	if(skillPrefab[1] && skillIcon[1]){
		GUI.DrawTexture (Rect (Screen.width -skillIconSize -10,Screen.height - skillIconSize -60,skillIconSize /2,skillIconSize /2), skillIcon[1]);
	}
	if(skillPrefab[2] && skillIcon[2]){
		GUI.DrawTexture (Rect (Screen.width -skillIconSize +30 ,Screen.height - skillIconSize -50,skillIconSize /2,skillIconSize /2), skillIcon[2]);
	}
}

function AttackCombo(){
	if(!attackCombo[c]){
		print("Please assign attack animation in Attack Combo");
		return;
	}
	str = GetComponent(Status).addAtk;
	matk = GetComponent(Status).addMatk;
	var bulletShootout : Transform;
	isCasting = true;
	// If Melee Dash
	if(whileAttack == whileAtk.MeleeFwd){
			GetComponent(CharacterMotor).canControl = false;
			MeleeDash();
	}
	// If Immobile
	if(whileAttack == whileAtk.Immobile){
			GetComponent(CharacterMotor).canControl = false;
	}
	if(sound.attackComboVoice.Length > c && sound.attackComboVoice[c]){
			GetComponent.<AudioSource>().clip = sound.attackComboVoice[c];
			GetComponent.<AudioSource>().Play();
		}
	
	while(conCombo > 0){
		if(!useMecanim){
			//For Legacy Animation
			if(c >= 1){
				mainModel.GetComponent.<Animation>().PlayQueued(attackCombo[c].name, QueueMode.PlayNow).speed = attackAnimationSpeed;
			}else{
				mainModel.GetComponent.<Animation>().PlayQueued(attackCombo[c].name, QueueMode.PlayNow).speed = attackAnimationSpeed;
			}
			var wait : float = mainModel.GetComponent.<Animation>()[attackCombo[c].name].length;
		}else{
			//For Mecanim Animation
			GetComponent(PlayerMecanimAnimation).AttackAnimation(attackCombo[c].name);
			var clip = GetComponent(PlayerMecanimAnimation).animator.GetCurrentAnimatorClipInfo(0);
			wait = clip.Length -0.3;
		}
	
	//var wait : float = mainModel.animation[attackCombo[c].name].length;
	
	yield WaitForSeconds(atkDelay1);
	c++;
	
	nextFire = Time.time + attackSpeed;
			bulletShootout = Instantiate(attackPrefab, attackPoint.transform.position , attackPoint.transform.rotation);
			bulletShootout.GetComponent(BulletStatus).Setting(str , matk , "Player" , this.gameObject);
			conCombo -= 1;
			
	if(c >= attackCombo.Length){
		c = 0;
		atkDelay = true;
		yield WaitForSeconds(wait - atkDelay1);
		atkDelay = false;
	}else{
		yield WaitForSeconds(attackSpeed);
	}
	
	}
	
	//yield WaitForSeconds(attackSpeed);
	isCasting = false;
	GetComponent(CharacterMotor).canControl = true;
}

function MeleeDash(){
	meleefwd = true;
	yield WaitForSeconds(0.2);
	meleefwd = false;

}

//---------------------
//-------
function MagicSkill(skillID : int){
	if(!skillAnimation[skillID]){
		print("Please assign skill animation in Skill Animation");
		return;
	}
	str = GetComponent(Status).addAtk;
	matk = GetComponent(Status).addMatk;
	
	if(GetComponent(Status).mana < manaCost[skillID] || GetComponent(Status).silence){
		return;
	}
	if(sound.magicCastVoice){
			GetComponent.<AudioSource>().clip = sound.magicCastVoice;
			GetComponent.<AudioSource>().Play();
		}
	isCasting = true;
	GetComponent(CharacterMotor).canControl = false;
	if(!useMecanim){
		//For Legacy Animation
		mainModel.GetComponent.<Animation>()[skillAnimation[skillID].name].layer = 16;
		mainModel.GetComponent.<Animation>()[skillAnimation[skillID].name].speed = skillAnimationSpeed;
		mainModel.GetComponent.<Animation>().Play(skillAnimation[skillID].name);
		var wait : float = mainModel.GetComponent.<Animation>()[skillAnimation[skillID].name].length -0.3;
	}else{
		//For Mecanim Animation
		GetComponent(PlayerMecanimAnimation).AttackAnimation(skillAnimation[skillID].name);
		var clip = GetComponent(PlayerMecanimAnimation).animator.GetCurrentAnimatorClipInfo(0);
		wait = clip.Length -0.3;
	}
		
	nextFire = Time.time + skillDelay;
	Maincam.GetComponent(ARPGcamera).lockOn = true;
	var bulletShootout : Transform;
	
	yield WaitForSeconds(wait);
	if(aimingType == AimType.Normal){
		Maincam.GetComponent(ARPGcamera).lockOn = false;
	}
	bulletShootout = Instantiate(skillPrefab[skillID], attackPoint.transform.position , attackPoint.transform.rotation);
	bulletShootout.GetComponent(BulletStatus).Setting(str , matk , "Player" , this.gameObject);
	yield WaitForSeconds(skillDelay);
	isCasting = false;
	GetComponent(CharacterMotor).canControl = true;
	GetComponent(Status).mana -= manaCost[skillID];
}

function Flinch(dir : Vector3){
		knock = dir;
		if(sound.hurtVoice && GetComponent(Status).health >= 1){
			GetComponent.<AudioSource>().clip = sound.hurtVoice;
			GetComponent.<AudioSource>().Play();
		}
		GetComponent(CharacterMotor).canControl = false;
		KnockBack();
		if(!useMecanim){
			//For Legacy Animation
			mainModel.GetComponent.<Animation>().PlayQueued(hurt.name, QueueMode.PlayNow);
		}
		GetComponent(CharacterMotor).canControl = true;
	}
	
function KnockBack(){
	flinch = true;
	yield WaitForSeconds(0.2);
	flinch = false;
}

function Aiming(){
		var ray : Ray = Maincam.GetComponent.<Camera>().ViewportPointToRay (Vector3(0.5,0.5,0));
		// Do a raycast
		var hit : RaycastHit;
		//if (Physics.Raycast (ray, hit) && hit.transform.tag == "Wall" || Physics.Raycast (ray, hit) && hit.transform.tag == "Enemy"){
		if (Physics.Raycast (ray, hit)){
			attackPoint.transform.LookAt(hit.point);
		}else{
			attackPoint.transform.rotation = Maincam.transform.rotation;
		}
}

@script RequireComponent (Status)
@script RequireComponent (StatusWindow)
@script RequireComponent (HealthBar)
//@script RequireComponent (PlayerAnimation)
@script RequireComponent (PlayerInputController)
@script RequireComponent (CharacterMotor)
@script RequireComponent (Inventory)
@script RequireComponent (QuestStat)
@script RequireComponent (SkillWindow)
@script RequireComponent (DontDestroyOnload)