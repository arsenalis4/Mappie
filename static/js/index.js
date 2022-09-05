// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { collection, addDoc, getFirestore } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCxe-LE2x6LQi_wmNovnOjNJxEsR4JkpQ",
  authDomain: "mappie-b34b8.firebaseapp.com",
  projectId: "mappie-b34b8",
  storageBucket: "mappie-b34b8.appspot.com",
  messagingSenderId: "575929816110",
  appId: "1:575929816110:web:b24640399675aa5a51fbbf",
  measurementId: "G-5SPFWPZQYJ",
  databaseURL: "https://mappie-b34b8-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebase = getDatabase(app);

var db = getDatabase();

let map, infoWindow;
var rectangle_list = [];
var click_list = [];
var render_boolean = true;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.460074, lng: 126.952568 },
    zoom: 16,
    });

    const starRef = ref(db, '1/');
    onValue(starRef, (snapshot) => {
        if(render_boolean){
        const rgb_data = snapshot.val();
        var rgb_num = 0;
        for(var i = 37.4 ; i < 37.7; i = i + 0.0025){
            for(var j = 126.7; j < 127.3; j = j + 0.0025){
                var rectangle = new google.maps.Rectangle({
                strokeColor: "white",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: rgb(rgb_data[rgb_num])[0],
                fillOpacity: rgb(rgb_data[rgb_num])[1],
                map,
                bounds: new google.maps.LatLngBounds(
                    new google.maps.LatLng(i, j),
                    new google.maps.LatLng(i+0.0025, j+0.0025)
                )
            });
            rgb_num++;
            rectangle_list.push(rectangle)
        }}
        render_boolean = false;
        rectangle_list.forEach((item) => item.addListener('click', () => 
        {
            $('#select_modal').css('display', 'block');
    
            click_list.push(item);
            window.click_list_length_substract_one = click_list.length - 1;

            console.log(rectangle_list.length);
        }
        ));
    }
    })


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

var click_limit = 0;

setInterval(() => {click_limit = 0}, 1800000);

$(document).on('click', '#green_box', function(e) {
    if(click_limit < 10){
    //fillColor: 'green' -> fillColor: 'rgb(0,' + test_num + ',255)'

    var temp_index = rectangle_list.indexOf(click_list[click_list_length_substract_one])
    var starCountRef = ref(db, '1/'+ temp_index);
    var green_boolean = true;
    onValue(starCountRef, (snapshot) => {
        if(green_boolean){
        var data = snapshot.val();

        set(ref(db, '1/' + temp_index), {
            "0": data[0],
            "1": data[1],
            "2": data[2]
        }).then(()=>{
            data[2]++;
        }).then(()=>{
            set(ref(db, '1/' + temp_index), {
                "0": data[0],
                "1": data[1],
                "2": data[2]
            })
        }).then(()=>{
            click_list[click_list_length_substract_one].setOptions( { fillColor: rgb(data)[0], fillOpacity: rgb(data)[1]});
        })
        green_boolean = false;
    }})

    console.log('1/'+ temp_index);
    click_limit++;
    console.log(click_limit);
    } else{
        alert("30분에 최대 10번까지 투표가 가능합니다.");
    }

    $('#select_modal').css('display', 'none');
});

$(document).on('click', '#yellow_box' ,function(e) {
    if(click_limit<10){
    click_list[click_list_length_substract_one].setOptions( { fillColor: 'yellow' });
    var temp_index = rectangle_list.indexOf(click_list[click_list_length_substract_one])
    var starCountRef = ref(db, '1/'+ temp_index);
    var yellow_boolean = true;
    onValue(starCountRef, (snapshot) => {
        if(yellow_boolean){
        var data = snapshot.val();

        set(ref(db, '1/' + temp_index), {
            "0": data[0],
            "1": data[1],
            "2": data[2]
        }).then(()=>{
            data[1]++;
        }).then(()=>{
            set(ref(db, '1/' + temp_index), {
                "0": data[0],
                "1": data[1],
                "2": data[2]
            })
        }).then(()=>{
            click_list[click_list_length_substract_one].setOptions( { fillColor: rgb(data)[0], fillOpacity: rgb(data)[1]});
        })
        yellow_boolean = false;
    }})

    console.log('1/'+ temp_index);
    click_limit++;
    console.log(click_limit);
    } else{
        alert("30분에 최대 10번까지 투표가 가능합니다.");
    }

    $('#select_modal').css('display', 'none');
});

$(document).on('click', '#red_box' ,function(e) {
    if(click_limit < 10){
    click_list[click_list_length_substract_one].setOptions( { fillColor: 'red' });
    var temp_index = rectangle_list.indexOf(click_list[click_list_length_substract_one])
    var starCountRef = ref(db, '1/'+ temp_index);
    var red_boolean = true;
    onValue(starCountRef, (snapshot) => {
        if(red_boolean){
        var data = snapshot.val();

        set(ref(db, '1/' + temp_index), {
            "0": data[0],
            "1": data[1],
            "2": data[2]
        }).then(()=>{
            data[0]++;
        }).then(()=>{
            set(ref(db, '1/' + temp_index), {
                "0": data[0],
                "1": data[1],
                "2": data[2]
            })
        }).then(()=>{
            click_list[click_list_length_substract_one].setOptions( { fillColor: rgb(data)[0], fillOpacity: rgb(data)[1]});
        })
        red_boolean = false;
    }})

    console.log('1/' + temp_index);  
    click_limit++;
    console.log(click_limit);
    } else{
        alert("30분에 최대 10번까지 투표가 가능합니다.");
    }

    $('#select_modal').css('display', 'none');
});

$(document).on('click', '.quit' ,function(e) {
    $('.modal').css('display', 'none');
})

$(document).on('click', '.usage' ,function(e) {
    $('#usage_modal').css('display', 'block');
})

$(document).on('click', '.contact' ,function(e) {
    $('#contact_modal').css('display', 'block');
})

$(document).on('click', '.button' ,function(e) {
    submit_feedback().then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        alert("성공적으로 전송되었습니다!")
        $('#contact_modal').css('display', 'none');
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        alert("Error")
      });;
})

function submit_feedback(){
    const feedback = document.getElementById('contact_input').value;
    const db = getFirestore();
    console.log(feedback);
    return addDoc(collection(db, "feedback"), {
        Feedback: feedback
    });
    
}

function rgb(array){
    var array_sum = array[0] + array[1] + array[2];
    if (((array[0] > array[1]) && (array[0] > array[2])) || ((array[0] == array[1]) && (array[0] > array[2]))){
        var red_prop = array[0] / array_sum;
        if (red_prop > 0.8){
            red_prop = 0.8;
        }
        return ["red", red_prop]
    } else if(((array[1] > array[0]) && (array[1] > array[2])) || ((array[0] == array[2]) && (array[0] > array[2]))){
        var yellow_prop = array[1] / array_sum;
        if (yellow_prop > 0.8){
            yellow_prop = 0.8;
        }
        return ["yellow", yellow_prop]
    } else if(((array[2] > array[0]) && (array[2] > array[1])) || ((array[1] == array[2]) && (array[2] > array[0]))){
        var green_prop = array[2] / array_sum;
        if (green_prop > 0.8){
            green_prop = 0.8;
        }
        return ["green", green_prop]        
    } else{
        return ["white", 0.35]
    }
}
