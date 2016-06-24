using UnityEngine;
using System.Collections;

public class DialogueC : MonoBehaviour {
	public TextDialogue[] message = new TextDialogue[1];
	
	public Texture2D button;
	public Texture2D textWindow;
	[HideInInspector]
	public bool  enter = false;
	private bool  showGui = false;
	[HideInInspector]
	public int s = 0;
	[HideInInspector]
	public GameObject player;
	
	[HideInInspector]
	public bool  talkFinish = false;
	
	public string sendMessageWhenDone = "";

	public GUIStyle textStyle;
	//-------------------------
	private string[] str = new string[4];
	private int line = 0;
	
	private float wait = 0;
	public float delay = 0.05f;
	private bool  begin = false;
	private int i = 0;
	private string[] wordComplete = new string[4];
	public bool  freezeTime = true;
	
	void  Update (){
		if(Input.GetKeyDown("e") && enter){
			NextPage();
		}
		if(begin){
			if(wait >= delay){
				if(wordComplete[line].Length > 0)
					str[line] += wordComplete[line][i++];
				wait = 0;
				if(i >= wordComplete[line].Length && line > 2){
					begin = false;
				}else if(i >= wordComplete[line].Length){
					i = 0;
					line++;
				}
			}else{
				//wait += Time.deltaTime;
				wait += Time.unscaledDeltaTime;
			}
			
		}
		
	}
	
	public void  AnimateText ( string strComplete  ,   string strComplete2  ,   string strComplete3  ,   string strComplete4  ){
		begin = false;
		i = 0;
		str[0] = "";
		str[1] = "";
		str[2] = "";
		str[3] = "";
		line = 0;
		wordComplete[0] = strComplete;
		wordComplete[1] = strComplete2;
		wordComplete[2] = strComplete3;
		wordComplete[3] = strComplete4;
		begin = true;
	}
	
	void  OnTriggerEnter ( Collider other  ){
		if(other.tag == "Player"){
			s = 0;
			talkFinish = false;
			player = other.gameObject;
			enter = true;
		}
		
	}
	
	void  OnTriggerExit ( Collider other  ){
		if(other.tag == "Player"){
			s = 0;
			enter = false;
			CloseTalk();
		}
		
	}
	
	public void  CloseTalk (){
		showGui = false;
		Time.timeScale = 1.0f;
		Screen.lockCursor = true;
		s = 0;
		
	}
	
	public void  NextPage (){
		if(!enter){
			return;
		}
		if(begin){
			str[0] = wordComplete[0];
			str[1] = wordComplete[1];
			str[2] = wordComplete[2];
			str[3] = wordComplete[3];
			begin = false;
			return;
		}
		s++;
		if(s > message.Length){
			showGui = false;
			talkFinish = true;
			CloseTalk();
			if(sendMessageWhenDone != ""){
				gameObject.SendMessage(sendMessageWhenDone);
			}
		}else{
			if(freezeTime){
				Time.timeScale = 0.0f;
			}
			talkFinish = false;
			Screen.lockCursor = false;
			showGui = true;
			AnimateText(message[s-1].textLine1 , message[s-1].textLine2 , message[s-1].textLine3 , message[s-1].textLine4);
		}
	}
	
	void  OnGUI (){
		if(!player){
			return;
		}
		if(enter && !showGui){
			//GUI.DrawTexture( new Rect(Screen.width / 2 - 130, Screen.height - 120, 260, 80), button);
			if (GUI.Button ( new Rect(Screen.width / 2 - 130, Screen.height - 180, 260, 80), button)){
				NextPage();
			}
		}
		
		if(showGui && s <= message.Length){
			GUI.DrawTexture( new Rect(Screen.width /2 - 308, Screen.height - 255, 615, 220), textWindow);
			GUI.Label ( new Rect(Screen.width /2 - 263, Screen.height - 220, 500, 200), str[0] , textStyle);
			GUI.Label ( new Rect(Screen.width /2 - 263, Screen.height - 190, 500, 200), str[1] , textStyle);
			GUI.Label ( new Rect(Screen.width /2 - 263, Screen.height - 160, 500, 200), str[2] , textStyle);
			GUI.Label ( new Rect(Screen.width /2 - 263, Screen.height - 130, 500, 200), str[3] , textStyle);
			if (GUI.Button ( new Rect(Screen.width /2 + 150,Screen.height - 100,140,60), "Next")) {
				NextPage();
			}
		}
		
	}
}

[System.Serializable]
public class TextDialogue{
	public string textLine1 = "";
	public string textLine2 = "";
	public string textLine3 = "";
	public string textLine4 = "";
}