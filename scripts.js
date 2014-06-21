function jumpTo(aId)
{
	var offset = 80;
    window.scrollTo(0, aId);
    var rect = aId.getBoundingClientRect();
    window.scrollTo(rect.left , rect.top - offset);
	
}