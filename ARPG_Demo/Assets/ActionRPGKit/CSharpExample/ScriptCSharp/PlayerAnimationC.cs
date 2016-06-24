using UnityEngine;
using System.Collections;

[RequireComponent (typeof (AttackTriggerC))]

public class PlayerAnimationC : MonoBehaviour {
	
	public float runMaxAnimationSpeed = 1.0f;
	public float backMaxAnimationSpeed = 1.0f;
	public float sprintAnimationSpeed = 1.5f;
	
	private GameObject player;
	private GameObject mainModel;
	
	//string idle = "idle";
	public AnimationClip idle;
	public AnimationClip run;
	public AnimationClip right;
	public AnimationClip left;
	public AnimationClip back;
	public AnimationClip jump;
	public AnimationClip hurt;
	
	void  Start (){
		if(!player){
			player = this.gameObject;
		}
		mainModel = GetComponent<AttackTriggerC>().mainModel;
		if(!mainModel){
			mainModel = this.gameObject;
		}
		GetComponent<AttackTriggerC>().useMecanim = false;
		mainModel.GetComponent<Animation>()[run.name].speed = runMaxAnimationSpeed;
		mainModel.GetComponent<Animation>()[right.name].speed = runMaxAnimationSpeed;
		mainModel.GetComponent<Animation>()[left.name].speed = runMaxAnimationSpeed;
		mainModel.GetComponent<Animation>()[back.name].speed = backMaxAnimationSpeed;
		
		mainModel.GetComponent<Animation>()[jump.name].wrapMode  = WrapMode.ClampForever;
		
		if(hurt){
			mainModel.GetComponent<Animation>()[hurt.name].layer = 5;
		}
		
	}
	
	void  Update (){
		CharacterController controller = player.GetComponent<CharacterController>();
		if ((controller.collisionFlags & CollisionFlags.Below) != 0){
			if (Input.GetAxis("Horizontal") > 0.1f)
				mainModel.GetComponent<Animation>().CrossFade(right.name);
			else if (Input.GetAxis("Horizontal") < -0.1f)
				mainModel.GetComponent<Animation>().CrossFade(left.name);
			else if (Input.GetAxis("Vertical") > 0.1f)
				mainModel.GetComponent<Animation>().CrossFade(run.name);
			else if (Input.GetAxis("Vertical") < -0.1f)
				mainModel.GetComponent<Animation>().CrossFade(back.name);
			else
				mainModel.GetComponent<Animation>().CrossFade(idle.name);
		}else{
			mainModel.GetComponent<Animation>().CrossFade(jump.name);
		}
	}
	
	public void  AnimationSpeedSet (){
		mainModel = GetComponent<AttackTriggerC>().mainModel;
		if(!mainModel){
			mainModel = this.gameObject;
		}
		mainModel.GetComponent<Animation>()[run.name].speed = runMaxAnimationSpeed;
		mainModel.GetComponent<Animation>()[right.name].speed = runMaxAnimationSpeed;
		mainModel.GetComponent<Animation>()[left.name].speed = runMaxAnimationSpeed;
		mainModel.GetComponent<Animation>()[back.name].speed = backMaxAnimationSpeed;
	}
}