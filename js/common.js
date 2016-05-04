// common function to populate api results list
var populateResults = function (apiUrl, targetContainer, resultsType){
  
  $.getJSON(apiUrl, function(response){
    // add the media list if it doesn't already exist
    if($(targetContainer).find('ul').length == 0){
      var htmlMediaList = $('<ul id="'+resultsType+'" class="media-list"></ul>');
      console.log("media list doesn't exist, so add it");
      $(targetContainer).append(htmlMediaList);
    }
    console.log(response);
    console.log(response.items.length);

    // for each result, add a list item with
    // anchor, img, media body, media heading, media desc
    for(i=0; i<response.items.length; i++){
      var htmlListItem;
      console.log(resultsType);
      switch(resultsType) {
        case "s":
          htmlListItem = '<li class="media ' + resultsType + '" data-video="'+ response.items[i].id.videoId + '">';
          break;
        case "t":
          htmlListItem = '<li class="media ' + resultsType + '" data-video="'+ response.items[i].id + '">';
          break;
        case "f":
          htmlListItem = '<li class="media ' + resultsType + '" data-video="'+ response.items[i].snippet.resourceId.videoId + '">';
          // add fave object to faves array
          // objFave is video id : playlist item id
          var objFave = {
            vidId : response.items[i].snippet.resourceId.videoId,
            playlistitemid : response.items[i].id
          };
          faves.push(objFave);
          break;

      }

      console.log("htmllistitem:"+htmlListItem);

      htmlListItem += '<a class="media-left" href="#">';
      htmlListItem += '<img class="media-object" src="' + response.items[i].snippet.thumbnails.default.url + '" >';
      htmlListItem += '</a>';
      htmlListItem += '<div class="media-body">';
      htmlListItem += '<h4 class="media-heading">' + response.items[i].snippet.title + '</h4>';
      htmlListItem += '<p>'+ response.items[i].snippet.description + '</p>';
      htmlListItem += '</div>';
      htmlListItem += '</li>';
      var $itemListener = $(htmlListItem).click(function() {
            console.log($(this).attr("data-video"));
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
            if(authenticated){
              // check if video is a fave, and if not, uncheck it
              if(isFave($(this).attr("data-video")) ===-1){
                console.log("it is not a fave");
                chkBox = chkBox.replace('checked', '');
              }

              $('#videoModal').find('#fave').append(chkBox);
            }
            console.log(htmlIFrame);
            $("#videoModal").modal("show");
      });

      $('#'+resultsType).append($itemListener);
    }
  });
}

// common function to clear the list of api results
var clearResultsList = function(targetContainer, resultsType){
  console.log("inside clearResultsList");
  $(targetContainer).find($('.'+resultsType).remove());
}

// remove IFrame with video
var removeVideoFrame = function(){
  console.log("inside removeVideoFrame");
  $('#videoModal').find('#fave').children().remove();
  $('#videoModal').find('#video').children().remove();
  $('.modal-title').text("");
  clearModalComments();
}

var clearModalComments = function(){
    $('#videoModal').find('#comments').children().remove();
}

$('#modalClose').click(function(){
  console.log("video id: " + $('#videoModal').find('iframe').attr("data-video"));
  console.log("is checked: " + $('#videoModal').find('#fave').find("input[type='checkbox']").is(":checked"));

  // if fave was checked/unchecked, handle it accordingly
  if(authenticated){
    if($('#videoModal').find('#fave').find("input[type='checkbox']").is(":checked")){
      addFave($('#videoModal').find('iframe').attr("data-video"));
    } else {
      removeFave($('#videoModal').find('iframe').attr("data-video"));
    }
  }

  removeVideoFrame();
});

$('#modalX').click(function(){
  // if fave was checked/unchecked, handle it accordingly on modal close
  if(authenticated){
    if($('#videoModal').find('#fave').find("input[type='checkbox']").is(":checked")){
      addFave($('#videoModal').find('iframe').attr("data-video"));
    } else {
      removeFave($('#videoModal').find('iframe').attr("data-video"));
    }
  }
  removeVideoFrame();
});

$('#searchTab').click(function(){
  $('#search-controls').show();
});

$('#trendingTab').click(function(){
  $('#search-controls').hide();
});

$('#myTab').click(function(){
  $('#search-controls').hide();
});
