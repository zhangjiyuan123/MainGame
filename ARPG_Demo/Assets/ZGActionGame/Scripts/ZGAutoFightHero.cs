using UnityEngine;
using System.Collections;

[RequireComponent(typeof(StatusC))]
[RequireComponent(typeof(CharacterMotorC))]

public class ZGAutoFightHero : MonoBehaviour
{


    public enum AIState { Moving = 0, Pausing = 1, Idle = 2, Patrol = 3 }

    public GameObject mainModel;
    public Transform followTarget;
    public float approachDistance = 2.0f;
    public float detectRange = 15.0f;
    public float lostSight = 100.0f;
    public float speed = 4.0f;
    public bool useMecanim = false;
    public Animator animator;
    public AnimationClip movingAnimation;
    public AnimationClip idleAnimation;
    public AnimationClip attackAnimation;
    public AnimationClip hurtAnimation;

    [HideInInspector]
    public bool flinch = false;

    public bool stability = false;

    public bool freeze = false;

    public Transform bulletPrefab;
    public Transform attackPoint;

    public float attackCast = 0.3f;
    public float attackDelay = 0.5f;
    [HideInInspector]
    public AIState followState;
    private float distance = 0.0f;
    private int atk = 0;
    private int matk = 0;
    private Vector3 knock = Vector3.zero;
    [HideInInspector]
    public bool cancelAttack = false;
    private bool attacking = false;
    private bool castSkill = false;
    private GameObject[] gos;

    public AudioClip attackVoice;
    public AudioClip hurtVoice;
    StatusC stat; //= stat;
    CharacterController controller;// = GetComponent<CharacterController>();
    private Animation mAnim;
    private AudioSource mAudio;
    void Start()
    {
        gameObject.tag = "Enemy";

        if (!attackPoint)
        {
            attackPoint = this.transform;
        }

        if (!mainModel)
        {
            mainModel = this.gameObject;
        }

        stat = GetComponent<StatusC>();
        controller = GetComponent<CharacterController>();
        mAudio = GetComponent<AudioSource>();
        stat.useMecanim = useMecanim;
        //Assign MainModel in Status Script
        stat.mainModel = mainModel;
        //Set ATK = Monster's Status
        atk = stat.atk;
        matk = stat.matk;

        followState = AIState.Idle;
        if (!useMecanim)
        {
            //If using Legacy Animation
            mAnim = mainModel.GetComponent<Animation>();
            mAnim.Play(idleAnimation.name);
            mAnim[hurtAnimation.name].layer = 10;
        }
        else
        {
            //If using Mecanim Animation
            if (!animator)
            {
                animator = mainModel.GetComponent<Animator>();
            }
        }

    }

    Vector3 GetDestination()
    {
        Vector3 destination = followTarget.position;
        destination.y = transform.position.y;
        return destination;
    }

