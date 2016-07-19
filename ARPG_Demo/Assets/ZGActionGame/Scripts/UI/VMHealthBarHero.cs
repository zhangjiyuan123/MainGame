using UnityEngine;
using System.Collections;
using UnityEngine.UI;

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

    private Text _txtLevel;

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
    }
    // Use this for initialization
    void Start ()
    {
        StatusManager.instance.MainPlayer.onChangeHealth = (h, m) =>
        {
            // ReSharper disable once PossibleLossOfFraction
            _imgHp.fillAmount = h/(m*1.0f);
        };
    }
	
	// Update is called once per frame
	void Update () {
	
	}
}
