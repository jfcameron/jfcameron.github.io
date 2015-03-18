Mesh.prototype = new Component();  //Is a component
Mesh.prototype.constructor = Mesh;

function Camera(aGameObject)
{
    //Refactor..
    var m_GameObject = aGameObject;
    
    //*************
    // Data members
    //*************
    var viewMatrix       = mat4.create();
    var projectionMatrix = mat4.create();     
     
    //**********
    // Accessors
    //**********
    this.getViewMatrix = function()
    {
    
        return viewMatrix;
    
    };
    
    
    this.getProjectionMatrix = function(){return projectionMatrix;};
     
    //*****************
    // Member functions
    //*****************
    this.createOrthographicCamera = function()
    {
        var glContext = GRAPHICS.getContext();
        mat4.identity(projectionMatrix);
        mat4.ortho(0,10,0,10,-1,100,projectionMatrix);
        
    };
    
    this.createPerspectiveCamera = function()
    {
        var glContext = GRAPHICS.getContext();
        mat4.identity(projectionMatrix);
        mat4.perspective(45, glContext.viewportWidth / glContext.viewportHeight , 0.1, 100.0, projectionMatrix);
        
    };
    
    this.update = function()
    {
        mat4.identity (this.getViewMatrix());
        mat4.rotate   (this.getViewMatrix(),m_GameObject.getTransform().getRotation()[0],[1,0,0]);
        mat4.rotate   (this.getViewMatrix(),m_GameObject.getTransform().getRotation()[1],[0,1,0]);
        mat4.rotate   (this.getViewMatrix(),m_GameObject.getTransform().getRotation()[2],[0,0,1]);
        mat4.translate(this.getViewMatrix(),m_GameObject.getTransform().getPosition());
    
    }
    
    this.draw; //holds gl setup data

    //************
    // Constructor
    //************
    GAME.getCameras().push(this);
    this.getGameObject = function(){return m_GameObject;};
    this.createPerspectiveCamera();
    
}




