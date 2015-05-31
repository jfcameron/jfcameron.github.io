//***************************************************************************
// Filename: Physics.js
// Description: Wrapper for physics engine. Currently using cannon.js
//  by routing physics calls through this object, keeps code portable &
//  prevents game programmers from needing to learn the specifics of the
//  underlying physics engine.
// Author: Joseph Cameron
//***************************************************************************
// CHANGELOG
//
// Date: March 10th, 2015
// Description: Initial implementation.
// Author: Joseph Cameron
//
function Physics()
{
	var m_World = null;
	var m_TimeStep = 1.0 / 60.0;

	this.start = function()
	{
		m_World = new CANNON.World();
		m_World.gravity.set(0,-9.82,0);
		m_World.broadphase = new CANNON.NaiveBroadphase();
        m_World.solver.iterations = 5;
        m_World.defaultContactMaterial.contactEquationStiffness = 1e6;
        m_World.defaultContactMaterial.contactEquationRelaxation = 10;    
		
	};
	
	this.update = function()
	{
		m_World.step(m_TimeStep);	
        
	};
	
	this.add = function(aBody)
	{
		m_World.add(aBody);
		
	};
	
}