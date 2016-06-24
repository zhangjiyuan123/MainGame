using UnityEngine;
using System.Collections;

[RequireComponent (typeof (StatusC))]
[RequireComponent (typeof (StatusWindowC))]
[RequireComponent (typeof (HealthBarC))]
//[RequireComponent (typeof (PlayerAnimationC))]
[RequireComponent (typeof (PlayerInputControllerC))]
[RequireComponent (typeof (CharacterMotorC))]
[RequireComponent (typeof (InventoryC))]
[RequireComponent (typeof (QuestStatC))]
[RequireComponent (typeof (SkillWindowC))]
[RequireComponent (typeof (DontDestroyOnloadC))]

public class AttackTriggerC : MonoBehaviour {
	
	//private bool  masterNetwork = false;
	public GameObject mainModel;
	public Transform attackPoint;
	public Transform cameraZoomPoint;
	public Transform attackPrefab;
	public bool useMecanim = false;

	public enum whileAtk{
		MeleeFwd = 0,
		Immobile = 1,
		WalkFree = 2
	}
	public whileAtk whileAttack = whileAtk.MeleeFwd;
	
	public enum AimType{
		Normal = 0,
		Raycast = 1
	}
    [HideInInspector]
    public enum AIState { Moving = 0, Pausing = 1, Idle = 2, Patrol = 3 }

    public AimType aimingType = AimType.Normal;
	
	public Transform[] skillPrefab = new Transform[3];
	
	private bool  atkDelay = false;
	public bool  freeze = false;
	
	public Texture2D[] skillIcon = new Texture2D[3];
	public int skillIconSize = 80;
	
	public float attackSpeed = 0.15f;
	private float nextFire = 0.0f;
	public float atkDelay1 = 0.1f;
	public float skillDelay = 0.3f;
	
	public AnimationClip[] attackCombo = new AnimationClip[3];
	public float attackAnimationSpeed = 1.0f;
	public AnimationClip[] skillAnimation = new AnimationClip[3];
	public float skillAnimationSpeed = 1.0f;
	public int[] manaCost = new int[3];
	private AnimationClip hurt;
	
	
	private bool  meleefwd = false;
	[HideInInspector]
	public bool  isCasting = false;
	
	private int c = 0;
	private int conCombo = 0;
	
	public Transform Maincam;
	public GameObject MaincamPrefab;
	public GameObject attackPointPrefab;
	
	private int str = 0;
	private int matk = 0;
	
	public Texture2D aimIcon;
	public int aimIconSize = 40;

	[HideInInspector]
	public bool  flinch = false;
	private int skillEquip  = 0;
	private Vector3 knock = Vector3.zero;

	//----------Sounds-------------
	[System.Serializable]
	public class AtkSound {
		public AudioClip[] attackComboVoice = new AudioClip[3];
		public AudioClip magicCastVoice;
		public AudioClip hurtVoice;
	}
	public AtkSound sound;

	[HideInInspector]
	public GameObject pet;

