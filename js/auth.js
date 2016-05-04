var init = function(){
  init.authenticated = false;
  init.favePlaylistId;
  init.faves = [];
}

var auth = function() {
    init();
    auth.token;
    var favePlaylistTitle = 'acowell-apidemo-faves';
    var clientId = '206932619037-ck9ljfqts067tn3okm6llomlfc2m22ri.apps.googleusercontent.com';
    var scopes = 'https://www.googleapis.com/auth/youtube';
    // https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly";
    var config = {
      'client_id': clientId,
      'scope': scopes,
      'immediate' : false
    };

    gapi.auth.authorize(config, function() {
      $('#signin').hide();
      $('#signout').show();
      console.log("login complete");
      init.authenticated = true;
      // hide sign in message
      $('#my-container').find('h3').hide();
      auth.token = gapi.auth.getToken();
      // console.log(auth.token);
      console.log("access token: " + auth.token.access_token);

      // get list of playlists, we just need id and title
      var apiUrl = 'https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&fields=items';
      apiUrl += '(id%2Csnippet%2Ftitle)&access_token=' + auth.token.access_token;

      // call playlist api
      $.getJSON(apiUrl, function(response){
        // console.log('get list of playlists response:'+response);

        // look for playlist title, if found, store playlist id
        for(i=0; i<response.items.length; i++){
          if(response.items[i].snippet.title === favePlaylistTitle){
            init.favePlaylistId = response.items[i].id;
            // console.log("playlist id: "+init.favePlaylistId);

            // get list of videos in fave playlist
            getFaves(init.favePlaylistId);
          }
        }

        // if playlist not found, create it
        if (typeof init.favePlaylistId == 'undefined') {
          console.log("playlist ["+favePlaylistTitle+"] not found");
          createPlaylist(favePlaylistTitle);
        }
      });

    });
};

$('#signin').click(function(){
  auth();

});

$('#signout').click(function(){
  var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' + auth.token.access_token;

    $.ajax({
        type: 'GET',
        url: revokeUrl,
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function (response) {
            init.authenticated = false;

            $('#signout').hide();
            $('#signin').show();
            // clear faves tab
            clearResultsList($('#faveResults'), "f");
            // show sign in message
            $('#my-container').find('h3').show();

            // clear faves array
            init.faves = [];
            init.favePlaylistId=undefined;
            console.log("sign-out successful");
        },
        error: function (e) {
            alert("Sign-out unsuccessful. See log for details.");
            console.log(e);
        }
    });

});
