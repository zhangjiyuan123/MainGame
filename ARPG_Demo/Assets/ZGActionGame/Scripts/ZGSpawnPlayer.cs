using UnityEngine;
using System.Collections;

public class ZGSpawnPlayer : MonoBehaviour
{

    public GameObject player;
    //GameObject mainCamPrefab;
    private Transform mainCam;

    void Start()
    {
        //Check for Current Player in the scene
        GameObject currentPlayer = GameObject.FindWithTag("Player");
        if (currentPlayer)
        {
            // If there are the player in the scene already. Check for the Spawn Point Name
            // If it match then Move Player to the SpawnpointPosition
            string spawnPointName = currentPlayer.GetComponent<StatusC>().spawnPointName;
            GameObject spawnPoint = GameObject.Find(spawnPointName);
            if (spawnPoint)
            {
                currentPlayer.transform.position = spawnPoint.transform.position;
                currentPlayer.transform.rotation = spawnPoint.transform.rotation;
            }
            GameObject oldCam = currentPlayer.GetComponent<AttackTriggerC>().Maincam.gameObject;
            if (!oldCam)
            {
                return;
            }
            GameObject[] cam = GameObject.FindGameObjectsWithTag("MainCamera");
            foreach (GameObject cam2 in cam)
            {
                if (cam2 != oldCam)
                {
                    Destroy(cam2.gameObject);
                }
            }
            // If there are the player in the scene already. We will not spawn the new player.
            return;
        }
        //Spawn Player
        GameObject spawnPlayer = Instantiate(player, transform.position, transform.rotation) as GameObject;
        //mainCam = GameObject.FindWithTag("MainCamera").transform;
        // ARPGcameraC checkCam = mainCam.GetComponent<ARPGcameraC>();
        //Check for Main Camera
        //if (mainCam && checkCam)
        //{
           // mainCam.GetComponent<ARPGcameraC>().target = spawnPlayer.transform;
        //}
        /*else if(mainCam){
			Destroy (mainCam.gameObject);
		}*/

        Screen.lockCursor = true;
        //Set Target for All Enemy to Player
        GameObject[] mon;
        mon = GameObject.FindGameObjectsWithTag("Enemy");
        foreach (GameObject mo in mon)
        {
            if (mo)
            {
                mo.GetComponent<AIsetC>().followTarget = spawnPlayer.transform;
            }
        }
    }

}
