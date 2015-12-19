if (typeof PREFABS == 'undefined')PREFABS = new Object();

//pos in form [0,10,-30]
PREFABS.playerObject = function(aPosition)
{
    var gameObject = new GameObject();
    {
        gameObject.setName("TheTestCamera");    
        gameObject.getTransform().setPosition(aPosition);
        gameObject.getTransform().setScale([1,1,1]);
        gameObject.getTransform().setRotation([0,10 * (3.14/180),0]);
        gameObject.getMesh().draw = null;
        
        //Add camera
        var camera = new Camera(gameObject);
        {
            camera.draw = function()
            {
                var glContext = GRAPHICS.getContext();
                glContext.bindFramebuffer(glContext.FRAMEBUFFER, null);
                glContext.viewport  (0,0, glContext.viewportWidth/1, glContext.viewportHeight/1);
                glContext.clear     ( glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT );
                
            };
            
        }
        gameObject.getBehaviors().push(camera);
        //Add camera controller
        gameObject.getBehaviors().push(new CameraController(gameObject));
        
    }
    
    return gameObject;
     
}