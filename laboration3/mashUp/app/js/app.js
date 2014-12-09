/**
 * Created by sheriefbadran on 12/1/14.
 */
window.onload = init;

function init() {
    'use strict';

    var doc = document;
    var dataHandler = TRAFFIC.data.dataHandler;
    var mapRenderer = TRAFFIC.google.maps.mapRenderer;
    var markerRenderer = TRAFFIC.google.maps.markerRenderer,

        isFirstLoad = true,
        dataCategories,

        ul = doc.querySelector('#traffic-message-list'),
        selectList = doc.querySelector('#select-list'),

        mapOptions = {
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        },

        mapHolder = document.querySelector('#map');

    mapRenderer.renderGoogleMap({latitude: 56.66282, longitude: 16.35524}, mapOptions, mapHolder);
    var map = mapRenderer.getMap();
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
            markerRenderer.clearPreviousMarkers();
            markerRenderer.bindMarkersToList(ul);

            switch (e.target.options.selectedIndex) {

                case 0:
                    markerRenderer.createMarkers(map, dataCategories.roadData, ul);
                    break;

                case 1:
                    markerRenderer.createMarkers(map, dataCategories.publicTransData, ul);
                    break;

                case 2:
                    markerRenderer.createMarkers(map, dataCategories.disruptionData, ul);
                    break;

                case 3:
                    markerRenderer.createMarkers(map, dataCategories.other, ul);
                    break;

                case 4:
                    markerRenderer.createMarkers(map, dataCategories.markerData, ul);
                    break;
            }
        }, false);

        if (isFirstLoad) {

            markerRenderer.clearPreviousMarkers();
            markerRenderer.bindMarkersToList(ul);
            markerRenderer.createMarkers(map, dataCategories.markerData, ul);
            isFirstLoad = false;
        };
    });
}