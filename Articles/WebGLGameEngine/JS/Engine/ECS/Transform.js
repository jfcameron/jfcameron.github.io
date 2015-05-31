//************************************************************************
// Filename: Transform.js
// Description: Holds position and rotation data for a game object
// Author: Joseph Cameron
//************************************************************************
// CHANGELOG
//
// Date: March 6th, 2015
// Description: Initial implementation.
// Author: Joseph Cameron
//
Transform.prototype = new Component();  //Is a component
Transform.prototype.constructor = Transform;

function Transform(ownerGameObject)
{
    m_GameObject = ownerGameObject;

    var m_Position = vec3.create(); //Vector3
    var m_Scale    = [1,1,1];
    var m_Rotation = [0,0,0]; //Quaternion
    
    //init
    //vec3.create(m_Position);
    //vec3.set(m_Position,5,5,0);

    //
    //
    //
    this.getPosition = function()         {return m_Position;     };
    this.setPosition = function(aPosition){m_Position = aPosition;};
    
    this.getScale    = function(){return m_Scale;};
    this.setScale    = function(aScale){m_Scale = aScale;}
    
    this.getRotation = function(){return m_Rotation;};
    this.setRotation = function(aRotation){m_Rotation = aRotation;};
    
    this.getLocalScaleMatrix = function()
    {
        var output = mat4.create();
        {
            mat4.identity(output);
            mat4.scale(output,m_Scale);
                        
        }
        return output;
        
    };
    
    this.getLocalRotationMatrix = function()
    {
        var output = mat4.create();
        {
            mat4.identity(output);
            mat4.rotate(output, m_Rotation[0]*Math.PI/180, [1, 0, 0]);
            mat4.rotate(output, m_Rotation[1]*Math.PI/180, [0, 1, 0]);
            mat4.rotate(output, m_Rotation[2]*Math.PI/180, [0, 0, 1]);
            
        }
        
        return output;
        
    };
    
    
    //incomplete
    this.getWorldMatrix = function()
    {   
        //var parentWorldMatrix = null;
        //
        //if (m_GameObject.getParent() != null)
        //{
        //    if (m_GameObject.getParent().getTransform() != null)
        //    {
        //        parentWorldMatrix = m_GameObject.getParent().getTransform().getWorldMatrix();
        //    
        //    }
        //
        //}
    
        var output = mat4.create();
        {
            mat4.identity(output);
            
            mat4.translate(output,m_Position);
                        
        }
        return output;
        
    };
    
    //Mat4 interface for drawing
    
}