    void Update()
    {

        /*gos = GameObject.FindGameObjectsWithTag("Player");  
			if (gos.Length > 0) {
				followTarget = FindClosest().transform;
			}*/
        FindClosestEnemy();

        if (useMecanim)
        {
            animator.SetBool("hurt", flinch);
        }

        if (flinch)
        {
            controller.Move(knock * 6 * Time.deltaTime);
            return;
        }

        if (freeze || stat.freeze)
        {
            return;
        }

        if (!followTarget)
        {
            return;
        }
        //-----------------------------------

        if (followState == AIState.Moving)
        {
            if ((followTarget.position - transform.position).magnitude <= approachDistance)
            {
                followState = AIState.Pausing;
                if (!useMecanim)
                {
                    //If using Legacy Animation
                    mAnim.CrossFade(idleAnimation.name, 0.2f);
                }
                else
                {
                    animator.SetBool("run", false);
                }
                //----Attack----
                //Attack();
                StartCoroutine(Attack());
            }
            else if ((followTarget.position - transform.position).magnitude >= lostSight)
            {//Lost Sight
                stat.health = stat.maxHealth;
                followState = AIState.Idle;
                if (!useMecanim)
                {
                    //If using Legacy Animation
                    mAnim.CrossFade(idleAnimation.name, 0.2f);
                }
                else
                {
                    animator.SetBool("run", false);
                }
            }
            else
            {
                Vector3 forward = transform.TransformDirection(Vector3.forward);
                controller.Move(forward * speed * Time.deltaTime);

                Vector3 destinationy = followTarget.position;
                destinationy.y = transform.position.y;
                transform.LookAt(destinationy);
            }
        }
        else if (followState == AIState.Pausing)
        {
            Vector3 destinya = followTarget.position;
            destinya.y = transform.position.y;
            transform.LookAt(destinya);

            distance = (transform.position - GetDestination()).magnitude;
            if (distance > approachDistance)
            {
                followState = AIState.Moving;
                if (!useMecanim)
                {
                    //If using Legacy Animation
                    mAnim.CrossFade(movingAnimation.name, 0.2f);
                }
                else
                {
                    animator.SetBool("run", true);
                }
            }
        }
        //----------------Idle Mode--------------
        else if (followState == AIState.Idle)
        {
            Vector3 destinyheight = followTarget.position;
            destinyheight.y = transform.position.y - destinyheight.y;
            int getHealth = stat.maxHealth - stat.health;

            distance = (transform.position - GetDestination()).magnitude;
            if (distance < detectRange && Mathf.Abs(destinyheight.y) <= 4 || getHealth > 0)
            {
                followState = AIState.Moving;
                if (!useMecanim)
                {
                    //If using Legacy Animation
                    mAnim.CrossFade(movingAnimation.name, 0.2f);
                }
                else
                {
                    animator.SetBool("run", true);
                }
            }
        }
        //-----------------------------------
    }

    public void Flinch(Vector3 dir)
    {
        if (stability)
        {
            return;
        }
        if (hurtVoice && stat.health >= 1)
        {
            mAudio.clip = hurtVoice;
            mAudio.Play();
        }
        cancelAttack = true;
        if (followTarget)
        {
            Vector3 look = followTarget.position;
            look.y = transform.position.y;
            transform.LookAt(look);
        }
        knock = transform.TransformDirection(Vector3.back);
        //knock = dir;
        //KnockBack();
        StartCoroutine(KnockBack());
        if (!useMecanim)
        {
            //If using Legacy Animation
            mAnim.PlayQueued(hurtAnimation.name, QueueMode.PlayNow);
            mAnim.CrossFade(movingAnimation.name, 0.2f);
        }
        followState = AIState.Moving;

    }

    IEnumerator KnockBack()
    {
        flinch = true;
        yield return new WaitForSeconds(0.2f);
        flinch = false;
    }

    IEnumerator Attack()
    {
        cancelAttack = false;
        Transform bulletShootout;
        if (!flinch || !stat.freeze || !freeze || !attacking)
        {
            freeze = true;
            attacking = true;
            if (!useMecanim)
            {
                //If using Legacy Animation
                mAnim.Play(attackAnimation.name);
            }
            else
            {
                animator.Play(attackAnimation.name);
            }
            yield return new WaitForSeconds(attackCast);

            //attackPoint.transform.LookAt(followTarget);
            if (!cancelAttack)
            {
                if (attackVoice && !flinch)
                {
                    mAudio.clip = attackVoice;
                    mAudio.Play();
                }
                bulletShootout = Instantiate(bulletPrefab, attackPoint.transform.position, attackPoint.transform.rotation) as Transform;
                bulletShootout.GetComponent<BulletStatusC>().Setting(atk, matk, "Enemy", this.gameObject);
                yield return new WaitForSeconds(attackDelay);
                freeze = false;
                attacking = false;
                if (!useMecanim)
                {
                    //If using Legacy Animation
                    mAnim.CrossFade(movingAnimation.name, 0.2f);
                }
                else
                {
                    animator.SetBool("run", true);
                }
                CheckDistance();
            }
            else
            {
                freeze = false;
                attacking = false;
            }

        }

    }

