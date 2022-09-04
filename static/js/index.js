let map, infoWindow;
var rectangle_list = [];
var click_list = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.460074, lng: 126.952568 },
    zoom: 16,
    });
    
    
    for(var i = 37.4 ; i < 37.7; i = i + 0.002){
        for(var j = 126.7; j < 127.3; j = j + 0.002){
            var rectangle = new google.maps.Rectangle({
            strokeColor: "white",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "white",
            fillOpacity: 0.35,
            map,
            bounds: new google.maps.LatLngBounds(
                new google.maps.LatLng(i, j),
                new google.maps.LatLng(i+0.002, j+0.002)
            )
        });
        rectangle_list.push(rectangle)
    }}

    
    rectangle_list.forEach((item) => item.addListener('click', () => 
        {
            $('#select_modal').css('display', 'block');

            click_list.push(item);
            window.click_list_length_substract_one = click_list.length - 1
        }
    ));

    $(document).on('click', '#green_box' ,function(e) {
        click_list[click_list_length_substract_one].setOptions( { fillColor: 'green'});
        //fillColor: 'green' -> fillColor: 'rgb(0,255,255)'
        $('#select_modal').css('display', 'none');
    });

    $(document).on('click', '#yellow_box' ,function(e) {
        click_list[click_list_length_substract_one].setOptions( { fillColor: 'yellow' });
        $('#select_modal').css('display', 'none');
    });

    $(document).on('click', '#red_box' ,function(e) {
        click_list[click_list_length_substract_one].setOptions( { fillColor: 'red' });
        $('#select_modal').css('display', 'none');
    });

    infoWindow = new google.maps.InfoWindow();

    const locationButton = document.createElement("button");

    locationButton.textContent = "현재 위치로";
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

$(document).on('click', '#quit' ,function(e) {
    $('#select_modal').css('display', 'none');
})