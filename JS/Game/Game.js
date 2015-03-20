//***************************************************************************
// Filename: Demo/Game.js
// Description: Demo code.
// Author: Joseph Cameron
//***************************************************************************
// CHANGELOG
//
// Date: March 7th, 2015
// Description: Initial implementation.
// Author: Joseph Cameron
//// Date: March 11th, 2015
// Description: Added rigidbody spawner to button 1
// Author: Joseph Cameron
//

function cameraDrawTest()
{
    //
    // Prep context
    //
    var glContext = GRAPHICS.getContext();
    glContext.viewport  (0,0, glContext.viewportWidth/1, glContext.viewportHeight/1);
    glContext.clear     ( glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT );
    
    
};

function cameraOverlayDrawTest()
{
    //
    // Prep context
    //
    var glContext = GRAPHICS.getContext();
    glContext.viewport  (0,0, glContext.viewportWidth/1, glContext.viewportHeight/1);
    glContext.clear     ( glContext.DEPTH_BUFFER_BIT );
    
    
};

function drawTest() //Should be part of a material or some kind of shader/gl setup bundle
{
    //*************
    // Marshal data
    //*************
    //Graphics
    var glContext        = GRAPHICS.getContext();
    //Time
    var time             = TIME.getTime();//should be moved
    //Current camera
    var viewMatrix       = GRAPHICS.getActiveCamera().getViewMatrix();//This should be part of a camera
    var projectionMatrix = GRAPHICS.getActiveCamera().getProjectionMatrix();//this should be part of a camera
    //This gameobject
    var VertexArray      = this.getVertexBuffer();
    var shaderProgram    = this.getShader();
    var texture          = this.getMainTexture();
    //Model Scale
    var modelScale = this.getGameObject().getTransform().getLocalScaleMatrix();
    //Model Rotation
    var rotation   = this.getGameObject().getTransform().getLocalRotationMatrix();
    //This transform
    var object2WorldMatrix = this.getGameObject().getTransform().getWorldMatrix();
    //Camera pos
    var cameraPosition = GRAPHICS.getActiveCamera().getGameObject().getTransform().getPosition();
    
    //setup culling
    glContext.enable  (glContext.DEPTH_TEST);
    glContext.enable  (glContext.CULL_FACE);
    glContext.disable (glContext.CULL_FACE);
    glContext.cullFace(glContext.BACK);
    
    //********************
    // Prepare vertex data
    //********************
    glContext.bindBuffer( glContext.ARRAY_BUFFER, VertexArray );
    
    glContext.vertexAttribPointer
    (
        shaderProgram.vertexPositionAttribute,
        3, //Pos size
        glContext.FLOAT,
        false, 
        4*(3+2+3), //stride is size of vertex format in bytes. 4 is float size, 3 pos, 2 uv 
        0 
    
    );
    
    //UV attribute pointer
    glContext.vertexAttribPointer
    (
        shaderProgram.uvAttribute,
        2, //UV size
        glContext.FLOAT,
        false, 
        4*(3+2+3), //stride is size of vertex format in bytes. 4 is float size, 3 pos, 2 uv 
        4*3 
    
    );
    
    //Normal attribute pointer
    glContext.vertexAttribPointer
    (
        shaderProgram.normalAttribute,
        3, //Normal size
        glContext.FLOAT,
        false, 
        4*(3+2+3), //stride is size of vertex format in bytes. 4 is float size, 3 pos, 2 uv 
        4*(3+2) 
    
    );
    
    //************
    // Prep shader
    //************
    glContext.useProgram(shaderProgram);
        
    shaderProgram.vertexPositionAttribute = glContext.getAttribLocation( shaderProgram, "a_Pos" );
    glContext.enableVertexAttribArray( shaderProgram.vertexPositionAttribute);
    
    shaderProgram.uvAttribute             = glContext.getAttribLocation( shaderProgram, "a_UV"  );
    glContext.enableVertexAttribArray( shaderProgram.uvAttribute            );
    
    shaderProgram.normalAttribute         = glContext.getAttribLocation( shaderProgram, "a_Normal"  );
    glContext.enableVertexAttribArray( shaderProgram.normalAttribute        );
    
    //*********************
    // Pass in uniform data
    //*********************
    //Time uniform
    var uTime = glContext.getUniformLocation(shaderProgram,"_Time");
    if (uTime != -1)
        glContext.uniform1f(uTime, time);
    
    //ModelScale uniform
    var uModelScaleMatrix = glContext.getUniformLocation(shaderProgram,"_ModelScaleMatrix");
    if (uModelScaleMatrix != -1)
        glContext.uniformMatrix4fv(uModelScaleMatrix, false, modelScale);
    
    //ModelRotation uniform
    var uModelRotationMatrix = glContext.getUniformLocation(shaderProgram,"_ModelRotationMatrix");
    if (uModelRotationMatrix != -1)
        glContext.uniformMatrix4fv(uModelRotationMatrix, false, rotation);
        
    //Model translation matrix uniform
    var uObject2WorldMatrix = glContext.getUniformLocation(shaderProgram,"_Object2WorldMatrix");
    if (uObject2WorldMatrix != -1)
        glContext.uniformMatrix4fv(uObject2WorldMatrix, false, object2WorldMatrix);
        
    //View matrix uniform
    var uViewMatrix = glContext.getUniformLocation(shaderProgram,"_ViewMatrix");
    if (uViewMatrix != -1)
        glContext.uniformMatrix4fv(uViewMatrix, false, viewMatrix);
        
    //Projection matrix uniform
    var uProjectionMatrix = glContext.getUniformLocation(shaderProgram,"_ProjectionMatrix");
    if (uProjectionMatrix != -1)
        glContext.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);
    
    //Texture uniform
    glContext.activeTexture(glContext.TEXTURE0);
    glContext.bindTexture  (glContext.TEXTURE_2D, texture);
    glContext.uniform1i    (glContext.getUniformLocation(shaderProgram, "_Texture"), 0);
	
	//Camera world position uniform
	var uCameraWorldPosition = glContext.getUniformLocation(shaderProgram,"_CameraPos");
	if (uCameraWorldPosition != -1)
		glContext.uniform3fv(uCameraWorldPosition,cameraPosition);

    //*****
    // draw
    //*****
    glContext.drawArrays( glContext.TRIANGLES, 0, VertexArray.numItems );
    
};

