using UnityEngine;
using System.Collections;

public class GainEXPC : MonoBehaviour {
	
	public int expGain = 20;
	GameObject player;
	void  Start (){
		if(!player){
			player = GameObject.FindWithTag ("Player");
		}
		player.GetComponent<StatusC>().gainEXP(expGain);
	}
}