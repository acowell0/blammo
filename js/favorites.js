// get list of videos in fave playlist
var getFaves = function (favePlaylistId) {
  // max results = 20
  var faveURL = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=%%%playlist%%%&fields=items(id%2Csnippet%2Ftitle%2Csnippet%2Fdescription%2Csnippet%2FresourceId%2FvideoId%2Csnippet%2Fthumbnails%2Fdefault%2Furl)&access_token=';

  faveURL = faveURL.replace('%%%playlist%%%', favePlaylistId);
  faveURL = faveURL+ auth.token.access_token;
  // console.log("faveURL: " + faveURL);

  // populate list of faves into fave results div
  populateResults(faveURL, $('#faveResults'), 'f');
}

// check if video is a fave
var isFave = function(videoId) {
  // console.log("checking if [" + videoId + "] is fave...");
  for(i=0;i<init.faves.length;i++){
    if(init.faves[i].vidId == videoId){
      return 1;
    }
  }
  return(-1);
}

var addFave = function(videoId, favePlaylistId){
  // console.log("adding fave: " + videoId);
  // if it's not already a fave, add it
  if(isFave(videoId) === -1){
    var objFave = {
      vidId : videoId,
      playlistitemid : "x"
    };
    init.faves.push(objFave);
    // call api to insert playlist item
    var insertURL = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&fields=snippet%2C+id&access_token='+auth.token.access_token;
    var snippet = '{"snippet": {"playlistId": "'+favePlaylistId+'", "resourceId": { "kind": "youtube#video","videoId": "'+videoId+'" } } }';
    // console.log("snippet:"+snippet);

    $.ajax({
      type: 'POST',
      url: insertURL,
      contentType:'application/json; charset=utf-8',
      data: snippet,
      dataType: 'json',
      success: function(response) {
        console.log("insertion successful");
        // update array with valid playlist item id
        updateFavesArray(response, videoId);

        // add to the DOM
        addFaveToDOM(response, $('#faveResults'), videoId);
      },

      error: function(response) {
        console.log(response);
        alert("An error occurred trying to insert playlist item: [" +videoId+ "]. See log for details.");
      }
    });
  }
}

var updateFavesArray = function(response, videoId){
  for(i=0;i<init.faves.length;i++){
      if(init.faves[i].vidId == videoId){
        init.faves[i].playlistitemid = response.id;
      }
  }
}

