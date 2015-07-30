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

Game.prototype = new GameBase();
Game.prototype.constructor = Game;

function Game()
{     
    //***************
    // Game interface
    //***************
    this.start = function()
    {
        //Tesselated object
        var test4 = new GameObject();
        {
            test4.setName("Water");    
            //test4.getMesh().draw = drawTest;
            test4.getMesh().setVertexBuffer(GRAPHICS.getTessellatedPlaneVertexArray());
            test4.getMesh().setMainTexture(GRAPHICS.getTextures()[4]);
            test4.getMesh().setShader(GRAPHICS.getShader("Water"));
            test4.getTransform().setPosition([0,-9,0]);
            test4.getTransform().setScale([5,1,5]);
        
        }
        this.m_RootGameObject.addChild(test4);
        
        //this.initializeRootGameObject();
        /*
        //Init test object 1
        var gameObject = new GameObject();
        {
            gameObject.setName("QuadTest");    
            //gameObject.getMesh().draw = drawTest;
            gameObject.getMesh().setVertexBuffer(GRAPHICS.getQuadVertexArray());
            gameObject.getMesh().setMainTexture(GRAPHICS.getTextures()[0]);
            gameObject.getTransform().setPosition([0,10,-10]);
            
        }
        this.m_RootGameObject.addChild(gameObject);*/
        /*
        //Init test object 3
        var test3 = new GameObject();
        {
            test3.setName("TriTest");    
            //test3.getMesh().draw = drawTest;
            test3.getMesh().setVertexBuffer(GRAPHICS.getTriVertexArray());
            test3.getTransform().setPosition([10,10,10]);
        
        }
        this.m_RootGameObject.addChild(test3);*/
        
        /*
        //Init test object 2
        var whatIsJavaScript = new GameObject();
        {
            whatIsJavaScript.setName("CubeTest");    
            //whatIsJavaScript.getMesh().draw = drawTest;
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
            //whatIsJavaScript2.getMesh().draw = drawTest;
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
		*/
        
        this.m_RootGameObject.addChild(PREFABS.rotatorTest());
        this.m_RootGameObject.addChild(PREFABS.groundObject());
        
        //make camera
        var someCamera = new GameObject();
        {
            someCamera.setName("TheTestCamera");    
            someCamera.getTransform().setPosition([0,6,-10]);
            someCamera.getTransform().setScale([1,1,1]);
            someCamera.getMesh().draw = null;
            
            //Add camera
            var camera = new Camera(someCamera);
            camera.draw = cameraDrawTest;
            someCamera.getBehaviors().push(camera);
            //Add camera controller
            someCamera.getBehaviors().push(new CameraController(someCamera));

        }
        this.m_RootGameObject.addChild(someCamera);
        
        /*
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
        this.m_RootGameObject.addChild(hudCamera);*/
        
        
        //Make name element
       var gameObject123 = new GameObject();
        {
            gameObject123.setName("Name");    
            //gameObject123.getMesh().draw = drawTest;
            gameObject123.getMesh().setVertexBuffer(GRAPHICS.getQuadVertexArray());
            gameObject123.getMesh().setMainTexture(GRAPHICS.getTexture("name.png"));
            gameObject123.getTransform().setPosition([0,2,-30]);
            gameObject123.getTransform().setScale([80,80,0]);
            
        }
        this.m_RootGameObject.addChild(gameObject123);
        
        ////Make name element
        //var zxcv = new GameObject();
        //{
        //    zxcv.setName("Cloud");    
        //    //gameObject123.getMesh().draw = drawTest;
        //    zxcv.getMesh().setVertexBuffer(GRAPHICS.getQuadVertexArray());
        //    zxcv.getMesh().setMainTexture(GRAPHICS.getTextures()[5]);
        //    zxcv.getMesh().setShader(GRAPHICS.getShader("Sky"));
        //    zxcv.getTransform().setPosition([0,10,-30]);
        //    zxcv.getTransform().setScale([80,80,0]);
        //    zxcv.getTransform().setRotation([-90,0,0]);
        //    
        //}
        //this.m_RootGameObject.addChild(zxcv);
        
        this.m_RootGameObject.addChild(PREFABS.cloudObject([0,10, 10]));
        this.m_RootGameObject.addChild(PREFABS.cloudObject([0,10,-30]));
        this.m_RootGameObject.addChild(PREFABS.cloudObject([0,10,-70]));
        this.m_RootGameObject.addChild(PREFABS.cloudObject([0,10,-110]));
        
    };

}









