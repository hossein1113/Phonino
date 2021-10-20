var request = require('request')
    , cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const fetch = require("node-fetch");
var async = require('async');
// const nightmare = require('nightmare')
const Nightmare = require('nightmare')
const nightmare = Nightmare({show: false})
for (var i = 3; i < 5; i++) {

    // const url2 = 'https://digido.ir/3-mobile#/page-2';

    var urlToCall =
        'https://www.alldigitall.ir/index.php?route=product/asearch&filtering=C&path=205&filter_att[56]=ios';
    // var urlToCall = [6,6,1];
// getDevices1 = async (url) => {
//     console.log(url);
    const selector = '.product-meta .top .name a';
//     const fetchResponse = await nightmare
//         .goto(url)
//         .wait(5000)
//         .evaluate(selector => {
//             return {
//                 nextPage: Array.from(document.querySelectorAll(selector)).map(element => element.getAttribute('href'))
//             };
//         }, selector)
//         .then(extracted => {
//             insert(extracted.nextPage,"digido")
//             console.log(extracted.nextPage); //Your extracted data from evaluate
//         });
// }

    let m = new Nightmare({
        width: 1600,
        height: 900,
        show: false,
        waitTimeout: 12000
    });

    function Iterate_Containers(count) {
        return m
            .goto(`https://www.alldigitall.ir/index.php?route=product/asearch&path=205&filtering=C&filter_att[56]=ios&page=`+count)
            .wait(5000)
            .evaluate(selector => {
                return {
                    nextPage: Array.from(document.querySelectorAll(selector)).map(element => element.getAttribute('href'))
                };
            }, selector)
            .then((extracted) => {
                insert(extracted.nextPage, "alldigital")
                console.log(extracted.nextPage); //Your extracted data from evaluate
                if (count === 1) {
                    return;
                }
                if (count < 1) {
                    return Iterate_Containers(count + 1);
                }
            });
    }

    m
        .goto(urlToCall)
        .wait(5000)
        .then(extracted => {
            // insert(extracted.nextPage, "digido")
            // console.log(extracted.nextPage); //Your extracted data from evaluate
            return Iterate_Containers(1)
        })
        .then(() => {
            return m.end(() => {
                // console.log(green(`\nSuccessfully grabbed ${chalk.bgRed.white.bold(count)} containers release information from [${chalk.bgCyan.white.bold(`HANJIN`)}] terminal.`))
            })
        })

    // var urlToCall = 'https://digido.ir/3-mobile#/page-2';
    // getDevices1 = async (url) => {
    //     console.log(url);
    //     const fetchResponse = await request23(url, 2, function (res) {
    //             var $ = cheerio.load(res,{
    //                 ignoreWhitespace: true
    //             });
    //             links1 = $('.product_img_link'); //use your CSS selector here
    //             alert = $('#layered_ajax_loader').css('display');
    //             console.log($(links1[0]).attr('href'));
    //             var all_link = [];
    //             // for(var i=0;i<links1.length;i++){
    //                 // all_link.push($(links1[i]).attr('href'))
    //             // }
    //     });
    // }
    function request23(url, type, callback) {
        request(url, function (err, resp, body) {
            if (!err && resp.statusCode == 200) {
                // console.log(type);
                if (type === 1) {
                    return callback(JSON.parse(body.toString()));
                } else {
                    var delayInMilliseconds = 10000; //1 second
                    setTimeout(function () {
                        return callback(body.toString());
                    }, delayInMilliseconds);
                }
            } else {
                console.log(err);
            }
        });
    }

    // getDevices1(urlToCall);
}
var url = 'mongodb://127.0.0.1:27017/test_fesphone';

function insert(insert_data, name_shop) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var count1;
        var digido = [];
        var alldigital = [];
        if (name_shop === 'digido') {
            digido = insert_data;
            var dbo = db.db('test_fesphone');
            let coll = dbo.collection('all_links_with_shop');
            var field_name = "digido";
            var update = {"$addToSet": {}}
            update["$addToSet"][field_name] = {'$each': digido}
            coll.updateOne({}, update, {upsert: false}, function (err, res) {
                if (err) throw err;
                console.log('pir');
            });
        }else if(name_shop === 'alldigital'){
            alldigital = insert_data;
            var dbo = db.db('test_fesphone');
            let coll = dbo.collection('all_links_with_shop');
            var field_name = "alldigital";
            var update = {"$addToSet": {}}
            update["$addToSet"][field_name] = {'$each': alldigital}
            coll.updateOne({}, update, {upsert: false}, function (err, res) {
                if (err) throw err;
                console.log('pir');
            });
        }

    });
}
