// clear search results and input controls
$('#btnClear').click(function(){
  clearResultsList($('#searchResults'), 's');
  $('#lat').val('');
  $('#long').val('');
  $('#radius').val('');
  $('#inputSearch').val('');
  // reset selects to first option
  $('#selUnit option')[0].selected = true;
  $('#selSort option')[0].selected = true;
  $('#selMaxResults option')[0].selected = true;
});

$('#btnSearch').click(function(){
  var searchUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=%%%maxRes%%%&';
  searchUrl += 'order=%%%order%%%&q=%%%query%%%&type=video&';
  searchUrl += 'fields=items(id%2Csnippet%2Ftitle%2Csnippet%2Fdescription%2Csnippet%2Fthumbnails%2Fdefault%2Furl)';
  searchUrl += '&key=AIzaSyAgNqfgP847pRTGlFzhirgATebC768fxbY';

  // if geo controls are active, get values
  if($('#geo').is(':checked')){
    //TODO: validate these params!!!!!
    var latitude = $('#lat').val();
    var longitude = $('#long').val();
    var radius = $('#radius').val();
    var unit = $('#selUnit').find('option:selected').val();

    // add geo params to search url
    // must add both location and locationRadius
    // location is: latitude,longitude but comma is url-encoded --> %2C
    searchUrl += '&location=' + latitude +'%2C'+ longitude;
    searchUrl += '&locationRadius='+radius+unit;

  }

  // clear previous search results
  clearResultsList($('#searchResults'), 's');

  searchUrl = searchUrl.replace('%%%order%%%', $('#selSort').find('option:selected').val());
  searchUrl = searchUrl.replace('%%%maxRes%%%',$('#selMaxResults').find('option:selected').val());

  //TODO: validate query input?
  var searchString = $('#inputSearch').val();

  // replace spaces with +
  searchUrl = searchUrl.replace('%%%query%%%', searchString.split(' ').join('+'));
  console.log(searchUrl);

  // populate list of search results into search results div
  populateResults(searchUrl, $('#searchResults'), 's');

});

$('#geo').click(function(){
  // show/hide geo controls when checkbox clicked
  $("#lat").toggle();
  $("#long").toggle();
  $("#radius").toggle();
  $("#lblUnit").toggle();
  $("#selUnit").toggle();
  // push search container down when geo controls are visible
  if($('#geo').is(":checked")){
    $('#search-container').css("margin-top", "260px");
  } else {
    $('#search-container').css("margin-top", "200px");
  }
});

/////////////////////
var validateLatLong = function(){
  var regLat = new RegExp("^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}");

  if( reg.exec(latitude) ) {
   //do nothing
  } else {
   //error
  }

  if( reg.exec(longitude) ) {
   //do nothing
  } else {
   //error
  }
}
