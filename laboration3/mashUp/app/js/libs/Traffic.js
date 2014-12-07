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

TRAFFIC.dom.listRenderer = (function () {

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

        var relevantArray = dataArray.map(function (message, i) {

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

        arrangeData: function (array) {

            return array.reverse().slice(0, 100);
        },

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

            var relevantArray = getRelevantArray(array);
            dataCategories.markerData = relevantArray;

        },
        getMarkerData: function () {

            return dataCategories.markerData;
        }
    };
}());

TRAFFIC.events.listenerCallbacks = (function () {

    var selectListListener = function (e) {

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
    };

    // public API
    return {
        selectListListener: function () {

            return selectListListener;
        }
    };
}());

TRAFFIC.google.events = (function () {

    // private properties. Creating elements is a one time procedure.
    var doc = document,
        unitList,
        liOrigin = doc.createElement('li'),
        aOrigin = doc.createElement('a');

    aOrigin.setAttribute('href', '');
    var li,
        a;

    // Code below is executed each time an li element is rendered.
    var renderMarkerBindedList = function (marker, bindId) {

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
            return renderMarkerBindedList(marker, bindId);
        }
    };
}());

TRAFFIC.google.maps.mapRenderer = (function () {

    // private property
    var map;

    // private methods
    function displayMap(centerCoordinate, mapOptions, mapWrapper) {

        // var accuracy = pos.coords.accuracy;
        var latlng = new google.maps.LatLng(centerCoordinate.latitude, centerCoordinate.longitude);
        map = new google.maps.Map(mapWrapper, mapOptions);
    };

    // public API
    return {
        displayGoogleMap: function (centerCoordinate, mapOptions, mapWrapper) {

            displayMap(centerCoordinate, mapOptions, mapWrapper);
        },
        getMap: function () {

            return (map instanceof google.maps.Map) ? map : null
        }
    };
}());

TRAFFIC.google.maps.markerRenderer = (function () {

    return {};
}());