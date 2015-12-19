if (typeof PREFABS == 'undefined')PREFABS = new Object();

//pos in form [0,10,-30]
PREFABS.lightObject = function()
{
    var gameObject = new GameObject();
    {
        gameObject.setName("light");    
        gameObject.getMesh().setVertexBuffer(GRAPHICS.getQuadVertexArray());
        gameObject.getMesh().draw = null;
        //gameObject.getMesh().setMainTexture(GRAPHICS.getRttTexture());
        //gameObject.getMesh().setShader(GRAPHICS.getShader("Unlit"));
        gameObject.getTransform().setPosition([-0,-3,-8]);
        gameObject.getTransform().setScale([7,7,0]);
        
        //Add camera
        var camera = new Camera(gameObject);
        {
            camera.draw = function()
            {
                var glContext = GRAPHICS.getContext();
                glContext.bindFramebuffer(glContext.FRAMEBUFFER, GRAPHICS.getRttFramebuffer());
                glContext.clear     ( glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT );
            
            };
            
            //camera.createOrthographicCamera();
        
        }
        gameObject.getBehaviors().push(camera);
        gameObject.addBehavior(new MovementTest(gameObject));
        
    }
    
    return gameObject;
     
}