/**
 * Created by sheriefbadran on 12/1/14.
 */
window.onload = init;

function init() {

    var doc = document;
    var listHandler = TRAFFIC.dom.listRenderer;
    var dataHandler = TRAFFIC.data.dataHandler;

    var isFirstLoad = true;
    var dataCategories;
    var ul = doc.querySelector('#traffic-message-list');
    var selectList = doc.querySelector('#select-list select');
    //renderList();
    var socket = io.connect('http://localhost:8000');

    socket.on('load', function (data) {

        console.log(data);
        dataHandler.clearCategories();
        dataHandler.setMarkerData(data['messages']);

        var makerData = dataHandler.getMarkerData();
        dataCategories = dataHandler.populateCategoryArrays(makerData);

        selectList.addEventListener('change', function (e) {

            renderer.trafficMessageList.textContent = '';

            // 1. Clear array.
            switch (e.target.options.selectedIndex) {

                case 0:
                    //google.maps.event.removeDomListener(ul, 'click', listMarkerEventCallback);
                    if (renderer.listenerHandle)  google.maps.event.removeListener(renderer.listenerHandle);
                    renderer.createMarkers(dataHandler.arrangeData(dataCategories.roadData));
                    break;

                case 1:
                    if (renderer.listenerHandle)  google.maps.event.removeListener(renderer.listenerHandle);
                    renderer.createMarkers(dataHandler.arrangeData(dataCategories.publicTransData));
                    break;

                case 2:
                    if (renderer.listenerHandle)  google.maps.event.removeListener(renderer.listenerHandle);
                    renderer.createMarkers(dataHandler.arrangeData(dataCategories.disruptionData));
                    break;

                case 3:
                    if (renderer.listenerHandle)  google.maps.event.removeListener(renderer.listenerHandle);
                    renderer.createMarkers(dataHandler.arrangeData(dataCategories.other));
                    break;

                case 4:
                    if (renderer.listenerHandle)  google.maps.event.removeListener(renderer.listenerHandle);
                    renderer.createMarkers(dataHandler.arrangeData(dataCategories.markerData));
                    break;
            }
        }, false);

        if (isFirstLoad) {

            renderer.createMarkers(dataHandler.arrangeData(dataCategories.markerData));
            isFirstLoad = false;
        };
    });


    var map;
    var renderer = {

        markers: [],
        trafficMessageList: document.querySelector('#traffic-message-list'),
        listenerHandle: null,

        createMarkers: function (markerData) {

            // Clear markers - break out.
            renderer.markers.forEach(function (listMarkerObj) {
                listMarkerObj.marker.setMap(null);
            });
            renderer.markers = [];

            renderer.listenerHandle = google.maps.event.addDomListener(ul, 'click', listMarkerEventCallback);

            var prevClickedMarker;
            var li;
            markerData.forEach(function (markerObj, i) {

// Break out the creation part - START HERE
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
// CREATION ENDS HERE

                //var li = renderList(marker, i);
                var li = listHandler.renderMarkerBindedListItems(ul, marker, i);


                var listMarkerObj = {
                    marker: marker,
                    li: li
                };
                renderer.markers.push(listMarkerObj);

                google.maps.event.addListener(marker, 'click', function () {

                    if (prevClickedMarker) {

                        prevClickedMarker.infoWindow.close();
                    }

                    map.setZoom(6);
                    map.setCenter(markerCoordinate);
                    marker.infoWindow.open(map, marker);

                    prevClickedMarker = marker;

                });
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

    var listMarkerEventCallback = function(e) {

        // Prevent a href action to be called.
        e.preventDefault();
        var target = e.target,
            nodeName = target.nodeName.toLocaleLowerCase();

        if (nodeName !== 'a') {

            return;
        };

        var marker = renderer.markers[target.id].marker;
        google.maps.event.trigger(marker, 'click');
        //google.maps.event.trigger(marker, 'click');
    };
}