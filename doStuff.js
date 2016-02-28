

var gHours;
var gMinutes;
var gDate;
var articles = [];
var count = 0;


var main = function(){
  $(document).keypress(function(event){
    if(event.which == 106){
      count--;
      if(count < 0){
        count = articles.length-1;
      }
      updateRSS();
    }
    if(event.which == 108){

      count++;
      if(count >= articles.length){
        count = 0;
      }
      updateRSS();
    }

  });
  getRSSFeed("https://query.yahooapis.com/v1/public/yql?q=select%20title%20from%20rss%20where%20url%3D%22https%3A%2F%2Fnews.google.com%2Fnews%3Fcf%3Dall%26hl%3Den%26pz%3D1%26ned%3Dus%26output%3Drss%22&diagnostics=true"
);



  var r = Math.floor(Math.random() * 14 + 1);
  var bgFile = 'Backgrounds/' + r + ".png";
  //$('body').css('background', 'url(\''+ bgFile +'\') no-repeat center center fixed');


  var currentTime = new Date();
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes();
  if(minutes < 10){
    minutes = "0" + minutes;
  }
  gHours = hours;
  gMinutes = minutes;
  gDate = currentTime;


  displayDate( hours, minutes, currentTime);


  setTimeout(repeat , 3000);
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


	displayDate( hours, minutes, currentTime);


	setTimeout(repeat , 3000);


}

var displayDate = function(hours , minutes, date){


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
  $('.currentDate').html(s);

	if(hours > 12){
		$('.time').html((  hours - 12) + ':' + minutes + " PM");
	}else{
		if(hours == 0){
			$('.time').html(( 12 )+ ":" + minutes + " AM");
		}else{
		$('.time').html(( hours )+ ":" + minutes + " AM");}
	}


}

var getRSSFeed = function(FEED_URL) {
var yql = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22https%3A%2F%2Fnews.google.com%2Fnews%3Fcf%3Dall%26hl%3Den%26pz%3D1%26ned%3Dus%26output%3Drss%22&format=json&diagnostics=true&callback="
$.getJSON(yql, function(res) {
      //console.log(res.query.results);

      articles = res.query.results.item;
      console.log(articles.length)
      cycleRSS();
      //$('.rss').html(articles[0].description)
      //$('.rss1').empty().append(res.query.results.item[1].description);
      //$('.rss2').html(res.query.results.item[2].description);
      //changeTheRSSFormat();
      //$.each(res)
  }, "jsonp");


}


var cycleRSS = function(){
  count++;
  if(count >= articles.length){
    count = 0;
  }
  updateRSS();

  setTimeout(cycleRSS, 13000);
}


var updateRSS = function(){
  $('.rss').html(articles[count].description);
  changeTheRSSFormat();
}

var changeTheRSSFormat = function(){
  for(var i = 5; i < $('.rss .lh').children().length; i++){
    $('.rss .lh').children().eq(i).empty();
    //$('.rss .lh').children().eq(i).remove();
  }

  $('.rss .lh').children().eq(0).css('font-size',  '120%');
  $('.rss .lh').children().eq(2).find('>:first-child').find('>:first-child').css('color',  '#DDDDDD');


}



$(document).ready(main)
