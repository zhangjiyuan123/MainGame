using UnityEngine;
using System.Collections;
using UnityEngine.UI;

/// <summary>
/// 怪物的头像
/// </summary>
public class VMMonsterPhoto : MonoBehaviour
{
    public static VMMonsterPhoto instance;

    private Image _imgHp;
    private Text _txtName;
    void Awake()
    {
        instance = this;
        InitView();    
    }
	// Use this for initialization
	void Start () {
	
	}
    void InitView()
    {
        _imgHp = this.transform.FindChild("Img_Hp").GetComponent<Image>();
        _txtName = this.transform.FindChild("Txt_Name").GetComponent<Text>();
    }

    private Transform _lastObj = null;
    public void ChangeMonsterHp(StatusC target)
    {
        StartCoroutine(UpdateImage(target));
    }

    /// <summary>
    /// 更新image
    /// </summary>
    /// <param name="obj"></param>
    /// <returns></returns>
    IEnumerator UpdateImage(StatusC obj)
    {
        if (obj.transform != _lastObj)
        {
            _txtName.text = obj.name;
            _imgHp.fillAmount = 1.0f;
            _lastObj = obj.transform;
        }
        float target = obj.Health/(obj.MaxHealth*1.0f);
        if (target > 1.0f)
        {
            while (_imgHp.fillAmount < 1.0f)
            {
                _imgHp.fillAmount += 0.03f;
                yield return new WaitForSeconds(0.03f);
            }
            _imgHp.fillAmount = 0.0f;
            float leftTarget = target - 1.0f;

            while (_imgHp.fillAmount < leftTarget)
            {
                _imgHp.fillAmount += 0.03f;
                yield return new WaitForSeconds(0.03f);
            }
        }
        else
        {
            while (_imgHp.fillAmount > target)
            {
                //减
                _imgHp.fillAmount -= 0.03f;
                yield return new WaitForSeconds(0.03f);
            }
        }
    }
}
