var request = require('request')
    , cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const fetch = require("node-fetch");
var async = require('async');
// ['Huawei P30 Lite','Samsung Galaxy A02s','Samsung Galaxy A12','Huawei Y8s' , 'Huawei Nova 7i' ,'Huawei Y6p','Samsung Galaxy A11','Samsung Galaxy S20 FE'
// ,'Samsung Galaxy Note20 Ultra' , 'Samsung Galaxy A01 Core' , 'Samsung Galaxy A21s' , 'Samsung Galaxy M11', 'Samsung Galaxy A31' , 'Samsung Galaxy A10s']
function get_all(callback) {
    var url = 'mongodb://127.0.0.1:27017/test_fesphone';
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var count1;
        var dbo = db.db('test_fesphone');
        let coll = dbo.collection('myColl');
        coll.find(
        {title: {$in: ['Apple iPhone SE (2020)']}},
            {'projection': {'_id': 0, 'data.memory.internal': 1, title: 1}}
        ).toArray(function (err, result) {
            if (err) throw err;
            return callback(result);
        });
    });
}

var result;
var array;
get_all(function (data) {
    // console.log(data[0].title);
    getDevices = async () => {
        // console.log(internal);
        // console.log(ram);
        // const location = window.location.hostname;
        const settings = {
            method: 'POST',
        };
        // try {
        ''
        var s = 'موبایل';
        // var urlToCall = 'https://www.googleapis.com/customsearch/v1/?key=AIzaSyD88TFM54-qQUwbWkS0nQ1CR46YUDlisPo&cx=55e64898a5d0fd5bd&q=' + title + ' ' + internal + 'GB' + ' ' + ram + 'GB Ram';
        var urlToCall = 'https://www.googleapis.com/customsearch/v1/siterestrict?key=AIzaSyD88TFM54-qQUwbWkS0nQ1CR46YUDlisPo&cx=55e64898a5d0fd5bd&q=' + encodeURI(s);
        await request23(urlToCall, 1, function (res) {
            for (var tot = 0; tot < 1; tot++) {
                array = [...data[tot].data.memory.internal.matchAll('[1-9]+(GB) [1-9]+(GB RAM)')];
                var title = data[tot].title + ' ';
                title = title.replace('(','').replace(')','');
                var title_orig = data[tot].title;
                // console.log(title);
                var array_internal = [];
                var array_ram = [];
                var array_ire = [];
                for (var b = 0; b < array.length; b++) {
                    array_internal.push(array[b][0].substring(0, array[b][0].indexOf('GB')));
                    array_ram.push(array[b][0].substring(array[b][0].indexOf('GB ') + 3, array[b][0].indexOf('GB', array[b][0].indexOf('GB ') + 1)));
                }
                // console.log(array_internal[0]);
                // console.log(array_ram[0]);
                for (var tot1 = 0; tot1 < array.length; tot1++) {
                    //         console.log (array[tot1][0]);
                    var internal = array[tot1][0].substring(0, array[tot1][0].indexOf('GB'));
                    var ram = array[tot1][0].substring(array[tot1][0].indexOf('GB ') + 3, array[tot1][0].indexOf('GB', array[tot1][0].indexOf('GB ') + 1));

                    // var urlToCall = 'https://world.fesgr.com/';

                    var result;
                    // console.log(title +' '+internal+'GB'+' '+ram+'GB Ram');
                    for (var j = 0; j < res.items.length; j++) {
                        if (res.items[j].pagemap.hproduct) {
                            for (var i = 0; i < res.items[j].pagemap.hproduct.length; i++) {
                                // console.log(res.items[j].pagemap.hproduct[i].fn);
                                // if(res.items[j].pagemap.hproduct[i].fn.includes('Huawei P30 Lite')){
                                //     console.log(res.items[j].pagemap.hproduct[i].fn);
                                //     console.log(internal + 'GB');
                                //     console.log(ram + 'GB');
                                //     // console.log(title);
                                // }
                                if ((res.items[j].pagemap.hproduct[i].fn.toString().toLowerCase().includes(title.toLowerCase()) && res.items[j].pagemap.hproduct[i].fn.toString().includes(internal + 'GB') && res.items[j].pagemap.hproduct[i].fn.toString().includes(ram + 'GB RAM')) ||
                                    ((res.items[j].pagemap.hproduct[i].fn.toString().toLowerCase().includes(title.toLowerCase())) && res.items[j].pagemap.hproduct[i].fn.toString().includes(internal + 'GB') && !res.items[j].pagemap.hproduct[i].fn.toString().includes('RAM'))) {
                                    // console.log(res.items[j].pagemap.hproduct[i].url);
                                    // array_ire.
                                    result = res.items[j].pagemap.hproduct[i].url;

                                    if (!array_ire.includes(res.items[j].pagemap.hproduct[i].fn.toString())) {
                                        if (result) {
                                            getDevices1 = async (title, internal, ram, result, array_ire, fn, array_internal, array_ram, title_orig) => {
                                                await request23(result, 2, function (res) {
                                                    for (var f = 0; f < array_internal.length; f++) {
                                                        var check_ram = false;
                                                        var check_internal = false;
                                                        var $ = cheerio.load(res);
                                                        links = $('td'); //use your CSS selector here
                                                        $(links).each(function (i, link) {
                                                            // console.log($(link).text().substring(0, $(link).text().indexOf('GB')));
                                                            if ($(link).text() === 'حافظه داخلی') {
                                                                // console.log(array_internal[f] + 'GB');
                                                                if ($(link).next().text() === array_internal[f] + 'GB') {
                                                                    // console.log($(link).next().text());

                                                                    check_internal = true;
                                                                }
                                                            }
                                                            if ($(link).text() === 'حافظه رم') {
                                                                // console.log($(link).next().text());
                                                                // console.log(array_ram[f] + 'GB');
                                                                if ($(link).next().text() === array_ram[f] + 'GB') {
                                                                    // console.log($(link).next().text());
                                                                    check_ram = true;
                                                                }
                                                            }
                                                        });
                                                        // console.log(check_ram);
                                                        // console.log(check_internal);
                                                        var gr;
                                                        if (check_ram && check_internal) {
                                                            links1 = $('.option-price'); //use your CSS selector here
                                                            var choose_unit;
                                                            if (links1) {
                                                                links2 = $('.option-oldprice'); //use your CSS selector here
                                                                links3 = $('.option-name');
                                                                var json_make = '{';
                                                                if($(links1[0]).text().includes('تومان')){
                                                                    choose_unit = 'تومان';
                                                                }else{
                                                                    choose_unit = 'ریال';
                                                                }
                                                                for(var i=0;i<links1.length;i++){
                                                                    // json_make += '{';
                                                                    var bef_price;
                                                                    // if($(links2[i]).text()){
                                                                    //     bef_price = $(links2[i]).text();
                                                                    // }else {
                                                                    //     bef_price = '""';
                                                                    // }

                                                                    json_make += '"gr' + (i) + '":{' +
                                                                        '"price" : "' + $(links1[i]).text().replace(' تومان','').replaceAll(',','') +'"'+
                                                                        ',"bef_price" :"' + $(links2[i]).text().replace(' تومان','').replaceAll(',','') + '"'+
                                                                        ',"color" :"' + $(links3[i]).text().substring(0, $(links3[i]).text().indexOf('-')) +'"'+
                                                                        ',"garanti" :"' + $(links3[i]).text().substring($(links3[i]).text().indexOf('-') + 1) +'"'+
                                                                        '}';
                                                                    if(i < links1.length - 1){
                                                                        json_make += ','
                                                                    }
                                                                    // console.log(title_orig + ',internal: ' + array_internal[f] + ' Ram: ' + array_ram[f] + ' price: ' + $(links1[i]).text());
                                                                    // console.log(title_orig + ',internal: ' + array_internal[f] + ' Ram: ' + array_ram[f] + ' bef price: ' + $(links2[i]).text());
                                                                    // console.log(title_orig + ',internal: ' + array_internal[f] + ' Ram: ' + array_ram[f] + ' bef price: ' +
                                                                    //     $(links3[i]).text().substring(0, $(links3[i]).text().indexOf('-')) + ' color: ' + $(links3[i]).text().substring($(links3[i]).text().indexOf('-') + 1));
                                                                }

                                                                json_make += '}';

                                                                insert(f,title_orig,array_ram[f],array_internal[f],result,JSON.parse(json_make),choose_unit);
                                                                // console.log(JSON.parse(json_make));

                                                            } else {
                                                                insert(f,title_orig,array_ram[f],array_internal[f],result,JSON.parse('{}'),choose_unit);
                                                                console.log('do not import gheimat!!!');
                                                            }

                                                        } else {
                                                            // console.log('not exist level 2');
                                                        }
                                                    }
                                                });
                                            }
                                            array_ire.push(res.items[j].pagemap.hproduct[i].fn.toString());
                                            // console.log(array_ire+ ' ds');
                                            getDevices1(title, internal, ram, result, array_ire, res.items[j].pagemap.hproduct[i].fn.toString(), array_internal, array_ram, title_orig);
                                        } else {
                                            console.log('not exist');
                                        }
                                    } else {
                                        console.log(array_ire);
                                    }
                                }
                            }
                        }
                    }

                    // console.log(result);

                    // if (res) {
                    //     console.log(res.queries.request[0].title);
                    // for (var j = 0; j < res.items.length; j++) {
                    //     if (res.items[j].pagemap.hproduct) {
                    //         for (var i = 0; i < res.items[j].pagemap.hproduct.length; i++) {
                    //             if ((res.items[j].pagemap.hproduct[i].fn.includes(title) && res.items[j].pagemap.hproduct[i].fn.includes(internal + 'GB') && res.items[j].pagemap.hproduct[i].fn.includes(ram + 'GB')) ||
                    //                 (res.items[j].pagemap.hproduct[i].fn.includes(title)) && res.items[j].pagemap.hproduct[i].fn.includes(internal + 'GB')) {
                    //                 result = res.items[j].pagemap.hproduct[i].url;
                    //                 // console.log(queries.request.totalResults);
                    //             }
                    //         }
                    //     }
                    // }
                    // }
                    // });
                    // } catch (e) {
                    //     console.log(e);
                    // });
                }
                // getDevices(internal, ram, title);
                // console.log(internal + 'GB');
                // console.log(ram + 'GB');
                // var urlToCall = ['https://www.googleapis.com/customsearch/v1/siterestrict?key=AIzaSyD88TFM54-qQUwbWkS0nQ1CR46YUDlisPo&cx=55e64898a5d0fd5bd&q=' + title + ' ' + array[tot1][0]];
                // async.mapLimit(urls, 5, async function(url) {
                //     const response = await fetch(url)
                //     return response.body
                // }, (err, results) => {
                //     if (err) throw err
                //     // results is now an array of the response bodies
                //     console.log(results)
                // })
                // console.log(urlToCall);
                // request23(urlToCall, 1, function (res) {
                // if (res) {

                //     } else {
                //         console.log('hich');
                //     }
                // });
            }
        });
    }
    getDevices();
// }
});

