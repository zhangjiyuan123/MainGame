using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using System.Text;
public class VMHealthBarHero : MonoBehaviour
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
        if (mainPlayer != null)
        {
            //血条变化监听
            mainPlayer.onChangeHealth = (c, m) =>
            {
                // ReSharper disable once PossibleLossOfFraction
                StringBuilder sb = new StringBuilder();
                sb.Append(c);
                sb.Append("/");
                sb.Append(m);
                _imgHp.fillAmount = c / (m * 1.0f);
                _txtHp.text = sb.ToString();
            };
            //魔法变化监听
            mainPlayer.onChangeMp = (c, m) =>
            {
                StringBuilder sb = new StringBuilder();
                sb.Append(c);
                sb.Append("/");
                sb.Append(m);
                _imgMp.fillAmount = c/(m*1.0f);
                _txtMp.text = sb.ToString();

            };
            mainPlayer.onChangeExp = (c, m) =>
            {
                StringBuilder sb = new StringBuilder();
                sb.Append(c);
                sb.Append("/");
                sb.Append(m);
                StartCoroutine(UpdateImage(_imgExp, c / (m * 1.0f)));
                //_imgExp.fillAmount = Mathf.Lerp(_imgExp.fillAmount, c/(m*1.0f), Time.deltaTime);
                //  _txtExp.text = sb.ToString();
            };
            mainPlayer.onUpdateLevel = (data) =>
            {
                _txtLevel.text = data.ToString();
            };
        }
    }

    IEnumerator UpdateImage(Image img,float target)
    {
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
                img.fillAmount += 0.03f;
                yield return new WaitForSeconds(0.03f);
            }
        }
    }
    // Update is called once per frame
	void Update () {
	
	}
}
