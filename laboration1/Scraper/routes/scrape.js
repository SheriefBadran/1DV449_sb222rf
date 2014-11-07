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

    var url = 'http://coursepress.lnu.se/kurser/?bpage=1';
    scrapePage(url);

});

var json = {};
function scrapePage (url) {

    request(url, function(error, response, html) {

        var data, courseName, courseUrl, urlQueryStringObject, urlQueryString;


        if (!error) {

            var $ = cheerio.load(html);

            $('.item-list li .item-title a').filter(function () {

                data = $(this);

                courseName = data.html();
                courseUrl = data.attr('href');

                //console.log('courseName: ' + courseName);

                scrapeCoursePage(courseUrl);
                function scrapeCoursePage (courseUrl) {

                    var courseName, courseCode, navSection, courseCurriculum;
                    request(courseUrl, function(error, response, html) {

                        if (!error) {

                            $ = cheerio.load(html);
                            courseName = $('#header-wrapper h1 a').text();
                            courseCode = $('#header-wrapper ul li a').last().text();
                            navSection = $('#navigation section #menu-main-nav-menu').html();
                            //console.log(navSection);

                            json[courseName] = {};

                            json[courseName].code = courseCode;
                            json[courseName].name = courseName;
                            json[courseName].url = courseUrl;

                            $('section .menu-item a').filter(function(){

                                var data = $(this);
                                if(data.text().match('Kursplan')) {

                                    var courseCurriculumLink = data.attr('href');
                                    console.log(courseCurriculumLink);
                                }
                            });
                        }
                    });
                }
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



module.exports = router;
