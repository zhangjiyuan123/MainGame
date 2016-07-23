using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using System.Text;
using System.Xml.Serialization;

/// <summary>
/// 主玩家的头像 todo  统一时间设置血量 会引起脏数据 不能枷锁 只能存公共的 大家都获取公共数据
/// </summary>
public class VMMainPlayerPhoto : MonoBehaviour
{

    /// <summary>
    /// 血条
    /// </summary>
    private  Image _imgHp;
    /// <summary>
    /// 魔法条
    /// </summary>
    private Image _imgMp;
    /// <summary>
    /// 经验条
    /// </summary>
    private Image _imgExp;
    /// <summary>
    /// 等级文字
    /// </summary>
    private Text _txtLevel;
    /// <summary>
    /// 血条文字
    /// </summary>
    private Text _txtHp;
    /// <summary>
    /// 魔法文字
    /// </summary>
    private Text _txtMp;
    /// <summary>
    /// 经验条文字
    /// </summary>
    //private Text _txtExp;


    /// <summary>
    /// 设置血量
    /// </summary>
    public float HP
    {
        set { _imgHp.fillAmount = value; }
    }

    /// <summary>
    /// 设置魔法值
    /// </summary>
    public float MP
    {
        set { _imgMp.fillAmount = value; }
    }
    /// <summary>
    /// 设置等级
    /// </summary>
    public float Level
    {
        set { _txtLevel.text = value.ToString(); }
    }

    

    void Awake()
    {
        InitView();
    }

    /// <summary>
    /// 初始化UIView
    /// </summary>
    private void InitView()
    {
        _imgHp = this.transform.FindChild("Img_Hp").GetComponent<Image>();
        _imgMp = this.transform.FindChild("Img_Mp").GetComponent<Image>();
        _imgExp = this.transform.FindChild("Img_Exp").GetComponent<Image>();
        _txtLevel = this.transform.FindChild("Txt_Level").GetComponent<Text>();
        _txtHp = this.transform.FindChild("Txt_Hp").GetComponent<Text>();
        _txtMp = this.transform.FindChild("Txt_Mp").GetComponent<Text>();
        //_txtExp = this.transform.FindChild("Txt_Exp").GetComponent<Text>();
    }
    // Use this for initialization
    void Start ()
    {
        StatusC mainPlayer = StatusManager.instance.MainPlayer;
        //暂时数据初始化放这里 todo 得到角色数据
        if (mainPlayer != null)
        {
            //血条变化监听
            InitData(mainPlayer);
            mainPlayer.onChangeHealth = (c, m) =>
            {
                Debug.Log("hp:"+c + "|" + m);
                if (c == m)
                {
                    SetImgAndTxt(c, m, _imgHp, _txtHp);
                }
                else
                {
                    // ReSharper disable once PossibleLossOfFraction
                    StartCoroutine(UpdateImageAndTxt(c, m, _imgHp, _txtHp));
                }
               
            };
            //魔法变化监听
            mainPlayer.onChangeMp = (c, m) =>
            {
                Debug.Log("mp:" + c + "|" + m);
                if (c == m)
                {
                    SetImgAndTxt(c, m, _imgMp, _txtMp);
                }
                else
                {
                    StartCoroutine(UpdateImageAndTxt(c, m, _imgMp, _txtMp));
                }
            };
            mainPlayer.onChangeExp = (c, m) =>
            {
                StartCoroutine(UpdateExpImage(c,m,_imgExp));
                //_imgExp.fillAmount = Mathf.Lerp(_imgExp.fillAmount, c/(m*1.0f), Time.deltaTime);
                //  _txtExp.text = sb.ToString();
            };
            mainPlayer.onUpdateLevel = (data) =>
            {
                _txtLevel.text = data.ToString();
            };
        }
    }

    private void InitData(StatusC player)
    {
        SetImgAndTxt(player.Health,player.MaxHealth,_imgHp,_txtHp);
        SetImgAndTxt(player.Mana, player.MaxMana, _imgMp, _txtMp);
        SetImgAndTxt(player.Exp, player.MaxExp, _imgExp, null);
    }
    /// <summary>
    /// 更新文本信息
    /// </summary>
    /// <param name="cur"></param>
    /// <param name="max"></param>
    /// <param name="txt"></param>
    private void UpdateTxt(int cur,int max,Text txt)
    {
        StringBuilder sb = new StringBuilder();
        sb.Append(cur);
        sb.Append("/");
        sb.Append(max);
        // img.fillAmount = cur / (max * 1.0f);
        txt.text = sb.ToString();
    }
    /// <summary>
    /// 直接设置初始的数据
    /// </summary>
    /// <param name="cur"></param>
    /// <param name="max"></param>
    /// <param name="img"></param>
    /// <param name="txt"></param>
    private void SetImgAndTxt(int cur, int max, Image img, Text txt)
    {
        img.fillAmount = cur/(max*1.0f);
        if (txt != null)
        {
            UpdateTxt(cur,max,txt);
        }
    }
    /// <summary>
    /// 缓动更新血条和魔法进度条和文字
    /// </summary>
    /// <param name="cur"></param>
    /// <param name="max"></param>
    /// <param name="img"></param>
    /// <param name="txt"></param>
    /// <returns></returns>

    IEnumerator UpdateImageAndTxt(int cur,int max,Image img,Text txt)
    {
        UpdateTxt(cur,max,txt);
        //进度条变化
        float target = cur/(max*1.0f);
        if (img.fillAmount < target)
        {
            while (img.fillAmount<target)
            {
                img.fillAmount += 0.03f;
                yield return new WaitForSeconds(0.03f);
            }
        }
        else
        {
            while (img.fillAmount > target)
            {
                img.fillAmount -= 0.03f;
                yield return new WaitForSeconds(0.03f);
            }
        }
    }
    /// <summary>
    /// 更新经验条
    /// </summary>
    /// <param name="img"></param>
    /// <param name="target"></param>
    /// <returns></returns>
    IEnumerator UpdateExpImage(int cur,int max,Image img)
    {
        float target = cur/(max*1.0f);
        if (target > 1.0f)
        {
            while (img.fillAmount < 1.0f)
            {
                img.fillAmount += 0.03f;
                yield return new WaitForSeconds(0.03f);
            }
            img.fillAmount = 0.0f;
            float leftTarget = target - 1.0f;

            while (img.fillAmount < leftTarget)
            {
                img.fillAmount += 0.03f;
                yield return new WaitForSeconds(0.03f);
            }
        }
        else
        {
            while (img.fillAmount < target)
            {
                //加
                img.fillAmount += 0.03f;
                yield return new WaitForSeconds(0.03f);
            }
        }
    }
}
