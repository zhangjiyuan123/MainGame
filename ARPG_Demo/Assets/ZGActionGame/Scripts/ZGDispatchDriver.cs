using UnityEngine;
using System.Collections;
using System;
using System.Collections.Generic;
public class ZGDispatchDriver : MonoBehaviour
{
    private static ZGDispatchDriver DriverDispatch = null;
    public static ZGDispatchDriver MInstance
    {
        get
        {
            return DriverDispatch;
        }
    }
    /// <summary>
    /// 最小时间间隔
    /// </summary>
    public float MinTimeDelta
    {
        get
        {
           
            return minTimeDelta;
        }

        set
        {
            minTimeDelta = value;
        }
    }

    public bool NeedUpdateMinTimeDelta
    {
        get
        {
            return needUpdateMinTimeDelta;
        }

        set
        {
            Debug.LogError("设置bool "+value+Time.realtimeSinceStartup);
            needUpdateMinTimeDelta = value;
        }
    }

    private List<DispatchTimer> lstDTTimers = null;
    private float minTimeDelta = float.MaxValue;
    private bool needUpdateMinTimeDelta = false;
    void Awake()
    {
        DriverDispatch = this;
        lstDTTimers = new List<DispatchTimer>();
        //StartCoroutine(DTManager());

    }
    void Update()
    {
        ExcuteTimers();
    }

    private void ExcuteTimers()
    {
        for (int i = 0; i < lstDTTimers.Count; i++) //不要用缓存的count 因为外部会改变list的大小
        {
            try
            {
                if (lstDTTimers[i].MRunState == TimerState.Running)
                {
                    lstDTTimers[i].ExcuteTimer(DateTime.Now.Ticks);
                }
            }
            catch (Exception e)
            {
                Debug.LogError(e.ToString());
            }
        }
    }
    private bool checkAll = false;
    private IEnumerator DTManager()
    {
        while(true)
        {
            yield return new WaitForSeconds(MinTimeDelta);
            // int count = ;
            ExcuteTimers();
        }

    }

    public void AddDTTimer(DispatchTimer dt)
    {
        lstDTTimers.Add(dt);
     //   UpdateMinDeltaTime();
    }

    public void AddDTTimerNoUpdate(DispatchTimer dt)
    {
        lstDTTimers.Add(dt);
      //  UpdateMinDeltaTime();
    }
    public void RemoveDTTimer(DispatchTimer dt)
    {
       // NeedUpdateMinTimeDelta = true;
        lstDTTimers.Remove(dt);
     //   UpdateMinDeltaTime();
    }
    private void ClearAll()
    {
        lstDTTimers.Clear();
    }
    private void UpdateMinDeltaTime()
    {
      //  if (NeedUpdateMinTimeDelta)
        {
            float temp = float.MaxValue;
            if (lstDTTimers.Count > 1)
            {
                lstDTTimers.Sort((a, b) => { return a.InternalTime.CompareTo(b.InternalTime); });
                for (int i = 0; i < lstDTTimers.Count - 1; i++)
                {
                    float delta = Mathf.Abs(lstDTTimers[i].InternalMillSec - lstDTTimers[i + 1].InternalMillSec); //两个携程之间时间间距最小的
                    if (delta < temp)
                    {
                        temp = delta;
                        if (temp == 0.0f)
                        {
                            Debug.LogError(">1" + temp);
                        }
                    }
                }
                if(temp==0.0f)
                {
                    Debug.LogError(">1" + temp);
                }
                Debug.LogError(">1"+temp);
            }
            else
            {
                if (lstDTTimers.Count > 0)
                {
                    temp = lstDTTimers[0].InternalTime.Milliseconds; //只有一个的时候用当前时间的间隔
                    Debug.LogError("==1:"+temp);
                }
            }
            minTimeDelta = temp * 0.1f;//这个0.1f是为了调整时间精度
           // NeedUpdateMinTimeDelta = false;
           Debug.LogError("更新时间间距:"+ minTimeDelta.ToString());

        }
        StopAllCoroutines();
        StartCoroutine(DTManager());
    }
}
/// <summary>
/// 计时器完成的回调
/// </summary>
/// <param name="sender"></param>
/// <param name="args"></param>
public delegate void DTEventHandler(object sender, EventArgs args);
public class DispatchTimer:IDisposable
{

    private TimeSpan internalTime = TimeSpan.Zero;
    private long lastTick =long.MaxValue;
    public DTEventHandler Finished = null;
    private string modalName = "Common";
    private int timerID = -1;
    private TimerState mRunState = TimerState.None;
    private EventArgs eventArgs = EventArgs.Empty;
    private uint loopTimes = 1;
    private uint excuteTimes = 0;

    public uint InternalMillSec =0;
    /// <summary>
    /// 计时器间隔时间
    /// </summary>
    public TimeSpan InternalTime
    {
        get
        {
            return internalTime;
        }

        set
        {
            internalTime =value;
        }
    }

    public string ModalName
    {
        get
        {
            return modalName;
        }

//         set
//         {
//             modalName = value;
//         }
    }

    public TimerState MRunState
    {
        get
        {
            return mRunState;
        }

        set
        {
            mRunState = value;
        }
    }

    public DispatchTimer(string dtName, uint dtDelta)
    {
        modalName = dtName;
        InternalTime =TimeSpan.FromMilliseconds(dtDelta);

        ZGDispatchDriver.MInstance.AddDTTimer(this);
    }
    public DispatchTimer(string dtName, uint dtDelta, uint loopTime)
    {
        modalName = dtName;
        InternalTime = TimeSpan.FromMilliseconds(dtDelta);
        loopTimes = loopTime;

        ZGDispatchDriver.MInstance.AddDTTimer(this);

    }
    public DispatchTimer(string dtName, uint dtDelta,EventArgs args)
    {
        modalName = dtName;
        InternalTime = TimeSpan.FromMilliseconds(dtDelta);
        eventArgs = args;

        ZGDispatchDriver.MInstance.AddDTTimer(this);
    }

    public void Start()
    {
        mRunState = TimerState.Running;
        lastTick = DateTime.Now.Ticks;
    }


    public void Pause()
    {
        mRunState = TimerState.Pause;
        lastTick = long.MaxValue;
    }
    public void UnPause()
    {
//         mRunState = TimerState.Running;
//         lastTick = DateTime.Now.Ticks - lastTick;
    }
    public void Stop()
    {
        mRunState = TimerState.Stop;
        lastTick = long.MaxValue;
    }

    public void ExcuteTimer(long now)
    {
        if(now - lastTick<internalTime.Ticks)
        {
            return;
        }
        lastTick = now;
        excuteTimes++;
        if(Finished!=null)
        {
            Finished(this,EventArgs.Empty);//
        }
        //0代表无限循环
        if(loopTimes>0)
        {
            if (excuteTimes >= loopTimes)
            {
                this.Dispose();
            }
        }
    }
    public void Dispose()
    {
        // this = null;
        ZGDispatchDriver.MInstance.RemoveDTTimer(this);
    }

   
}
public enum TimerState
{
    None,
    Running,//运行中
    Pause,//暂停中
    Stop,//停止
}

