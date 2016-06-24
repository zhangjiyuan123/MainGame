#pragma strict
var mainModel : GameObject;
var skillDistance : float = 4.5;
var delay : float = 2.0;
private var begin : boolean = false;
private var onSkill : boolean = false;

private var wait : float = 0;

class SkillSetting{
	var skillName : String;
	 var skillPrefab : Transform;
	 var skillAnimation : AnimationClip;
	 var castEffect : GameObject;
	 var castTime : float = 0.5;
	 var delayTime : float = 1.5;
}

var skillSet : SkillSetting[] = new SkillSetting[1];

function Start () {
	 if(!mainModel){
	 	mainModel = this.gameObject;
	 }
	 yield WaitForSeconds(1.5);
	 begin = true;

}

function Update () {
	 if(begin && !onSkill){
	  	if(wait >= delay){
	       UseSkill();
	        wait = 0;
	     }else{
	      	wait += Time.deltaTime;
	     }
	 
	 }

}

function UseSkill(){
	if(GetComponent(Status).freeze){
		return;
	}
	var ai : AIset = GetComponent(AIset);
	 var c : int = 0;
	 if(skillSet.Length > 1){
	  	c = Random.Range(0 , skillSet.Length);
	 }
	 onSkill = true;
	  //Cast Effect
	 if(skillSet[c].castEffect){
	 	var eff : GameObject = Instantiate(skillSet[c].castEffect , mainModel.transform.position , mainModel.transform.rotation);
	 	eff.transform.parent = this.transform;
	 }
	 //Call UseSkill Function in AIset Script.
	 ai.UseSkill(skillSet[c].skillPrefab ,skillSet[c].castTime, skillSet[c].delayTime , skillSet[c].skillAnimation.name , skillDistance);
	 yield WaitForSeconds(skillSet[c].castTime);
	 if(eff){
	 	Destroy(eff);
	 }
	 
	 yield WaitForSeconds(skillSet[c].delayTime);
	 onSkill = false;

}


@script RequireComponent (AIset)