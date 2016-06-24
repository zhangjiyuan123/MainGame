#pragma strict

enum AIState { Moving = 0, Pausing = 1 , Idle = 2 , Patrol = 3}

var mainModel : GameObject;
var followTarget : Transform;
var approachDistance  : float = 2.0f;
var detectRange : float = 15.0f;
var lostSight : float = 100.0f;
var speed  : float = 4.0f;
var useMecanim : boolean = false;
var animator : Animator; //For Mecanim
var movingAnimation : AnimationClip;
var idleAnimation : AnimationClip;
var attackAnimation : AnimationClip;
var hurtAnimation : AnimationClip;

@HideInInspector
var flinch : boolean = false;

var stability : boolean = false;

var freeze : boolean = false;

var bulletPrefab : Transform;
var attackPoint : Transform;

var attackCast : float = 0.3;
var attackDelay : float = 0.5;
@HideInInspector
var followState : AIState;
private var distance : float = 0.0;
private var atk : int = 0;
private var matk : int = 0;
private var knock : Vector3 = Vector3.zero;
@HideInInspector
var cancelAttack : boolean = false;
private var attacking : boolean = false;
private var castSkill : boolean = false;
private var angry : boolean = false;
private var gos : GameObject[]; 

var attackVoice : AudioClip;
var hurtVoice : AudioClip;

function Start () {
	gameObject.tag = "Enemy"; 
	
	if(!attackPoint){
		attackPoint = this.transform;
	}
	
	if(!mainModel){
		mainModel = this.gameObject;
	}
	GetComponent(Status).useMecanim = useMecanim;
	//Assign MainModel in Status Script
	GetComponent(Status).mainModel = mainModel;
		//Set ATK = Monster's Status
		atk = GetComponent(Status).atk;
		matk = GetComponent(Status).matk;
        
      	followState = AIState.Idle;
      	if(!useMecanim){
      		//If using Legacy Animation
	      	mainModel.GetComponent.<Animation>().Play(idleAnimation.name);
	        mainModel.GetComponent.<Animation>()[hurtAnimation.name].layer = 10;
        }else{
        	//If using Mecanim Animation
        	if(!animator){
				animator = mainModel.GetComponent(Animator);
			}
        }

}

function GetDestination()
    {
        var destination : Vector3 = followTarget.position;
        destination.y = transform.position.y;
        return destination;
    }

function Update () {
	var stat : Status = GetComponent(Status);
	var controller : CharacterController = GetComponent(CharacterController);
	
	FindClosest();
	//FindClosestEnemy();
	if(useMecanim){
		animator.SetBool("hurt" , flinch);
	}
	
	if (flinch){
		controller.Move(knock * 6* Time.deltaTime);
		return;
	}
	
	if(freeze || stat.freeze){
		return;
	}

	if(!followTarget){
		return;
	}
	//-----------------------------------
	
		if (followState == AIState.Moving) {
            if ((followTarget.position - transform.position).magnitude <= approachDistance) {
                followState = AIState.Pausing;
                if(!useMecanim){
                //If using Legacy Animation
                	mainModel.GetComponent.<Animation>().CrossFade(idleAnimation.name, 0.2f);
                }else{
					animator.SetBool("run" , false);
				}
                //----Attack----
                	Attack();
            }else if ((followTarget.position - transform.position).magnitude >= lostSight){
            	//Lost Sight
            	angry = false;
            	GetComponent(Status).health = GetComponent(Status).maxHealth;
                followState = AIState.Idle;
                if(!useMecanim){
                	//If using Legacy Animation
                	mainModel.GetComponent.<Animation>().CrossFade(idleAnimation.name, 0.2f); 
                }else{
					animator.SetBool("run" , false);
				}
            }else{
                var forward : Vector3 = transform.TransformDirection(Vector3.forward);
     			controller.Move(forward * speed * Time.deltaTime);
     			   
     			   var destinationy : Vector3 = followTarget.position;
     			   destinationy.y = transform.position.y;
  				   transform.LookAt(destinationy);
            }
        }
        else if (followState == AIState.Pausing){
       			 var destinya : Vector3 = followTarget.position;
     			   destinya.y = transform.position.y;
  				   transform.LookAt(destinya);
  				   			   
            distance = (transform.position - GetDestination()).magnitude;
            if (distance > approachDistance) {
                followState = AIState.Moving;
                if(!useMecanim){
                //If using Legacy Animation
                	mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
                }else{
					animator.SetBool("run" , true);
				}
            }
        }
        //----------------Idle Mode--------------
        else if (followState == AIState.Idle){
  			var destinyheight : Vector3 = followTarget.position;
     			destinyheight.y = transform.position.y - destinyheight.y;
     		var getHealth : int = GetComponent(Status).maxHealth - GetComponent(Status).health;
     			
            distance = (transform.position - GetDestination()).magnitude;
            if (distance < detectRange && Mathf.Abs(destinyheight.y) <= 4 || getHealth > 0){
                followState = AIState.Moving;
                if(!useMecanim){
                //If using Legacy Animation
                	mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
                }else{
					animator.SetBool("run" , true);
				}
            }
        }
//-----------------------------------
}
    
