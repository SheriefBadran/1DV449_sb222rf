/**
 * Created by sheriefbadran on 12/1/14.
 */
window.onload = init;

function init() {

    renderList();
    var socket = io.connect('http://localhost:8000');

    socket.on('load', function (data) {

        socket.emit('test', {my: 'sending news from client'});

        renderer.markerData = renderer.getRelevantArray(data['messages']);

        // Populate category arrays
        renderer.populateCategoryArrays(renderer.markerData);

        var selectList = document.querySelector('#select-list select');

        selectList.addEventListener('change', function (e) {

            renderer.trafficMessageList.textContent = '';

            // 1. Clear array.
            switch (e.target.options.selectedIndex) {

                case 0:
                    renderer.createMarkers(renderer.arrangeData(renderer.roadData));
                    break;
                case 1:
                    renderer.createMarkers(renderer.arrangeData(renderer.publicTransData));
                    break;
                case 2:
                    renderer.createMarkers(renderer.arrangeData(renderer.disruptionData));
                    break;
                case 3:
                    renderer.createMarkers(renderer.arrangeData(renderer.other));
                    break;
                case 4:
                    renderer.createMarkers(renderer.arrangeData(renderer.markerData));
                    break;
            }
        }, false);

        renderer.createMarkers(renderer.arrangeData(renderer.markerData));
        renderList(renderer.arrangeData(renderer.markerData));
    });


    var map;
    var renderer = {

        markers: [],
        roadData: [],
        publicTransData: [],
        disruptionData: [],
        other: [],
        markerData: [],
        trafficMessageList: document.querySelector('#traffic-message-list'),
        addMarker: function () {

        },
        createMarkers: function (markerData) {

            renderer.markers.forEach(function (marker) {
                marker.setMap(null);
            });

            var prevClickedMarker;
            var li;
            markerData.forEach(function (markerObj, i) {

                var infoMarkup = new infoWindowContent(markerObj);
                var markup = infoMarkup.getInfoMarkup();

                var markerCoordinate = new google.maps.LatLng(markerObj.latitude, markerObj.longitude);
                var marker = new google.maps.Marker({
                    position: markerCoordinate,
                    map: map,
                    title: markerObj.title,
                    infoWindow: new google.maps.InfoWindow({
                        content: markup
                    })
                });

                renderer.markers.push(marker);

                google.maps.event.addListener(marker, 'click', function () {

                    if (prevClickedMarker) {

                        prevClickedMarker.infoWindow.close();
                    }

                    map.setZoom(6);
                    map.setCenter(markerCoordinate);
                    marker.infoWindow.open(map, marker);

                    prevClickedMarker = marker;

                });
                li = renderList(marker);
                google.maps.event.addDomListener(li, 'click', function(e) {

                    // Prevent a href action to be called.
                    e.preventDefault();
                    google.maps.event.trigger(marker, 'click');
                });
            });
        },
        getRelevantArray: function (array) {

            var relevantArray = array.map(function (message, i) {

                //console.log(trafficMessage);
                return {
                    latitude: message.latitude,
                    longitude: message.longitude,
                    title: message.title,
                    description: message.description,
                    createddate: message.createddate,
                    category: message.category,
                    subcategory: message.subcategory
                };
            });

            return relevantArray;
        },
        arrangeData: function (array) {

            return array.reverse().slice(0, 100);
        },
        populateCategoryArrays: function (array) {

            array.forEach(function (trafficMessage) {

                switch (trafficMessage['category']) {
                    case 0:
                        renderer.roadData.push(trafficMessage);
                        break;
                    case 1:
                        renderer.publicTransData.push(trafficMessage);
                        break;
                    case 2:
                        renderer.disruptionData.push(trafficMessage);
                        break;
                    case 3:
                        renderer.other.push(trafficMessage);
                        break;
                    default :
                        break;
                }
            });
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


var renderList = function() {

    // Initial one time procedure
    var doc = document;
    var ul = doc.querySelector('#traffic-message-list');
    var liOrigin = doc.createElement('li');
    var aOrigin = doc.createElement('a');
    var li;
    var a;

    renderList = function(marker) {

        li = liOrigin.cloneNode(true);
        a = aOrigin.cloneNode(true);
        a.setAttribute('href', '');
        a.textContent = marker.title;
        li.appendChild(a);
        ul.appendChild(li);

        return li;
    };
};