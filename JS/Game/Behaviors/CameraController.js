
function CameraController(aGameObject)
{
    //Refactor this...
    var m_GameObject = aGameObject;
    this.getGameObject = function(){return m_GameObject;};

    //
    //Data members
    //
    var camera          = this.getGameObject().getBehaviors().find(function(x){return x instanceof Camera ? true : false;});
    var cameraPosition  = m_GameObject.getTransform().getPosition();
    var cameraRotation  = m_GameObject.getTransform().getRotation();
    var cameraDeltaSize = 0.05;
    
    var spawnsomeboxes = 10;
    
    this.update = function()
    {
        if (spawnsomeboxes-- > 0)
            for(var i = 0; i < 1; i++)
                this.testGenCube();
            
    
        //************
        // Buffer data
        //************
        cameraRotation[1] += INPUT.getMouseDelta()[0]*Math.PI /180;
        cameraRotation[0] += INPUT.getMouseDelta()[1]*Math.PI /180;
        
        //clamp
        if (cameraRotation[0] > Math.PI/2)
            cameraRotation[0] = Math.PI/2;
        else if (cameraRotation[0] < -Math.PI/2)
            cameraRotation[0] = -Math.PI/2;
        
        //Translation data
        if (INPUT.getKeys()[65])//left
        {
            cameraPosition[0] += Math.sin(cameraRotation[1] + (90 * Math.PI /180))/10;
            cameraPosition[2] -= Math.cos(cameraRotation[1] + (90 * Math.PI /180))/10;
        
        }
        
        if (INPUT.getKeys()[68])//right
        {
            cameraPosition[0] -= Math.sin(cameraRotation[1] + (90 * Math.PI /180))/10;
            cameraPosition[2] += Math.cos(cameraRotation[1] + (90 * Math.PI /180))/10;
        
        }
        
        if (INPUT.getKeys()[87])//forward
        {
            cameraPosition[0] -= Math.sin(cameraRotation[1])/10;
            cameraPosition[2] += Math.cos(cameraRotation[1])/10;
        
        }
        
        if (INPUT.getKeys()[83])//backward
        {
            cameraPosition[0] += Math.sin(cameraRotation[1])/10;
            cameraPosition[2] -= Math.cos(cameraRotation[1])/10;
        
        }
        
        if (INPUT.getKeys()[69])//down
            cameraPosition[1] -= 1 *cameraDeltaSize;
            
        if (INPUT.getKeys()[81])//up
            cameraPosition[1] += 1 *cameraDeltaSize;
        
        //**********
        // Push data
        //**********        
        m_GameObject.getTransform().setPosition(cameraPosition);
        m_GameObject.getTransform().setRotation(cameraRotation);
        
    
        //test gen cube
        if (INPUT.getKeys()[49])
            this.testGenCube();
	
    }
    
    //delete me
	this.testGenCube = function()
	{
		var gameObject = new GameObject();
		{
			gameObject.setName("CubeTest");    
			//gameObject.getMesh().draw = drawTest;
			gameObject.getMesh().setShader(GRAPHICS.getShader("Opaque"));
			gameObject.getMesh().setMainTexture(GRAPHICS.getTextures()[1]);
			gameObject.getTransform().setPosition([0,20,0]);
			gameObject.getTransform().setScale([1,1,1]);
			//Init rb
			gameObject.getRigidbody().setMass(0.5);
			gameObject.getRigidbody().setShape(new CANNON.Box(new CANNON.Vec3(0,0,0)));
			
			gameObject.getRigidbody().init();
			
			gameObject.getRigidbody().getBody().quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), 45);
			
		}
		
		GAME.m_RootGameObject.getChildren().push(gameObject);
		
	}
    
}








