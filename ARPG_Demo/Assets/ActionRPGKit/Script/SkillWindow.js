#pragma strict
var player : GameObject;
var database : GameObject;

var skill : int[] = new int[3];
var skillListSlot : int[] = new int[16];

class LearnSkillLV{
	var level : int = 1;
	var skillId : int = 1;
}
var learnSkill : LearnSkillLV[] = new LearnSkillLV[2];

private var menu : boolean = false;
private var shortcutPage : boolean = true;
private var skillListPage : boolean = false;
private var skillSelect : int = 0;

var skin1 :  GUISkin;
var windowRect : Rect = new Rect (360 ,80 ,360 ,185);
private var originalRect : Rect;
private var selectedPos : Vector2 = new Vector2(27 , 97);
var textStyle : GUIStyle;
var textStyle2 : GUIStyle;
private var showSkillLearned : boolean = false;
private var showSkillName : String = "";
var pageMultiply : int = 8;
private var page : int = 0;
var autoAssignSkill : boolean = false;

function Start () {
		if(!player){
			player = this.gameObject;
		}
		originalRect = windowRect;
		if(autoAssignSkill){
			AssignAllSkill();
		}

}

function Update () {
	if (Input.GetKeyDown("k")) {
		OnOffMenu();
	}

}

function OnOffMenu(){
	//Freeze Time Scale to 0 if Window is Showing
	if(!menu && Time.timeScale != 0.0){
			menu = true;
			skillListPage = false;
			shortcutPage = true;
			Time.timeScale = 0.0;
			selectedPos = new Vector2(26 , 56);
			ResetPosition();
			Screen.lockCursor = false;
	}else if(menu){
			menu = false;
			Time.timeScale = 1.0;
			Screen.lockCursor = true;
	}
}

function OnGUI(){
	var dataItem : SkillData = database.GetComponent(SkillData);
	if(showSkillLearned){
		GUI.Label (Rect (Screen.width /2 -50, 85, 400, 50), "You Learned  " + showSkillName , textStyle2);
	}
	if(menu && shortcutPage){
		windowRect = GUI.Window (3, windowRect, SkillShortcut, "Skill");
	}
	//---------------Skill List----------------------------
	if(menu && skillListPage){
		windowRect = GUI.Window (3, windowRect, AllSkill, "Skill");
	}
	
}

function AssignSkill(id : int , sk : int){
	var dataSkill : SkillData = database.GetComponent(SkillData);
	player.GetComponent(AttackTrigger).manaCost[id] = dataSkill.skill[skillListSlot[sk]].manaCost;
	player.GetComponent(AttackTrigger).skillPrefab[id] = dataSkill.skill[skillListSlot[sk]].skillPrefab;
	player.GetComponent(AttackTrigger).skillAnimation[id] = dataSkill.skill[skillListSlot[sk]].skillAnimation;
	
	/*if(dataSkill.skill[skillListSlot[sk]].skillAnimation){
		player.GetComponent(AttackTrigger).mainModel.animation[dataSkill.skill[skillListSlot[sk]].skillAnimation.name].layer = 16;
	}*/
	
	player.GetComponent(AttackTrigger).skillIcon[id] = dataSkill.skill[skillListSlot[sk]].icon;
	skill[id] = skillListSlot[sk];
	print(sk);

}

function AssignAllSkill(){
	if(!player){
			player = this.gameObject;
		}
	var n : int = 0;
	var dataSkill : SkillData = database.GetComponent(SkillData);
	while(n <= 2){
		player.GetComponent(AttackTrigger).manaCost[n] = dataSkill.skill[skill[n]].manaCost;
		player.GetComponent(AttackTrigger).skillPrefab[n] = dataSkill.skill[skill[n]].skillPrefab;
		player.GetComponent(AttackTrigger).skillAnimation[n] = dataSkill.skill[skill[n]].skillAnimation;
		/*if(dataSkill.skill[skill[n]].skillAnimation){
			player.GetComponent(AttackTrigger).mainModel.animation[dataSkill.skill[skill[n]].skillAnimation.name].layer = 16;
		}*/
	
		player.GetComponent(AttackTrigger).skillIcon[n] = dataSkill.skill[skill[n]].icon;
		n++;
	}

}

