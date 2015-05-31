function rotator()
{
	var m_GameObject;
	
	this.setGameObject = function(aGameObject){m_GameObject = aGameObject;};
	this.update = function()
	{
		m_GameObject.getTransform().setRotation([TIME.getTime()*5,3,TIME.getTime()*2]);
		
	};

}