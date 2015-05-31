//***************************************************************************
// Filename: GameObject.js
// Description: Central object in ECS strategy
//  Read http://en.wikipedia.org/wiki/Entity_component_system
//  or better yet, go download Unity.
// Author: Joseph Cameron
//***************************************************************************
// CHANGELOG
//
// Date: March 6th, 2015
// Description: Initial implementation.
// Author: Joseph Cameron
//
// Date: March 7th, 2015
// Description: Added Mesh & transform.
// Author: Joseph Cameron
//
// Date: March 10th, 2015
// Description: Added rigidbody.
// Author: Joseph Cameron
//
function GameObject()
{
    //*************
    // Data members
    //*************
    var m_Name      = "GameObject";
    var m_Transform = new Transform(this);
    var m_Mesh      = new Mesh(this);
    var m_Rigidbody = new Rigidbody(this);
    var m_Behaviors = []  ;
    var m_Children  = []  ;
    var m_Parent    = null;
    
    //**********
    // Accessors
    //**********
    this.getName = function()      {return m_Name ;};
    this.setName = function(aName) {m_Name = aName;};
    
    this.getParent = function()        {return m_Parent   ;};
    this.setParent = function(aParent) {m_Parent = aParent;};
    
    this.getTransform = function(){return m_Transform;};
    this.getMesh      = function(){return m_Mesh     ;};
    this.getRigidbody = function(){return m_Rigidbody;};
    this.getBehaviors = function(){return m_Behaviors;};
    this.getChildren  = function(){return m_Children ;};
    
    //*********************
    // GameObject interface
    //*********************
    this.addBehavior = function(aBehavior)
    {
        aBehavior.setGameObject(this);
    
        m_Behaviors.push(aBehavior);
    
    };
    
    this.addChild = function(aChild)
    {
        aChild.setParent(this);
        m_Children.push(aChild);
        
    };
    
    this.update = function()
    {
        //console.log(this.getName() + ": " +this.getTransform().getPosition());
        //console.log(this.getName() + ", " + this.getMesh().getGameObject().getName());
    
         m_Mesh.update();
         m_Rigidbody.update();
    
        for(var i = 0; i < m_Behaviors.length; i++)
            if (m_Behaviors[i].update != undefined)
                m_Behaviors[i].update();
            
        for(var i = 0; i < m_Children.length; i++)
            if (m_Children[i].update != undefined)
                m_Children[i].update();
        
    };
    
    this.draw = function()
    {
        if (m_Mesh != undefined && typeof m_Mesh.draw === 'function')
            m_Mesh.draw();
        
        for(var i = 0; i < m_Children.length; i++)
            if (m_Children[i].getMesh != undefined && typeof m_Children[i].getMesh().draw == 'function')
                m_Children[i].getMesh().draw();
        
    };
    
}



