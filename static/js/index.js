let map, infoWindow;
var random_num = 0;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.460074, lng: 126.952568 },
    zoom: 16,
    });
    
    
    for(var i = 37.4 ; i < 37.7; i = i + 0.003){
        for(var j = 126.7; j < 127.3; j = j + 0.003){
            var rectangle = new google.maps.Rectangle({
            strokeColor: "white",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "yellow",
            fillOpacity: 0.35,
            map,
            bounds: new google.maps.LatLngBounds(
                new google.maps.LatLng(i, j),
                new google.maps.LatLng(i+0.003, j+0.003)
            )
        });
        console.log(rectangle)  
    }}

    rectangle.addListener('click', function(e) {
        console.log(1);
      });

    infoWindow = new google.maps.InfoWindow();

    const locationButton = document.createElement("button");

    locationButton.textContent = "Pan to Current Location";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
        (position) => {
            const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent("Location found.");
            infoWindow.open(map);
            map.setCenter(pos);
        },
        () => {
            handleLocationError(true, infoWindow, map.getCenter());
        }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
    });
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
    browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}

window.initMap = initMap;