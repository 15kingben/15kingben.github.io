if(navigator.webkitGetUserMedia!=null) {
  var options = {
    video:true,
    audio:true
  };
  navigator.webkitGetUserMedia(options,
    function(stream) {
      var video = document.querySelector('video');
      video.src = window.webkitURL.createObjectURL(stream);
    },
    function(e) {
      console.log("There was a problem");
    }
  );
}

document.querySelector('video').addEventListener('ended',myHandler,false);
function myHandler(e) {
    console.log('ended');
    setTimeout(function(){
        document.querySelector('video').play();
    }, 5000);
}