var addFaveToDOM = function(resp, container, videoId){
  // note: we only expect 1 object returned, so there is no items array in resp

  // only add the media list ul if it doesn't already exist
  if($(container).find('ul').length == 0){
    var htmlMediaList = $('<ul id="f" class="media-list"></ul>');
    $(container).append(htmlMediaList);
  }
  var htmlListItem = '<li class="media f" data-video="'+ videoId + '">';
  htmlListItem += '<a class="media-left" href="#">';
  htmlListItem += '<img class="media-object" src="' + resp.snippet.thumbnails.default.url + '" >';
  htmlListItem += '</a>';
  htmlListItem += '<div class="media-body">';
  htmlListItem += '<h4 class="media-heading">' + resp.snippet.title + '</h4>';
  htmlListItem += '<p>'+ resp.snippet.description + '</p>';
  htmlListItem += '</div>';
  htmlListItem += '</li>';

  var $itemListener = $(htmlListItem).click(function() {
        // console.log($(this).attr("data-video"));
        var chkBox = '<label><input type="checkbox" checked> Fave</label>';
        var statsUrl = 'https://www.googleapis.com/youtube/v3/videos?part=snippet%2C+statistics&id=' + $(this).attr("data-video") + '&maxResults=1&fields=items(snippet%2FchannelTitle%2Cstatistics)&key=AIzaSyAgNqfgP847pRTGlFzhirgATebC768fxbY';
        var commentsUrl = 'https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=' + $(this).attr("data-video") + '&fields=items(snippet%2FtopLevelComment%2Fsnippet%2FauthorDisplayName%2Csnippet%2FtopLevelComment%2Fsnippet%2FtextDisplay)&key=AIzaSyAgNqfgP847pRTGlFzhirgATebC768fxbY';
        var htmlIFrame = '<iframe data-video="' +$(this).attr("data-video")+ '" width="640" height="360" src="http://www.youtube.com/embed/' + $(this).attr("data-video") + '" frameborder="0" allowfullscreen></iframe>';
        removeVideoFrame();

        // get channel and stats
        $.getJSON(statsUrl, function(statsResp){
            $('#videoModal').find('#channel').text('CHANNEL: ' + statsResp.items[0].snippet.channelTitle);
            $('#videoModal').find('#views').text('VIEWS: ' + Number(statsResp.items[0].statistics.viewCount).toLocaleString("en"));
            $('#videoModal').find('#likes').text('LIKES: ' + Number(statsResp.items[0].statistics.likeCount).toLocaleString("en"));
            $('#videoModal').find('#dislikes').text('DISLIKES: ' + Number(statsResp.items[0].statistics.dislikeCount).toLocaleString("en"));
        });

        // get comments
        $.getJSON(commentsUrl, function(commentsResp){
            for(j=0; j<commentsResp.items.length; j++){
              var commentListItem = '<li><b>' + commentsResp.items[j].snippet.topLevelComment.snippet.authorDisplayName + ' says: </b>"' + commentsResp.items[j].snippet.topLevelComment.snippet.textDisplay + '" </li>';
              $('#videoModal').find('#comments').append(commentListItem);
            }
        });

        // add video iframe and title to modal, then display it
        $('#videoModal').find('#video').append(htmlIFrame);
        $('.modal-title').text($(this).find('.media-heading').text());
        if(init.authenticated){
          // check if video is a fave, and if not, uncheck it
          if(isFave($(this).attr("data-video")) ===-1){
            chkBox = chkBox.replace('checked', '');
          }

          $('#videoModal').find('#fave').append(chkBox);
        }
        // console.log(htmlIFrame);
        $("#videoModal").modal("show");
  });

  $("#f").append($itemListener);

}

var removeFave = function(videoId){
  console.log("removing fave: " + videoId);

  var deleteId;
  for(i=0; i<init.faves.length; i++){
      if(init.faves[i].vidId == videoId){
        deleteId = init.faves[i].playlistitemid;
        // remove from faves array
        init.faves.splice(i, 1);
        break;
      }
  }

  if (deleteId != undefined){

    // call playlist item delete api with playlist item id
    var deleteURL = 'https://www.googleapis.com/youtube/v3/playlistItems?id=%%%id%%%&access_token=' + auth.token.access_token;
    deleteURL = deleteURL.replace('%%%id%%%', deleteId);

    $.ajax({
      type: 'DELETE',
      url: deleteURL,
      dataType: 'json',
      success: function() {
        console.log("deletion successful");
        // remove from the DOM
        $('#faveResults').find('li[data-video='+videoId+']').remove();

        removeVideoFrame();
      },
      error: function(e) {
        console.log(e);
        alert("An error occurred trying to delete playlist item [" +deleteId+ "]. See log for details.");
      }
    });

  }
}

// create the acowell-apidemo-faves playlist
var createPlaylist = function(favePlaylistTitle){
  var insertPlaylistURL = 'https://www.googleapis.com/youtube/v3/playlists?part=snippet%2C+status&fields=id&access_token=' + auth.token.access_token;
  var data = '{ "snippet": { "title": "'+favePlaylistTitle+'", ';
  data += '"description": "A private playlist created with the YouTube API used by the blammo JavaScript demo" }, ';
  data += '"status": { "privacyStatus": "private" } }';

  $.ajax({
    type: 'POST',
    url: insertPlaylistURL,
    contentType:'application/json; charset=utf-8',
    data: data,
    dataType: 'json',
    success: function(response) {
      console.log("playlist successfully created: " + response.id);
      init.favePlaylistId = response.id;
    },
    error: function(response) {
      console.log(response);
      alert("An error occurred trying to create playlist. See log for details.");
    }
  });
}
