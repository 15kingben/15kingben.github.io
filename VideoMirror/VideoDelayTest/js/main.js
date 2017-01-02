'use strict';

/* globals MediaRecorder */

// Spec is at http://dvcs.w3.org/hg/dap/raw-file/tip/media-stream-capture/RecordingProposal.html

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;


if(getBrowser() == "Chrome"){
	var mirrorConstraints = {"audio": false, "video": {  "mandatory": {  "minWidth": 640,  "maxWidth": 640, "minHeight": 480,"maxHeight": 480 }, "optional": [] } };//Chrome
	var videoConstraints  = {"audio": true, "video": {  "mandatory": {  "minWidth": 640,  "maxWidth": 640, "minHeight": 480,"maxHeight": 480 }, "optional": [] } };//Chrome
}else if(getBrowser() == "Firefox"){
	var mirrorConstraints = {audio: false,video: {  width: { min: 640, ideal: 640, max: 640 },  height: { min: 480, ideal: 480, max: 480 }}}; //Firefox
	var videoConstraints = {audio: true,video: {  width: { min: 640, ideal: 640, max: 640 },  height: { min: 480, ideal: 480, max: 480 }}}; //Firefox
}

// var recBtn = document.querySelector('button#rec');
// var pauseResBtn = document.querySelector('button#pauseRes');
// var stopBtn = document.querySelector('button#stop');

var videoElement = document.querySelector('video');
// var dataElement = document.querySelector('#data');
var downloadLink = document.querySelector('a#downloadLink');

//Ben's stuff
var videoLength = 8000;
var videoDelay = 3000;
var mirrorMode = true;
var countdownTimer = document.querySelector("h1#countdownTimer");
var stopInQueue;
var resetInQueue;
var downloadList = document.querySelector("ol#downloadList");
var mirrorModeButton = document.querySelector('button#mirrorMode');
var videoModeButton = document.querySelector('button#videoMode');
videoElement.controls = false;


window.onload = onBtnMirrorModeClicked;



function errorCallback(error){
	console.log('navigator.getUserMedia error: ', error);
}

/*
var mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
var sourceBuffer;
*/

var mediaRecorder;
var chunks = [];
var count = 0;

function startRecording(stream) {
	//log('Start recording...');
	if (typeof MediaRecorder.isTypeSupported == 'function'){
		/*
			MediaRecorder.isTypeSupported is a function announced in https://developers.google.com/web/updates/2016/01/mediarecorder and later introduced in the MediaRecorder API spec http://www.w3.org/TR/mediastream-recording/
		*/
		if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
		  var options = {mimeType: 'video/webm;codecs=h264'};
		} else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
		  var options = {mimeType: 'video/webm;codecs=vp9'};
		} else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
		  var options = {mimeType: 'video/webm;codecs=vp8'};
		}
		//log('Using '+options.mimeType);
		mediaRecorder = new MediaRecorder(stream, options);
	}else{
	//	log('Using default codecs for browser');
		mediaRecorder = new MediaRecorder(stream);
	}

	// pauseResBtn.textContent = "Pause";

	mediaRecorder.start(10);

	var url = window.URL || window.webkitURL;
	videoElement.src = url ? url.createObjectURL(stream) : stream;
	videoElement.play();

	mediaRecorder.ondataavailable = function(e) {
		//log('Data available...');
		//console.log(e.data);
		//console.log(e.data.type);
		//console.log(e);
		chunks.push(e.data);
	};

	mediaRecorder.onerror = function(e){
		//log('Error: ' + e);
		console.log('Error: ', e);
	};


	mediaRecorder.onstart = function(){
		//log('Started & state = ' + mediaRecorder.state);
	};

	mediaRecorder.onstop = function(){
		if(mirrorMode){
			return;
		}
		//log('Stopped  & state = ' + mediaRecorder.state);

		var blob = new Blob(chunks, {type: "video/webm"});
		chunks = [];

		var videoURL = window.URL.createObjectURL(blob);

		downloadLink.href = videoURL;
		videoElement.src = videoURL;

		$(".downloadHeader").css("display", "block");
		downloadList.style.display = "block";

		var listNode = document.createElement('li');
		var imgNode = document.createElement('img');
		listNode.appendChild(imgNode);
		//listNode.appendChild(document.createTextNode())

		var canvas_elem = $( '<canvas class=snapshot_generator></canvas>' ).appendTo(document.body)[0];
		var $video = $( '<video muted class=snapshot_generator></video>' ).appendTo(document.body);

		var step_2_events_fired = 0;
		$video.one('loadedmetadata loadeddata suspend', function() {
    	if (++step_2_events_fired == 3) {
				$video.one('seeked', function() {
					canvas_elem.height = this.videoHeight;
					canvas_elem.width = this.videoWidth;
					canvas_elem.getContext('2d').drawImage(this, 0, 0);
					var snapshot = canvas_elem.toDataURL();
					imgNode.setAttribute("src", snapshot);
					// Remove elements as they are no longer needed
					$video.remove();
					$(canvas_elem).remove();
				}).prop('currentTime', videoLength/1000/2);
    	}
		}).prop('src', videoURL);




		var rand =  Math.floor((Math.random() * 10000000));
		var name  = "video_"+rand+".webm" ;

		// var lengthNode = document.createTextNode("  Length: " + videoLength/1000 + " seconds");
		// lengthNode.setAttribute("style", "{color:#333}");
		//listNode.appendChild(lengthNode);

		var linkNode = document.createElement("a");
		linkNode.appendChild(document.createTextNode('Download'));
		linkNode.setAttribute("href", videoURL);
		linkNode.setAttribute( "download", name);
		linkNode.setAttribute( "name", name);


		listNode.appendChild(linkNode);
		downloadList.appendChild(listNode);
	};

	mediaRecorder.onpause = function(){
		//log('Paused & state = ' + mediaRecorder.state);
	}

	mediaRecorder.onresume = function(){
		//log('Resumed  & state = ' + mediaRecorder.state);
	}

	mediaRecorder.onwarning = function(e){
	//	log('Warning: ' + e);
	};
}