function Flinch(dir : Vector3){
	if(stability){
		return;
	}
	if(hurtVoice && GetComponent(Status).health >= 1){
			GetComponent.<AudioSource>().clip = hurtVoice;
			GetComponent.<AudioSource>().Play();
		}
	cancelAttack = true;
	if(followTarget){
			var look : Vector3 = followTarget.position;
     			   look.y = transform.position.y;
  				   transform.LookAt(look);
  		}
	knock = transform.TransformDirection(Vector3.back);
		//knock = dir;
		KnockBack();
		if(!useMecanim){
        	//If using Legacy Animation
			mainModel.GetComponent.<Animation>().PlayQueued(hurtAnimation.name, QueueMode.PlayNow);
			mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
		}
		followState = AIState.Moving;
	
}

function KnockBack(){
	flinch = true;
	yield WaitForSeconds(0.2);
	flinch = false;
}

function Attack(){
	cancelAttack = false;
	if(flinch || GetComponent(Status).freeze || freeze || attacking){
		return;
	}
	/*if(attackVoice && !flinch){
			audio.clip = attackVoice;
			audio.Play();
		}*/
		freeze = true;
		attacking = true;
		if(!useMecanim){
        	//If using Legacy Animation
			mainModel.GetComponent.<Animation>().Play(attackAnimation.name);
		}else{
			animator.Play(attackAnimation.name);
		}
		yield WaitForSeconds(attackCast);
		if(flinch){
			freeze = false;
			attacking = false;
			return;
		}
		//attackPoint.transform.LookAt(followTarget);
		if(!cancelAttack){
			if(attackVoice && !flinch){
				GetComponent.<AudioSource>().clip = attackVoice;
				GetComponent.<AudioSource>().Play();
			}
			var bulletShootout : Transform = Instantiate(bulletPrefab, attackPoint.transform.position , attackPoint.transform.rotation);
			bulletShootout.GetComponent(BulletStatus).Setting(atk , matk , "Enemy" , this.gameObject);
		}

		yield WaitForSeconds(attackDelay);
		freeze = false;
		attacking = false;
		if(!useMecanim){
        //If using Legacy Animation
			mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
		}else{
			animator.SetBool("run" , true);
		}
		CheckDistance();
	
}

function CheckDistance(){
	if(!followTarget){
		if(!useMecanim){
	        //If using Legacy Animation
			mainModel.GetComponent.<Animation>().CrossFade(idleAnimation.name, 0.2f);  
		}else{
			animator.SetBool("run" , false);
		}
		followState = AIState.Idle;
		return;
	}
	var distancea : float = (followTarget.position - transform.position).magnitude;
	if (distancea <= approachDistance){
			var destinya : Vector3 = followTarget.position;
     		 destinya.y = transform.position.y;
  			 transform.LookAt(destinya);
              Attack();
     }else{
          followState = AIState.Moving;
          if(!useMecanim){
          //If using Legacy Animation
          	mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
          }else{
			animator.SetBool("run" , true);
		  }
       }
}


function FindClosest(){ 
    // Find Closest Player   
   // var gos : GameObject[]; 
    gos = GameObject.FindGameObjectsWithTag("Player");
    gos += GameObject.FindGameObjectsWithTag("Ally"); 
    if(gos.Length <= 0){
    	return;
    }
    angry = true;
    var closest : GameObject; 
    
    var distance : float = Mathf.Infinity; 
    var position : Vector3 = transform.position; 

    for (var go : GameObject in gos) { 
       var diff : Vector3 = (go.transform.position - position); 
       var curDistance : float = diff.sqrMagnitude; 
       if (curDistance < distance) { 
       //------------
         followTarget = go.transform; 
         distance = curDistance; 
       } 
    } 
}

function FindClosestEnemy(){
		// Find all game objects with tag Enemy
		var distance : float = Mathf.Infinity;
		var findingradius : float = detectRange;
		
		var objectsAroundMe : Collider[] = Physics.OverlapSphere(transform.position , findingradius);
		for(var obj : Collider in objectsAroundMe){
			if(obj.CompareTag("Player") || obj.CompareTag("Ally")){
				var diff : Vector3 = (obj.transform.position - transform.position); 
				var curDistance : float = diff.sqrMagnitude; 
				if (curDistance < distance) { 
					//------------
					followTarget = obj.transform;
					distance = curDistance;
				} 
			}
		}
		
}

function UseSkill(skill : Transform , castTime : float , delay : float , anim : String , dist : float){
	cancelAttack = false;
	if(flinch || !followTarget || (followTarget.position - transform.position).magnitude >= dist || GetComponent(Status).silence || GetComponent(Status).freeze  || castSkill){
		return;
	}
	
		freeze = true;
		castSkill = true;
		if(!useMecanim){
	        //If using Legacy Animation
			mainModel.GetComponent.<Animation>().Play(anim);
		}else{
			animator.Play(anim);
		}
		yield WaitForSeconds(castTime);
		if(flinch){
			freeze = false;
			castSkill = false;
			return;
		}
		//attackPoint.transform.LookAt(followTarget);
		if(!cancelAttack){
			var bulletShootout : Transform = Instantiate(skill, attackPoint.transform.position , attackPoint.transform.rotation);
			bulletShootout.GetComponent(BulletStatus).Setting(atk , matk , "Enemy" , this.gameObject);
		}

		yield WaitForSeconds(delay);
		freeze = false;
		castSkill = false;
		if(!useMecanim){
	        //If using Legacy Animation
			mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
		}else{
			animator.SetBool("run" , true);
		}
	
}

@script RequireComponent (Status)
@script RequireComponent (CharacterMotor)
@script AddComponentMenu ("Action-RPG Kit/Create Enemy")
