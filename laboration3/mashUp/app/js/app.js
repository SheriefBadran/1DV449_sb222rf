/**
 * Created by sheriefbadran on 12/1/14.
 */
window.onload = init;

function init () {

    var socket = io.connect('http://localhost:8000');
    socket.on('news', function(data) {

        console.log(data);
        socket.emit('test', {my: 'sending news from client'});
    });


    //console.log("Hello World");
    //
    var markerData = [];
    jQuery.get( '/development', function( data, textStatus, jqXHR ) {

        markerData = data['messages'].map(function(message, i) {

            //console.log(trafficMessage);
            return {
                latitude: message.latitude,
                longitude: message.longitude,
                title: message.title,
                description: message.description,
                createddate: message.createddate
            };
        });

        console.log(markerData.reverse());
        console.log(markerData);
        renderer.markers = renderer.createMarkers(renderer.arrangeData(markerData));


    });

    var map;
    var renderer = {


        markers: [],
        addMarker: function () {

        },
        createMarkers: function (markerData) {

            markerData.forEach(function(markerObj, i) {

                var markerCoordinate = new google.maps.LatLng(markerObj.latitude, markerObj.longitude);
                var marker = new google.maps.Marker({
                    position: markerCoordinate,
                    map: map,
                    title: markerObj.title
                });

                renderer.markers.push(marker);

                google.maps.event.addListener(marker, 'click', function() {

                    map.setZoom(6);
                    map.setCenter(markerCoordinate);
                });
            });
        },
        arrangeData: function(array) {

            return array.reverse().slice(0, 100);
        }

    };


    // var accuracy = pos.coords.accuracy;
    var latlng = new google.maps.LatLng(56.66282, 16.35524);
    var mapOptions = {
        zoom: 4,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var mapHolder = document.querySelector('#map');
    map = new google.maps.Map(mapHolder, mapOptions);
}

function createMarkerArray() {

    return markerArray;
}