//function handleSourceOpen(event) {
//  console.log('MediaSource opened');
//  sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp9"');
//  console.log('Source buffer: ', sourceBuffer);
//}

function videoStop(){
	if(mirrorMode){
		return;
	}
	if(mediaRecorder != null && mediaRecorder.state != "inactive"){
		mediaRecorder.stop();
	}

	resetInQueue = setTimeout(videoResetting, videoLength);
}

function videoResetting(){
	if(mirrorMode){
		return;
	}
	enableMirroring();

	//tell the user that were restarting
	countdownTimer.style.display = "flex";
	countdownDelay(videoDelay + 1000 - 100);
	setTimeout(onBtnRecordClicked, videoDelay);
}



function countdownDelay(timeLeft){
	if(mediaRecorder != null && mediaRecorder.state != "inactive"){
		return;
	}
	timeLeft -= 1000;
	if(timeLeft <=0 ){
		return;
	}
	countdownTimer.innerHTML = Math.ceil(timeLeft/1000.0);
	setTimeout(countdownDelay.bind(null, timeLeft), 1000);
}



function onBtnMirrorModeClicked(){
	mirrorModeButton.className =
	   mirrorModeButton.className.replace
	      ( /(?:^|\s)greyedOut(?!\S)/g , '' );

	if(!videoModeButton.className.match(/(?:^|\s)greyedOut(?!\S)/) ){
		countdownTimer.style.display = "none";
		videoModeButton.className += " greyedOut";
		mirrorMode = true;
		//if(stopInQueue != null){
			clearTimeout(stopInQueue);
			clearTimeout(resetInQueue);

		enableMirroring();
	}
}

function enableMirroring(){
	if(mediaRecorder != null){
		if(mediaRecorder.state != "inactive"){
			mediaRecorder.stop();
		}
	}

	if (typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
	 alert('MediaRecorder not supported on your browser, use Firefox 30 or Chrome 49 instead.');
	}else {
 		navigator.getUserMedia(mirrorConstraints, mirrorRecording, errorCallback);
	}
}

function mirrorRecording(stream){
	var url = window.URL || window.webkitURL;
	videoElement.src = window.webkitURL.createObjectURL(stream);
	// video.onloadedmetadata = function(e){
	//     video.play();
	// };
	videoElement.play();
}

