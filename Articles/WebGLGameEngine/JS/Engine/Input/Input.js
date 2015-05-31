//*************************************
// Filename: Input.js
// Description: Handles user input.
// Author: Joseph Cameron
//*************************************
// CHANGELOG
//
// Date: March 5th, 2015
// Description: Initial implementation.
// KeyUp and KeyDown events handled.
// Author: Joseph Cameron
//
// Date: March 10th, 2015
// Description: Added mouse handler
// Author: Joseph Cameron
//

function Input()
{
    //*************
    // Data members
    //*************
    var canvas = document.getElementById("canvas");
    
    var m_Keys = {};
    
    var m_CurrentMousePos = [0,0];
    
    //****************
    // Input interface
    //****************
    
    
    this.start = function()
    {
        initKeyHandlers();
        initMouseHandler();
        
    };
    
    this.update = function()
    {
        mouseUpdate();
        
    };
    
    this.getKeys = function()
    {
        return m_Keys;
    
    };
    
    this.getMouseDelta = function()
    {
        return m_CurrentMousePos;
        
    };
    
    //****************
    // Private methods
    //****************
    mouselock = function()
    {
        canvas.requestPointerLock();
        
        if (
            document.pointerLockElement       === canvas || //Cross browser call (future proofing)
            document.mozPointerLockElement    === canvas || //ff
            document.webkitPointerLockElement === canvas    //chrome
           ) {}
            //document.removeEventListener("mousemove", mouseMove, false);
        else 
            document.addEventListener("mousemove", mouseMove, false);

    
    };
    
    initKeyHandlers = function()
    {
        document.onkeydown   = keyDown;
        document.onkeyup     = keyUp;
    
    };
    
    initMouseHandler = function()
    {
        
        canvas.onclick = mouselock;
        
        var check_pointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

        if(check_pointerLock)
        {   canvas.requestPointerLock = 
            canvas.requestPointerLock ||
            canvas.mozRequestPointerLock ||
            canvas.webkitRequestPointerLock;
            canvas.requestPointerLock();  
            
        }
        
    };
    
    keyDown = function (event)
    {
        m_Keys[event.keyCode] = true;
        
    };

    keyUp = function (event)
    {
        m_Keys[event.keyCode] = false;
        
    };
    
    mouseUpdate = function()
    {
        m_CurrentMousePos = [0,0];
        
        if (m_Keys[27])
            document.removeEventListener("mousemove", mouseMove, false);
    
    };
    
    mouseMove = function (e)
    {
        //Retrieve movement across browsers
        var movementX = e.movementX ||
        e.mozMovementX          ||
        e.webkitMovementX       ||
        0,
        movementY = e.movementY ||
        e.mozMovementY      ||
        e.webkitMovementY   ||
        0;
    
        m_CurrentMousePos = [movementX ,movementY];
        
    };
    
}



