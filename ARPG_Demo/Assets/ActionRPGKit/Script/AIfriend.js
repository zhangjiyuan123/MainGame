#pragma strict

private enum AIStatef { Moving = 0, Pausing = 1 , Escape = 2 , Idle = 3, FollowMaster = 4 }

var master : Transform;

var mainModel : GameObject;
var useMecanim : boolean = false;
var animator : Animator; //For Mecanim
var followTarget : Transform;
var approachDistance  : float = 3.0f;
var detectRange : float = 15.0f;
var lostSight : float = 100.0f;
var speed  : float = 4.0f;
var movingAnimation : AnimationClip;
var idleAnimation : AnimationClip;
var attackAnimation : AnimationClip[] = new AnimationClip[1];
var hurtAnimation : AnimationClip;

private var flinch : boolean = false;
var stability : boolean = false;

var freeze : boolean = false;

var attackPrefab : Transform;
var attackPoint : Transform;

var attackCast : float = 0.5;
var attackDelay : float = 1.0;
private var continueAttack : int = 1;
var continueAttackDelay : float = 0.8;

private var followState : AIStatef;
private var distance : float = 0.0;
private var masterDistance : float = 0.0;
private var atk = 0;
private var mag = 0;

private var cancelAttack : boolean = false;
private var meleefwd : boolean = false;

enum AIatkType {
			Immobile = 0,
			MeleeDash = 1,
}
		
var attackType : AIatkType = AIatkType.Immobile;

var attackVoice : AudioClip[] = new AudioClip[3];
var hurtVoice : AudioClip;

function Start () {
	gameObject.tag = "Ally"; 
	if(!mainModel){
		mainModel = this.gameObject;
	}
	GetComponent(Status).mainModel = mainModel;
	if(!master){
		print("Please Assign It's Master first");
	}
	
	if(!attackPoint){
		attackPoint = this.transform;
	}
	GetComponent(Status).useMecanim = useMecanim;
	
	continueAttack = attackAnimation.Length;
	atk = GetComponent(Status).atk;
	mag = GetComponent(Status).matk;
        
      	followState = AIStatef.FollowMaster;
      	
      	if(!useMecanim){
      		//If using Legacy Animation
	      	mainModel.GetComponent.<Animation>().Play(movingAnimation.name);
	      	if(hurtAnimation){
	      		mainModel.GetComponent.<Animation>()[hurtAnimation.name].layer = 10;
	      	}
        }else{
        	//If using Mecanim Animation
        	if(!animator){
				animator = mainModel.GetComponent(Animator);
			}
			animator.SetBool("run" , true);
        }
      
      	if(master){
      		Physics.IgnoreCollision(GetComponent.<Collider>(), master.GetComponent.<Collider>());
      	}
}

function GetDestination()
    {
        var destination : Vector3 = followTarget.position;
        destination.y = transform.position.y;
        return destination;
    }
    
function GetMasterPosition(){
    	if(!master){
    		return;
    	}
        var destination : Vector3 = master.position;
        destination.y = transform.position.y;
        return destination;
}

