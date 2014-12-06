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
TRAFFIC.namespace('google.events');

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

TRAFFIC.google.events = (function () {

    // private properties. Creating elements is a one time procedure.
    var doc = document,
        unitList,
        liOrigin = doc.createElement('li'),
        aOrigin = doc.createElement('a');
    aOrigin.setAttribute('href', '');

    var li,
        a;

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