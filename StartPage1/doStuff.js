var gDate;
var gHours;
var gMinutes;
var gLoc = "";

//remember to cache copies of all libraries

var main = function(){
	
		$(".btn").map(function() {
			var url = this.getAttribute("href");
			
			$(this).find("img").attr("src", "http://www.google.com/s2/favicons?domain=" + url);
		});
		
		getRSS("http://stackoverflow.com/feeds/question/10943544");
		getLocation();
		repeat();

}


var getRSS = function(feedUrl){
	/* $.ajax({
  url      : "http:" + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(feedUrl),
  dataType : 'json',
  success  : function (data) {
    if (data.responseData.feed && data.responseData.feed.entries) {
      $.each(data.responseData.feed.entries, function (i, e) {
        console.log("------------------------");
        console.log("title      : " + e.title);
        console.log("author     : " + e.author);
        console.log("description: " + e.description);
      });
    }
  }
}); */
	
	
	$.getFeed({
   url     : feedUrl,
   success : function (feed) {
      console.log(feed.title);
      // do more stuff here
   }
});
}

var repeat = function() {
	
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	if(minutes < 10){
		minutes = "0" + minutes;
	}
	gHours = hours;
	gMinutes = minutes;
	gDate = currentTime;
	
	
	displayDate(gLoc, hours, minutes, currentTime);

	
	setTimeout(repeat , 3000);
	
	
}


/* var addToDate = function(hours, minutes){
	minutes += .5;
	if(minutes > 60){
		minutes = minutes%60;
		hours++;
	}
	if(hours > 24){
		hours = hours%24;
	}
	
	setTimeout(addToDate, 10000);
} */


var getLocation = function(){
	
	
	$.getJSON('http://ip-api.com/json/?callback=?' , function (result) {
		
		
		
	}).fail( function (result, textStatus, e){
		gLoc = "";
		console.log("status: " + textStatus + " error: " + e);
	}).done( function(result) {
		var city;
		var state;
		
		$.each(result, function(k , v){
			
			
			
			
			if(k=="status"){
				if(v=="fail"){
					return;
				}
			}
			
			if(k=="city"){
				city = v;
			}
			
			if(k=="region"){
				state = v;
			
			}
			
		});
		
		
		gLoc = city + ", " + state;
		
		displayDate(gLoc, gHours,gMinutes, gDate);
		
		$.getJSON("http://api.openweathermap.org/data/2.5/weather?q="  +gLoc+ "&appid=506a9df1236167de4b97254ada3b4173", function(data){
			
		}).fail(function(data){
			console.log("weather failed");
			
		}).done(function(data){
			//$.each(data, function(k,v){
				
				setBackground(data.weather[0].main);
				
			//});
		});


	});
}



var displayDate = function(location,hours , minutes, date){
	//display location
	var city = "";
	var state = "";
	//"http://ip-api.com/json/?callback=?"
	//http://www.telize.com/geoip?callback=?
	
	
	
		

	

	
	/*
	 var url =  "http://puppygifs.tumblr.com/api/read/json";
    $.getJSON(url + "?callback=?", null, function(tweets) {
        window.alert(tweets);
		
		for(i in tweets) {
            tweet = tweets[i];
            $("#tweet-list").append(tweet.text + "<hr />");
        }
    });*/
	
	
	/*$.getJSON("http://ip.jsontest.com/?callback=?", function(data) {
		
		window.alert(data);
	});*/
	
	
	
	//openweathermap
	//ip-api.com
	
	
	
	//shout out to w3 schools
	var weekday = new Array(7);
	weekday[0]=  "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";

	var w = weekday[date.getDay()];
	
	var month = new Array();
	month[0] = "January";
	month[1] = "February";
	month[2] = "March";
	month[3] = "April";
	month[4] = "May";
	month[5] = "June";
	month[6] = "July";
	month[7] = "August";
	month[8] = "September";
	month[9] = "October";
	month[10] = "November";
	month[11] = "December";
	var m = month[date.getMonth()];
	
	var s = w + ", " + m + " " + date.getDate();
	
	if(hours > 12){
		$('.time').html(location + "<br>" +  s + "<br>" + (  hours - 12) + ':' + minutes + " PM");
	}else{
		if(hours == 0){
			$('.time').html(location + "<br>" + s + "<br>" + ( 12 )+ ":" + minutes + " AM");
		}else{
		$('.time').html(location + "<br>" +  s + "<br>" + ( hours )+ ":" + minutes + " AM");}
	}

	
}

var setBackground = function(weather){
	
	switch(weather){
		case "Thunderstorm":
			break;
		case "Drizzle":
			break;
		case "Rain":
			break;
		case "Snow":
			break;
		case "Atmosphere":
			break;
		case "Clear":
			break;
		case "Clouds":
			console.log($("body").css("background"));
			break;
		case "Extreme":
			break;
		case "Additional":
			break;
		
		
		
		
	}
	
}

$(document).ready(main);