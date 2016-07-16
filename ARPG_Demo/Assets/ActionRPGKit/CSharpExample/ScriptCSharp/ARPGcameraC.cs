using UnityEngine;
using System.Collections;
/// <summary>
/// 角色跟随的相机 
/// </summary>
public class ARPGcameraC : MonoBehaviour {
	
	public Transform target;
	public Transform targetBody;
	public float targetHeight = 3.0f;
	public float distance = 8.0f;
	public float maxDistance = 10;
	public float minDistance =2.2f;
	public float xSpeed = 250.0f;
	public float ySpeed = 120.0f;
	public float yMinLimit = -10;
	public float yMaxLimit = 70;
	public float zoomRate = 80;
	public float rotationDampening = 3.0f;
	private float x = 20.0f;
	private float y = 0.0f;
	public Quaternion aim;
	public float aimAngle = 8;
	public bool  lockOn = false;
	RaycastHit hit;

    private Vector3 cammerPosOffset ;
    private Quaternion cammerRotOffset;
    private Vector3 heightOffset;
	void  Start (){
		if(!target){
			target = GameObject.FindWithTag ("Player").transform;
		}
		Vector3 angles = transform.eulerAngles;
		x = angles.y;
		y = angles.x;
		
		if (GetComponent<Rigidbody>())
			GetComponent<Rigidbody>().freezeRotation = true;

        // transform.rotation = rotation;
        //Screen.lockCursor = true;
        initCammerParams();
    }
    void initCammerParams()
    {
        cammerPosOffset = new Vector3(0.0f, 5.0f, 4.0f);
        cammerRotOffset = Quaternion.Euler(45.0f, 180.0f, 0);
        heightOffset = new Vector3(0.0f, -targetHeight, 0.0f);
        // distance -= (Input.GetAxis("Mouse ScrollWheel") * Time.deltaTime) * zoomRate * Mathf.Abs(distance);
        // distance = Mathf.Clamp(distance, minDistance, maxDistance);

        //y = ClampAngle(y, yMinLimit, yMaxLimit);

        // Rotate Camera
        Quaternion rotation = cammerRotOffset;
        transform.rotation = rotation;
        aim = Quaternion.Euler(y - aimAngle, x, 0);

        //Rotate Target
        if (Input.GetButton("Fire1") || Input.GetButton("Fire2") || Input.GetAxis("Horizontal") != 0 || Input.GetAxis("Vertical") != 0 || lockOn)
        {
            targetBody.transform.rotation = Quaternion.Euler(0, x, 0);
        }

//         Vector3 positiona = target.position - (cammerRotOffset * Vector3.forward * distance + new Vector3(0.0f, -targetHeight, 0.0f));
//         transform.position = positiona;
    }
    void  LateUpdate (){
		if(!target)
			return;
		if(!targetBody){
      		targetBody = target;
      	}
		
		if (Time.timeScale == 0.0f){
			return;
		}
	
// 		x += Input.GetAxis("Mouse X") * xSpeed * 0.02f;
// 		y -= Input.GetAxis("Mouse Y") * ySpeed * 0.02f;
		
		
		//Camera Position

		Vector3 positiona = target.position - (cammerRotOffset * Vector3.forward * distance + heightOffset);
		transform.position = positiona;
     //   transform.localPosition = transform.localPosition + cammerPosOffset;

        Vector3 trueTargetPosition = target.transform.position - heightOffset;

		if (Physics.Linecast (trueTargetPosition, transform.position, out hit)) {
			if(hit.transform.tag == "Wall"){
				float tempDistance = Vector3.Distance (trueTargetPosition, hit.point) - 0.28f;
				
				positiona = target.position - (cammerRotOffset * Vector3.forward * tempDistance + heightOffset);
				transform.position = positiona;
			}
		}
	}
	
	static float  ClampAngle ( float angle ,   float min ,   float max  ){
		if (angle < -360)
			angle += 360;
		if (angle > 360)
			angle -= 360;
		return Mathf.Clamp (angle, min, max);
		
	}
}