    private StatusC mStatusC = null;
    private CharacterController controller = null;
    private CharacterMotorC cmc = null;
    private Animation mAnim = null;
    private Animator mAnimator = null;
    private AudioSource mAudio = null;
    /// <summary>
    /// 移动状态
    /// </summary>
    [HideInInspector] 
    public AIState followState;
    /// <summary>
    /// 距离目的地的距离
    /// </summary>
    private float distance = 0.0f;
    /// <summary>
    /// 移动速度
    /// </summary>
    public float speed = 2.0f;
    /// <summary>
    /// 到达的间距
    /// </summary>
    public float approachDistance = 1f;
    public float lostSight = 100.0f;
    void Awake() {
        if (!mainModel) {
            mainModel = this.gameObject;
        }
        mStatusC = GetComponent<StatusC>();
        //Assign This mainModel to Status Script
        mStatusC.mainModel = mainModel;
        mStatusC.useMecanim = useMecanim;
        //Set tag to Player.
        gameObject.tag = "Player";
        controller = GetComponent<CharacterController>();
        cmc = GetComponent<CharacterMotorC>();

        if (!useMecanim)
        {
            mAnim = mainModel.GetComponent<Animation>();
        }
        else
        {
            if (!mAnimator)
            {
                mAnimator = mainModel.GetComponent<Animator>();
            }
        }
        

        GameObject[] cam = GameObject.FindGameObjectsWithTag("MainCamera"); 
		foreach(GameObject cam2 in cam) { 
			if(cam2){
				Destroy(cam2.gameObject);
			}
		}
		GameObject newCam = GameObject.FindWithTag ("MainCamera");
		newCam = Instantiate(MaincamPrefab, transform.position , transform.rotation) as GameObject;
		Maincam = newCam.transform;
		//Maincam.GetComponent<ARPGcameraC>().target = this.transform;
		// Set Target to ARPG Camera
    	if(!cameraZoomPoint || aimingType == AimType.Normal){
    		//cameraZoomPoint = this.transform;
    		Maincam.GetComponent<ARPGcameraC>().target = this.transform;
    	}else{
    		Maincam.GetComponent<ARPGcameraC>().target = cameraZoomPoint;
    	}
    	Maincam.GetComponent<ARPGcameraC>().targetBody = this.transform;

		str = mStatusC.addAtk;
		matk = mStatusC.addMatk;
		//Set All Attack Animation'sLayer to 15
		int animationSize = attackCombo.Length;
		int a = 0;
		if(animationSize > 0 && !useMecanim){
			while(a < animationSize && attackCombo[a]){
				mAnim[attackCombo[a].name].layer = 15;
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
			GameObject newAtkPoint = Instantiate(attackPointPrefab, transform.position , transform.rotation) as GameObject;
			newAtkPoint.transform.parent = this.transform;
			attackPoint = newAtkPoint.transform;	
		}

		if (!useMecanim){
			hurt = GetComponent<PlayerAnimationC> ().hurt;
		}
		if(aimingType == AimType.Raycast){//Auto Lock On for Raycast Mode
			Maincam.GetComponent<ARPGcameraC>().lockOn = true;
		}
		GameObject minimap = GameObject.FindWithTag("Minimap");
			if(minimap){
				GameObject mapcam = minimap.GetComponent<MinimapOnOffC>().minimapCam;
				mapcam.GetComponent<MinimapCameraC>().target = this.transform;
			}

        followState = AIState.Idle;
        if (!useMecanim)
        {
            //If using Legacy Animation
            mAnim = mainModel.GetComponent<Animation>();
            mAnim.Play("idle");
           // mAnim[hurtAnimation.name].layer = 10;
        }
        else
        {
            //If using Mecanim Animation
            if (!mAnimator)
            {
                mAnimator = mainModel.GetComponent<Animator>();
            }
        }
        mAudio = GetComponent<AudioSource>();
    }

    private bool canAttack;
	void  Update (){
		//StatusC stat = mStatusC;
		if(freeze || atkDelay || Time.timeScale == 0.0f || mStatusC.freeze){
			return;
		}
		//CharacterController controller = GetComponent<CharacterController>();
		if (flinch){
			controller.Move(knock * 6* Time.deltaTime);
			return;
		}

        if(mStatusC.health<1)
        {
            return;
        }
		
		if (meleefwd){
			Vector3 lui = transform.TransformDirection(Vector3.forward);
			controller.Move(lui * 5 * Time.deltaTime);
		}
		if(aimingType == AimType.Raycast){
			Aiming();
		}else{
			attackPoint.transform.rotation = Maincam.GetComponent<ARPGcameraC>().aim;
		}
        FindClosestEnemy();

        //自动锁定怪物
        if (!followTarget)
        {
            return;
        }
        //-----------------------------------

        if (followState == AIState.Moving)
        {
            if ((followTarget.position - transform.position).magnitude <= approachDistance)
            {
                followState = AIState.Pausing;
                if (!useMecanim)
                {
                    //If using Legacy Animation
                    mAnim.CrossFade("idle", 0.2f);//(idleAnimation.name, 0.2f);
                }
                else
                {
                    // mAnimator.SetBool("running", false);
                    mAnimator.CrossFade("idle", 0.2f);
                    mAnimator.SetBool("running", false);
                }
                //----Attack----
                //Attack();
                // StartCoroutine(Attack());
                canAttack = true;
            }
            else if ((followTarget.position - transform.position).magnitude >= lostSight)
            {//Lost Sight 暂时没有主角失去视野的选项
                mStatusC.health = mStatusC.maxHealth;
                followState = AIState.Idle;
                if (!useMecanim)
                {
                    //If using Legacy Animation
                    mAnim.CrossFade("idle", 0.2f);
                }
                else
                {
                   // mAnimator.SetBool("running", false);
                    mAnimator.CrossFade("idle", 0.2f);
                    mAnimator.SetBool("running", false);
                }
            }
            else
            {
                
                if (!useMecanim)
                {
                    //If using Legacy Animation
                    if(!mAnim.IsPlaying("run"))
                    {
                        mAnim.Play("run");//(idleAnimation.name, 0.2f);
                    }
                }
                else
                {
                   // mAnimator.SetBool("running", true);
                    mAnimator.Play("running");
                }
                Vector3 forward = transform.TransformDirection(Vector3.forward);
                controller.Move(forward * speed * Time.deltaTime);

                Vector3 destinationy = followTarget.position;
                destinationy.y = transform.position.y;
                transform.LookAt(destinationy);
            }
        }
        else if (followState == AIState.Pausing)
        {
            Vector3 destinya = followTarget.position;
            destinya.y = transform.position.y;
            transform.LookAt(destinya);

            distance = (transform.position - GetDestination()).magnitude;
            if (distance > approachDistance)
            {
                followState = AIState.Moving;
                if (!useMecanim)
                {
                    //If using Legacy Animation
                    mAnim.CrossFade("run",0.2f);//(movingAnimation.name, 0.2f);
                }
                else
                {
                   // mAnimator.SetBool("runnning", true);
                    mAnimator.Play("running");

                }
            }
            else
            {
                canAttack = true;
            }
        }
        //----------------Idle Mode--------------
        else if (followState == AIState.Idle)
        {
            Vector3 destinyheight = followTarget.position;
            destinyheight.y = transform.position.y - destinyheight.y;
            int getHealth = mStatusC.maxHealth - mStatusC.health;

            distance = (transform.position - GetDestination()).magnitude;
            if (distance < detectRange && Mathf.Abs(destinyheight.y) <= 4 || getHealth > 0)
            {
                followState = AIState.Moving;
                if (!useMecanim)
                {
                    //If using Legacy Animation
                    mAnim.CrossFade("run", 0.2f);//(movingAnimation.name, 0.2f);
                }
                else
                {
                  //  mAnimator.SetBool("running", true);
                    mAnimator.Play("running");

                }
            }
        }

        //----------------------------

        //战斗修改
        //Normal Trigger
        //if (Input.GetButton("Fire1") && Time.time > nextFire && !isCasting) {
        if (canAttack&&Time.time > nextFire && !isCasting) {

			if(Time.time > (nextFire + 0.5f)){
				c = 0;
			}
			//Attack Combo
			if(attackCombo.Length >= 1){
				conCombo++;
				//AttackCombo();
				StartCoroutine(AttackCombo());
			}
		}
		//Magic
		if (Input.GetButtonDown("Fire2") && Time.time > nextFire && !isCasting && skillPrefab[skillEquip] && !mStatusC.silence) {
		//if (Time.time > nextFire && !isCasting && skillPrefab[skillEquip] && !mStatusC.silence) {

			//MagicSkill(skillEquip);
			StartCoroutine(MagicSkill(skillEquip));
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
		
	}
	//Hit Bear :P
	void  OnGUI (){
		if(aimingType == AimType.Normal){
			GUI.DrawTexture ( new Rect(Screen.width/2 - 16,Screen.height/2 - 90,aimIconSize,aimIconSize), aimIcon);
		}
		if(aimingType == AimType.Raycast){
			GUI.DrawTexture ( new Rect(Screen.width/2 - 20,Screen.height/2 - 20,40,40), aimIcon);
		}
		
		
		if(skillPrefab[skillEquip] && skillIcon[skillEquip]){
			GUI.DrawTexture ( new Rect(Screen.width -skillIconSize - 28,Screen.height - skillIconSize - 20,skillIconSize,skillIconSize), skillIcon[skillEquip]);
		}
		if(skillPrefab[0] && skillIcon[0]){
			GUI.DrawTexture ( new Rect(Screen.width -skillIconSize -50,Screen.height - skillIconSize -50,skillIconSize /2,skillIconSize /2), skillIcon[0]);
		}
		if(skillPrefab[1] && skillIcon[1]){
			GUI.DrawTexture ( new Rect(Screen.width -skillIconSize -10,Screen.height - skillIconSize -60,skillIconSize /2,skillIconSize /2), skillIcon[1]);
		}
		if(skillPrefab[2] && skillIcon[2]){
			GUI.DrawTexture ( new Rect(Screen.width -skillIconSize +30 ,Screen.height - skillIconSize -50,skillIconSize /2,skillIconSize /2), skillIcon[2]);
		}
	}


	IEnumerator  AttackCombo (){
		float wait = 0.0f;
		if (attackCombo [c]) {
			str = mStatusC.addAtk;
			matk = mStatusC.addMatk;
			Transform bulletShootout;
			isCasting = true;
			// If Melee Dash
			if(whileAttack == whileAtk.MeleeFwd){
				cmc.canControl = false;
				//MeleeDash();
				StartCoroutine(MeleeDash());
			}
			// If Immobile
			if(whileAttack == whileAtk.Immobile){
				cmc.canControl = false;
			}

			if(sound.attackComboVoice.Length > c && sound.attackComboVoice[c]){
				mAudio.clip = sound.attackComboVoice[c];
				mAudio.Play();
			}
			
			while(conCombo > 0){
				if(!useMecanim){
					//For Legacy Animation
					if(c >= 1){
						mAnim.PlayQueued(attackCombo[c].name, QueueMode.PlayNow).speed = attackAnimationSpeed;
					}else{
						mAnim.PlayQueued(attackCombo[c].name, QueueMode.PlayNow).speed = attackAnimationSpeed;
					}
					
					wait = mAnim[attackCombo[c].name].length;
				}else{
					//For Mecanim Animation
					GetComponent<PlayerMecanimAnimationC>().AttackAnimation(attackCombo[c].name);
					float clip = GetComponent<PlayerMecanimAnimationC>().animator.GetCurrentAnimatorClipInfo(0).Length;
					wait = clip -0.3f;
				}
				
				yield return new WaitForSeconds(atkDelay1);
				c++;
				
				nextFire = Time.time + attackSpeed;
				bulletShootout = Instantiate(attackPrefab, attackPoint.transform.position , attackPoint.transform.rotation) as Transform;
				bulletShootout.GetComponent<BulletStatusC>().Setting(str , matk , "Player" , this.gameObject);
				conCombo -= 1;
				
				if(c >= attackCombo.Length){
					c = 0;
					atkDelay = true;
					yield return new WaitForSeconds(wait);
					atkDelay = false;
				}else{
					yield return new WaitForSeconds(attackSpeed);
				}
				
			}
			
			isCasting = false;
			cmc.canControl = true;
		} else {
			print ("Please assign attack animation in Attack Combo");
		}

	}

	
	IEnumerator  MeleeDash (){
		meleefwd = true;
		yield return new WaitForSeconds(0.2f);
		meleefwd = false;
		
	}
	
	//---------------------
	//-------
	IEnumerator  MagicSkill ( int skillID  ){
		float wait = 0.0f;
		if(skillAnimation[skillID]){
			str = mStatusC.addAtk;
			matk = mStatusC.addMatk;
			
			if(mStatusC.mana > manaCost[skillID] && !mStatusC.silence){
				if(sound.magicCastVoice){
					mAudio.clip = sound.magicCastVoice;
					mAudio.Play();
				}
				isCasting = true;
				cmc.canControl = false;

				if(!useMecanim){
					//For Legacy Animation
					mAnim[skillAnimation[skillID].name].layer = 16;
					mAnim[skillAnimation[skillID].name].speed = skillAnimationSpeed;
					mAnim.Play(skillAnimation[skillID].name);

					wait = mAnim[skillAnimation[skillID].name].length -0.3f;
				}else{
					//For Mecanim Animation
					GetComponent<PlayerMecanimAnimationC>().AttackAnimation(skillAnimation[skillID].name);
					float clip = GetComponent<PlayerMecanimAnimationC>().animator.GetCurrentAnimatorClipInfo(0).Length;
					wait = clip -0.3f;
				}
				
				nextFire = Time.time + skillDelay;
				Maincam.GetComponent<ARPGcameraC>().lockOn = true;
				//Transform bulletShootout;

				yield return new WaitForSeconds(wait);
				if(aimingType == AimType.Normal){
					Maincam.GetComponent<ARPGcameraC>().lockOn = false;
				}
				Transform bulletShootout = Instantiate(skillPrefab[skillID], attackPoint.transform.position , attackPoint.transform.rotation) as Transform;
				bulletShootout.GetComponent<BulletStatusC>().Setting(str , matk , "Player" , this.gameObject);
				yield return new WaitForSeconds(skillDelay);
				isCasting = false;
				cmc.canControl = true;
				mStatusC.mana -= manaCost[skillID];
			}


		}else{
			print("Please assign skill animation in Skill Animation");
		}

	}
	
	public void  Flinch ( Vector3 dir  ){
		if(sound.hurtVoice && mStatusC.health >= 1){
			mAudio.clip = sound.hurtVoice;
			mAudio.Play();
		}
		knock = dir;
		cmc.canControl = false;
		//KnockBack();
		StartCoroutine(KnockBack());
		if(!useMecanim){
			//For Legacy Animation
			mAnim.PlayQueued(hurt.name, QueueMode.PlayNow);
		}
		cmc.canControl = true;
	}
	
	IEnumerator  KnockBack (){
		flinch = true;
		yield return new WaitForSeconds(0.2f);
		flinch = false;
	}

	public void WhileAttackSet(int watk){
		if (watk == 2) {
			whileAttack = whileAtk.WalkFree;
		} else if (watk == 1) {
			whileAttack = whileAtk.Immobile;
		} else {
			whileAttack = whileAtk.MeleeFwd;
		}
	}
	
	void Aiming(){
		Ray ray = Maincam.GetComponent<Camera>().ViewportPointToRay (new Vector3(0.5f,0.5f,0.0f));
		// Do a raycast
		RaycastHit hit;
		//if (Physics.Raycast (ray, out hit) && hit.transform.tag == "Wall" || Physics.Raycast (ray, out hit) && hit.transform.tag == "Enemy"){
		if (Physics.Raycast (ray, out hit)){
			attackPoint.transform.LookAt(hit.point);
		}else{
			attackPoint.transform.rotation = Maincam.transform.rotation;
		}
    }


    #region 自动战斗相关逻辑
    public float detectRange = 100.0f;
    private Transform followTarget;
    private StatusC targetStatC;
  //  private Transform 
    void FindClosestEnemy()
    {
        // Find all game objects with tag Enemy

        //如果当前对象没死 就不进行搜索
        if(targetStatC!=null && targetStatC.health>0)
        {
            return;
        }
        canAttack = false;
        if (followTarget!=null && followTarget.gameObject.activeInHierarchy)
        {
            return;
        }

        float distance = Mathf.Infinity;
        float findingradius = detectRange;

        //为什么血量会影响视野 
//         if (mStatusC.health < mStatusC.maxHealth)
//         {
//             findingradius += lostSight + 3.0f;
//         }

        Collider[] objectsAroundMe = Physics.OverlapSphere(transform.position, findingradius);
        foreach (Collider obj in objectsAroundMe)
        {
            if (obj.CompareTag("Enemy")) //|| obj.CompareTag("Boss"))
            {
                Vector3 diff = (obj.transform.position - transform.position);
                float curDistance = diff.sqrMagnitude;
                if (curDistance < distance)
                {
                    //------------
                    followTarget = obj.transform;
                    targetStatC = obj.GetComponent<StatusC>();
                    distance = curDistance;
                }
            }
        }
    }
    void CheckDistance()
    {
        if (!followTarget)
        {
            if (!useMecanim)
            {
                //If using Legacy Animation
                mAnim.CrossFade("idle", 0.2f);
            }
            else
            {
                mAnimator.SetBool("running", false);
                mAnimator.CrossFade("idle",0.2f);

            }
            followState = AIState.Idle;
            return;
        }
        float distancea = (followTarget.position - transform.position).magnitude;
        if (distancea <= approachDistance)
        {
            Vector3 destinya = followTarget.position;
            destinya.y = transform.position.y;
            transform.LookAt(destinya);
            canAttack = true;
            //StartCoroutine(Attack());
            //Attack();
        }
        else
        {
            followState = AIState.Moving;
            if (!useMecanim)
            {
                //If using Legacy Animation
                mAnim.CrossFade("run", 0.2f);
            }
            else
            {
                //mAnimator.SetBool("run", true);
                mAnimator.Play("running");
            }
        }
    }
    Vector3 GetDestination()
    {
        Vector3 destination = followTarget.position;
        destination.y = transform.position.y;
        return destination;
    }
    #endregion
}