function SkillShortcut(windowID : int){
		var dataSkill : SkillData = database.GetComponent(SkillData);
		windowRect.width = 360;
		windowRect.height = 185;
		//Close Window Button
		if (GUI.Button (Rect (310,2,30,30), "X")) {
			OnOffMenu();
		}
		
		//Skill Shortcut
		if (GUI.Button (Rect (30,45,80,80), dataSkill.skill[skill[0]].icon)) {
			skillSelect = 0;
			skillListPage = true;
			shortcutPage = false;
		}
		GUI.Label (Rect (70, 145, 20, 20), "1");
		if (GUI.Button (Rect (130,45,80,80), dataSkill.skill[skill[1]].icon)) {
			skillSelect = 1;
			skillListPage = true;
			shortcutPage = false;
		}
		GUI.Label (Rect (170, 145, 20, 20), "2");
		if (GUI.Button (Rect (230,45,80,80), dataSkill.skill[skill[2]].icon)) {
			skillSelect = 2;
			skillListPage = true;
			shortcutPage = false;
		}
		GUI.Label (Rect (270, 145, 20, 20), "3");
		
		GUI.DragWindow (new Rect (0,0,10000,10000));

}

function AllSkill(windowID : int){
		var dataSkill : SkillData = database.GetComponent(SkillData);
		windowRect.width = 300;
		windowRect.height = 555;
		//Close Window Button
		if (GUI.Button (Rect (260,2,30,30), "X")) {
			OnOffMenu();
		}
		if (GUI.Button (Rect (30,60,50,50), new GUIContent (dataSkill.skill[skillListSlot[0 + page]].icon, dataSkill.skill[skillListSlot[0 + page]].description ))) {
				AssignSkill(skillSelect , 0 + page);
				shortcutPage = true;
				skillListPage = false;
		}
		GUI.Label (Rect (95, 75, 140, 40), dataSkill.skill[skillListSlot[0 + page]].skillName , textStyle); //Show Skill's Name
		GUI.Label (Rect (220, 75, 140, 40), "MP : " + dataSkill.skill[skillListSlot[0 + page]].manaCost , textStyle); //Show Skill's MP Cost
		//-----------------------------
		
		if (GUI.Button (Rect (30,120,50,50), new GUIContent (dataSkill.skill[skillListSlot[1 + page]].icon, dataSkill.skill[skillListSlot[1 + page]].description ))) {
				AssignSkill(skillSelect , 1 + page);
				shortcutPage = true;
				skillListPage = false;
		}
		GUI.Label (Rect (95, 135, 140, 40), dataSkill.skill[skillListSlot[1 + page]].skillName , textStyle); //Show Skill's Name
		GUI.Label (Rect (220, 135, 140, 40), "MP : " + dataSkill.skill[skillListSlot[1 + page]].manaCost , textStyle); //Show Skill's MP Cost
		//-----------------------------
		
		if (GUI.Button (Rect (30,180,50,50), new GUIContent (dataSkill.skill[skillListSlot[2 + page]].icon, dataSkill.skill[skillListSlot[2 + page]].description ))) {
				AssignSkill(skillSelect , 2 + page);
				shortcutPage = true;
				skillListPage = false;
		}
		GUI.Label (Rect (95, 195, 140, 40), dataSkill.skill[skillListSlot[2 + page]].skillName , textStyle); //Show Skill's Name
		GUI.Label (Rect (220, 195, 140, 40), "MP : " + dataSkill.skill[skillListSlot[2 + page]].manaCost , textStyle); //Show Skill's MP Cost
		//-----------------------------
		
		if (GUI.Button (Rect (30,240,50,50), new GUIContent (dataSkill.skill[skillListSlot[3 + page]].icon, dataSkill.skill[skillListSlot[3 + page]].description ))) {
				AssignSkill(skillSelect , 3 + page);
				shortcutPage = true;
				skillListPage = false;
		}
		GUI.Label (Rect (95, 255, 140, 40), dataSkill.skill[skillListSlot[3 + page]].skillName , textStyle); //Show Skill's Name
		GUI.Label (Rect (220, 255, 140, 40), "MP : " + dataSkill.skill[skillListSlot[3 + page]].manaCost , textStyle); //Show Skill's MP Cost
		//-----------------------------
		
		if (GUI.Button (Rect (30,300,50,50), new GUIContent (dataSkill.skill[skillListSlot[4 + page]].icon, dataSkill.skill[skillListSlot[4 + page]].description ))) {
				AssignSkill(skillSelect , 4 + page);
				shortcutPage = true;
				skillListPage = false;
		}
		GUI.Label (Rect (95, 315, 140, 40), dataSkill.skill[skillListSlot[4 + page]].skillName , textStyle); //Show Skill's Name
		GUI.Label (Rect (220, 315, 140, 40), "MP : " + dataSkill.skill[skillListSlot[4 + page]].manaCost , textStyle); //Show Skill's MP Cost
		//-----------------------------
		
		if (GUI.Button (Rect (30,360,50,50), new GUIContent (dataSkill.skill[skillListSlot[5 + page]].icon, dataSkill.skill[skillListSlot[5 + page]].description ))) {
				AssignSkill(skillSelect , 5 + page);
				shortcutPage = true;
				skillListPage = false;
		}
		GUI.Label (Rect (95, 375, 140, 40), dataSkill.skill[skillListSlot[5 + page]].skillName , textStyle); //Show Skill's Name
		GUI.Label (Rect (220, 375, 140, 40), "MP : " + dataSkill.skill[skillListSlot[5 + page]].manaCost , textStyle); //Show Skill's MP Cost
		//-----------------------------
		
		if (GUI.Button (Rect (30,420,50,50), new GUIContent (dataSkill.skill[skillListSlot[6 + page]].icon, dataSkill.skill[skillListSlot[6 + page]].description ))) {
				AssignSkill(skillSelect , 6 + page);
				shortcutPage = true;
				skillListPage = false;
		}
		GUI.Label (Rect (95, 435, 140, 40), dataSkill.skill[skillListSlot[6 + page]].skillName , textStyle); //Show Skill's Name
		GUI.Label (Rect (220, 435, 140, 40), "MP : " + dataSkill.skill[skillListSlot[6 + page]].manaCost , textStyle); //Show Skill's MP Cost
		//-----------------------------
		
		if (GUI.Button (Rect (30,480,50,50), new GUIContent (dataSkill.skill[skillListSlot[7 + page]].icon, dataSkill.skill[skillListSlot[7 + page]].description ))) {
			AssignSkill(skillSelect , 7 + page);
				shortcutPage = true;
				skillListPage = false;
		}
		GUI.Label (Rect (95, 495, 140, 40), dataSkill.skill[skillListSlot[7 + page]].skillName , textStyle); //Show Skill's Name
		GUI.Label (Rect (220, 495, 140, 40), "MP : " + dataSkill.skill[skillListSlot[7 + page]].manaCost , textStyle); //Show Skill's MP Cost
		
		if (GUI.Button (Rect (220,514,25,30), "1")) {
			page = 0;
		}
		if (GUI.Button (Rect (250,514,25,30), "2")) {
			page = pageMultiply;
		}
		
		GUI.Box (Rect (20,20,240,26), GUI.tooltip);
		GUI.DragWindow (new Rect (0,0,10000,10000));
}

function AddSkill(id : int){
	var geta : boolean = false;
	var pt : int = 0;
	while(pt < skillListSlot.Length && !geta){
		if(skillListSlot[pt] == id){
			// Check if you already have this skill.
			geta = true;
		}else if(skillListSlot[pt] == 0){
			// Add Skill to empty slot.
			skillListSlot[pt] = id;
			ShowLearnedSkill(id);
			geta = true;
		}else{
			pt++;
		}
		
	}
	
}

function ShowLearnedSkill(id : int){
	var dataSkill : SkillData = database.GetComponent(SkillData);
	showSkillLearned = true;
	showSkillName = dataSkill.skill[id].skillName;
	yield WaitForSeconds(10.5);
	showSkillLearned = false;

}

function ResetPosition(){
		//Reset GUI Position when it out of Screen.
		if(windowRect.x >= Screen.width -30 || windowRect.y >= Screen.height -30 || windowRect.x <= -70 || windowRect.y <= -70 ){
			windowRect = originalRect;
		}
}

function LearnSkillByLevel(lv : int){
	var c : int = 0;
	while(c < learnSkill.Length){
		if(lv >= learnSkill[c].level){
			AddSkill(learnSkill[c].skillId);
		}
		c++;
	}

}