if (typeof PREFABS == 'undefined')PREFABS = new Object();

PREFABS.lightObject = function()
{
    var gameObject = new GameObject();
    {
        gameObject.setName("light");    

        gameObject.getMesh().setVertexBuffer(GRAPHICS.getQuadVertexArray());
        gameObject.getMesh().draw = null;
        
        gameObject.getTransform().setPosition([-0,-3,-8]);
        gameObject.getTransform().setScale([7,7,0]);
        
        var camera = new Camera(gameObject);
        {
            camera.draw = function()
            {
                var glContext = GRAPHICS.getContext();
                glContext.bindFramebuffer(glContext.FRAMEBUFFER, GRAPHICS.getRttFramebuffer());
                glContext.clear     ( glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT );
            };
        }

        gameObject.getBehaviors().push(camera);
        gameObject.addBehavior(new MovementTest(gameObject));
    }
    
    return gameObject;    
}