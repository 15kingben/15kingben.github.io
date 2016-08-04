$(document).ready(function() {

    var yql = "https://query.yahooapis.com/v1/public/yql?q=select%20title%2Clink%2Cdescription%20from%20rss%20where%20url%3D%22http%3A%2F%2Ffeeds.feedburner.com%2Fraymondcamdensblog%3Fformat%3Dxml%22&format=json&diagnostics=true&callback=";

    $.getJSON(yql, function(res) {
        console.log(res);
    }, "jsonp");

});