    void CheckDistance()
    {
        if (!followTarget)
        {
            if (!useMecanim)
            {
                //If using Legacy Animation
                mAnim.CrossFade(idleAnimation.name, 0.2f);
            }
            else
            {
                animator.SetBool("run", false);
            }
            followState = AIState.Idle;
            return;
        }
        float distancea = (followTarget.position - transform.position).magnitude;
        if (distancea <= approachDistance)
        {
            Vector3 destinya = followTarget.position;
            destinya.y = transform.position.y;
            transform.LookAt(destinya);
            StartCoroutine(Attack());
            //Attack();
        }
        else
        {
            followState = AIState.Moving;
            if (!useMecanim)
            {
                //If using Legacy Animation
                mAnim.CrossFade(movingAnimation.name, 0.2f);
            }
            else
            {
                animator.SetBool("run", true);
            }
        }
    }


    void FindClosest()
    {
        // Find Closest Player   
        //GameObject closest = new GameObject();
        gos = GameObject.FindGameObjectsWithTag("Player");
        //gos += GameObject.FindGameObjectsWithTag("Ally"); 
        if (gos.Length > 0)
        {
            float distance = Mathf.Infinity;
            Vector3 position = transform.position;

            foreach (GameObject go in gos)
            {
                Vector3 diff = (go.transform.position - position);
                float curDistance = diff.sqrMagnitude;
                if (curDistance < distance)
                {
                    //------------
                    followTarget = go.transform;
                    distance = curDistance;
                }
            }
        }
    }

    void FindClosestEnemy()
    {
        // Find all game objects with tag Enemy
        float distance = Mathf.Infinity;
        float findingradius = detectRange;

        if (stat.health < stat.maxHealth)
        {
            findingradius += lostSight + 3.0f;
        }

        Collider[] objectsAroundMe = Physics.OverlapSphere(transform.position, findingradius);
        foreach (Collider obj in objectsAroundMe)
        {
            if (obj.CompareTag("Player") || obj.CompareTag("Ally"))
            {
                Vector3 diff = (obj.transform.position - transform.position);
                float curDistance = diff.sqrMagnitude;
                if (curDistance < distance)
                {
                    //------------
                    followTarget = obj.transform;
                    distance = curDistance;
                }
            }
        }

    }

    public void ActivateSkill(Transform skill, float castTime, float delay, string anim, float dist)
    {
        StartCoroutine(UseSkill(skill, attackCast, attackDelay, anim, dist));
    }


    public IEnumerator UseSkill(Transform skill, float castTime, float delay, string anim, float dist)
    {
        cancelAttack = false;
        if (!flinch && followTarget && (followTarget.position - transform.position).magnitude < dist && !stat.silence && !stat.freeze && !castSkill)
        {
            freeze = true;
            castSkill = true;
            if (!useMecanim)
            {
                //If using Legacy Animation
                mAnim.Play(anim);
            }
            else
            {
                animator.Play(anim);
            }
            //Transform bulletShootout;
            yield return new WaitForSeconds(castTime);
            //attackPoint.transform.LookAt(followTarget);
            if (!cancelAttack)
            {
                Transform bulletShootout = Instantiate(skill, attackPoint.transform.position, attackPoint.transform.rotation) as Transform;
                bulletShootout.GetComponent<BulletStatusC>().Setting(atk, matk, "Enemy", this.gameObject);
                yield return new WaitForSeconds(delay);
                freeze = false;
                castSkill = false;
                if (!useMecanim)
                {
                    //If using Legacy Animation
                    mAnim.CrossFade(movingAnimation.name, 0.2f);
                }
                else
                {
                    animator.SetBool("run", true);
                }
            }
            else
            {
                freeze = false;
                castSkill = false;
            }
        }
    }
}