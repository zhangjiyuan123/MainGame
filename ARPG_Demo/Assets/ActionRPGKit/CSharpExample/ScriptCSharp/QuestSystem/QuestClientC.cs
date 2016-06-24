using UnityEngine;
using System.Collections;

public class QuestClientC : MonoBehaviour {
	
	public int questId = 1;
	public GameObject questData;
	//private int finishProgress = 0;
	public Texture2D button;
	public Texture2D textWindow;
	[HideInInspector]
	public bool  enter = false;
	private bool  showGui = false;
	private bool  showError = false;
	[HideInInspector]
	public int s = 0;
	
	private GameObject player;

	public string[] talkText = new string[3];
	public string[] ongoingQuestText = new string[1];
	public string[] finishQuestText = new string[1];
	public string[] alreadyFinishText = new string[1];
	private string errorLog = "Quest Full...";
	
	public GUIStyle textStyle;
	private bool  acceptQuest = false;
	public bool  trigger = true;
	//private bool  activateQuest = false;
	private int textLength = 0;
	public string showText = "";
	private bool  thisActive = false;
	private bool  questFinish = false;
	public string sendMsgWhenTakeQuest = "";

	void  Update (){
		if(Input.GetKeyDown("e") && enter && thisActive && !showError){
			NextPage();
		}
		
	}
	
	void  NextPage (){
		//Check if it already finish
		int ongoing = player.GetComponent<QuestStatC>().CheckQuestProgress(questId);
		int finish =	questData.GetComponent<QuestDataC>().questData[questId].finishProgress;
		int qprogress = player.GetComponent<QuestStatC>().questProgress[questId];
		if(qprogress >= finish + 9){
			textLength = alreadyFinishText.Length;
			if(s < textLength){
				showText = alreadyFinishText[s];
			}
			s++;
			TalkOnly();
			print("Already Clear");
			return;
		}
		
		if(acceptQuest){
			if(ongoing >= finish){ //Quest Complete
				textLength = finishQuestText.Length;
				if(s < textLength){
					showText = finishQuestText[s];
				}
				s++;
				FinishQuest();
			}else{ //Ongoing
				textLength = ongoingQuestText.Length;
				if(s < textLength){
					showText = ongoingQuestText[s];
				}
				s++;
				TalkOnly();
			}
		}else{
			//Before Take the quest
			textLength = talkText.Length;
			if(s < textLength){
				showText = talkText[s];
			}
			s++;
			TakeQuest();
		}
	}
	
	void  TakeQuest (){
		if(s > textLength){
			showGui = false;
			StartCoroutine(AcceptQuest());
			//AcceptQuest();
			CloseTalk();
		}else{
			Talking();
		}
		
	}
	
	void  TalkOnly (){
		if(s > textLength){
			showGui = false;
			CloseTalk();
		}else{
			Talking();
		}
	}
	
	public void  FinishQuest (){
		if(s > textLength){
			showGui = false;
			questData.GetComponent<QuestDataC>().QuestClear(questId , player);
			player.GetComponent<QuestStatC>().Clear(questId);
			print("Clear");
			questFinish = true;
			CloseTalk();
		}else{
			Talking();
		}
	}
	
	public IEnumerator AcceptQuest (){
		bool full = player.GetComponent<QuestStatC>().AddQuest(questId);
		if(full){
			//Quest Full
			showError = true; //Show Quest Full Window
			yield return new WaitForSeconds(1);
			showError = false;
			
		}else{
			acceptQuest = player.GetComponent<QuestStatC>().CheckQuestSlot(questId);
			if(sendMsgWhenTakeQuest != ""){
				SendMessage(sendMsgWhenTakeQuest);
			}
		}
		
	}
	
	public void  CheckQuestCondition (){
		QuestDataC quest = questData.GetComponent<QuestDataC>();
		int progress = player.GetComponent<QuestStatC>().CheckQuestProgress(questId);
		
		if(progress >= quest.questData[questId].finishProgress){
			//Quest Clear
			quest.QuestClear(questId , player);
			
		}
		
	}
	
	void  OnGUI (){
		if(!player){
			return;
		}
		if(enter && !showGui && !showError){
			GUI.DrawTexture( new Rect(Screen.width / 2 - 130, Screen.height - 120, 260, 80), button);
		}
		
		if(showError){
			GUI.DrawTexture( new Rect(80, Screen.height - 255, 615, 220), textWindow);
			GUI.Label ( new Rect(125, Screen.height - 220, 500, 200), errorLog , textStyle);
			if (GUI.Button ( new Rect(590,Screen.height - 100,80,30), "OK")) {
				showError = false;
			}
		}
		if(showGui && !showError && s <= textLength){
			GUI.DrawTexture( new Rect(80, Screen.height - 255, 615, 220), textWindow);
			GUI.Label ( new Rect(125, Screen.height - 220, 500, 200), showText , textStyle);
			if (GUI.Button ( new Rect(590,Screen.height - 100,80,30), "Next")) {
				NextPage();
			}
		}
		
	}
	
	
	void  OnTriggerEnter ( Collider other  ){
		if(!trigger){
			return;
		}
		if(other.tag == "Player"){
			s = 0;
			player = other.gameObject;
			acceptQuest = player.GetComponent<QuestStatC>().CheckQuestSlot(questId);
			enter = true;
			thisActive = true;
		}
		
	}
	
	void  OnTriggerExit ( Collider other  ){
		if(!trigger){
			return;
		}
		if(other.tag == "Player"){
			s = 0;
			enter = false;
			CloseTalk();
		}
		thisActive = false;
		showError = false;
		
	}
	
	void  Talking (){
		if(!enter){
			return;
		}
		Time.timeScale = 0.0f;
		Screen.lockCursor = false;
		showGui = true;
		
	}
	
	void  CloseTalk (){
		showGui = false;
		Time.timeScale = 1.0f;
		Screen.lockCursor = true;
		s = 0;
		
	}
	
	public bool ActivateQuest ( GameObject p  ){
		player = p;
		acceptQuest = player.GetComponent<QuestStatC>().CheckQuestSlot(questId);
		thisActive = false;
		trigger = false;
		NextPage();
		return questFinish;
		
		
	}
	
}