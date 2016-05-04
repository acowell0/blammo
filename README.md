# blammo
This project is a JavaScript single page application (SPA) utilizing various YouTube API operations. It is built with vanilla JavaScript, jQuery, and a bit of Bootstrap for UI stuffs.

<b>Trending</b></br>
Upon initial page load, the top 10 trending videos on YouTube are displayed on the <i>Trending</i> tab. </br></br>
<b>Search</b></br>
The <i>Search</i> tab provides a mechanism for searching YouTube videos based on the entered keyword(s). 
By ticking the <i>Geo</i> checkbox, you can filter your search via geolocation parameters:
<li>latitude</li>
<li>longitude</li>
<li>radius from the entered coordinates</li>
<li>units: meters, kilometers, feet, miles (maximum radius is 1000km)</li></br>
All geo parameters must be entered with valid values, otherwise a normal search will be performed with the geo parameters ignored.
Search results can be sorted by Relevance, Date, or Rating (must be selected before submitting the search). The max number of results to be returned can also be selected (10, 20, 30, 40, 50).</br></br>
<b>My Faves</b></br>
The <i>My Faves</i> tab allows you to see videos that you have favorited, assuming you have signed-into the blammo application (via google sign-in). This list is specific to blammo, which uses a unique YouTube playlist for storing/reading favorited videos.

<b>Video Modal Window</b></br>
Videos can be viewed by clicking a list entry on any of the tabs. The video will open in a modal window with all of the usual YouTube playback controls available. Channel, number of views, number of likes, and number of dislikes can be seen on the bottom of the modal window via the <i>Stats</i> tab. The <i>Comments</i> tab displays the last 20 comments (but none of their child replies). If you are signed-into blammo, the modal window will also show a <i>Fave</i> checkbox indicating if you have "favorited" this video. The video will be added/removed from your faves based on the status of this checkbox when the modal window is closed (checked=added, unchecked=removed). Videos opened from all tabs, not just <i>My Faves</i>, will show the <i>Fave</i> checkbox if you are signed-in.

Signing-out via the <i>Sign-out</i> link will remove your favorites from the <i>My Faves</i> tab (but not from YouTube or blammo) and will remove the <i>Fave</i> checkbox from the video modal windows.
