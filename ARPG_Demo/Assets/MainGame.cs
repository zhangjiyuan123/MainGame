using UnityEngine;
using System.Collections;

public class MainGame : MonoBehaviour {

    private ZGDispatchDriver timerManager = null;
    private DispatchTimer autoFightTimer = null;
	// Use this for initialization
	void Start () {
// 
//         autoFightTimer = new DispatchTimer("AutoFightTimer", 1000, 0);
//         autoFightTimer.Finished = (s, e) =>
//         {
//             Debug.LogError("自动挂机执行" + (s as DispatchTimer).ModalName);
//             AutoFightManaer();
//         };
//         autoFightTimer.Start();
       

//         timerManager = ZGDispatchDriver.MInstance;
//         DispatchTimer dt = new DispatchTimer("test1", 3200, 4);
//         dt.Finished = (s, e) =>
//         {
//             Debug.LogError("携程执行完成 3.2" + (s as DispatchTimer).ModalName);
//         };
//         dt.Start();
//         DispatchTimer dt2 = new DispatchTimer("test2", 3000, 2);
//         dt2.Finished = (s, e) =>
//         {
//             Debug.LogError("携程执行完成 3" + (s as DispatchTimer).ModalName);
//         };
//         dt2.Start();
// 
//         DispatchTimer dt3 = new DispatchTimer("test3", 1000, 6);
//         dt3.Finished = (s, e) =>
//         {
//             Debug.LogError("携程执行完成 1" + (s as DispatchTimer).ModalName);
//         };
//         dt3.Start();
// 
//         DispatchTimer dt4 = new DispatchTimer("test4", 2500, 8);
//         dt4.Finished = (s, e) =>
//         {
//             Debug.LogError("携程执行完成 2.5" + (s as DispatchTimer).ModalName);
//         };
//         dt4.Start();
//         timerManager.AddDTTimer(dt2);
//         timerManager.AddDTTimer(dt);
//         timerManager.AddDTTimer(dt3);
//         timerManager.AddDTTimer(dt4);
    }
	private void AutoFightManaer()
    {

    }
	// Update is called once per frame
	void Update () {
	
	}
}
