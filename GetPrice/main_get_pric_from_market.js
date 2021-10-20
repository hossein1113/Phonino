var request = require('request')
    , cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
// const fetch = require("node-fetch");
// var async = require('async');
var fs = require('fs');
var Moment = require('moment-timezone');
const Agenda = require('agenda');
process.env.TZ = 'Asia/Tehran'
// const https = require('https');
var url = 'mongodb://127.0.0.1:27017/test_xc';
// var url1 = 'mongodb://127.0.0.1:27017/test_fesphone';
const agenda = new Agenda({db: {address: url, options: {useUnifiedTopology: true, useNewUrlParser: true}}});
(async function () {
    // IIFE to give access to async/await

    agenda.processEvery("1 seconds");
    agenda.maxConcurrency(1);
    agenda.defaultConcurrency(1);
    agenda.lockLimit(1);
    agenda.defaultLockLimit(1);
    // await agenda.every("1 seconds", "aggregate");
    agenda.on("complete", async (job) => {
        // console.log(err);
        try {
            await job.disable();
            // await agenda.purge();
            await job.remove();
            await job.save;
            console.log('Successfully removed job from collection');
        } catch (e) {
            console.error('Error removing job from collection');
        }
        console.log(`Job ${job.attrs.name} finished`);
    });
    agenda.on("fail", async (err, job) => {
        console.log(err);
        try {
            await job.disable();
            // await agenda.purge();
            await job.remove();
            console.log('Successfully removed job from collection');
        } catch (e) {
            console.error('Error removing job from collection');
        }
        console.log(`Job failed with error: ${err.message}`);
    });
    agenda.on("start", (job) => {
        console.log("Job %s starting", job.attrs.name);
    });
    await agenda.start();
})();


function get_all_url(callback) {
    var url = 'mongodb://127.0.0.1:27017/test_fesphone';
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var count1;
        var dbo = db.db('test_fesphone');
        let coll = dbo.collection('all_links_with_shop');
        coll.find(
            {}
        ).toArray(function (err, result) {
            if (err) throw err;
            return callback(result);
        });
    });
}

function timer(ms) {
    return new Promise(res => setTimeout(res, ms));
}

async function task() { // 3
    await timer(2000);
    // console.log(`Task ${i} done!`);
}

function get_all(callback) {
    var url = 'mongodb://127.0.0.1:27017/test_fesphone';
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var count1;
        var dbo = db.db('test_fesphone');
        let coll = dbo.collection('myColl');
        coll.find(
            {},
            {'projection': {'_id': 0, 'data.memory.internal': 1, title: 1}}
        ).toArray(function (err, result) {
            if (err) throw err;
            return callback(result);
        });
    });
}

var tr1 = 0;

function request23(url, done, type, callback) {

    var options = {
        url: url,
        timeout: 40000
    }
    request(options, function (err, resp, body) {
        console.log('dobare');
        if (!err && resp.statusCode == 200) {
            if (type === 1) {
                this.end();
                return callback(JSON.parse(body.toString()));
            } else {
                this.end();
                return callback(body.toString());
            }
        } else {
            console.log(tr1);
            console.log(err);
            if (tr1 < 2) {
                // console.log('oomad');
                console.log(url, done, type);
                tr1++;
                this.end();
                request23(url, done, type, callback);

            } else {
                done();
                tr1 = 0;
            }
        }
    });
}

