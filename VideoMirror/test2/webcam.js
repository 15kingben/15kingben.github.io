
var constraints = {
  video:true,
  audio:true
};


navigator.mediaDevices.getUserMedia(constraints)
  .then(function(mediaStream){
    var video = document.querySelector('video');
    video.src = window.webkitURL.createObjectURL(mediaStream);
    video.onloadedmetadata = function(e){
        video.play();
    };
  })
  .catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.


}
//
// if(navigator.webkitGetUserMedia!=null) {
//
//   navigator.webkitGetUserMedia(options,
//     function(stream) {
//
//     },
//     function(e) {
//       console.log("There was a problem");
//     }
//   );
// }
//
// document.querySelector('video').addEventListener('ended',myHandler,false);
// function myHandler(e) {
//     console.log('ended');
//     setTimeout(function(){
//         document.querySelector('video').play();
//     }, 5000);
// }
