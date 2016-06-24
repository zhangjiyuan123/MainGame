using UnityEngine;
using System.Collections;

[RequireComponent (typeof (AttackTriggerC))]

public class PlayerMecanimAnimationC : MonoBehaviour {
	
	private GameObject player;
	private GameObject mainModel;
	public Animator animator;
	private CharacterController controller;
	
	public string moveHorizontalState = "horizontal";
	public string moveVerticalState = "vertical";
	public string jumpState = "jump";
	public string hurtState = "hurt";
    public string runState = "running";
	private bool  jumping = false;
	private bool  attacking = false;
	private bool  flinch = false;
    private bool running = false;

    private AttackTriggerC mATC = null;
	
	void  Start (){
		if(!player){
			player = this.gameObject;
		}
		mainModel = GetComponent<AttackTriggerC>().mainModel;
		if(!mainModel){
			mainModel = this.gameObject;
		}
		if(!animator){
			animator = mainModel.GetComponent<Animator>();
		}
		controller = player.GetComponent<CharacterController>();
        mATC = GetComponent<AttackTriggerC>();

        mATC.useMecanim = true;
	}
	
	void  Update (){
		//Set attacking variable = isCasting in AttackTrigger
		attacking = mATC.isCasting;
		flinch = mATC.flinch;
		//Set Hurt Animation
		animator.SetBool(hurtState , flinch);
		
		if(attacking || flinch){
			return;
		}
		if(mATC.followState == AttackTriggerC.AIState.Moving)
        {
            if(!running)
            {
                running = true;
                //animator.SetBool(runState, true);
                animator.Play(runState);
            }
            return;
        }
        else
        {
            running = false;
        }
		if ((controller.collisionFlags & CollisionFlags.Below) != 0){
			float h = Input.GetAxis("Horizontal");
			float v = Input.GetAxis("Vertical");
			animator.SetFloat(moveHorizontalState , h);
			animator.SetFloat(moveVerticalState , v);
			if(jumping){
				jumping = false;
				animator.SetBool(jumpState , jumping);
				//animator.StopPlayback(jumpState);
			}
			
		}else{
			jumping = true;
			animator.SetBool(jumpState , jumping);
			//animator.Play(jumpState);
		}
		
	}
	
	public void  AttackAnimation ( string anim  ){
		animator.SetBool(jumpState , false);
		animator.Play(anim);
	}
	
	public void  PlayAnim ( string anim  ){
		animator.Play(anim);
		
	}
	
	public void  SetWeaponType ( int val  , string idle  ){
		animator.SetInteger("weaponType" , val);
		animator.Play(idle);
	}

		
}