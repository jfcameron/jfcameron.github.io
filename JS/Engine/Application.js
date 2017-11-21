// © 2015 Joseph Cameron - All Rights Reserved
// Project: WebGLEngine
// Created on 2015-03-10.

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
