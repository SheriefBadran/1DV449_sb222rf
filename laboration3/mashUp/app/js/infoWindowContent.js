/**
 * Created by sheriefbadran on 12/4/14.
 */
function infoWindowContent (markerObj) {

    var title = markerObj.title == '' ? 'Titel saknas' : sanitize(markerObj.title);
    var date = new Date(markerObj.createddate);
    var description = markerObj.description == '' ? 'Beskrivning saknas.' : sanitize(markerObj.description);
    var subCategory = markerObj.subcategory == '' ? 'Underkategori saknas.' : sanitize(markerObj.subcategory);

    this.getInfoMarkup = function () {

        var HTML = "<div>";
        HTML+=  "<h4>" + title + " - " + subCategory + "</h4>";
        HTML+=  "<p>" + description + "</p>";
        HTML+=  "<p>" + sanitize(date.toLocaleDateString()) + " : " + sanitize(date.toLocaleTimeString()) + "</p>";

        return HTML;
    };

    function sanitize (string) {

        return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
}
