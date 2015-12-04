//
// Script name: StagingLabel
// Description: adds a staging label incase this is not the live version of the site
//
if(!(window.location.href.indexOf("github") > 0))
{
    //Label data
    var content = '<a href="http://jfcameron.github.io/">Go to live site</a>';

    //Apply data to document
    stagingLabel = document.createElement('div');
    stagingLabel.id = 'stagingLabel';
    stagingLabel.innerHTML = content;
    document.getElementsByTagName('body')[0].appendChild(stagingLabel);
    
}