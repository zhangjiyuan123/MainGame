using UnityEngine;
using System.Collections;

public class SkillDataC : MonoBehaviour {
	
	[System.Serializable]
	public class Skil {
		public string skillName = "";
		public Texture2D icon;
		public Transform skillPrefab;
		public AnimationClip skillAnimation;
		public int manaCost = 10;
		public string description = "";
	}
	
	public Skil[] skill = new Skil[3];
}