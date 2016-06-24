using UnityEngine;
using System.Collections;

public class DamagePopupC : MonoBehaviour {
	
	Vector3 targetScreenPosition;
	public string damage = "";
	public GUIStyle fontStyle;
	
	public float duration = 0.5f;

	private int glide = 50;
	
	void  Start (){
		Destroy (gameObject, duration);
		//Glide();
		StartCoroutine(Glide());

	}

	IEnumerator Glide(){
		int a = 0;
		while(a < 100){
			glide += 2;
			yield return new WaitForSeconds(0.03f); 
		}
	}
	
	void  OnGUI (){
		targetScreenPosition = Camera.main.WorldToScreenPoint(transform.position);
		targetScreenPosition.y = Screen.height - targetScreenPosition.y - glide;
		targetScreenPosition.x = targetScreenPosition.x - 6;
		if(targetScreenPosition.z > 0){
			GUI.Label (new Rect (targetScreenPosition.x,targetScreenPosition.y,200,50), damage,fontStyle);
		}
	}
}