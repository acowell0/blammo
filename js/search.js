var searchKey = "s";

$('#btnClear').click(function(){
  clearResultsList($('#searchResults'), searchKey);
});

$('#btnSearch').click(function(){
  var searchUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&order=%%%order%%%&q=%%%query%%%&type=video&fields=items(id%2Csnippet%2Ftitle%2Csnippet%2Fdescription%2Csnippet%2Fthumbnails%2Fdefault%2Furl)&key=AIzaSyAgNqfgP847pRTGlFzhirgATebC768fxbY';
  // clear previous search results
  clearResultsList($('#searchResults'), searchKey);
  console.log($('#selSort').find('option:selected').val());

  searchUrl = searchUrl.replace('%%%order%%%', $('#selSort').find('option:selected').val());
  console.log(searchUrl);

  var searchString = $('#inputSearch').val();
  console.log(searchString);
  // replace spaces with +
  searchUrl = searchUrl.replace('%%%query%%%', searchString.split(' ').join('+'));
  console.log(searchUrl);

  // populate list of search results into search results div
  populateResults(searchUrl, $('#searchResults'), searchKey);

});
