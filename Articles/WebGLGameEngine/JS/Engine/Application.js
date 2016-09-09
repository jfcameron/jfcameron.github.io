//***************************************************************************
// Filename: Application.js
// Description: Entry point for js program. Inits engine and game.
//  See Game.js for game programming entry point.
// Author: Joseph Cameron
//***************************************************************************
// CHANGELOG
//
// Date: March 6st, 2015
// Description: Initial implementation.
// Author: Joseph Cameron
//
// Date: March 7th, 2015
// Description: Split Game.js into GameBase.js, Game.js.
// Author: Joseph Cameron
//
// Date: March 8th, 2015
// Description: Added reference to Time object, init & update
// Author: Joseph Cameron
//
// Date: March 10th, 2015
// Description: Added reference to Physics object, init & update
// Author: Joseph Cameron
//
//*****************
// Global variables
//*****************
var INPUT    = null;
var GRAPHICS = null;
var GAME     = null;
var TIME     = null;
var PHYSICS  = null;
var PREFABS  = new Object();




//********************
// Program entry point
//********************
function Start()
{
    //Init GRAPHICS
    GRAPHICS = new Graphics();
    GRAPHICS.start();

    //init TIME
    TIME = new Time();
    TIME.start();

    //Init INPUT
    INPUT = new Input();
    INPUT.start();

    //Init PHYSICS
	PHYSICS = new Physics();
	PHYSICS.start();

    //Init GAME
     GAME = new Game();
     GAME.superStart();
     GAME.start();
     
}

//**********
// Main loop
//**********
function Update()
{
    if (GAME != undefined)
    {
        GAME.update();
        GAME.draw();
        
    }
        
    TIME   .update();
    INPUT  .update();
	PHYSICS.update();
    
}



