var clientId = '206932619037-ck9ljfqts067tn3okm6llomlfc2m22ri.apps.googleusercontent.com';
var scopes = 'https://www.googleapis.com/auth/youtube';
// https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly";
var token;
var authenticated = false;

var auth = function() {
    var config = {
      'client_id': clientId,
      'scope': scopes
    };

    gapi.auth.authorize(config, function() {
      console.log("login complete");
      authenticated = true;
      // hide sign in message and button
      $('#my-container').find('h3').hide();
      $('#btnLoad').hide();
      token = gapi.auth.getToken();
      console.log(token);
      console.log("access token: " + token.access_token);

      // get list of playlists, we just need id and title
      var apiUrl = 'https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&fields=items(id%2Csnippet%2Ftitle)&access_token=' + token.access_token;

      // call playlist api
      $.getJSON(apiUrl, function(response){
        console.log(response);
        // look for playlist title, if found, store playlist id
        for(i=0; i<response.items.length; i++){
          if(response.items[i].snippet.title === favePlaylistTitle){
            favePlaylistId = response.items[i].id;
            console.log("playlist id: "+favePlaylistId);
            // get list of videos in fave playlist
            getFaves();
          }
        }
      });

    });
};

$('#btnLoad').click(function(){
  auth()
});