Game.prototype = new GameBase();
Game.prototype.constructor = Game;

function Game()
{     
    //***************
    // Game interface
    //***************
    this.start = function()
    {
        //this.initializeRootGameObject();
        
        //Init test object 1
        var gameObject = new GameObject();
        {
            gameObject.setName("QuadTest");    
            gameObject.getMesh().draw = drawTest;
            gameObject.getMesh().setVertexBuffer(GRAPHICS.getQuadVertexArray());
            gameObject.getMesh().setMainTexture(GRAPHICS.getTextures()[0]);
            gameObject.getTransform().setPosition([0,10,-10]);
            
        }
        this.m_RootGameObject.addChild(gameObject);
        
        //Init test object 3
        var test3 = new GameObject();
        {
            test3.setName("TriTest");    
            test3.getMesh().draw = drawTest;
            test3.getMesh().setVertexBuffer(GRAPHICS.getTriVertexArray());
            test3.getTransform().setPosition([10,10,10]);
        
        }
        this.m_RootGameObject.addChild(test3);
        
        //Init test object 2
        var whatIsJavaScript = new GameObject();
        {
            whatIsJavaScript.setName("CubeTest");    
            whatIsJavaScript.getMesh().draw = drawTest;
            whatIsJavaScript.getMesh().setShader(GRAPHICS.getShader("Opaque"));
            whatIsJavaScript.getMesh().setMainTexture(GRAPHICS.getTextures()[1]);
            whatIsJavaScript.getTransform().setPosition([0,20,0]);
            whatIsJavaScript.getTransform().setScale([1,1,1]);
            //Init rb
            whatIsJavaScript.getRigidbody().setMass(0.5);
			whatIsJavaScript.getRigidbody().setShape(new CANNON.Box(new CANNON.Vec3(0,0,0)));
			whatIsJavaScript.getRigidbody().init();
        
        }
        this.m_RootGameObject.addChild(whatIsJavaScript);
        
        //Init test object 2
        var whatIsJavaScript2 = new GameObject();
        {
            whatIsJavaScript2.setName("CubeTest2");    
            whatIsJavaScript2.getMesh().draw = drawTest;
            whatIsJavaScript2.getMesh().setShader(GRAPHICS.getShader("Opaque"));
            whatIsJavaScript2.getMesh().setMainTexture(GRAPHICS.getTextures()[1]);
            whatIsJavaScript2.getTransform().setPosition([0.5,1,0]);
            whatIsJavaScript2.getTransform().setScale([1,1,1]);
            //Init rb
            whatIsJavaScript2.getRigidbody().setMass(1);
			whatIsJavaScript2.getRigidbody().setShape(new CANNON.Box(new CANNON.Vec3(0,0,0)));
			whatIsJavaScript2.getRigidbody().init();
        
        }
        this.m_RootGameObject.addChild(whatIsJavaScript2);
		
        this.m_RootGameObject.addChild(PREFABS.rotatorTest());
        this.m_RootGameObject.addChild(PREFABS.groundObject());
        
        //make camera
        var someCamera = new GameObject();
        {
            someCamera.setName("TheTestCamera");    
            someCamera.getTransform().setPosition([0,6,-11]);
            someCamera.getTransform().setScale([1,1,1]);
            
            //Add camera
            var camera = new Camera(someCamera);
            camera.draw = cameraDrawTest;
            someCamera.getBehaviors().push(camera);
            //Add camera controller
            someCamera.getBehaviors().push(new CameraController(someCamera));

        }
        this.m_RootGameObject.addChild(someCamera);
        
        //make hudcamera
        var hudCamera = new GameObject();
        {
            hudCamera.getTransform().setPosition([0,-1000,0]);
        
            //Add camera
            var camera = new Camera(hudCamera);
            camera.draw = cameraOverlayDrawTest;
            camera.createOrthographicCamera();
            hudCamera.getBehaviors().push(camera);
            
        }
        this.m_RootGameObject.addChild(hudCamera);
        
        //Make hud element
        var gameObject123 = new GameObject();
        {
            gameObject123.setName("Huddude");    
            gameObject123.getMesh().draw = drawTest;
            gameObject123.getMesh().setVertexBuffer(GRAPHICS.getQuadVertexArray());
            gameObject123.getMesh().setMainTexture(GRAPHICS.getTexture("name.png"));
            gameObject123.getTransform().setPosition([0,2,-30]);
            gameObject123.getTransform().setScale([80,80,0]);
            
        }
        this.m_RootGameObject.addChild(gameObject123);
        
                
    };

}









