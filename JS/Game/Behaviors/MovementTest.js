function MovementTest(aGameObject)
{
	var m_GameObject = aGameObject;
	
	this.setGameObject = function(aGameObject){m_GameObject = aGameObject;};
	
	this.update = function()
	{
		m_GameObject.getTransform().setRotation([0,TIME.getTime()*0.01,0]);	
	};
}
