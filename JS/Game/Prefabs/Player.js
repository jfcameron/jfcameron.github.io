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
        camera.draw = cameraDrawTest;
        gameObject.getBehaviors().push(camera);
        //Add camera controller
        gameObject.getBehaviors().push(new CameraController(gameObject));
        
    }
    
    return gameObject;
     
}