function request23(url, type, callback) {
    request(url, function (err, resp, body) {
        if (!err && resp.statusCode == 200) {
            // console.log(type);
            if (type === 1) {
                return callback(JSON.parse(body.toString()));
            } else {
                return callback(body.toString());
            }
        } else {
            console.log(err);
        }
    });
}

function googledata(callback) {
    getDevices2 = async () => {
        var urlToCall = 'https://www.googleapis.com/customsearch/v1/siterestrict/?key=AIzaSyD88TFM54-qQUwbWkS0nQ1CR46YUDlisPo&cx=55e64898a5d0fd5bd&q=موبایل';
        const fetchResponse = await request23(urlToCall, 1, function (res) {
            return callback;
        });
    }
}

function insert(i, title, ram, internal, link, garanti_color,choose_unit) {

    var model = ['model1', 'model2', 'model3', 'model4', 'model5', 'model6', 'model7', 'model8', 'model9', 'model10'];
    var timeInMss = Date.now();

    // var tot =
    //     '{'+name_coll + ': {' +
    //     '"ram": "' + ram + '",'
    //     + '"intenal" :"' + internal + '",' +
    //     '"link":"' + link + '",' +
    //     '"date_modif":"' + timeInMss + '"' +
    //     '}}'
    var url = 'mongodb://127.0.0.1:27017/test_fesphone';
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var count1;
        var dbo = db.db('test_fesphone');
        let coll = dbo.collection('myColl');
        // console.log(title);
        // var name_coll = '"price.alldigital.' + model[i - 1]+'"';
        // var t = name_coll;
        // console.log(model[i - 1]);
        var field_name = "price.alldigital." + model[i];
        var update = { "$set" : { } }
        update["$set"][field_name] = {ram,internal,link,timeInMss,choose_unit,garanti_color}
        coll.updateOne(
            {"title": title}, update, {upsert: true}
            ,
            function (err, res) {
                if (err) {
                    throw err;
                    console.log(err);
                    // socket.emit('search_edit_title_only_back', 'خطا')
                } else {
                    console.log('piroozi');
                    // socket.emit('search_edit_title_only_back', 'با موفقیت اصلاح شد حتما چک کنید');
                }
                db.close();
            });
    });
}
// function insert(i, title, ram, internal, link, gr, price, bef_price) {
//     var model = ['model1', 'model2', 'model3', 'model4', 'model5', 'model6', 'model7', 'model8', 'model9', 'model10'];
//     var timeInMss = Date.now();
//     var name_coll = '"price.alldigital.' + model[i - 1] + '"';
//     var tot =
//         '{'+name_coll + ': {' +
//         '"ram": "' + ram + '",'
//         + '"intenal" :"' + internal + '",' +
//         '"link":"' + link + '",' +
//         '"date_modif":"' + timeInMss + '"' +
//         '}}'
//     console.log(JSON.parse(tot));
//     var final_tot=JSON.parse(tot);
//     var url = 'mongodb://127.0.0.1:27017/test_fesphone';
//     MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
//         if (err) throw err;
//         var count1;
//         var dbo = db.db('test_fesphone');
//         let coll = dbo.collection('Employee');
//         // console.log(title);
//         coll.updateOne(
//             {"title": title}, {
//                 $set: {
//                     final_tot,
//                     gr
//                 }
//             }, {upsert: true}
//             ,
//             function (err, res) {
//                 if (err) {
//                     throw err;
//                     console.log(err);
//                     // socket.emit('search_edit_title_only_back', 'خطا')
//                 } else {
//                     console.log('piroozi');
//                     // socket.emit('search_edit_title_only_back', 'با موفقیت اصلاح شد حتما چک کنید');
//                 }
//                 db.close();
//             });
//     });
// }
// modify url price  per price title model
