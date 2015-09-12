var cheerio = require('cheerio');
var fs = require('fs');
var config = require('./config');
var indexedFiles = require('./indexedFiles');

// remove the left column and the nav bar so that it fits dash's usually small
// browser screen
indexedFiles.forEach(function(array, index) {
    var path = __dirname + '/../Contents/Resources/Documents/' + config.name + '/docs/' + array.name + '.html';
    var src = fs.readFileSync(path, 'utf8');
    var $ = cheerio.load(src);

    var headerClasses = config.pageSubHeaders.toString();
    var $headers = $(headerClasses);

    $headers.each(function(index, elem) {
        // Grabs the text of each header in the pageSubHeaders array.
        var name = $(elem).contents().text();

        $(elem).prepend('<a name="//apple_ref/cpp/' + array.toc + '/' + encodeURIComponent(name) + '" class="dashAnchor"></a>');
        $.html();
    });

    // Removes page header
    $('.topbar').remove();
    // Removes Side Navigation
    $('nav.toc').remove();
    // Removes Edit on Github
    $('.edit-page-link').remove();
    // Sets styles to DOM elements on page to fit within Dash
    $('.container').attr('style', 'min-width:inherit;padding-top:0');
    $('.content').attr('style', 'width:inherit;');
    $('.withtoc').attr('style', 'float:none;margin:auto;');
    // Removes fontkit and google analytics
    $('head meta').nextAll('script').remove();
    $('script').last().remove();

    fs.writeFileSync(path, $.html(), 'utf8');
});