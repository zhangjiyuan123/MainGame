using UnityEngine;
using System.Collections;

public class ARPGcameraC : MonoBehaviour {
	
	public Transform target;
	public Transform targetBody;
	public float targetHeight = 1.2f;
	public float distance = 4.0f;
	public float maxDistance = 6;
	public float minDistance = 1.0f;
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

	
	void  Start (){
		if(!target){
			target = GameObject.FindWithTag ("Player").transform;
		}
		Vector3 angles = transform.eulerAngles;
		x = angles.y;
		y = angles.x;
		
		if (GetComponent<Rigidbody>())
			GetComponent<Rigidbody>().freezeRotation = true;
		Screen.lockCursor = true;
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
	
		x += Input.GetAxis("Mouse X") * xSpeed * 0.02f;
		y -= Input.GetAxis("Mouse Y") * ySpeed * 0.02f;
		
		distance -= (Input.GetAxis("Mouse ScrollWheel") * Time.deltaTime) * zoomRate * Mathf.Abs(distance);
		distance = Mathf.Clamp(distance, minDistance, maxDistance);
		
		y = ClampAngle(y, yMinLimit, yMaxLimit);
		
		// Rotate Camera
		Quaternion rotation = Quaternion.Euler(y, x, 0);
		transform.rotation = rotation;
		aim = Quaternion.Euler(y- aimAngle, x, 0);
		
		//Rotate Target
		if(Input.GetButton("Fire1") || Input.GetButton("Fire2") || Input.GetAxis("Horizontal") != 0 || Input.GetAxis("Vertical") != 0 || lockOn){
			targetBody.transform.rotation = Quaternion.Euler(0, x, 0);
		}
		
		//Camera Position

		Vector3 positiona = target.position - (rotation * Vector3.forward * distance + new Vector3(0.0f,-targetHeight,0.0f));
		transform.position = positiona;

		Vector3 trueTargetPosition = target.transform.position - new Vector3(0.0f,-targetHeight,0.0f);

		if (Physics.Linecast (trueTargetPosition, transform.position, out hit)) {
			if(hit.transform.tag == "Wall"){
				float tempDistance = Vector3.Distance (trueTargetPosition, hit.point) - 0.28f;
				
				positiona = target.position - (rotation * Vector3.forward * tempDistance + new Vector3(0,-targetHeight,0));
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