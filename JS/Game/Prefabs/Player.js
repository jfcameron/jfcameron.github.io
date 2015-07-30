if (typeof PREFABS == 'undefined')PREFABS = new Object();

//pos in form [0,10,-30]
PREFABS.playerObject = function()
{
    var gameObject = new GameObject();
    {
        gameObject.setName("TheTestCamera");    
        gameObject.getTransform().setPosition([0,6,-10]);
        gameObject.getTransform().setScale([1,1,1]);
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