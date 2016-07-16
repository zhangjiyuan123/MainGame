using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;

public class VMSkill : MonoBehaviour
{
    public static VMSkill instance;
    public List<Button> BtnsSkill; 
    void Awake()
    {
        instance = this;
        BtnsSkill = new List<Button>(3);
        for (int i = 0; i < BtnsSkill.Capacity; i++)
        {
            var tsName = "Skill_" + (i + 1);
            var btnTs = transform.FindChild(tsName);
            BtnsSkill.Add(btnTs.GetComponent<Button>());
        }
    }

    void OnDisable()
    {
        
    }
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
