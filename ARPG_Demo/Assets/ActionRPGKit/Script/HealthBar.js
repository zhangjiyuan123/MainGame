#pragma strict
var maxHpBar : Texture2D;
var hpBar : Texture2D;
var mpBar : Texture2D;
var expBar : Texture2D;
var maxHpBarPosition : Vector2 = new Vector2(20 , 20);
var hpBarPosition : Vector2 = new Vector2(152 , 48);
var mpBarPosition : Vector2 = new Vector2(152 , 71);
var expBarPosition : Vector2 = new Vector2(152 , 94);
var levelPosition : Vector2 = new Vector2(24 , 86);
var maxHpBarWidth : int = 310;
var maxHpBarHeigh : int = 115;
var barHeight : int = 19;
var expBarHeight : int = 8;
var textStyle : GUIStyle;
var hpTextStyle : GUIStyle;

var barMultiply : float = 1.6;

var player : GameObject;
private var hptext : int = 100;

function Awake(){
	if(!player){
		player = GameObject.FindWithTag("Player");
	}
	hptext = 100 * barMultiply;
}

function OnGUI() {
    if(!player){
        return;
    }
    var maxHp : int = player.GetComponent(Status).maxHealth;
    var hp : int = player.GetComponent(Status).health * 100 / maxHp *barMultiply;
    var maxMp : int = player.GetComponent(Status).maxMana;
    var mp : int = player.GetComponent(Status).mana * 100 / maxMp *barMultiply;
    var maxExp : int = player.GetComponent(Status).maxExp;
    var exp : int = player.GetComponent(Status).exp * 100 / maxExp *barMultiply;
    var lv : int = player.GetComponent(Status).level;
    
    var currentHp : int = player.GetComponent(Status).health;
    var currentMp : int = player.GetComponent(Status).mana;
    
    GUI.DrawTexture(Rect(maxHpBarPosition.x ,maxHpBarPosition.y ,maxHpBarWidth,maxHpBarHeigh), maxHpBar);
    GUI.DrawTexture(Rect(hpBarPosition.x ,hpBarPosition.y ,hp,barHeight), hpBar);
    GUI.DrawTexture(Rect(mpBarPosition.x ,mpBarPosition.y ,mp,barHeight), mpBar);
    GUI.DrawTexture(Rect(expBarPosition.x ,expBarPosition.y ,exp,expBarHeight), expBar);
    
    GUI.Label (Rect (levelPosition.x, levelPosition.y, 50, 50), lv.ToString() , textStyle);
    GUI.Label (Rect (hpBarPosition.x, hpBarPosition.y, hptext, barHeight), currentHp.ToString() + "/" + maxHp.ToString() , hpTextStyle);
    GUI.Label (Rect (mpBarPosition.x, mpBarPosition.y, hptext, barHeight), currentMp.ToString() + "/" + maxMp.ToString() , hpTextStyle);
 }
