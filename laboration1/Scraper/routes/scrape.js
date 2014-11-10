/**
 * Created by sheriefbadran on 11/5/14.
 */
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var app = express();

var router = express.Router();


/* GET users listing. */

router.get('/', function(req, res) {

    var url = 'http://coursepress.lnu.se/kurser/?bpage=1';

    fs.readFile('lnu.json', function (err, data) {

        // This method will be sent as a callback.
        var printToBrowser = function (data) {

            res.write(data);
        };

        if (!data) {

            scrapePage(url, printToBrowser);
            return;
        }

        var date = new Date().getTime();
        var content = JSON.parse(data);
        if (date - content.timeStamp > 20000) {

            console.log('omskrapning');
            scrapePage(url, printToBrowser);
        }
        else {

            console.log('not rescrape');
            res.write(data);
        }
    });
});

var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();
var hour = date.getMinutes();
var minutes = date.getMinutes();
var seconds = date.getSeconds();

var scrapeDate = year+'-'+month+'-'+day+' '+hour+':'+minutes;

var json = {};
var hrefCount = 0;
json.scrapeDate = scrapeDate;

function scrapePage (url, callback) {

    request(url, function(error, response, html) {

        var data, courseName, courseUrl, urlQueryStringObject, urlQueryString;


        if (!error) {

            var $ = cheerio.load(html);

            $('.item-list li .item-title a').filter(function () {

                data = $(this);

                courseName = data.html();
                courseUrl = data.attr('href');

                //console.log('courseName: ' + courseName);
                if (courseUrl.split('/')[3] === "kurs") {

                    scrapeCoursePage(courseUrl);
                }

                function scrapeCoursePage (courseUrl) {

                    console.log(courseUrl);
                    var courseName, courseCode, navSection, preamble, latestPost, latestPostDate;

                    var requestObj = {
                        url: courseUrl,
                        headers: {
                            'User-Agent': 'Sherief Badran'
                        }
                    };

                    hrefCount++;

                    request(requestObj, function(error, response, html) {

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

                                    var courseCurriculumUrl = data.attr('href');
                                    //console.log(courseCurriculumUrl);
                                    json[courseName].curriculumUrl = courseCurriculumUrl;
                                }
                            });

                            preamble = $('.entry-content p').text();
                            json[courseName].preamble = preamble;

                            latestPost = $('#latest-post').parent().next().html();
                            var latestPostTitle = $('.entry-header .entry-title').text();
                            var latestPostAuthor = $('.entry-header .entry-byline strong').first().text();
                            var latestPostText = $('.entry-header .entry-byline').first().text();

                            var result = latestPostText.match(/(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})/);

                            if (result === null) {

                                latestPostDate = 'no data';
                            }
                            else {

                                latestPostDate = result[0];
                            }

                            latestPostAuthor = checkData(latestPostAuthor);

                            json[courseName].latestPost = {

                                title: latestPostTitle,
                                author: latestPostAuthor,
                                date: latestPostDate
                            };

                            var timestamp = new Date().getTime();
                            json.timeStamp = timestamp;
                        }


                    });
                }
            });

            urlQueryStringObject = $('#pag-top .next');
            urlQueryString = urlQueryStringObject.attr('href');
            var rootUrl = 'http://coursepress.lnu.se';
            url = rootUrl + urlQueryString;


            if (urlQueryStringObject.length > 0) {

                scrapePage(url, callback);
            }
            else {

                json.count = Object.keys(json).length;

                var interval = setInterval(writeToFile, 3000);
                function writeToFile () {

                    console.log(json.count);
                    console.log(hrefCount);
                    console.log(Object.keys(json).length);

                    if (hrefCount !== Object.keys(json).length - 2) {

                        return;
                    }

                    var jsonString = JSON.stringify(json, null, 4);

                    fs.writeFile('lnu.json', jsonString, function(err){

                        if(!err) {

                            callback(jsonString);
                            console.log('SUCCESS');
                        }
                    });
                    clearInterval(interval);
                }
            }
        }
    });
}


function checkData (string) {

    if (string === '') {

        string = 'no data';
    }

    return string;
}

module.exports = router;

