$('#btnTrending').click(function(){
  loadTrending();
});

var loadTrending = function(){
  var searchUrl = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular';
  searchUrl += '&maxResults=10&regionCode=US&fields=items(id%2Csnippet%2Ftitle%2Csnippet%2Fdescription%2Csnippet%2Fthumbnails%2Fdefault%2Furl)';
  searchUrl += '&key=AIzaSyAgNqfgP847pRTGlFzhirgATebC768fxbY';

  // clear previous search results
  clearResultsList($('#trendingResults'), 't');
  // console.log(searchUrl);

  // populate list of search results into search results div
  populateResults(searchUrl, $('#trendingResults'), 't');

}