setInterval(function () { // Set interval for checking
    var date = new Date(); // Create a Date object to find out what time it is
    console.log(date.getMonth() + ' ' + date.getDay());
    console.log(date.getHours() + ' ' + date.getMinutes());
    if (date.getHours() === 15 && date.getMinutes() === 39) {
        get_all(function (data) {
            // for (var shop_count = 0; shop_count < 2; shop_count++) {
            // console.log(shop[shop_count]);
            get_all_url(function (res) {
                // var shop = ['alldigital'];
                var shop = ['digido', 'alldigital', 'digikala'];
                // var shop = ['digido'];
                for (var shop_count = 0; shop_count < shop.length; shop_count++) {
                    // console.log(res[0].digido.length);
                    // console.log(res[0].alldigital.length);
                    var len_os;
                    if (shop[shop_count] === 'alldigital') {
                        len_os = res[0].alldigital.length;
                    } else if (shop[shop_count] === 'digido') {
                        len_os = res[0].digido.length;
                    } else {
                        len_os = res[0].digikala.length;
                    }
                    console.log(len_os);
                    for (var h1 = 0; h1 < len_os; h1++) {
                        if (shop[shop_count] === 'digido') {
                            agenda.define('digido', async (job, done) => {
                                // getDevices1 = async (url12, h1) => {
                                try {
                                    const fetchResponse = await request23(job.attrs.data.url, done, 2, function (res) {
                                        console.log('digido : ' + job.attrs.data.h1);
                                        var $ = cheerio.load(res);
                                        ram_internal = $('#short_description_block div h2'); //use your CSS selector here
                                        // var color21 = $('#color_to_pick_list li a .color-n'); //use your CSS selector here
                                        if (ram_internal.length <= 0) {
                                            ram_internal = $('#short_description_block div p');
                                        }
                                        var color21 = $('#color_to_pick_list li a .color-n'); //use your CSS selector here
                                        $('fieldset label').each(function (i, link) {
                                            if ($(link).text() === 'رنگ ') {
                                                color21 = $($(link).parent()).find('#color_to_pick_list li a .color-n');
                                            }
                                        });

                                        price = $('td div .badge-info'); //use your CSS selector here
                                        garan = $('.radio_label'); //use your CSS selector here
                                        selected = $('#color_to_pick_list .selected'); //use your CSS selector here
                                        var count1 = $("#color_to_pick_list li");


                                        // var count3 = $("#product-sellers-table comb-name");
                                        var sort_price = []
                                        var sort_color = []
                                        var sort_garan = []


                                        var table = $(".table-striped tbody");
                                        // $($(".table-striped tbody")).each(function (i, link) {
                                        for (var i = 0; i < table.length; i++) {
                                            // console.log($(table[i]).find('tr').length);
                                            if ($(table[i]).find('tr').length === 1) {
                                                var link = $('.comb-name')[i];
                                                // $($(".comb-name")).each(function (i, link) {
                                                sort_color.push($(link).text().substring($(link).text().indexOf('رنگ:') + 5, $(link).text().indexOf(' - ')));
                                                if ($(link).text().indexOf(' - ', $(link).text().indexOf('گارانتی:') + 1) !== -1) {
                                                    sort_garan.push($(link).text().substring($(link).text().indexOf('گارانتی:') + 9, $(link).text().indexOf(' - ', $(link).text().indexOf('گارانتی:') + 1)));
                                                } else {
                                                    sort_garan.push($(link).text().substring($(link).text().indexOf('گارانتی:') + 9));
                                                }
                                                if ($($($($(link).parent()).parent()).find('td div .badge-info')).text().replace(' تومان', '').replaceAll(',', '').replaceAll(' ', '') !== 'بهزودی' &&
                                                    $($($($(link).parent()).parent()).find('td div .badge-info')).text().replaceAll(',', '').replaceAll(' ', '').includes('تومان')) {
                                                    sort_price.push(parseInt($($($($(link).parent()).parent()).find('td div .badge-info')).text().replace(' تومان', '').replaceAll(',', '').replaceAll(' ', '')));
                                                }
                                                // });
                                            } else {
                                                var link = $('.comb-name')[i];
                                                var row = $(table[i]).find('tr');
                                                for (var j = 0; j < $(table[i]).find('tr').length; j++) {
                                                    sort_color.push($(link).text().substring($(link).text().indexOf('رنگ:') + 5, $(link).text().indexOf(' - ')));
                                                    if ($(link).text().indexOf(' - ', $(link).text().indexOf('گارانتی:') + 1) !== -1) {
                                                        sort_garan.push($(link).text().substring($(link).text().indexOf('گارانتی:') + 9, $(link).text().indexOf(' - ', $(link).text().indexOf('گارانتی:') + 1)));
                                                    } else {
                                                        sort_garan.push($(link).text().substring($(link).text().indexOf('گارانتی:') + 9));
                                                    }
                                                    if (($((row)[j]).find('td div .badge-info')).text().replace(' تومان', '').replaceAll(',', '').replaceAll(' ', '') !== 'بهزودی' &&
                                                        ($((row)[j]).find('td div .badge-info')).text().replaceAll(',', '').replaceAll(' ', '').includes('تومان')) {
                                                        sort_price.push(parseInt(($((row)[j]).find('td div .badge-info')).text().replace(' تومان', '').replaceAll(',', '').replaceAll(' ', '')));
                                                    }
                                                }
                                                // console.log('sdsd');
                                            }
                                        }


                                        child_index = $(selected).index();
                                        var array_title = [];
                                        var array_title_on = [];
                                        array_title = $(ram_internal[0]).text().match('[0-9]+(GB RAM|gb ram|TB RAM) [0-9]+(GB|gb|mb|MB)');
                                        array_title_on = $(ram_internal[0]).text().match('[0-9]+(GB|TB|MB)');
                                        internal_ram = $('.kfafeaturespro-feature-name'); //use your CSS selector here
                                        var title_site;
                                        if (array_title === null) {
                                            array_title = [];
                                        }
                                        if (array_title_on === null) {
                                            array_title_on = [];
                                        }
                                        // console.log($(ram_internal[0]).text());
                                        if ($(ram_internal[0]).text().toLowerCase().includes('dual sim')) {
                                            title_site = $(ram_internal[0]).text().substring(0, $(ram_internal[0]).text().toLowerCase().indexOf('dual sim') - 1);
                                        } else if ($(ram_internal[0]).text().toLowerCase().includes('dual sim')) {
                                            title_site = $(ram_internal[0]).text().substring(0, $(ram_internal[0]).text().toLowerCase().indexOf('dual sim') - 1);
                                        } else if ($(ram_internal[0]).text().includes(array_title[0])) {
                                            title_site = $(ram_internal[0]).text().substring(0, $(ram_internal[0]).text().indexOf(array_title[0]) - 1);
                                        } else if ($(ram_internal[0]).text().includes(array_title_on[0])) {
                                            title_site = $(ram_internal[0]).text().substring(0, $(ram_internal[0]).text().indexOf(array_title_on[0]) - 1);
                                        } else if ($(ram_internal[0]).text().toLowerCase().includes(' mobile phone')) {
                                            title_site = $(ram_internal[0]).text().substring(0, $(ram_internal[0]).text().toLowerCase().indexOf(' mobile phone'));
                                        }
                                        if (title_site !== undefined) {
                                            var internal_site;
                                            var ram_site;
                                            $(internal_ram).each(function (i, link) {
                                                if ($(link).text() === ' حافظه داخلی') {
                                                    array_internal = $(link).next().text().match('[0-9]+');
                                                    // internal_site = array_internal[0];
                                                    if ($(link).next().text().includes('ترابایت')) {
                                                        internal_site = (parseFloat(array_internal[0]) * 1000).toString();
                                                    } else {
                                                        internal_site = array_internal[0];
                                                        // ram_site = parseFloat(array_ram[0]) / 1000;
                                                    }
                                                    // console.log(internal_site);
                                                }
                                                if ($(link).text() === ' مقدار RAM') {
                                                    array_ram = $(link).next().text().match('[0-9]+');
                                                    if ($(link).next().text().includes('مگابایت')) {
                                                        ram_site = (parseFloat(array_ram[0]) / 1000).toString();
                                                    } else {
                                                        ram_site = array_ram[0];
                                                        // ram_site = parseFloat(array_ram[0]) / 1000;
                                                    }

                                                    // console.log(ram_site);
                                                }
                                            });
                                            if (ram_site === undefined || ram_site === null) {
                                                var ram = $("#short_description_content ul li");
                                                for (var i = 0; i < $(ram).length; i++) {
                                                    if ($(ram[i]).text().includes('مقدار رم')) {
                                                        if (ram.length > 0 && title_site.toLowerCase().includes('samsung galaxy') && $(ram[i]).text().match('[0-9]+ (گیگابایت|مگابایت)') !== null) {
                                                            ram_site = $(ram[i]).text().match('[0-9]+ (گیگابایت|مگابایت)')[0].match('[0-9]+')[0];
                                                            if ($(ram[i]).text().includes('مگابایت')) {
                                                                ram_site = (parseFloat(ram_site) / 1000).toString();
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            if (internal_site === undefined || internal_site === null) {
                                                var internal = $("#short_description_content ul li");
                                                for (var i = 0; i < $(internal).length; i++) {
                                                    if ($(internal[i]).text().includes('حافظه داخلی')) {
                                                        if (internal.length > 0 && title_site.toLowerCase().includes('samsung galaxy') && $(internal[i]).text().match('[0-9]+ (گیگابایت|ترابایت)') !== null) {
                                                            internal_site = $(internal[i]).text().match('[0-9]+ (گیگابایت|ترابایت)')[0].match('[0-9]+')[0];
                                                            if ($(internal[i]).text().includes('ترابایت')) {
                                                                internal_site = (internal_site * 1000).toString();

                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            for (var i = 0; ; i++) {
                                                if (title_site[0] === ' ') {
                                                    title_site = title_site.replace(' ', '');
                                                } else if (title_site[0] === ' ') {
                                                    title_site = title_site.replace(' ', '');
                                                } else {
                                                    break;
                                                }
                                            }

                                            title_site = title_site.replaceAll(" ", " ");
                                            title_site = title_site.replaceAll(" ", " ");
                                            title_site = title_site.replaceAll("  ", " ");
                                            title_site = title_site.replace('(', '').replace(')', '');
                                            // if(title_site[title_site.length - 1] === ''){
                                            //
                                            // }
                                            // console.log('vorud');
                                            title_site = title_site.replaceAll("  ", " ");
                                            if (title_site.toLowerCase().includes('samsung galaxy')) {
                                                title_site = title_site.toLowerCase().replace("note ", "note");
                                            }
                                            if (title_site.toLowerCase().includes('xiaomi poco f2 pro 5g')) {
                                                title_site = title_site.toLowerCase().replace(" 5g", "");
                                            }
                                            if (title_site.toLowerCase().includes('apple iphone 10 x')) {
                                                title_site = title_site.toLowerCase().replace(" 10 ", " ");
                                            }
                                            if (title_site.toLowerCase() === 'huawei mate20 pro') {
                                                title_site = title_site.toLowerCase().replace("mate", "mate ");
                                            }
                                            if (title_site.toLowerCase() === 'huawei mate 30 pro 5g') {
                                                title_site = title_site.toLowerCase().replace(" 5g", "");
                                            }
                                            if (title_site.toLowerCase() === 'samsung galaxy j1 ace 3g') {
                                                title_site = title_site.toLowerCase().replace(" 3g", "");
                                            }
                                            if (title_site.toLowerCase() === 'huawei nate 30 pro') {
                                                title_site = title_site.toLowerCase().replace("huawei", "");
                                            }
                                            if (title_site.toLowerCase() === 'honor 8a') {
                                                title_site = title_site.toLowerCase().replace("8a", "8a pro");
                                            }
                                            console.log(title_site.toLowerCase());
                                            dance:
                                                for (var tot = 0; tot < data.length; tot++) {
                                                    // console.log(data[tot].title);
                                                    array = [...data[tot].data.memory.internal.matchAll('\\d{1,4}(\\.\\d{1,4})?(GB) \\d{1,4}(\\.\\d{1,4})?(GB RAM)')];
                                                    var title_orig = data[tot].title;
                                                    var title = data[tot].title;
                                                    var title1 = data[tot].title;
                                                    title = title.replace('(', '').replace(')', '').replace('+', ' plus');
                                                    title1 = title.replace('(', '').replace(')', '').replace('plus', '+');
                                                    // console.log(title.toLowerCase());
                                                    for (var b = 0; b < array.length; b++) {
                                                        var check_ram = false;
                                                        var check_internal = false;
                                                        // console.log(array[b][0]);
                                                        var internal1 = array[b][0].match('\\d{1,4}(\\.\\d{1,4})?(GB)')[0];
                                                        // console.log(internal1);
                                                        var internal = internal1.match('\\d{1,4}(\\.\\d{1,4})?');
                                                        // var ram = array[b][0].substring(array[b][0].indexOf(internal1+' ') + 5, array[b][0].indexOf('GB', array[b][0].indexOf(internal1+' ') + 1));
                                                        var ram = array[b][0].match('\\d{1,4}(\\.\\d{1,4})?(GB RAM|MB RAM)')[0].match('\\d{1,4}(\\.\\d{1,4})?')[0];

                                                        if (internal_site === internal[0]) {
                                                            check_internal = true;
                                                        }
                                                        if (ram_site === ram) {
                                                            check_ram = true;
                                                        }
                                                        // if (title.toLowerCase() === 'oneplus 6t mcLaren') {
                                                        //     console.log(title_site);
                                                        //     console.log(title);
                                                        //     console.log(internal[0]);
                                                        //     console.log(ram);
                                                        //     console.log(title.toLowerCase() === title_site.toLowerCase());
                                                        //     console.log(check_internal);
                                                        //     console.log(check_ram);
                                                        //     console.log(ram_site);
                                                        //     console.log(internal_site);
                                                        // }
                                                        if (check_internal && check_ram && (title.toLowerCase() === title_site.toLowerCase() || title1.toLowerCase() === title_site.toLowerCase())) {
                                                            // console.log(sort_price);
                                                            if (price.length > 0 && sort_price.length > 0) {
                                                                var choose_unit;
                                                                if ($(price[0]).text().includes('تومان')) {
                                                                    choose_unit = 'تومان';
                                                                } else {
                                                                    choose_unit = 'ریال';
                                                                }
                                                                // var sort_price = []
                                                                // for (var p = 0; p < price.length; p++) {
                                                                //     sort_price.push(parseInt($(price[p]).text().replace(' تومان', '').replaceAll(',', '').replaceAll(' ', '')));
                                                                // }
                                                                // if (child_index === count1.length - 1) {
                                                                //     sort_price.sort(function (a, b) {
                                                                //         return a - b
                                                                //     });
                                                                // }else{
                                                                //     sort_price.sort(function (a, b) {
                                                                //         return b - a
                                                                //     });
                                                                // }
                                                                var json_make = '{';
                                                                for (var k = 0; k < price.length; k++) {
                                                                    // console.log($(color21[color21.length - k - 1]).text() + ' price: ' + sort_price[k]);
                                                                    json_make += '"gr' + (k) + '":{' +
                                                                        '"price" : "' + sort_price[k] + '"' +
                                                                        ',"bef_price" :"' + '' + '"' +
                                                                        ',"color" :"' + sort_color[k] + '"' +
                                                                        ',"garanti" :"' + sort_garan[k] + '"' +
                                                                        '}';
                                                                    if (k < price.length - 1) {
                                                                        json_make += ','
                                                                    }
                                                                }

                                                                json_make += '}';
                                                                console.log(JSON.parse(json_make));
                                                                // console.log('digido');
                                                                insert(b, title_orig, ram, internal[0], job.attrs.data.url, JSON.parse(json_make), choose_unit, 'digido');
                                                                done();
                                                                // console.log('dorost');
                                                                break dance;
                                                            } else {
                                                                console.log('nadarad');
                                                                // var date = new Date();
                                                                // var current_hour = date.getUTCDate();
                                                                // fs.appendFile('/home/admin/domains/world.iran33.ir/shop/digido' + current_hour + '.txt', '\n' + title_site + ' (empty price)', function (err, data) {
                                                                //     if (err) {
                                                                //         return console.log(err);
                                                                //     }
                                                                // });
                                                                // console.log('digido');
                                                                insert(b, title_orig, ram, internal[0], job.attrs.data.url, JSON.parse('{}'), choose_unit, 'digido');
                                                                done();
                                                                break dance;
                                                            }
                                                        }
                                                    }
                                                    if (tot === data.length - 1) {
                                                        // console.log('lala');
                                                        // var timeInMss = Date(year);
                                                        var date = new Date();
                                                        // var current_hour = date.getDay();
                                                        var current_hour = date.getUTCDate();
                                                        // console.log('/home/admin/domains/world.iran33.ir/shop/digido' + current_hour + '.txt');
                                                        fs.appendFile('/home/admin/domains/world.iran33.ir/shop/digido' + current_hour + '.txt', '\n' + title_site + ':  ' + job.attrs.data.url, function (err, data) {
                                                            if (err) {
                                                                return console.log(err);
                                                            }
                                                        });
                                                        done();
                                                    }
                                                }
                                        } else {
                                            var date = new Date();
                                            var current_hour = date.getUTCDate();
                                            fs.appendFile('/home/admin/domains/world.iran33.ir/shop/digido' + current_hour + '.txt', '\n' + job.attrs.data.url, function (err, data) {
                                                if (err) {
                                                    return console.log(err);
                                                }
                                            });
                                            done();
                                        }
                                    });
                                } catch (e) {
                                    console.log(e)
                                }
                                // }
                            });
                            // getDevices1(encodeURI(res[0].digido[h1]));
                            // setTimeout(function() {

                            // }, 1500 * h1);
                            // async function start(res, h1) {
                            // await new Promise(resolve => setTimeout(resolve, 5000 * h1));
                            // console.log('yes');
                            agenda.schedule(new Date(Date.now() + 1000), 'digido', {
                                'h1': h1,
                                'url': encodeURI(res[0].digido[h1])
                                // 'url': 'https://dig'
                            });
                            // getDevices1('https://digido.ir/samsung-phone/1359-%DA%AF%D9%88%D8%B4%DB%8C-%D9%85%D9%88%D8%A8%D8%A7%DB%8C%D9%84-%D8%B3%D8%A7%D9%85%D8%B3%D9%88%D9%86%DA%AF-%D9%85%D8%AF%D9%84-%DA%AF%D9%84%DA%A9%D8%B3%DB%8C-%D8%A7%D8%B3-10-%D9%BE%D9%84%D8%A7%D8%B3-%D8%A8%D8%A7-%D8%B8%D8%B1%D9%81%DB%8C%D8%AA-1-%D8%AA%D8%B1%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA-%D8%AF%D9%88-%D8%B3%DB%8C%D9%85-%DA%A9%D8%A7%D8%B1%D8%AA-samsung-galaxy-s10-plus-1tb-dualsim.html?search_query=samsung+galaxy+s10+plus&results=641', h1);
                            // }

                            // start(res, h1);
                            // getDevices1('https://digido.ir/samsung-phone/724-%DA%AF%D9%88%D8%B4%DB%8C-%D9%85%D9%88%D8%A8%D8%A7%DB%8C%D9%84-%D8%B3%D8%A7%D9%85%D8%B3%D9%88%D9%86%DA%AF-%D9%85%D8%AF%D9%84-galaxy-note8-sm-n950fd-%D8%A8%D8%A7-%D8%B8%D8%B1%D9%81%DB%8C%D8%AA-256-%DA%AF%DB%8C%DA%AF%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA.html',h1);

                        } else if (shop[shop_count] === 'alldigital') {
                            agenda.define('alldigital', async (job, done) => {
                                // getDevices2 = async (url12, h1) => {
                                try {
                                    // await task();
                                    const fetchResponse = await request23(job.attrs.data.url, done, 2, function (res) {
                                        console.log('alldigital : ' + job.attrs.data.h1);
                                        var $ = cheerio.load(res);
                                        ram_internal = $('.panel-heading h1'); //use your CSS selector here
                                        // console.log($(ram_internal).text());
                                        // var color21 = $('#color_to_pick_list li a .color-n'); //use your CSS selector here
                                        // if(ram_internal.length <= 0){
                                        //     ram_internal = $('#short_description_block div p');
                                        // }
                                        // var color21 = $('#color_to_pick_list li a .color-n'); //use your CSS selector here
                                        // $('fieldset label').each(function (i, link) {
                                        //     if ($(link).text() === 'رنگ ') {
                                        //         color21 = $($(link).parent()).find('#color_to_pick_list li a .color-n');
                                        //     }
                                        // });

                                        price = $('.option-price'); //use your CSS selector here
                                        garan_color = $('.option-name'); //use your CSS selector here
                                        // selected = $('#color_to_pick_list .selected'); //use your CSS selector here
                                        // var count1 = $("#color_to_pick_list li");


                                        // var count3 = $("#product-sellers-table comb-name");
                                        var sort_price = []
                                        var sort_color = []
                                        var sort_garan = []
                                        // $($(".option-price")).each(function (i, link) {
                                        // console.log($(link).text());
                                        for (var count_price_ga = 0; count_price_ga < price.length; count_price_ga++) {
                                            sort_color.push($(garan_color[count_price_ga]).text().substring(0, $(garan_color[count_price_ga]).text().indexOf('-')));
                                            // if ($(link).text().indexOf(' - ', $(link).text().indexOf('گارانتی:') + 1) !== -1) {
                                            sort_garan.push($(garan_color[count_price_ga]).text().substring($(garan_color[count_price_ga]).text().indexOf('-') + 1));
                                            // console.log($(link).text().substring($(link).text().indexOf('گارانتی:') + 9, $(link).text().indexOf(' - ',$(link).text().indexOf('گارانتی:') + 1)));
                                            // } else {
                                            //     sort_garan.push($(link).text().substring($(link).text().indexOf('گارانتی:') + 9));
                                            //     console.log($(link).text().substring($(link).text().indexOf('گارانتی:') + 9));
                                            // }

                                            sort_price.push($(price[count_price_ga]).text().replace(' تومان', '').replaceAll(',', '').replaceAll(' ', ''));
                                        }
                                        // });


                                        // child_index = $(selected).index();
                                        var array_title = [];
                                        var array_title_on = [];
                                        array_title = $(ram_internal[0]).text().match('([0-9]+(GB|gb|TB)- [0-9]+(GB RAM|GB Ram))|([0-9]+(GB -)[0-9]+(GB Ram|GB RAM))');
                                        array_title_on = $(ram_internal[0]).text().match('[0-9]+(GB|TB|MB)');
                                        // internal_ram = $('.kfafeaturespro-feature-name'); //use your CSS selector here
                                        var title_site;
                                        if (array_title === null) {
                                            array_title = [];
                                        }
                                        if (array_title_on === null) {
                                            array_title_on = [];
                                        }
                                        // console.log($(ram_internal[0]).text());
                                        if ($(ram_internal[0]).text().toLowerCase().includes('dual sim')) {
                                            title_site = $(ram_internal[0]).text().substring(0, $(ram_internal[0]).text().toLowerCase().indexOf('dual sim') - 1);
                                        } else if ($(ram_internal[0]).text().toLowerCase().includes('dual')) {
                                            title_site = $(ram_internal[0]).text().substring(0, $(ram_internal[0]).text().toLowerCase().indexOf('dual') - 1);
                                        } else if ($(ram_internal[0]).text().includes(array_title[0])) {
                                            title_site = $(ram_internal[0]).text().substring(0, $(ram_internal[0]).text().indexOf(array_title[0]) - 1);
                                        } else if ($(ram_internal[0]).text().includes(array_title_on[0])) {
                                            title_site = $(ram_internal[0]).text().substring(0, $(ram_internal[0]).text().indexOf(array_title_on[0]) - 1);
                                        } else if ($(ram_internal[0]).text().toLowerCase().includes(' mobile phone')) {
                                            title_site = $(ram_internal[0]).text().substring(0, $(ram_internal[0]).text().toLowerCase().indexOf(' mobile phone'));
                                        }
                                        if (title_site !== undefined) {
                                            var internal_site;
                                            var ram_site;
                                            $('td').each(function (i, link) {
                                                if ($(link).text() === 'حافظه داخلی') {
                                                    array_internal = $(link).next().text().match('[1-9]+');
                                                    internal_site = array_internal[0];
                                                    // console.log(internal_site);
                                                }
                                                if ($(link).text() === 'حافظه رم') {
                                                    array_ram = $(link).next().text().match('[1-9]+');
                                                    ram_site = array_ram[0];
                                                    // console.log(ram_site);
                                                }
                                            });
                                            // console.log(title_site.toLowerCase());
                                            for (var i = 0; ; i++) {
                                                if (title_site[0] === ' ') {
                                                    title_site = title_site.replace(' ', '');
                                                } else if (title_site[0] === ' ') {
                                                    title_site = title_site.replace(' ', '');
                                                } else {
                                                    break;
                                                }
                                            }
                                            title_site = title_site.replaceAll(" ", " ");
                                            title_site = title_site.replaceAll(" ", " ");
                                            title_site = title_site.replaceAll("  ", " ");
                                            title_site = title_site.replace('(', '').replace(')', '');
                                            // if(title_site[title_site.length - 1] === ''){
                                            //
                                            // }
                                            // console.log('vorud');
                                            title_site = title_site.replaceAll("  ", " ");
                                            title_site = title_site.toLowerCase().replace(" lte", "");
                                            if (title_site.toLowerCase().includes('samsung galaxy')) {
                                                title_site = title_site.toLowerCase().replace("note ", "note").replace(' plus', '+');
                                            }
                                            if (title_site.toLowerCase().includes('xiaomi poco f2 pro 5g')) {
                                                title_site = title_site.toLowerCase().replace(" 5g", "");
                                            }
                                            if (title_site.toLowerCase().includes('huawei y6 prime 2019')) {
                                                title_site = title_site.replace(" y6 prime 2019", " y6 2019");
                                            }
                                            if (title_site.toLowerCase().includes('nokia 8.1')) {
                                                title_site = title_site.replace("nokia 8.1", "nokia 8.1 (nokia x7)");
                                            }
                                            if (title_site.toLowerCase().includes('honor 8a')) {
                                                title_site = title_site.replace("honor 8a", "honor 8a 2020");
                                            }
                                            if (title_site.toLowerCase().includes('huawei y5 lite')) {
                                                title_site = title_site.replace("huawei y5 lite", "huawei y5 lite 2018");
                                            }
                                            // if(title_site.toLowerCase().includes(' lte')){

                                            // }
                                            console.log(title_site.toLowerCase());
                                            dance:
                                                for (var tot = 0; tot < data.length; tot++) {
                                                    // console.log(data[tot].title);
                                                    array = [...data[tot].data.memory.internal.matchAll('[1-9]+(GB|TB) [1-9]+(GB RAM|MB RAM)')];
                                                    var title_orig = data[tot].title;
                                                    var title = data[tot].title;
                                                    title = title.replace('(', '').replace(')', '');
                                                    // console.log(title.toLowerCase());
                                                    for (var b = 0; b < array.length; b++) {
                                                        var check_ram = false;
                                                        var check_internal = false;
                                                        var internal1 = array[b][0].match('[1-9]+(GB|TB)')[0];
                                                        // console.log(internal1);
                                                        var internal = internal1.match('[1-9]+');
                                                        // var ram = array[b][0].substring(array[b][0].indexOf(internal1+' ') + 5, array[b][0].indexOf('GB', array[b][0].indexOf(internal1+' ') + 1));
                                                        var ram = array[b][0].match('[1-9]+(GB RAM|MB RAM)')[0].match('[1-9]+')[0];

                                                        if (internal_site === internal[0]) {
                                                            check_internal = true;
                                                        }
                                                        if (ram_site === ram) {
                                                            check_ram = true;
                                                        }
                                                        // if(title.toLowerCase() === 'honor 8a 2020'){
                                                        //     console.log(title_site.toLowerCase().length);
                                                        //     console.log(title.toLowerCase().length);
                                                        //     console.log(internal[0]);
                                                        //     console.log(ram);
                                                        //     console.log(title.toLowerCase() === title_site.toLowerCase());
                                                        //     console.log(check_internal);
                                                        //     console.log(check_ram);
                                                        //     console.log(ram_site);
                                                        //     console.log(internal_site);
                                                        // }
                                                        if ((check_internal && check_ram && title.toLowerCase() === title_site.toLowerCase()) ||
                                                            (check_internal && title_site.toLowerCase().includes('apple iphone') && title.toLowerCase() === title_site.toLowerCase())) {
                                                            if (price.length > 0) {
                                                                var choose_unit;
                                                                if ($(price[0]).text().includes('تومان')) {
                                                                    choose_unit = 'تومان';
                                                                } else {
                                                                    choose_unit = 'ریال';
                                                                }
                                                                // var sort_price = []
                                                                // for (var p = 0; p < price.length; p++) {
                                                                //     sort_price.push(parseInt($(price[p]).text().replace(' تومان', '').replaceAll(',', '').replaceAll(' ', '')));
                                                                // }
                                                                // if (child_index === count1.length - 1) {
                                                                //     sort_price.sort(function (a, b) {
                                                                //         return a - b
                                                                //     });
                                                                // }else{
                                                                //     sort_price.sort(function (a, b) {
                                                                //         return b - a
                                                                //     });
                                                                // }
                                                                var json_make = '{';
                                                                for (var k = 0; k < price.length; k++) {
                                                                    // console.log($(color21[color21.length - k - 1]).text() + ' price: ' + sort_price[k]);
                                                                    json_make += '"gr' + (k) + '":{' +
                                                                        '"price" : "' + sort_price[k] + '"' +
                                                                        ',"bef_price" :"' + '' + '"' +
                                                                        ',"color" :"' + sort_color[k] + '"' +
                                                                        ',"garanti" :"' + sort_garan[k] + '"' +
                                                                        '}';
                                                                    if (k < price.length - 1) {
                                                                        json_make += ','
                                                                    }
                                                                }

                                                                json_make += '}';
                                                                console.log(JSON.parse(json_make));
                                                                // console.log('alldigital');
                                                                insert(b, title_orig, ram, internal[0], job.attrs.data.url, JSON.parse(json_make), choose_unit, 'alldigital');
                                                                done();
                                                                // console.log('dorost');
                                                                break dance;
                                                            } else {
                                                                console.log('nadarad');
                                                                // var date = new Date();
                                                                // var current_hour = date.getDay();
                                                                // fs.appendFile('/home/admin/domains/world.iran33.ir/shop/digido' + current_hour + '.txt', '\n' + title_site + ' (empty price)', function (err, data) {
                                                                //     if (err) {
                                                                //         return console.log(err);
                                                                //     }
                                                                // });
                                                                // console.log('alldigital');
                                                                insert(b, title_orig, ram, internal[0], job.attrs.data.url, JSON.parse('{}'), choose_unit, 'alldigital');
                                                                done();
                                                                break dance;
                                                            }
                                                        }
                                                    }
                                                    if (tot === data.length - 1) {
                                                        // console.log('lala');
                                                        // var timeInMss = Date(year);
                                                        var date = new Date();
                                                        // var current_hour = date.getDay();
                                                        var current_hour = date.getUTCDate();
                                                        fs.appendFile('/home/admin/domains/world.iran33.ir/shop/alldigital' + current_hour + '.txt', '\n' + title_site, function (err, data) {
                                                            if (err) {
                                                                return console.log(err);
                                                            }
                                                        });
                                                        done();
                                                    }
                                                }
                                        } else {
                                            var date = new Date();
                                            // var current_hour = date.getDay();
                                            var current_hour = date.getUTCDate();
                                            fs.appendFile('/home/admin/domains/world.iran33.ir/shop/alldigital' + current_hour + '.txt', '\n' + job.attrs.data.url, function (err, data) {
                                                if (err) {
                                                    return console.log(err);
                                                }
                                            });
                                            done();
                                        }
                                    });
                                } catch (e) {
                                    console.log(e)
                                }
                            });
                            agenda.schedule(new Date(Date.now() + 1000), 'alldigital', {
                                'h1': h1,
                                'url': encodeURI(res[0].alldigital[h1]), h1
                            });
                            // async function start(res, h1) {
                            //     await new Promise(resolve => setTimeout(resolve, 5000 * h1));
                            //     getDevices2(encodeURI(res[0].alldigital[h1]), h1);
                            // }
                            //
                            // start(res, h1);

                            // getDevices2('https://www.alldigitall.ir/index.php?route=product/product&product_id=349773',h1);

                        } else if (shop[shop_count] === 'digikala') {
                            agenda.define('digikala', async (job, done) => {
                                // getDevices2 = async (url12, h1) => {
                                try {
                                    // await task();

                                    const fetchResponse = await request23(job.attrs.data.url, done, 2, function (res) {
                                        var $ = cheerio.load(res);


                                        // console.log(Object.values(months)[0]);

                                        //
                                        console.log('digikala : ' + job.attrs.data.h1);

                                        var haf = $('section ul li div span');
                                        ram_internal = $('.c-product__title-en'); //use for title en
                                        // ram_internal_fa = $('.c-product__title').text(); //use for title fa
                                        // console.log(ram_internal_fa);
                                        // console.log(ram_internal_fa.substring(ram_internal_fa.indexOf('مدل') + 4 ,ram_internal_fa.indexOf(' ' , ram_internal_fa.indexOf('مدل') + 5)));
                                        // var color21 = $('#color_to_pick_list li a .color-n'); //use your CSS selector here
                                        // if(ram_internal.length <= 0){
                                        //     ram_internal = $('#short_description_block div p');
                                        // }
                                        // var color21 = $('#color_to_pick_list li a .color-n'); //use your CSS selector here
                                        // $('fieldset label').each(function (i, link) {
                                        //     if ($(link).text() === 'رنگ ') {
                                        //         color21 = $($(link).parent()).find('#color_to_pick_list li a .color-n');
                                        //     }
                                        // });

                                        // price = $('.option-price'); //use your CSS selector here
                                        // garan_color = $('.option-name'); //use your CSS selector here
                                        // selected = $('#color_to_pick_list .selected'); //use your CSS selector here
                                        // var count1 = $("#color_to_pick_list li");


                                        // var count3 = $("#product-sellers-table comb-name");
                                        // var sort_price = []
                                        // var sort_color = []
                                        // var sort_garan = []
                                        // // $($(".option-price")).each(function (i, link) {
                                        // // console.log($(link).text());
                                        // for (var count_price_ga = 0; count_price_ga < price.length; count_price_ga++) {
                                        //     sort_color.push($(garan_color[count_price_ga]).text().substring(0, $(garan_color[count_price_ga]).text().indexOf('-')));
                                        //     // if ($(link).text().indexOf(' - ', $(link).text().indexOf('گارانتی:') + 1) !== -1) {
                                        //     sort_garan.push($(garan_color[count_price_ga]).text().substring($(garan_color[count_price_ga]).text().indexOf('-') + 1));
                                        //     // console.log($(link).text().substring($(link).text().indexOf('گارانتی:') + 9, $(link).text().indexOf(' - ',$(link).text().indexOf('گارانتی:') + 1)));
                                        //     // } else {
                                        //     //     sort_garan.push($(link).text().substring($(link).text().indexOf('گارانتی:') + 9));
                                        //     //     console.log($(link).text().substring($(link).text().indexOf('گارانتی:') + 9));
                                        //     // }
                                        //
                                        //     sort_price.push($(price[count_price_ga]).text().replace(' تومان', '').replaceAll(',', '').replaceAll(' ', ''));
                                        // }
                                        // // });
                                        var main_tit = $(ram_internal[0]).text();
                                        // console.log($(ram_internal[0]).text());
                                        main_tit = $(ram_internal[0]).text().toString().replaceAll(" ", " ");
                                        main_tit = $(ram_internal[0]).text().toString().replaceAll(" ", " ");
                                        main_tit = $(ram_internal[0]).text().toString().replaceAll("  ", " ");
                                        main_tit = main_tit.toString().replace("  ", " ");
                                        main_tit = main_tit.toString().replace("   ", " ");
                                        main_tit = main_tit.replace('(', '').replace(')', '');
                                        // console.log(main_tit);
                                        // title_site_an_digi = title_site_an_digi.replaceAll(" ", " ");
                                        // title_site_an_digi = title_site_an_digi.replaceAll(" ", " ");
                                        // title_site_an_digi = title_site_an_digi.replaceAll("  ", " ");
                                        // title_site_an_digi = title_site_an_digi.replace('(', '').replace(')', '');


                                        // child_index = $(selected).index();
                                        var array_title = [];
                                        var array_title_on = [];

                                        array_title = main_tit.match('([0-9]+(GB|gb|TB)- [0-9]+(GB RAM|GB Ram))|([0-9]+(GB -)[0-9]+(GB Ram|GB RAM))');
                                        array_title_on = main_tit.match('[0-9]+(GB|TB|MB)');

                                        // internal_ram = $('.kfafeaturespro-feature-name'); //use your CSS selector here
                                        var title_site;
                                        var title_site_an_digi;
                                        if (array_title === null) {
                                            array_title = [];
                                        }
                                        if (array_title_on === null) {
                                            array_title_on = [];
                                        }
                                        // console.log(array_title_on[0]);
                                        if (main_tit.toLowerCase().includes(' ds ')) {
                                            title_site = main_tit.substring(0, main_tit.toLowerCase().lastIndexOf(' ', main_tit.toLowerCase().indexOf('ds') - 2));
                                        } else if (main_tit.toLowerCase().includes(' dual sim')) {
                                            title_site = main_tit.substring(0, main_tit.toLowerCase().lastIndexOf(' ', main_tit.toLowerCase().indexOf('dual sim') - 2));
                                        } else if (main_tit.toLowerCase().includes(' single sim')) {
                                            title_site = main_tit.substring(0, main_tit.toLowerCase().lastIndexOf(' ', main_tit.toLowerCase().indexOf('single sim') - 2));
                                        } else if (main_tit.toLowerCase().includes('dual')) {
                                            title_site = main_tit.substring(0, main_tit.toLowerCase().lastIndexOf(' ', main_tit.toLowerCase().indexOf('dual') - 2));
                                        } else if (main_tit.includes(array_title[0])) {
                                            title_site = main_tit.substring(0, main_tit.lastIndexOf(' ', main_tit.indexOf(array_title[0]) - 2));
                                        } else if (main_tit.includes(array_title_on[0])) {
                                            title_site = main_tit.substring(0, main_tit.lastIndexOf(' ', main_tit.indexOf(array_title_on[0]) - 2));
                                        } else if (main_tit.toLowerCase().includes(' mobile phone')) {
                                            title_site = main_tit.substring(0, main_tit.toLowerCase().lastIndexOf(' ', main_tit.toLowerCase().indexOf(' mobile phone') - 2));
                                        }
                                        if (main_tit.toLowerCase().includes(' ds ')) {
                                            title_site_an_digi = main_tit.substring(0, main_tit.toLowerCase().indexOf('ds') - 1);
                                        } else if (main_tit.toLowerCase().includes(' dual sim')) {
                                            title_site_an_digi = main_tit.substring(0, main_tit.toLowerCase().indexOf('dual sim') - 1);
                                        } else if (main_tit.toLowerCase().includes(' single sim')) {
                                            title_site_an_digi = main_tit.substring(0, main_tit.toLowerCase().indexOf('single sim') - 1);
                                        } else if (main_tit.toLowerCase().includes('dual')) {
                                            title_site_an_digi = main_tit.substring(0, main_tit.toLowerCase().indexOf('dual') - 1);
                                        } else if (main_tit.includes(array_title[0])) {
                                            title_site_an_digi = main_tit.substring(0, main_tit.indexOf(array_title[0]) - 1);
                                        } else if (main_tit.includes(array_title_on[0])) {
                                            title_site_an_digi = main_tit.substring(0, main_tit.indexOf(array_title_on[0]) - 1);
                                        } else if (main_tit.toLowerCase().includes(' mobile phone')) {
                                            title_site_an_digi = main_tit.substring(0, main_tit.toLowerCase().indexOf(' mobile phone'));
                                        }
                                        console.log(title_site);
                                        console.log(title_site_an_digi);
                                        if (title_site !== undefined || title_site_an_digi !== undefined) {
                                            var internal_site;
                                            var ram_site;
                                            for (var i = 0; i < haf.length; i++) {
                                                if ($(haf[i]).text().includes('حافظه داخلی')) {
                                                    array_internal = $(haf[i + 1]).text().match('[1-9]+');
                                                    if (array_internal !== null) {
                                                        internal_site = array_internal[0];
                                                    }
                                                    // console.log(internal_site);
                                                } else if ($(haf[i]).text().includes('مقدار RAM')) {
                                                    array_ram = $(haf[i + 1]).text().match('[1-9]+');
                                                    if (array_ram !== null) {
                                                        ram_site = array_ram[0];
                                                    }
                                                    // console.log(ram_site);
                                                }
                                            }
                                            // console.log(title_site.toLowerCase());
                                            // for (var i = 0; ; i++) {
                                            //     if (title_site[0] === ' ') {
                                            //         title_site = title_site.replace(' ', '');
                                            //     } else if (title_site[0] === ' ') {
                                            //         title_site = title_site.replace(' ', '');
                                            //     } else {
                                            //         break;
                                            //     }
                                            // }
                                            title_site = title_site.replaceAll(" ", " ");
                                            title_site = title_site.replaceAll(" ", " ");
                                            title_site = title_site.replaceAll("  ", " ");
                                            title_site = title_site.replace('(', '').replace(')', '');
                                            title_site_an_digi = title_site_an_digi.replaceAll(" ", " ");
                                            title_site_an_digi = title_site_an_digi.replaceAll(" ", " ");
                                            title_site_an_digi = title_site_an_digi.replaceAll("  ", " ");
                                            title_site_an_digi = title_site_an_digi.replace('(', '').replace(')', '');
                                            // if(title_site[title_site.length - 1] === ''){
                                            //
                                            // }
                                            // console.log('vorud');
                                            title_site = title_site.replaceAll("  ", " ");
                                            title_site_an_digi = title_site_an_digi.replaceAll("  ", " ");
                                            title_site = title_site.toLowerCase().replace(" lte", "");
                                            title_site_an_digi = title_site_an_digi.toLowerCase().replace(" lte", "");
                                            if (title_site.toLowerCase().includes('samsung galaxy')) {
                                                title_site = title_site.toLowerCase().replace(' plus', '+').replace("note ", "note");
                                            } else if (title_site_an_digi.toLowerCase().includes('samsung galaxy')) {
                                                title_site_an_digi = title_site_an_digi.toLowerCase().replace(' plus', '+').replace("note ", "note");
                                            }
                                            if (title_site.toLowerCase().includes('huawei y6s')) {
                                                title_site = title_site.toLowerCase().replace("y6s", "y6s 2019");
                                            } else if (title_site_an_digi.toLowerCase().includes('huawei y6s')) {
                                                title_site_an_digi = title_site_an_digi.toLowerCase().replace("y6s", "y6s 2019");
                                            }
                                            if (title_site.toLowerCase().includes('one macro')) {
                                                title_site = title_site.toLowerCase().replace("moto one macro", "one macro");
                                            } else if (title_site_an_digi.toLowerCase().includes('one macro')) {
                                                title_site_an_digi = title_site_an_digi.toLowerCase().replace("moto one macro", "one macro");
                                            }
                                            if (title_site.toLowerCase().includes('g8 power lite')) {
                                                title_site = title_site.toLowerCase().replace("g8 power lite", "moto g8 power lite");
                                            } else if (title_site_an_digi.toLowerCase().includes('g8 power lite')) {
                                                title_site_an_digi = title_site_an_digi.toLowerCase().replace("g8 power lite", "moto g8 power lite");
                                            }
                                            if (title_site.toLowerCase().includes('xiaomi mi 10t pro 5g')) {
                                                title_site = title_site.toLowerCase().replace("pro 5g m", "pro 5g");
                                            } else if (title_site_an_digi.toLowerCase().includes('xiaomi mi 10t pro 5g')) {
                                                title_site_an_digi = title_site_an_digi.toLowerCase().replace("pro 5g m", "pro 5g");
                                            }
                                            if (title_site.toLowerCase().includes('huawei huawei')) {
                                                title_site = title_site.toLowerCase().replace(" huawei huawei", "huawei").replace("huawei huawei", "huawei");
                                            } else if (title_site_an_digi.toLowerCase().includes('huawei huawei')) {
                                                title_site_an_digi = title_site_an_digi.toLowerCase().replace(" huawei huawei", "huawei").replace("huawei huawei", "huawei");
                                            }
                                            if (title_site.toLowerCase().includes('samsung samsung')) {
                                                title_site = title_site.toLowerCase().replace("samsung samsung", "samsung");
                                            } else if (title_site_an_digi.toLowerCase().includes('samsung samsung')) {
                                                title_site_an_digi = title_site_an_digi.toLowerCase().replace("samsung samsung", "samsung");
                                            }
                                            // if (title_site.toLowerCase().includes('xiaomi poco f2 pro 5g')) {
                                            //     title_site = title_site.toLowerCase().replace(" 5g", "");
                                            // }
                                            // if (title_site.toLowerCase().includes('huawei y6 prime 2019')) {
                                            //     title_site = title_site.replace(" y6 prime 2019", " y6 2019");
                                            // }
                                            // if (title_site.toLowerCase().includes('nokia 8.1')) {
                                            //     title_site = title_site.replace("nokia 8.1", "nokia 8.1 (nokia x7)");
                                            // }
                                            if (title_site.toLowerCase().includes('redmi') && !title_site.toLowerCase().includes('xiaomi')) {
                                                title_site = title_site.replace("redmi", "xiaomi redmi");
                                            }
                                            if (title_site_an_digi.toLowerCase().includes('honor 8a')) {
                                                title_site_an_digi = title_site_an_digi.toLowerCase().replace("honor 8a", "honor 8a 2020");
                                            }
                                            // if (title_site.toLowerCase().includes('huawei y5 lite')) {
                                            //     title_site = title_site.replace("huawei y5 lite", "huawei y5 lite 2018");
                                            // }
                                            // if(title_site.toLowerCase().includes(' lte')){

                                            // }
                                            // console.log(title_site.toLowerCase());
                                            dance:
                                                for (var tot = 0; tot < data.length; tot++) {
                                                    // console.log(data[tot].title);
                                                    array = [...data[tot].data.memory.internal.matchAll('[1-9]+(GB|TB) [1-9]+(GB RAM|MB RAM)')];
                                                    var title_orig = data[tot].title;
                                                    var title = data[tot].title;
                                                    title = title.replace('(', '').replace(')', '');
                                                    // title += ' ';
                                                    // console.log(array.length);
                                                    for (var b = 0; b < array.length; b++) {

                                                        var check_ram = false;
                                                        var check_internal = false;
                                                        var internal1 = array[b][0].match('[1-9]+(GB|TB)')[0];
                                                        // console.log(internal1);
                                                        var internal = internal1.match('[1-9]+');
                                                        // var ram = array[b][0].substring(array[b][0].indexOf(internal1+' ') + 5, array[b][0].indexOf('GB', array[b][0].indexOf(internal1+' ') + 1));
                                                        var ram = array[b][0].match('[1-9]+(GB RAM|MB RAM)')[0].match('[1-9]+')[0];

                                                        if (internal_site === internal[0]) {
                                                            check_internal = true;
                                                        }
                                                        if (ram_site === ram) {
                                                            check_ram = true;
                                                        }

                                                        // if(title.toLowerCase() === 'honor 8a 2020' ){
                                                        //     console.log(title_site_an_digi.toLowerCase());
                                                        //     console.log(title.toLowerCase());
                                                        //     console.log(ram);
                                                        //     console.log(internal[0]);
                                                        //     console.log(title.toLowerCase() === title_site.toLowerCase());
                                                        //     console.log(title.toLowerCase() === title_site_an_digi.toLowerCase());
                                                        //     console.log(check_internal);
                                                        //     console.log(check_ram);
                                                        //     console.log(ram_site);
                                                        //     console.log(internal_site);
                                                        // }
                                                        if ((check_internal && check_ram &&
                                                            ((title.toLowerCase() === title_site.toLowerCase()) || (title.toLowerCase() === title_site_an_digi.toLowerCase()))) ||
                                                            (check_internal && (title_site.toLowerCase().includes('apple iphone') || title_site_an_digi.toLowerCase().includes('apple iphone')) &&
                                                                ((title.toLowerCase() === title_site_an_digi.toLowerCase())))) {
                                                            // console.log('vorud');
                                                            str = $('script:not([src])')[7].children[0].data;
                                                            try {
                                                                if (str.includes('var variants = ')) {
                                                                    var months = JSON.parse(str.substring(str.indexOf
                                                                    ('var variants = ') + 15, str.indexOf('};', str.indexOf('var variants = ') + 16) + 1));
                                                                    if (Object.values(months).length > 0) {
                                                                        var choose_unit;
                                                                        // if ($(price[0]).text().includes('تومان')) {
                                                                        choose_unit = 'تومان';
                                                                        // } else {
                                                                        //     choose_unit = 'ریال';
                                                                        // }
                                                                        // var sort_price = []
                                                                        // for (var p = 0; p < price.length; p++) {
                                                                        //     sort_price.push(parseInt($(price[p]).text().replace(' تومان', '').replaceAll(',', '').replaceAll(' ', '')));
                                                                        // }
                                                                        // if (child_index === count1.length - 1) {
                                                                        //     sort_price.sort(function (a, b) {
                                                                        //         return a - b
                                                                        //     });
                                                                        // }else{
                                                                        //     sort_price.sort(function (a, b) {
                                                                        //         return b - a
                                                                        //     });
                                                                        // }
                                                                        var json_make = '{';
                                                                        for (var k = 0; k < Object.values(months).length; k++) {
                                                                            // console.log($(color21[color21.length - k - 1]).text() + ' price: ' + sort_price[k]);
                                                                            json_make += '"gr' + (k) + '":{' +
                                                                                '"price" : "' + parseInt(Object.values(months)[k].price_list.selling_price) / 10 + '"' +
                                                                                ',"bef_price" :"' + parseInt(Object.values(months)[k].price_list.rrp_price) / 10 + '"' +
                                                                                ',"color" :"' + Object.values(months)[k].color.title + '"' +
                                                                                ',"garanti" :"' + Object.values(months)[k].warranty.title + '"' +
                                                                                '}';
                                                                            if (k < Object.values(months).length - 1) {
                                                                                json_make += ','
                                                                            }
                                                                        }

                                                                        json_make += '}';
                                                                        console.log(JSON.parse(json_make));
                                                                        // console.log('alldigital');
                                                                        insert(b, title_orig, ram, internal[0], job.attrs.data.url, JSON.parse(json_make), choose_unit, 'digikala');
                                                                        done();
                                                                        // console.log('dorost');
                                                                        break dance;
                                                                    } else {
                                                                        console.log('nadarad');
                                                                        // var date = new Date();
                                                                        // var current_hour = date.getDay();
                                                                        // fs.appendFile('/home/admin/domains/world.iran33.ir/shop/digido' + current_hour + '.txt', '\n' + title_site + ' (empty price)', function (err, data) {
                                                                        //     if (err) {
                                                                        //         return console.log(err);
                                                                        //     }
                                                                        // });
                                                                        // console.log('alldigital');
                                                                        insert(b, title_orig, ram, internal[0], job.attrs.data.url, JSON.parse('{}'), choose_unit, 'digikala');
                                                                        done();
                                                                        break dance;
                                                                    }
                                                                } else {
                                                                    console.log('nadarad');
                                                                    insert(b, title_orig, ram, internal[0], job.attrs.data.url, JSON.parse('{}'), choose_unit, 'digikala');
                                                                    done();
                                                                    break dance;
                                                                }
                                                            } catch (e) {
                                                                // console.log(job.attrs.data.h1);
                                                                console.log(e);
                                                                done();
                                                            }
                                                        }
                                                    }
                                                    if (tot === data.length - 1) {
                                                        // console.log('lala');
                                                        // var timeInMss = Date(year);
                                                        var date = new Date();
                                                        // var current_hour = date.getDay();
                                                        var current_hour = date.getUTCDate();
                                                        fs.appendFile('/home/admin/domains/world.iran33.ir/shop/digikala' + current_hour + '.txt', '\n' + title_site + ' : ' + title_site_an_digi + " : " + job.attrs.data.url, function (err, data) {
                                                            if (err) {
                                                                return console.log(err);
                                                            }
                                                        });
                                                        done();
                                                    }
                                                }
                                        } else {
                                            var date = new Date();
                                            // var current_hour = date.getDay();
                                            var current_hour = date.getUTCDate();
                                            fs.appendFile('/home/admin/domains/world.iran33.ir/shop/digikala' + current_hour + '.txt', '\n' + job.attrs.data.url, function (err, data) {
                                                if (err) {
                                                    return console.log(err);
                                                }
                                            });
                                            done();
                                        }
                                    });
                                } catch (e) {
                                    console.log(e)
                                }
                            });
                            agenda.schedule(new Date(Date.now() + 1000), 'digikala', {
                                'h1': h1,
                                // 'url': 'https://www.digikala.com/product/dkp-3944824/%DA%AF%D9%88%D8%B4%DB%8C-%D9%85%D9%88%D8%A8%D8%A7%DB%8C%D9%84-%D9%87%D9%88%D8%A2%D9%88%DB%8C-%D9%85%D8%AF%D9%84-huawei-y7p-art-l29-%D8%AF%D9%88-%D8%B3%DB%8C%D9%85-%DA%A9%D8%A7%D8%B1%D8%AA-%D8%B8%D8%B1%D9%81%DB%8C%D8%AA-64-%DA%AF%DB%8C%DA%AF%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA-%D8%A8%D9%87-%D9%87%D9%85%D8%B1%D8%A7%D9%87-%DA%A9%D8%A7%D8%B1%D8%AA-%D8%AD%D8%A7%D9%81%D8%B8%D9%87-microsdxc-%D8%AA%D9%88%D8%B4%DB%8C%D8%A8%D8%A7-%D8%B8%D8%B1%D9%81%DB%8C%D8%AA-64-%DA%AF%DB%8C%DA%AF%D8%A7%D8%A8%D8%A7%DB%8C%D8%AA'
                                'url': 'https://www.digikala.com' + encodeURI(res[0].digikala[h1])
                            });
                        }
                    }
                }
            });
        });
    }
}, 60000); // Repeat every 60000 milliseconds (1 minute)


function insert(i, title, ram, internal, link, garanti_color, choose_unit, shop) {

    var model = ['model1', 'model2', 'model3', 'model4', 'model5', 'model6', 'model7', 'model8', 'model9', 'model10'];
    var timeInMss = Date.now();
    var url = 'mongodb://127.0.0.1:27017/test_fesphone';
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var count1;
        var dbo = db.db('test_fesphone');
        let coll = dbo.collection('myColl');
        var field_name = "price." + shop + '.' + model[i];
        var update = {"$set": {}}
        update["$set"][field_name] = {ram, internal, link, timeInMss, choose_unit, garanti_color}
        coll.updateOne(
            {"title": title}, update, {upsert: true}
            ,
            function (err, res) {
                if (err) {
                    throw err;
                    console.log(err);
                } else {
                    // console.log('piroozi');
                }
                db.close();
            });
    });
}

process.on('uncaughtException', function (err) {
    console.error('Something bad happened: ', err);
});

async function graceful() {
    await agenda.stop();
    process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);
