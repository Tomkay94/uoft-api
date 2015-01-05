const
    cheerio           = require('cheerio')
  , request           = require('request')
  , rootURL           = 'http://www.artsandscience.utoronto.ca'
  , courseRootURL     = '/ofr/timetable/winter'
  , courseListingsURL = '/sponsors.htm';

/*
----------------------------------------
Function: getProgramURL
----------------------------------------
Returns a string of the course listing URL link.
----------------------------------------
Example Usage Calls
----------------------------------------
getProgramURL('csc, function(err, courseURL) {
  console.log(courseURL);
});

'csc.html'
----------------------------------------
Number of Requests
----------------------------------------
Min: 1 (parses the listings page)
Max: 1 (parses the listings page)
*/

exports.getProgramURL = function(course, callback) {
  request(rootURL + courseRootURL + courseListingsURL, function(error, response, body) {

    // Scrape the course URLs from the main course listings page
    if(!error && response.statusCode == 200) {

      // Load the response body into Cheerio for DOM manipulation
      var $            = cheerio.load(body);
      var webPageRegex = new RegExp('[A-Za-z]\.html');

      // Grab the course links from the program bullet points
      $('li a', '#content').each(function(foundLink) {
        var currentLink = $(this);
        // Every course link has its course code
        if (webPageRegex.test(currentLink.attr('href').toString()) &&
          currentLink.text().toString().indexOf('[' + course.toUpperCase() + ' courses') > -1) {
            callback(null, currentLink.attr('href').toString());
            return;
        };
      });
    };
  });
};

/*
----------------------------------------
Function: getProgramURLs
----------------------------------------
Returns a json object, containing all Arts and Science department URLs.
----------------------------------------
Example Usage Calls
----------------------------------------
getProgramURLs(function(urls) {
console.log(urls);
});

[ { courseURL: 'asabs.html' },
{ courseURL: 'ana.html' },
...
{ courseURL: 'wdw.html' },
{ courseURL: 'wgsi.html' } ]

----------------------------------------
Number of Requests
----------------------------------------
Min: 1 (parses the listings page)
Max: 1 (parses the listings page)

*/
exports.getProgramURLs = function(callback) {
  request(rootURL + courseRootURL + courseListingsURL, function(error, response, body) {

    // Scrape the course URLs from the main course listings page
    if(!error && response.statusCode == 200) {

      // Load the response body into Cheerio for DOM manipulation
      var $            = cheerio.load(body);
      var urls         = []; // Store all program listing URLs
      var webPageRegex = new RegExp('[A-Za-z]\.html');

      // Grab the course links from the program bullet points
      $('li a', '#content').each(function(foundLink) {
        var currentLink = $(this).attr('href').toString();
        if (webPageRegex.test(currentLink)) {
          urls.push(currentLink);
        };
      });
    };
    callback(null, urls);
  });
};
