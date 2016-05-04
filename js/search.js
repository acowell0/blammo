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
    var latitude = $('#lat').val();
    var longitude = $('#long').val();
    var radius = $('#radius').val();
    var unit = $('#selUnit').find('option:selected').val();

    // validate params before adding to search url
    if(validLat(latitude)){
      if(validLong(longitude)){
        if(validRadius(radius, unit)){
          // add geo params to search url
          // must add both location and locationRadius
          // location is: latitude,longitude but comma is url-encoded --> %2C
          searchUrl += '&location=' + latitude +'%2C'+ longitude;
          searchUrl += '&locationRadius='+radius+unit;
        }
      }
    }

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

// valid latitudes are values from -90 to 90
var validLat = function(latitude){
  if(isNumeric(latitude)){
    if(-90 <= latitude && latitude <= 90){
      return true;
    }
    else {
      alert("Invalid latitude value. Please enter a number between -90 and 90. Search will be executed without geolocation filters.");
      return false;
    }
  } else {
    alert("Invalid latitude value. Please enter a number between -90 and 90. Search will be executed without geolocation filters.");
    return false;
  }
}

// valid longitudes are values from -180 to 180
var validLong = function(longitude){
  if(isNumeric(longitude)){
    if(-180 <= longitude && longitude <= 180){
      return true;
    }
    else {
      alert("Invalid longitude value. Please enter a number between -180 and 180. Search will be executed without geolocation filters.");
      return false;
    }
  } else {
    alert("Invalid longitude value. Please enter a number between -180 and 180. Search will be executed without geolocation filters.");
    return false;
  }
}

// max allowable radius is 1000km
var validRadius = function(radius, unit){
  if(isNumeric(radius)){
    if(radius < 0){
      alert("Invalid radius. Please enter a non-negative number. Search will be executed without geolocation filters.");
      return false;
    }
    else {
      // convert to km and compare
      switch(unit) {
        case "m":
          radius = radius * 0.001;
          break;
        case "ft":
          radius = radius * 0.0003048;
          break;
        case "mi":
          radius = radius * 1.60934;
          break;
      };

      console.log("radius [" + radius + "] km.");
      if (radius > 1000) {
        alert("Radius exceeds maximum of 1000km. Please enter a smaller radius.  Search will be executed without geolocation filters.");
        return false;
      }
      else {
        return true;
      }
    }
  } else {
    alert("Invalid radius value. Radius must be numeric. Search will be executed without geolocation filters.");
    return false;
  }

}

// check if value is numeric
function isNumeric(num) {
  return !isNaN(parseFloat(num)) && isFinite(num);
}