function Update () {
	var controller : CharacterController = GetComponent(CharacterController);
	var stat : Status = GetComponent(Status);
	if(!master){
		stat.Death();
		return;
	}
	if (meleefwd && !stat.freeze){
		var lui : Vector3 = transform.TransformDirection(Vector3.forward);
		controller.Move(lui * 5 * Time.deltaTime);
		return;
	}
	if(freeze || stat.freeze){
		return;
	}
	if(useMecanim){
		animator.SetBool("hurt" , flinch);
	}
	if(flinch){
		cancelAttack = true;
		lui = transform.TransformDirection(Vector3.back);
		controller.SimpleMove(lui * 5);
		return;
	}
	if ((master.position - transform.position).magnitude > 30.0){
		var pos : Vector3 = master.position;
		pos.y += 1.7;
		transform.position = pos;
	}
	
	FindClosest();
	
		if (followState == AIStatef.FollowMaster) {
		//---------------------------------
			 if ((master.position - transform.position).magnitude <= 3.0) {
				followState = AIStatef.Idle;
                //mainModel.animation.CrossFade(idleAnimation.name, 0.2f);
                if(!useMecanim){
                //If using Legacy Animation
                	mainModel.GetComponent.<Animation>().CrossFade(idleAnimation.name, 0.2f); 
                }else{
					animator.SetBool("run" , false);
				}
            }else {
                var forward = transform.TransformDirection(Vector3.forward);
     			controller.Move(forward * speed * Time.deltaTime);
     			   
     			   var mas : Vector3 = master.position;
     			   mas.y = transform.position.y;
  				   transform.LookAt(mas);
  			}
		
		//---------------------------------
		}else if (followState == AIStatef.Moving) {
			masterDistance = (transform.position - GetMasterPosition()).magnitude;
            if (masterDistance > detectRange + 5.0){//////////////////GetMasterPosition
            	followState = AIStatef.FollowMaster;
            	//mainModel.animation.CrossFade(movingAnimation.name, 0.2f);
            	if(!useMecanim){
	            //If using Legacy Animation
	                mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
	            }else{
					animator.SetBool("run" , true);
				}
            }else if ((followTarget.position - transform.position).magnitude <= approachDistance) {
                followState = AIStatef.Pausing;
                //mainModel.animation.CrossFade(idleAnimation.name, 0.2f);
                if(!useMecanim){
                //If using Legacy Animation
                	mainModel.GetComponent.<Animation>().CrossFade(idleAnimation.name, 0.2f); 
                }else{
					animator.SetBool("run" , false);
				}
                //----Attack----
                	Attack();
            }else if ((followTarget.position - transform.position).magnitude >= lostSight)
            {//Lost Sight
            	GetComponent(Status).health = GetComponent(Status).maxHealth;
                followState = AIStatef.Idle;
                //mainModel.animation.CrossFade(idleAnimation.name, 0.2f);
                if(!useMecanim){
                //If using Legacy Animation
                	mainModel.GetComponent.<Animation>().CrossFade(idleAnimation.name, 0.2f); 
                }else{
					animator.SetBool("run" , false);
				}
            }else {
                forward = transform.TransformDirection(Vector3.forward);
     			controller.Move(forward * speed * Time.deltaTime);
     			   
     			   var destiny : Vector3 = followTarget.position;
     			   destiny.y = transform.position.y;
  				   transform.LookAt(destiny);
            }
        }
        else if (followState == AIStatef.Pausing){
       			 var destinya : Vector3 = followTarget.position;
     			   destinya.y = transform.position.y;
  				   transform.LookAt(destinya);
  				   			   
            distance = (transform.position - GetDestination()).magnitude;
            masterDistance = (transform.position - GetMasterPosition()).magnitude;
            if (masterDistance > 12.0){//////////////////GetMasterPosition
            	followState = AIStatef.FollowMaster;
            	//mainModel.animation.CrossFade(movingAnimation.name, 0.2f);
            	if(!useMecanim){
	            //If using Legacy Animation
	                mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
	            }else{
					animator.SetBool("run" , true);
				}
            }else if (distance > approachDistance) {
                followState = AIStatef.Moving;
                //mainModel.animation.CrossFade(movingAnimation.name, 0.2f);
                if(!useMecanim){
	            //If using Legacy Animation
	                mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
	            }else{
					animator.SetBool("run" , true);
				}
            }
        }
        //----------------Idle Mode--------------
        else if (followState == AIStatef.Idle){
  			var destinyheight : Vector3 = followTarget.position;
     			destinyheight.y = transform.position.y - destinyheight.y;
     		var getHealth = GetComponent(Status).maxHealth - GetComponent(Status).health;
     			
            distance = (transform.position - GetDestination()).magnitude;
            masterDistance = (transform.position - GetMasterPosition()).magnitude;
            if (distance < detectRange && Mathf.Abs(destinyheight.y) <= 4 && followTarget){
                followState = AIStatef.Moving;
                //mainModel.animation.CrossFade(movingAnimation.name, 0.2f);
                if(!useMecanim){
	            //If using Legacy Animation
	                mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
	            }else{
					animator.SetBool("run" , true);
				}
            }else if (masterDistance > 3.0){//////////////////GetMasterPosition
            	followState = AIStatef.FollowMaster;
            	//mainModel.animation.CrossFade(movingAnimation.name, 0.2f);
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

function Attack(){
	var stat : Status = GetComponent(Status);
	atk = GetComponent(Status).atk;
	mag = GetComponent(Status).matk;
	var bulletShootout : Transform;
	cancelAttack = false;
	var c = 0;
	if(flinch){
		return;
	}
	while (c < continueAttack && followTarget){
		freeze = true;
		if(attackType == AIatkType.MeleeDash){
				MeleeDash();
		}
		if(followTarget){
				var destiny : Vector3 = followTarget.position;
     			   destiny.y = transform.position.y;
  				   transform.LookAt(destiny);
  			}
  				   
		if(!useMecanim){
        	//If using Legacy Animation
			mainModel.GetComponent.<Animation>().PlayQueued(attackAnimation[c].name, QueueMode.PlayNow);
		}else{
			animator.Play(attackAnimation[c].name);
		}
		
		yield WaitForSeconds(attackCast);
		if(flinch || stat.freeze){
			freeze = false;
			c = continueAttack;
			return;
		}
		//attackPoint.transform.LookAt(followTarget);
		if(!cancelAttack || GetComponent(Status).freeze){
			if(attackVoice.Length > c && attackVoice[c]){
				GetComponent.<AudioSource>().clip = attackVoice[c];
				GetComponent.<AudioSource>().Play();
			}
			bulletShootout = Instantiate(attackPrefab, attackPoint.transform.position , attackPoint.transform.rotation);
			bulletShootout.GetComponent(BulletStatus).Setting(atk , mag , "Player" , this.gameObject);
			c++;
			yield WaitForSeconds(continueAttackDelay);
			//print(c);
			//yield WaitForSeconds(attackDelay);
		}else{
			freeze = false;
			c = continueAttack;
		}
	}
	yield WaitForSeconds(attackDelay);
		//yield WaitForSeconds(attackDelay);
		c = 0;
		freeze = false;
		//mainModel.animation.CrossFade(movingAnimation.name, 0.2f);
		CheckDistance();
	
}

function CheckDistance(){
	masterDistance = (transform.position - GetMasterPosition()).magnitude;
    if (masterDistance > detectRange + 5.0){//////////////////GetMasterPosition
            followState = AIStatef.FollowMaster;
            if(!useMecanim){
	            //If using Legacy Animation
	            mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
	        }else{
				animator.SetBool("run" , true);
			}
            return;
      }
	if(!followTarget){
		if(!useMecanim){
           //If using Legacy Animation
           mainModel.GetComponent.<Animation>().CrossFade(idleAnimation.name, 0.2f); 
        }else{
			animator.SetBool("run" , false);
		}
		followState = AIStatef.Idle;
		return;
	}
	var distancea : float = (followTarget.position - transform.position).magnitude;
	if (distancea <= approachDistance){
			var destinya : Vector3 = followTarget.position;
     		 destinya.y = transform.position.y;
  			 transform.LookAt(destinya);
              Attack();
          }else{
          		followState = AIStatef.Moving;
				if(!useMecanim){
		            //If using Legacy Animation
		            mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
		        }else{
					animator.SetBool("run" , true);
				}
          }
}


//function FindClosest() : GameObject { 
function FindClosest() { 
    // Find Closest Player   
    var gos : GameObject[]; 
    gos = GameObject.FindGameObjectsWithTag("Enemy"); 
    if(!gos){
    	return;
    }
    var closest : GameObject; 
    
    var distance = Mathf.Infinity; 
    var position = transform.position; 

    for (var go : GameObject in gos) { 
       var diff = (go.transform.position - position); 
       var curDistance = diff.sqrMagnitude; 
       if (curDistance < distance) { 
       //------------
         closest = go; 
         distance = curDistance; 
       } 
    } 
   // target = closest;
     if(!closest){
     	followTarget = null;
   		followState = AIStatef.FollowMaster;
   		//mainModel.animation.CrossFade(movingAnimation.name, 0.2f);
   		if(!useMecanim){
	        //If using Legacy Animation
	        mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
	    }else{
			animator.SetBool("run" , true);
		}
    	return;
    }
   followTarget = closest.transform;
    return closest; 
}

function MeleeDash(){
	meleefwd = true;
	yield WaitForSeconds(0.2);
	meleefwd = false;
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
	KnockBack();
	if(!useMecanim){
       	//If using Legacy Animation
		mainModel.GetComponent.<Animation>().PlayQueued(hurtAnimation.name, QueueMode.PlayNow);
		mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
	}
	followState = AIStatef.Moving;
	
}

function KnockBack(){
	flinch = true;
	yield WaitForSeconds(0.2);
	flinch = false;
}

@script RequireComponent (Status)
@script RequireComponent (CharacterMotor)
@script AddComponentMenu ("Action-RPG Kit/Create Ally")
