var request = require('request');
var path = require( 'path' );
var criticalcss = require("criticalcss");
var fs = require('fs');
var tmpDir = require('os').tmpdir();

var cssUrl = 'https://world.fesgr.com/login_style_1120228047.css';
console.log(tmpDir);
var cssPath = path.join( tmpDir, 'login_style_1120228047.css' );
request(cssUrl).pipe(fs.createWriteStream(cssPath)).on('close', function() {
    criticalcss.getRules(cssPath, function(err, output) {
        if (err) {
            throw new Error(err);
        } else {
            criticalcss.findCritical("https://world.fesgr.com", { rules: JSON.parse(output) }, function(err, output) {
                if (err) {
                    throw new Error(err);
                } else {
                    console.log(output);
                }
            });
        }
    });
});
// var criticalcss = require("criticalcss");
// criticalcss.findCritical("https://world.fesgr.com/login_style_1120228047.css", function(err, output){
//     if( err ){
//         throw new Error( err );
//     } else {
//         fs.writeFileSync( 'style.css', output );
//     }
// });
// criticalcss.getRules("https://world.fesgr.com/login_style_1120228047.css", function(err, output){
//     if( err ){
//         throw new Error( err );
//     } else {
//         fs.writeFileSync( 'style.css', output );
//     }
// });
// var uncss = require('uncss');
//
// var files   = ['my', 'array', 'of', 'HTML', 'files', 'or', 'http://urls.com'],
//     options = {
//         banner       : false,
//         csspath      : '../public/css/',
//         htmlroot     : 'public',
//         ignore       : ['#added_at_runtime', /test\-[0-9]+/],
//         ignoreSheets : [/fonts.googleapis/],
//         inject       : function(window) { window.document.querySelector('html').classList.add('no-csscalc', 'csscalc'); },
//         jsdom        : {
//             userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X)',
//         },
//         media        : ['(min-width: 700px) handheld and (orientation: landscape)'],
//         raw          : 'h1 { color: green }',
//         report       : false,
//         strictSSL    : true,
//         stylesheets  : ['lib/bootstrap/dist/css/bootstrap.css', 'src/public/css/main.css'],
//         timeout      : 1000,
//         uncssrc      : '.uncssrc',
//         userAgent    : 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X)',
//     };
//
// uncss(files, options, function (error, output) {
//     console.log(output);
// });
//
// /* Look Ma, no options! */
// uncss(files, function (error, output) {
//     console.log(output);
// });
//
// /* Specifying raw HTML */
// var rawHtml = '...';
//
// uncss(rawHtml, options, function (error, output) {
//     console.log(output);
// });