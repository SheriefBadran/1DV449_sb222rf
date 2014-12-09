/**
 * Created by sheriefbadran on 12/6/14.
 * The name of the global namespace object is TRAFFIC.
 */

var TRAFFIC = TRAFFIC || {};

TRAFFIC.namespace = function (ns_string) {

    var parts = ns_string.split('.'),
        parent = TRAFFIC,
        i;

    if (parts[0] === "TRAFFIC") {

        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i += 1) {

        if (typeof parent[parts[i]] === "undefined") {

            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

TRAFFIC.namespace('dom.listRenderer');
TRAFFIC.namespace('events.listenerCallbacks');
TRAFFIC.namespace('google.events');
TRAFFIC.namespace('data.dataHandler');
TRAFFIC.namespace('google.maps.markerRenderer');
TRAFFIC.namespace('google.maps.mapRenderer');
TRAFFIC.namespace('google.maps.infoWindowContent');

TRAFFIC.dom.listRenderer = (function () {
    'use strict';

    // private properties. Creating elements is a one time procedure.
    var doc = document,
        unitList,
        liOrigin = doc.createElement('li'),
        aOrigin = doc.createElement('a');
    aOrigin.setAttribute('href', '');

    var li,
        a;

    var renderMarkerBindedListItems = function (marker, bindId) {

        li = liOrigin.cloneNode(true);
        a = aOrigin.cloneNode(true);
        a.setAttribute('id', bindId);
        a.textContent = marker.title;
        li.appendChild(a);
        unitList.appendChild(li);

        return li;
    };

    // public API
    return {
        renderMarkerBindedListItems: function (ul, marker, bindId) {

            unitList = ul;
            return renderMarkerBindedListItems(marker, bindId);
        }
    };
}());

TRAFFIC.data.dataHandler = (function () {
    'use strict';

    var dataCategories = {
        markers: [],
        roadData: [],
        publicTransData: [],
        disruptionData: [],
        other: [],
        markerData: []
    };

    function cleanArrayFromMultiples(array) {

        var seen = {};
        return array.filter(function(item) {

            return seen.hasOwnProperty(item.title) ? false : (seen[item.title] = true);
        });
    }

    // Private method.
    var getRelevantArray = function (dataArray) {



        dataArray.forEach(function(message) {

            message.createddate = parseInt(message.createddate.replace("/Date(", "").replace(")/", ""), 10);
        });

        dataArray.sort(function(objA, objB) {

            return (objB.createddate - objA.createddate);
        });

        dataArray = cleanArrayFromMultiples(dataArray);

        dataArray = dataArray.slice(0, 100);

        return dataArray.map(function (message) {

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
    };

    var categorize = function (array) {

        array.forEach(function (trafficMessage) {

            switch (trafficMessage['category']) {
                case 0:
                    dataCategories.roadData.push(trafficMessage);
                    break;
                case 1:
                    dataCategories.publicTransData.push(trafficMessage);
                    break;
                case 2:
                    dataCategories.disruptionData.push(trafficMessage);
                    break;
                case 3:
                    dataCategories.other.push(trafficMessage);
                    break;
                default :
                    break;
            }
        });

        return dataCategories
    };

    var clearCategories = function () {

        dataCategories.markers = [];
        dataCategories.roadData = [];
        dataCategories.publicTransData = [];
        dataCategories.disruptionData = [];
        dataCategories.other = [];
        dataCategories.makerData = [];
    };

    // public API
    return {

        populateCategoryArrays: function (array) {

            return categorize(array);
        },

        clearCategories: function () {

            clearCategories();
        },

        setMarkerData: function (array) {

            if (!array.length) {

                throw {errMsg: 'markerData has to be an array.'};
            }

            dataCategories.markerData = getRelevantArray(array);

        },
        getMarkerData: function () {

            return dataCategories.markerData;
        }
    };
}());

TRAFFIC.google.maps.mapRenderer = (function () {
    'use strict';

    var map;
    // private methods
    function renderMap(centerCoordinate, mapOptions, mapWrapper) {

        mapOptions.center = new google.maps.LatLng(centerCoordinate.latitude, centerCoordinate.longitude);
        map = new google.maps.Map(mapWrapper, mapOptions);
    };

    // public API
    return {
        renderGoogleMap: function (centerCoordinate, mapOptions, mapWrapper) {

            renderMap(centerCoordinate, mapOptions, mapWrapper);
        },
        getMap: function () {

            return (map instanceof google.maps.Map) ? map : null
        }
    };
}());

TRAFFIC.google.maps.infoWindowContent = (function () {

    var sanitize = function (string) {

        return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };

   return {

       getInfoMarkup: function (markerObj) {

           var title = markerObj.title == '' ? 'Titel saknas' : sanitize(markerObj.title);
           var date = new Date(markerObj.createddate);
           var description = markerObj.description == '' ? 'Beskrivning saknas.' : sanitize(markerObj.description);
           var subCategory = markerObj.subcategory == '' ? 'Underkategori saknas.' : sanitize(markerObj.subcategory);

           var HTML = "<div>";
           HTML+=  "<h4>" + title + " - " + subCategory + "</h4>";
           HTML+=  "<p>" + description + "</p>";
           HTML+=  "<p>" + sanitize(date.toLocaleDateString()) + " : " + sanitize(date.toLocaleTimeString()) + "</p>";

           return HTML;
       }
   };
}());

TRAFFIC.google.maps.markerRenderer = (function () {
    'use strict';

    // Dependencies
    var listHandler = TRAFFIC.dom.listRenderer;
    var infoMarkup = TRAFFIC.google.maps.infoWindowContent;

    var renderer = {

        markers: [],
        trafficMessageList: document.querySelector('#traffic-message-list'),
        listenerHandle: null
    };

    var prevClickedMarker;

    var listMarkerEventCallback = function(e) {

        // Prevent a href action to be called.
        e.preventDefault();
        var target = e.target,
            nodeName = target.nodeName.toLowerCase();

        if (nodeName !== 'a') {

            return;
        }

        var marker = renderer.markers[target.id].marker;
        google.maps.event.trigger(marker, 'click');
    };

    var clearMarkers = function () {

        renderer.markers.forEach(function (listMarkerObj) {

            listMarkerObj.marker.setMap(null);
        });
        renderer.markers = [];
    };

    var bindMarkersToList = function (ul) {

        renderer.listenerHandle = google.maps.event.addDomListener(ul, 'click', listMarkerEventCallback);
    };

    var createMarkers = function (map, markerData, ul) {

        // Clear list before new rendering of new list and markers.
        ul.textContent = '';
        markerData.forEach(function (markerObj, i) {
            
            var markup = infoMarkup.getInfoMarkup(markerObj);

            var markerCoordinate = new google.maps.LatLng(markerObj.latitude, markerObj.longitude);
            var marker = new google.maps.Marker({
                position: markerCoordinate,
                map: map,
                title: markerObj.title,
                infoWindow: new google.maps.InfoWindow({
                    content: markup
                })
            });

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
    };
    return {
        getListenerHandle: function () {

            return renderer.listenerHandle;
        },

        clearPreviousMarkers: function () {

            clearMarkers();
        },

        bindMarkersToList: function (ul) {

            bindMarkersToList(ul);
        },

        createMarkers: function (map, markerData, ul) {

            createMarkers(map, markerData, ul);
        }
    };
}());