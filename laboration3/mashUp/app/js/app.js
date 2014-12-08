/**
 * Created by sheriefbadran on 12/1/14.
 */
window.onload = init;

function init() {

    var doc = document;
    var listHandler = TRAFFIC.dom.listRenderer;
    var dataHandler = TRAFFIC.data.dataHandler;
    var mapRenderer = TRAFFIC.google.maps.mapRenderer;
    var markerRenderer = TRAFFIC.google.maps.markerRenderer;

    var isFirstLoad = true;
    var dataCategories;
    var ul = doc.querySelector('#traffic-message-list');
    var selectList = doc.querySelector('#select-list');

    var mapOptions = {
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var mapHolder = document.querySelector('#map');
    mapRenderer.renderGoogleMap({latitude: 56.66282, longitude: 16.35524}, mapOptions, mapHolder);
    map = mapRenderer.getMap();
    //renderList();
    var socket = io.connect('http://localhost:8000');

    socket.on('load', function (data) {

        console.log(data);
        dataHandler.clearCategories();
        dataHandler.setMarkerData(data['messages']);

        var markerData = dataHandler.getMarkerData();
        dataCategories = dataHandler.populateCategoryArrays(markerData);

        selectList.addEventListener('change', function (e) {

            //renderer.trafficMessageList.textContent = '';
            var listenerHandle = markerRenderer.getListenerHandle();
            if (listenerHandle) google.maps.event.removeListener(listenerHandle);
            markerRenderer.clearMarkers();
            markerRenderer.bindMarkersToList(ul);

            // 1. Clear array.
            switch (e.target.options.selectedIndex) {

                case 0:
                    //if (renderer.listenerHandle)  google.maps.event.removeListener(renderer.listenerHandle);
                    //renderer.createMarkers(dataCategories.roadData);

                    markerRenderer.createMarkers(map, dataCategories.roadData, ul);
                    break;

                case 1:
                    //if (renderer.listenerHandle)  google.maps.event.removeListener(renderer.listenerHandle);
                    //renderer.createMarkers(dataCategories.publicTransData);

                    markerRenderer.createMarkers(map, dataCategories.publicTransData, ul);
                    break;

                case 2:
                    //if (renderer.listenerHandle)  google.maps.event.removeListener(renderer.listenerHandle);
                    //renderer.createMarkers(dataCategories.disruptionData);

                    markerRenderer.createMarkers(map, dataCategories.disruptionData, ul);
                    break;

                case 3:
                    //if (renderer.listenerHandle)  google.maps.event.removeListener(renderer.listenerHandle);
                    //renderer.createMarkers(dataCategories.other);

                    markerRenderer.createMarkers(map, dataCategories.other, ul);
                    break;

                case 4:
                    //if (renderer.listenerHandle)  google.maps.event.removeListener(renderer.listenerHandle);
                    //renderer.createMarkers(dataCategories.markerData);

                    markerRenderer.createMarkers(map, dataCategories.markerData, ul);
                    break;
            }
        }, false);

        if (isFirstLoad) {

            //renderer.createMarkers(dataCategories.markerData);
            markerRenderer.clearMarkers();
            markerRenderer.bindMarkersToList(ul);
            markerRenderer.createMarkers(map, dataCategories.markerData, ul);
            isFirstLoad = false;
        };
    });
}