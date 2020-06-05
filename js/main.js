
import { requestNotificationPermission , createNotification } from './notifications.js';
import push from './push-notifications.js';




// Set constraints for the video stream
var constraints = { video: { facingMode: "user" }, audio: false };
// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger")
// Access the web camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
       const track = stream.getTracks()[0];
        cameraView.srcObject = stream;
    })
    .catch(function(error) {
        console.error("Oops. Something is broken.", error);
    });
}
// Take a picture when cameraTrigger is clicked
cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
};
// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);

//filter function
function sliderHandler(event){
    Caman("#camera--output",function renderCaman(){
         this.revert(false);
         this[event.target.name](event.target.value).render();
      });

};
 var brightnessRange = document.getElementById("brightness");
    brightnessRange.onchange = sliderHandler;

  var vibranceRange = document.getElementById("vibrance");
     vibranceRange.onchange = sliderHandler;

  var hueRange = document.getElementById("hue");
     hueRange.onchange = sliderHandler;

  var contrastRange = document.getElementById("contrast");
     contrastRange.onchange = sliderHandler;

  var sepiaRange = document.getElementById("sepia");
    sepiaRange.onchange = sliderHandler;

// function for resetting filters

 var ranges = document.querySelectorAll('input[type="range"]') ;
const revertButton = document.getElementById("reset")
     function revertButtonHandler(event){
        ranges.forEach(function(range){
        range.value=0;

   });
       Caman("#camera--output",function(){
          this.revert(true);

   });
};
  
revertButton.onclick = revertButtonHandler;

// Download photo
function createDownload() {
  document.querySelector("#download").href = cameraSensor.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
    if (!navigator.onLine) {
      document.querySelector("#download").href = "#filters";
      document.querySelector("#download").removeAttribute("download");
      console.log("Disable download");
    } else {
      document.querySelector("#download").download = "image.png";
      console.log("Enable download");
    }
  }

  download.addEventListener("click", createDownload);


// make sure service Worker is registered

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('../SW.js')
      .then((registration) => { 
        console.log('Registered service worker')
        push();
      })
      .catch(error => console.log('Error with register service worker'));
    }
  }
  
 
 
 
  registerServiceWorker();
  createNotification();
  requestNotificationPermission();