function onBtnVideoModeClicked(){
	videoModeButton.className =
	   videoModeButton.className.replace
	      ( /(?:^|\s)greyedOut(?!\S)/g , '' );

		$(".sliders").css("display", "block");
		updateSliders();

	if(!mirrorModeButton.className.match(/(?:^|\s)greyedOut(?!\S)/) ){
				mirrorModeButton.className += " greyedOut";
				mirrorMode = false;
				videoResetting();
		}
}

function onBtnRecordClicked (){
	if(mirrorMode){
		return;
	}
	countdownTimer.style.display = "none";

	 if (typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
		alert('MediaRecorder not supported on your browser, use Firefox 30 or Chrome 49 instead.');
	}else {
		navigator.getUserMedia(videoConstraints, startRecording, errorCallback);
		// recBtn.disabled = true;
		// pauseResBtn.disabled = false;
		// stopBtn.disabled = false;
		// ////
		stopInQueue = setTimeout(videoStop, videoLength);
	}
}

function onBtnStopClicked(){
	mediaRecorder.stop();
	videoElement.controls = true;

	// recBtn.disabled = false;
	// pauseResBtn.disabled = true;
	// stopBtn.disabled = true;
}

// function onPauseResumeClicked(){
// 	if(pauseResBtn.textContent === "Pause"){
// 		console.log("pause");
// 		pauseResBtn.textContent = "Resume";
// 		mediaRecorder.pause();
// 		// stopBtn.disabled = true;
// 	}else{
// 		console.log("resume");
// 		pauseResBtn.textContent = "Pause";
// 		mediaRecorder.resume();
// 		// stopBtn.disabled = false;
// 	}
// 	// recBtn.disabled = true;
// 	// pauseResBtn.disabled = false;
// }

// function log(message){
// 	dataElement.innerHTML = dataElement.innerHTML+'<br>'+message ;
// }

//browser ID
function getBrowser(){
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var fullVersion  = ''+parseFloat(navigator.appVersion);
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameOffset,verOffset,ix;

	// In Opera, the true version is after "Opera" or after "Version"
	if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
	 browserName = "Opera";
	 fullVersion = nAgt.substring(verOffset+6);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
	 browserName = "Microsoft Internet Explorer";
	 fullVersion = nAgt.substring(verOffset+5);
	}
	// In Chrome, the true version is after "Chrome"
	else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
	 browserName = "Chrome";
	 fullVersion = nAgt.substring(verOffset+7);
	}
	// In Safari, the true version is after "Safari" or after "Version"
	else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
	 browserName = "Safari";
	 fullVersion = nAgt.substring(verOffset+7);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In Firefox, the true version is after "Firefox"
	else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
	 browserName = "Firefox";
	 fullVersion = nAgt.substring(verOffset+8);
	}
	// In most other browsers, "name/version" is at the end of userAgent
	else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
		   (verOffset=nAgt.lastIndexOf('/')) )
	{
	 browserName = nAgt.substring(nameOffset,verOffset);
	 fullVersion = nAgt.substring(verOffset+1);
	 if (browserName.toLowerCase()==browserName.toUpperCase()) {
	  browserName = navigator.appName;
	 }
	}
	// trim the fullVersion string at semicolon/space if present
	if ((ix=fullVersion.indexOf(";"))!=-1)
	   fullVersion=fullVersion.substring(0,ix);
	if ((ix=fullVersion.indexOf(" "))!=-1)
	   fullVersion=fullVersion.substring(0,ix);

	majorVersion = parseInt(''+fullVersion,10);
	if (isNaN(majorVersion)) {
	 fullVersion  = ''+parseFloat(navigator.appVersion);
	 majorVersion = parseInt(navigator.appVersion,10);
	}


	return browserName;
}

function updateSliders(){
	updateVideoLength();
	updateDelayLength();
}

function updateVideoLength(){
	$("p#videoLengthTF").html($("input#videoLengthSlider").val() + " seconds");
	videoLength = $("input#videoLengthSlider").val() * 1000;
}

function updateDelayLength(){
	$("p#videoDelayTF").html($("input#videoDelaySlider").val() + " seconds");
	videoDelay = $("input#videoDelaySlider").val() * 1000;
}

$(document).ready(
	function(){
		$("input#videoLengthSlider").on('change', updateVideoLength);
		$("input#videoDelaySlider").on('change', updateDelayLength);
		$("input#videoLengthSlider").val(8);
		$("input#videoDelaySlider").val(3);
	}
);
