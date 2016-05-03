var trendingKey = "t";

$('#btnTrending').click(function(){
  loadTrending();
});

var loadTrending = function(){
  var searchUrl = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=10&regionCode=US&fields=items(id%2Csnippet%2Ftitle%2Csnippet%2Fdescription%2Csnippet%2Fthumbnails%2Fdefault%2Furl)&key=AIzaSyAgNqfgP847pRTGlFzhirgATebC768fxbY';

  // clear previous search results
  clearResultsList($('#trendingResults'), trendingKey);
  console.log(searchUrl);

  // populate list of search results into search results div
  populateResults(searchUrl, $('#trendingResults'), trendingKey);

}
