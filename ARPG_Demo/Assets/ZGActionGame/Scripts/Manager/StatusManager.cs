using UnityEngine;
using System.Collections;

public class StatusManager : MonoBehaviour
{
    public static StatusManager instance;
    private  StatusC mainPlayer;

    public StatusC MainPlayer
    {
        get
        {
            if (mainPlayer == null)
            {
                GameObject player = GameObject.FindWithTag("Player");
                if (player != null)
                {
                    mainPlayer = player.GetComponent<StatusC>();
                }
            }
            return mainPlayer;
        }

        set
        {
            mainPlayer = value;
        }
    }

    void Awake()
    {
        instance = this;
    }
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
