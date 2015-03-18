//************************************************************************
// Filename: Component.js
// Description: Base object for all components.
// Component subtypes are Mesh, Transform, Behavior.
// Author: Joseph Cameron
//************************************************************************
// CHANGELOG
//
// Date: March 6th, 2015
// Description: Initial implementation.
// Author: Joseph Cameron
//
function Component(aGameObject)
{
    var m_GameObject = aGameObject;
    
    this.getGameObject = function(){return m_GameObject;};
    
    this.update = function(){};
    
    this.test = function()
    {
        return "this is an inheritance test";
    
    };

}