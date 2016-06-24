using UnityEngine;
using System.Collections;
using System;

public class ZGIEnumeratorDriver : MonoBehaviour {


     
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

    public static void  RemoveDispatcher(ZGIEnumeratorDispatcher dispatch)
    {

    }
}
public class ZGIEnumeratorDispatcher : System.IDisposable
{
    /// <summary>
    /// 从携程计时器中移除改对象
    /// </summary>
    public void Dispose()
    {
        ZGIEnumeratorDriver.RemoveDispatcher(this);
    }
}