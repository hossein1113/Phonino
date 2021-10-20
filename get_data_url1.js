var request = require('request'), cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var async = require('async');
// const nightmare = require('nightmare')
var Nightmare = require('nightmare');
process.env.TZ = 'Asia/Tehran';
// const nightmare = Nightmare({show: false})
// for (var i = 3; i < 5; i++) {
// const url2 = 'https://digido.ir/3-mobile#/page-2';
// const urlToCall : Array<string> = ['https://digido.ir/3-mobile#/page-3',
//     'https://www.alldigitall.ir/index.php?route=product/asearch&filtering=C&path=205&filter_att[56]=Android',
//     'https://www.alldigitall.ir/index.php?route=product/asearch&filtering=C&path=205&filter_att[56]=ios',
//     `https://www.digikala.com/search/category-mobile-phone/?pageno=2`,
//     `https://www.technolife.ir/product/list/69_25/%D8%AA%D9%85%D8%A7%D9%85-%DA%AF%D9%88%D8%B4%DB%8C-%D9%87%D8%A7?page=1`
// ];
var urlToCall_to_get_up_page_one = ["https://digido.ir/3-mobile#/page-", "https://www.alldigitall.ir/index.php?route=product/asearch&path=205&filtering=C&filter_att[56]=android&page=", "https://www.alldigitall.ir/index.php?route=product/asearch&path=205&filtering=C&filter_att[56]=ios&page=", "https://www.digikala.com/search/category-mobile-phone/?pageno=", "https://www.technolife.ir/product/list/69_25/%D8%AA%D9%85%D8%A7%D9%85-%DA%AF%D9%88%D8%B4%DB%8C-%D9%87%D8%A7?page="
];
var counter_up_page = [6, 6, 1, 6, 6];
var string_to_call = ['digido', 'alldigital', 'alldigital', 'digikala', 'technolife'];
var counter = 0;
// getDevices1 = async (url) => {
//     console.log(url);
var selector = ['.product_img_link', '.product-meta .top .name a',
    '.product-meta .top .name a',
    '.c-product-box__content .c-product-box__content--row .c-product-box__title .js-product-url',
    '.product-item .product-image'];
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
function Iterate_Containers(count) {
    // console.log('sdsd');
    var m = new Nightmare({
        width: 1600,
        height: 900,
        show: false,
        waitTimeout: 40000
    });
    m.goto(urlToCall_to_get_up_page_one[counter] + count)
        .evaluate(function (selector) {
        return {
            nextPage: Array.from(document.querySelectorAll(selector)).map(function (element) { return element.getAttribute('href'); })
        };
    }, selector[counter])
        .then(function (extracted) {
        insert(extracted.nextPage, string_to_call[counter]);
        console.log(extracted.nextPage); //Your extracted data from evaluate
        if (counter === 4 && count === counter_up_page[counter]) {
            console.log(counter);
            console.log('the end');
            m.end();
            return;
        }
        if (count < counter_up_page[counter]) {
            console.log(counter);
            return Iterate_Containers(count + 1);
        }
        if (count === counter_up_page[counter]) {
            console.log(counter);
            counter = counter + 1;
            return Iterate_Containers(1);
        }
    })["catch"](function (err) {
        console.log(err);
        Iterate_Containers(count);
    });
}
//setInterval(function () { // Set interval for checking
//  var date = new Date(); // Create a Date object to find out what time it is
//  console.log(date.getMonth() + ' ' + date.getDay());
// console.log(date.getHours() + ' ' + date.getMinutes());
//    if (date.getHours() === 14 && date.getMinutes() === 46) {
Iterate_Containers(1);
//  }
//}, 60000);
// console.log('sd');
// m
//     .goto(urlToCall[counter])
//     .wait(5000)
//     .then(extracted => {
//         insert(extracted.nextPage, "digido")
//         console.log(extracted.nextPage); //Your extracted data from evaluate
// Iterate_Containers(1);
// })
// .then(() => {
// return m.end(() => {
//     console.log('sds');
//     console./log(green(`\nSuccessfully grabbed ${chalk.bgRed.white.bold(count)} containers release information from [${chalk.bgCyan.white.bold(`HANJIN`)}] terminal.`))
// })
// })
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
// function request23(url, type, callback) {
//     request(url, function (err, resp, body) {
//         if (!err && resp.statusCode == 200) {
//             // console.log(type);
//             if (type === 1) {
//                 return callback(JSON.parse(body.toString()));
//             } else {
//                 const delayInMilliseconds = 10000; //1 second
//                 setTimeout(function () {
//                     return callback(body.toString());
//                 }, delayInMilliseconds);
//             }
//         } else {
//             console.log(err);
//         }
//     });
// }
// getDevices1(urlToCall);
// }
var url = 'mongodb://127.0.0.1:27017/test_fesphone';
function insert(insert_data, name_shop) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err)
            throw err;
        var AllMarketDataInsert = [];
        var DbName = "test_fesphone";
        var dboName = db.db(DbName);
        var CollName = dboName.collection('all_links_with_shop');
        var UpdaterCommand = { "$addToSet": {} };
        if (name_shop === 'digido') {
            AllMarketDataInsert = insert_data;
            var FieldNameDigido = "digido";
            UpdaterCommand["$addToSet"][FieldNameDigido] = { '$each': AllMarketDataInsert };
        }
        else if (name_shop === 'alldigital') {
            AllMarketDataInsert = insert_data;
            var field_nameDigido = "alldigital";
            UpdaterCommand["$addToSet"][field_nameDigido] = { '$each': AllMarketDataInsert };
        }
        else if (name_shop === 'digikala') {
            AllMarketDataInsert = insert_data;
            var field_nameDigikala = "digikala";
            UpdaterCommand["$addToSet"][field_nameDigikala] = { '$each': AllMarketDataInsert };
        }
        else if (name_shop === 'technolife') {
            AllMarketDataInsert = insert_data;
            var field_name = "technolife";
            UpdaterCommand["$addToSet"][field_name] = { '$each': AllMarketDataInsert };
        }
        CollName.updateOne({}, UpdaterCommand, { upsert: false }, function (err) {
            if (err)
                throw err;
            console.log('pir');
        });
    });
}
