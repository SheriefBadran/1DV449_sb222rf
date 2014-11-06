/**
 * Created by sheriefbadran on 11/5/14.
 */
var express = require('express');
var request = require('request');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

var router = express.Router();


/* GET users listing. */

router.get('/', function(req, res) {

    // moved

    var url = 'http://coursepress.lnu.se/kurser/?bpage=1';
    scrapePage(url);

});

function scrapePage (url) {


    request(url, function(error, response, html) {

        var data, courseName, courseUrl, urlQueryStringObject, urlQueryString;

        var json = {
            courseName: "",
            courseUrl: "",
            preamble: ""
        };

        if (!error) {

            var $ = cheerio.load(html);
            var urlParts = url.split("?");
            url = urlParts[0];

            $('.item-list li .item-title a').filter(function () {

                data = $(this);

                courseName = data.html();
                courseUrl = data.attr('href');

                json.courseName = courseName;
                json.courseUrl = courseUrl;
                console.log('courseName: ' + courseName);
                // console.log('courseUrls: ' + courseUrl);
                // console.log(json);

                //var makeCourseRequest = getCoursePreamble(courseUrl);
                //json.preamble = makeCourseRequest();
                //console.log(json.preamble);
            });

            urlQueryStringObject = $('#pag-top .next');
            urlQueryString = urlQueryStringObject.attr('href');
            var rootUrl = 'http://coursepress.lnu.se';
            url = rootUrl + urlQueryString;


            if (urlQueryStringObject.length > 0) {


                repeatPageScrape(url);
            }
        }
    });
}

function repeatPageScrape (url) {


    scrapePage(url);
}

//function getCoursePreamble (url) {
//
//    function makeRequest () {
//
//        request(url, function(error, response, html) {
//
//            // Handle different cases dependeing on the last split of url.
//            console.log(url);
//            if (!error) {
//
//                var $ = cheerio.load(html);
//                var preambleSelector = $('.entry-content p').text();
//            }
//        });
//
//        return preambleSelector;
//    }
//
//    return makeRequest;
//}



module.exports = router;
