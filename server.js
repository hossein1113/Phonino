const express = require('express');
const app2 = express();

const http2 = require('https');
// const http = require('http');
// var cors = require('cors');
// const  sock =  (http2);

const Agenda = require('agenda');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var fs = require('fs');
var Promise = require('nodeify').Promise;
var server = http2.createServer({
    key: fs.readFileSync("/etc/letsencrypt/live/world.fesgr.com/privkey.pem"),
    cert: fs.readFileSync('/etc/letsencrypt/live/world.fesgr.com/fullchain.pem'),
    requestCert: false,
    rejectUnauthorized: false
}, app2);
var url = 'mongodb://127.0.0.1:27017/test_fesphone';
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
try {
    const io = require('socket.io')(server, {
        cors: {
            origin: "https://world.fesgr.com:3303",
            credentials: true
        }
    });
// var app = express();
    server.listen(3303, function () {
        console.log('listening on *:3303');
    });


    io.on('connection', function (socket) {
         var clientIp = socket.request.connection.remoteAddress;
         console.log('New connection from ' + clientIp);
        var c;
        socket.on('disconnect', function () {
            console.log('Got disconnect!');
        });

        function discon() {
            c = setTimeout(function () {
                // socket.disconnect();
            }, 60000);
        }


        discon();
        socket.on('all-search', function () {
            MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
                if (err) throw err;
                var count1;
                var dbo = db.db('test_fesphone');
                let coll = dbo.collection('myColl');
                coll.aggregate(
                    [
                        {
                            $project: {
                                _id: 0,
                                data: 0,
                                status: 0
                            }
                        },
                        {$limit: 21}
                    ]
                ).toArray(function (err, result) {
                    if (err) throw err;
                    socket.emit('all-search', result);
                });
            });
            discon();
        });

        socket.on('insert_data', function (insert_data) {
            MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
                if (err) throw err;
                var count1;
                var dbo = db.db('test_fesphone');
                let coll = dbo.collection('myColl');
                coll.insertOne(insert_data, function (err, res) {
                    if (err) throw err;
                    socket.emit('insert_data', 'با موفقیت اضافه شد لطفا چک کنید');
                    db.close();
                });
            });
            discon();
        });
        socket.on('search_edit_title_only', function (insert_data) {
            MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
                if (err) throw err;
                var count1;
                var dbo = db.db('test_fesphone');
                let coll = dbo.collection('myColl');
                coll.aggregate(
                    [
                        {
                            $match: {
                                "title": insert_data
                            }
                        }
                        , {
                        $project: {
                            title: 1,
                            _id: 1,
                            img: 1,
                            title_an_fa: 1,
                            title_an: 1,
                            title_f: 1
                        }
                    }
                    ]
                ).toArray(function (err, result) {
                    if (err) throw err;
                    // console.log(result);
                    socket.emit('search_edit_title_only', result);
                });
            });
            discon();
        });
        socket.on('search_edit_all_only', function (insert_data) {
            MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
                if (err) throw err;
                var count1;
                var dbo = db.db('test_fesphone');
                let coll = dbo.collection('myColl');
                coll.aggregate(
                    [
                        {
                            $match: {
                                "title": insert_data
                            }
                        }
                    ]
                ).toArray(function (err, result) {
                    if (err) throw err;
                    // console.log(result);
                    socket.emit('search_edit_all_only', result);
                });
            });
            discon();
        });

        socket.on('search_edit_title_only_back', function (insert_data) {
            MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
                if (err) throw err;
                var count1;
                var dbo = db.db('test_fesphone');
                let coll = dbo.collection('myColl');
                coll.updateOne(
                    {"_id": ObjectId(insert_data[0])}, {
                        $set: {
                            "title": insert_data[1],
                            "title_f": insert_data[2],
                            "img": insert_data[3],
                            "title_an": insert_data[4],
                            "title_an_fa": insert_data[5]
                        }
                    }
                    ,
                    function (err, res) {
                        if (err) {
                            throw err;
                            socket.emit('search_edit_title_only_back', 'خطا')
                        } else {
                            socket.emit('search_edit_title_only_back', 'با موفقیت اصلاح شد حتما چک کنید');
                        }
                        db.close();
                    });
            });
            discon();
        });
        socket.on('search_edit_all_only_back', function (insert_data) {
            MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
                if (err) throw err;
                var count1;
                var dbo = db.db('test_fesphone');
                let coll = dbo.collection('myColl');
                delete insert_data[1]._id;
                coll.replaceOne(
                    {"_id": ObjectId(insert_data[0])},
                    insert_data[1],
                    function (err, res) {
                        if (err) {
                            throw err;
                            socket.emit('search_edit_all_only_back', 'خطا')
                        } else {
                            socket.emit('search_edit_all_only_back', 'با موفقیت اصلاح شد حتما چک کنید');
                        }
                        db.close();
                    });
            });
            discon();
        });
        socket.on('get_phone', function (phone_title) {
            // console.log(phone_title);
            MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
                if (err) throw err;
                var count1;
                var dbo = db.db('test_fesphone');
                let coll = dbo.collection('myColl');
                coll.aggregate(
                    [
                        {
                            $match: {
                                "title": phone_title
                            }
                        }
                        , {
                        $project: {
                            title: 1,
                            _id: 0,
                            img: 1,
                            '3D_url': 1,
                            data: 1,
                            img_det: 1,
                            title_f: 1
                        }
                    }
                    ]
                ).toArray(function (err, result) {
                    if (err) throw err;
                    // console.log(result);
                    socket.emit('get_phone', result);
                });
            });
            discon();
        });

        socket.on('phone-search', function (sa) {
            clearTimeout(c);
            MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
                if (err) throw err;
                var count1;
                var dbo = db.db('test_fesphone');
                let coll = dbo.collection('myColl');
                coll.aggregate(
                    [
                        {
                            $match: {
                                $or: [{"title": {'$regex': sa, '$options': 'i'}}, {
                                    "title_an": {
                                        '$regex': sa,
                                        '$options': 'i'
                                    }
                                }, {"title_f": {'$regex': sa, '$options': 'i'}},
                                    {
                                        "title_an_fa": {
                                            '$regex': sa,
                                            '$options': 'i'
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $limit : 100
                        },
                        {
                            $project: {
                                "data.memory.internal": 1,
                                img: 1,
                                title: 1,
                                price : 1,
                                title_an_fa: 1,
                                title_an: 1,
                                title_f: 1
                            }
                        },
                        {
                            $sort: {title: 1}
                        }
                    ]
                ).toArray(function (err, result) {
                    if (err) throw err;
                    socket.emit('phone-search', result);
                });
            });
            discon();
        });
        socket.on('phone-search-auto', async function (sa) {
            clearTimeout(c);
            const job = agenda.schedule(new Date(Date.now() + 500), 'aggre', {'data': sa, 'sockeid': socket.id});
            // const  job = agenda.create( 'aggre' , {'data' : sa , 'sockeid' : socket.id});
            // await job.save();
            console.log("Job successfully saved %s", socket.id);
            discon();
        });
    });
    agenda.define('aggre', async (job, done) => {
        // console.log(io.sockets.sockets.get(job.attrs.data.sockeid).connected);
        // if(io.sockets.sockets.get(job.attrs.data.sockeid) === undefined){
        //     done();
        // }
        if (io.sockets.sockets.get(job.attrs.data.sockeid).connected) {
            try {
                MongoClient.connect(url, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }, function (err, db) {
                    if (err) throw err;
                    var count1;
                    var fnumber_checker_main_camera = false;
                    var fnumber_checker_selfie_camera = false;
                    var value_cpu = '';
                    var value_count_sim = '';
                    var value_type_sim = '';
                    var value_bounds = '';
                    var value_brands = '';
                    var value_colors = '';
                    var value_count_core = '';
                    var value_RAM_min = 0.512;
                    var value_RAM_max = 16;
                    var value_HARD_min = 2;
                    var value_HARD_max = 2000;
                    var value_WIDTH_min = 40;
                    var value_WIDTH_max = 80;
                    var value_HEIGHT_min = 90;
                    var value_HEIGHT_max = 180;
                    var value_thickness_min = 5;
                    var value_thickness_max = 20;
                    var value_battery_min = 200;
                    var value_battery_max = 10000;
                    var value_display_min = 4;
                    var value_display_max = 8.5;
                    var value_density_min = 150;
                    var value_density_max = 600;
                    var value_main_camera_min = 2;
                    var value_main_camera_max = 108;
                    var value_self_camera_min = 1;
                    var value_self_camera_max = 64;
                    var value_main_camera_fnumber_min = 1.5;
                    var value_main_camera_fnumber_max = 2.7;
                    var value_self_camera_fnumber_min = 1.5;
                    var value_self_camera_fnumber_max = 2.7;
                    var value_launch_min = 2011;
                    var value_launch_max = 2021;
                    var value_weight_min = 100;
                    var value_weight_max = 310;
                    var value_price_min = 1000000;
                    var value_price_max = 70000000;
                    var value_freq_min = 1.0;
                    var value_freq_max = 3.3;
                    var platform_os = 'Android|IOS';
                    var value_price_only_price = '';

                    var battery_detail = -1;
                    var display_size = -1;
                    var main_camera_det_det_det = -1;
                    var selfie_camera_det_det_det = -1;
                    var sals3 = 1;
                    var _id = 1;
                    var dec = false;
                    var inc = true;


                    var bool_ram_or_internal = true;
                    var bool_weight = false;
                    var bool_heigh_with_think = false;
                    var bool_launch = false;
                    var bool_display_size = true;
                    var bool_freq_size = false;
                    var bool_density_size = false;
                    var bool_main_camera = true;
                    var bool_selfie_camera = false;
                    var bool_battery = false;
                    var bool_price = false;


                    var tot = JSON.parse(job.attrs.data.data);
                    if (tot.Internal_storage !== undefined) {
                        bool_ram_or_internal = true;
                        value_HARD_min = tot.Internal_storage.min;
                        value_HARD_max = tot.Internal_storage.max;
                    }
                    if (tot.RAM !== undefined) {
                        bool_ram_or_internal = true;
                        value_RAM_min = tot.RAM.min;
                        value_RAM_max = tot.RAM.max;
                    }
                    if (tot.Width !== undefined) {
                        bool_heigh_with_think = true;
                        value_WIDTH_min = tot.Width.min;
                        value_WIDTH_max = tot.Width.max;
                    }
                    if (tot.Height !== undefined) {
                        bool_heigh_with_think = true;
                        value_HEIGHT_min = tot.Height.min;
                        value_HEIGHT_max = tot.Height.max;
                    }
                    if (tot.Thickness !== undefined) {
                        bool_heigh_with_think = true;
                        value_thickness_min = tot.Thickness.min;
                        value_thickness_max = tot.Thickness.max;
                    }
                    if (tot.Weight !== undefined) {
                        bool_weight = true;
                        value_weight_min = tot.Weight.min;
                        value_weight_max = tot.Weight.max;
                    }
                    if (tot.freq !== undefined) {
                        bool_freq_size = true;
                        value_freq_min = tot.freq.min;
                        value_freq_max = tot.freq.max;
                    }
                    if (tot.Display !== undefined) {
                        bool_display_size = true;
                        value_display_min = tot.Display.min;
                        value_display_max = tot.Display.max;
                    }
                    if (tot.Density !== undefined) {
                        bool_density_size = true;
                        value_density_min = tot.Density.min;
                        value_density_max = tot.Density.max;
                    }
                    if (tot.Main_camera_rez !== undefined) {
                        bool_main_camera = true;
                        fnumber_checker_main_camera = false;
                        value_main_camera_min = tot.Main_camera_rez.min;
                        value_main_camera_max = tot.Main_camera_rez.max;
                    }
                    if (tot.Main_camera_fnumber !== undefined) {
                        if (!fnumber_checker_main_camera) {
                            fnumber_checker_main_camera = true;
                        }
                        bool_main_camera = true;
                        value_main_camera_fnumber_min = tot.Main_camera_fnumber.min;
                        value_main_camera_fnumber_max = tot.Main_camera_fnumber.max;
                    }
                    if (tot.selfie_camera !== undefined) {
                        bool_selfie_camera = true;
                        fnumber_checker_selfie_camera = false;
                        value_self_camera_min = tot.selfie_camera.min;
                        value_self_camera_max = tot.selfie_camera.max;
                    }
                    if (tot.selfie_camera_fnumber !== undefined) {
                        if (!fnumber_checker_selfie_camera) {
                            fnumber_checker_selfie_camera = true;
                        }
                        bool_selfie_camera = true;
                        value_self_camera_fnumber_min = tot.selfie_camera_fnumber.min;
                        value_self_camera_fnumber_max = tot.selfie_camera_fnumber.max;
                    }
                    if (tot.ios_variable !== undefined) {
                        platform_os = 'Android';
                    }
                    if (tot.android_variable !== undefined) {
                        platform_os = 'IOS';
                    }
                    if (tot.ios_ver !== undefined) {
                        if (platform_os === 'Android|IOS' && tot.android_ver !== undefined) {
                            platform_os = tot.ios_ver.content;
                        } else if (platform_os === 'Android|IOS' && tot.android_ver === undefined) {
                            platform_os = 'Android|' + tot.ios_ver.content;
                        } else if (platform_os === 'IOS') {
                            platform_os = tot.ios_ver.content;
                        }
                    }
                    if (tot.android_ver !== undefined) {
                        if (platform_os === 'Android|IOS') {
                            platform_os = 'IOS|' + tot.android_ver.content;
                        } else if (platform_os === 'Android') {
                            platform_os = tot.android_ver.content;
                        } else {
                            platform_os += "|" + tot.android_ver.content;
                        }
                    }
                    if (tot.launch !== undefined) {
                        bool_launch = true;
                        value_launch_min = tot.launch.min;
                        value_launch_max = tot.launch.max;
                    }
                    if (tot.battery !== undefined) {
                        bool_battery = true;
                        value_battery_min = tot.battery.min;
                        value_battery_max = tot.battery.max;
                    }
                    if (tot.price !== undefined) {
                        bool_price = true;
                        value_price_min = tot.price.min;
                        value_price_max = tot.price.max;
                    }
                    if (tot.cpu !== undefined) {
                        value_cpu = tot.cpu.content;
                    }
                    if (tot.count_sim !== undefined) {
                        value_count_sim = tot.count_sim.content;
                    }
                    if (tot.sim_type !== undefined) {
                        value_type_sim = tot.sim_type.content;
                    }
                    if (tot.count_core !== undefined) {
                        value_count_core = tot.count_core.content;
                    }
                    if (tot.bounds !== undefined) {
                        value_bounds = tot.bounds.content;
                    }
                    if (tot.brands !== undefined) {
                        value_brands = tot.brands.content;
                    }
                    if (tot.colors !== undefined) {
                        value_colors = tot.colors.content;
                    }
                    if (tot.price_only_price !== undefined) {
                        bool_price = true;
                        value_price_only_price = tot.price_only_price.content;
                    }
                    if (tot.dec !== undefined) {
                        dec = true;
                    } else if (tot.inc !== undefined) {
                        inc = true;
                    }
                    var update = {"$sort": {}};
                    if (tot.battery_sort !== undefined) {
                        bool_battery = true;
                        if (dec) {
                            battery_detail = -1;
                        } else {
                            battery_detail = 1;
                        }
                        update["$sort"] = {battery_detail};
                        console.log('bat');
                    } else if (tot.screen_size !== undefined) {
                        bool_display_size = true;
                        if (dec) {
                            display_size = -1;
                        } else {
                            display_size = 1;
                        }
                        update["$sort"] = {display_size};
                        console.log('dis');
                    } else if (tot.selfie_main_sort !== undefined) {
                        bool_selfie_camera = true;
                        if (dec) {
                            selfie_camera_det_det_det = -1;
                        } else {
                            selfie_camera_det_det_det = 1;
                        }

                        update["$sort"] = {selfie_camera_det_det_det};
                        console.log('self');
                    } else if (tot.camera_main_sort !== undefined) {
                        bool_main_camera = true;
                        if (dec) {
                            main_camera_det_det_det = -1;
                        } else {
                            main_camera_det_det_det = 1;
                        }
                        update["$sort"] = {main_camera_det_det_det}
                        console.log('main');
                    } else if (tot.price_sort !== undefined) {
                        bool_price = true;
                        if (dec) {
                            sals3 = -1;
                        } else {
                            sals3 = 1;
                        }
                        update["$sort"] = {sals3}
                        console.log('price');
                    } else {
                        console.log('id');
                        if (dec) {
                            _id = -1;
                        } else {
                            _id = 1;
                        }
                        update["$sort"] = {_id};
                    }
                    // var field_name = "battery-detail";


                    var dbo = db.db('test_fesphone');
                    let coll = dbo.collection('myColl');

                    coll.aggregate([
                        {
                            "$addFields": {
                                "number": {
                                    "input": {
                                        $cond: {
                                            if: bool_ram_or_internal,
                                            then: {
                                                $map: {
                                                    input: {
                                                        "$zip": {
                                                            "inputs": [{
                                                                "$regexFindAll": {
                                                                    "input": "$data.memory.internal",
                                                                    "regex": "[+-]?([0-9]*[.])?[0-9]+(GB) [+-]?([0-9]*[.])?[0-9]+(GB RAM)"
                                                                }
                                                            }, {
                                                                $map: {
                                                                    input: {
                                                                        "$regexFindAll": {
                                                                            "input": "$data.memory.internal",
                                                                            "regex": "[+-]?([0-9]*[.])?[0-9]+(GB) [+-]?([0-9]*[.])?[0-9]+(GB RAM)"
                                                                        }
                                                                    },
                                                                    as: "main2",
                                                                    in: {
                                                                        $indexOfBytes: ["$$main2.match", "GB"]
                                                                    }
                                                                }
                                                            }, {
                                                                $map: {
                                                                    input: {
                                                                        "$regexFindAll": {
                                                                            "input": "$data.memory.internal",
                                                                            "regex": "[+-]?([0-9]*[.])?[0-9]+(GB) [+-]?([0-9]*[.])?[0-9]+(GB RAM)"
                                                                        }
                                                                    },
                                                                    as: "main3",
                                                                    in: {
                                                                        $indexOfBytes: ["$$main3.match", "GB RAM"]
                                                                    }
                                                                }
                                                            }]
                                                        }
                                                    },
                                                    as: "main1",
                                                    in: {
                                                        INTERNAL: {
                                                            "$convert": {
                                                                "input": {
                                                                    $substr: [{"$arrayElemAt": ["$$main1.match", 0]}, 0, {"$arrayElemAt": ["$$main1", 1]}]
                                                                },
                                                                "to": "double",
                                                                "onError": "no digit matched"
                                                            }
                                                        },
                                                        RAM: {
                                                            "$convert": {
                                                                "input": {
                                                                    $substr: [{"$arrayElemAt": ["$$main1.match", 0]},
                                                                        {$sum: [{"$arrayElemAt": ["$$main1", 1]}, 3]},
                                                                        {
                                                                            $sum: [{"$arrayElemAt": ["$$main1", 2]},
                                                                                {$subtract: [-3, {"$arrayElemAt": ["$$main1", 1]}]}]
                                                                        }]
                                                                },
                                                                "to": "double",
                                                                "onError": "no digit matched"
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            else: []
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "$addFields": {
                                "sds": {
                                    $cond: {
                                        if: bool_ram_or_internal,
                                        then: {
                                            $map: {
                                                input: "$number.input",
                                                as: "main10",
                                                in: {
                                                    $and: [
                                                        {$gte: ["$$main10.INTERNAL", value_HARD_min]}, {$lte: ["$$main10.INTERNAL", value_HARD_max]},
                                                        {$gte: ["$$main10.RAM", value_RAM_min]}, {$lte: ["$$main10.RAM", value_RAM_max]}
                                                    ]
                                                }
                                            }
                                        },
                                        else: [true]
                                    }
                                }
                            }
                        },
                        {
                            $match: {
                                "sds": {"$in": [true]}
                            }
                        },
                        {
                            "$addFields": {
                                "launch": {
                                    $cond: {
                                        if: bool_launch,
                                        then: {
                                            "$convert": {
                                                "input": {
                                                    $substr: ["$data.launch.announced", 0, 4]
                                                },
                                                "to": "int",
                                                "onError": "no digit matched"
                                            }
                                        },
                                        else: 2015
                                    }
                                }
                            }
                        }, {
                            $match: {
                                "launch": {"$gte": value_launch_min, "$lte": value_launch_max}
                            }
                        },
                        {
                            "$addFields": {
                                "weight": {
                                    $cond: {
                                        if: bool_weight,
                                        then: {
                                            "$convert": {
                                                "input": {
                                                    $substr: ["$data.body.weight", 0, {$indexOfBytes: ["$data.body.weight", " g"]}]
                                                },
                                                "to": "double",
                                                "onError": "no digit matched"
                                            }
                                        },
                                        else: 120
                                    }
                                }
                            }
                        },
                        {
                            $match: {
                                "weight": {
                                    "$gte": value_weight_min,
                                    "$lte": value_weight_max
                                }
                            }
                        },
                        {
                            "$addFields": {
                                "display_size": {
                                    $cond: {
                                        if: bool_display_size,
                                        then: {
                                            "$convert": {
                                                "input": {
                                                    $substr: ["$data.display.size", 0, {$indexOfBytes: ["$data.display.size", " inches"]}]
                                                },
                                                "to": "double",
                                                "onError": "no digit matched"
                                            }
                                        },
                                        else: 5
                                    }
                                }
                            }
                        },
                        {
                            $match: {
                                "display_size": {"$gte": value_display_min, "$lte": value_display_max}
                            }
                        },
                        {
                            "$addFields": {
                                "freq_size": {
                                    $cond: {
                                        if: bool_freq_size,
                                        then: {
                                            "$regexFindAll": {
                                                "input": "$data.platform.cpu",
                                                "regex": "\\d{1,3}(\\.\\d{1,3})? (GHz|MHz)"
                                            }
                                        },
                                        else: 5
                                    }
                                }
                            }
                        },
                        {
                            "$addFields": {
                                "freq_size1": {
                                    $cond: {
                                        if: bool_freq_size,
                                        then: {
                                            $map: {
                                                input: "$freq_size",
                                                as: "main178",
                                                in: {
                                                    "$regexFind": {
                                                        "input": "$$main178.match",
                                                        "regex": "\\d{1,3}(\\.\\d{1,3})?"
                                                    }
                                                }
                                            }
                                        },
                                        else: 1.5
                                    }
                                }
                            }
                        },
                        {
                            "$addFields": {
                                "freq_size2": {
                                    $cond: {
                                        if: bool_freq_size,
                                        then: {
                                            $map: {
                                                input: "$freq_size1",
                                                as: "main17",
                                                in: {
                                                    "$convert": {
                                                        "input": '$$main17.match',
                                                        "to": "double",
                                                        "onError": "no digit matched"
                                                    }
                                                }
                                            }
                                        },
                                        else: [true]
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                freq_size3: {
                                    $cond: {
                                        if: bool_freq_size,
                                        then: {
                                            $filter: {
                                                input: "$freq_size2",
                                                as: "item",
                                                cond: {$eq: ["$$item", {$max: "$freq_size2"}]}
                                            }
                                        },
                                        else: [1.5]
                                    }
                                }
                            }
                        },
                        {
                            $match: {
                                "freq_size3.0": {"$gte": value_freq_min, "$lte": value_freq_max}
                            }
                        },
                        {
                            "$addFields": {
                                "density_size": {
                                    $cond: {
                                        if: bool_density_size,
                                        then: {
                                            "$regexFind": {
                                                "input": "$data.display.resolution",
                                                "regex": "~\\d{1,3}(\\.\\d{1,3})? ppi density"
                                            }
                                        },
                                        else: 156
                                    }
                                }
                            }
                        },
                        {
                            "$addFields": {
                                "density_size1": {
                                    $cond: {
                                        if: bool_density_size,
                                        then: {
                                            "$regexFind": {
                                                "input": '$density_size.match',
                                                "regex": '\\d{1,3}(\\.\\d{1,3})?'
                                            }
                                        },
                                        else: 156
                                    }
                                }
                            }
                        },
                        {
                            "$addFields": {
                                "density_size2": {
                                    $cond: {
                                        if: bool_density_size,
                                        then: {
                                            "$convert": {
                                                "input": '$density_size1.match',
                                                "to": "double",
                                                "onError": "no digit matched"
                                            }
                                        },
                                        else: 156
                                    }
                                }
                            }
                        }, {
                            $match: {
                                "density_size2": {"$gte": value_density_min, "$lte": value_density_max}
                            }
                        },
                        {
                            "$addFields": {
                                "mohem": {
                                    $cond: {
                                        if: bool_heigh_with_think,
                                        then: {
                                            "$regexFind": {
                                                "input": "$data.body.dimensions",
                                                "regex": "\\d{1,3}(\\.\\d{1,3})? (x) \\d{1,3}(\\.\\d{1,3})? (x) \\d{1,3}(\\.\\d{1,3})? (mm)"
                                            }
                                        },
                                        else: []
                                    }
                                }
                            }
                        },
                        {
                            "$addFields": {
                                "dimen-detail-detail": {
                                    $cond: {
                                        if: bool_heigh_with_think,
                                        then: {
                                            $map: {
                                                input: {
                                                    "$regexFindAll": {
                                                        "input": "$mohem.match",
                                                        "regex": "\\d{1,3}(\\.\\d{1,3})?"
                                                    }
                                                },
                                                as: "main8",
                                                in: {
                                                    "$convert": {
                                                        "input": "$$main8.match",
                                                        "to": "double",
                                                        "onError": "no digit matched"
                                                    }
                                                }
                                            }
                                        },
                                        else: []
                                    }
                                }
                            }
                        },
                        {
                            "$addFields": {
                                "width": {
                                    $cond: {
                                        if: bool_heigh_with_think,
                                        then: {
                                            $arrayElemAt: ["$dimen-detail-detail", 1]
                                        },
                                        else: 45
                                    }
                                },
                                "height": {
                                    $cond: {
                                        if: bool_heigh_with_think,
                                        then: {
                                            $arrayElemAt: ["$dimen-detail-detail", 0]
                                        },
                                        else: 91
                                    }
                                },
                                "thickness": {
                                    $cond: {
                                        if: bool_heigh_with_think,
                                        then: {
                                            $arrayElemAt: ["$dimen-detail-detail", 2]
                                        },
                                        else: 15
                                    }
                                }
                            }
                        },
                        {
                            $match: {
                                "width": {
                                    "$gte": value_WIDTH_min,
                                    "$lte": value_WIDTH_max
                                }, "height": {"$gte": value_HEIGHT_min, "$lte": value_HEIGHT_max},
                                "thickness": {
                                    "$gte": value_thickness_min,
                                    "$lte": value_thickness_max
                                }
                            }
                        },
                        {
                            "$addFields": {
                                "main_camera_tot": {
                                    $cond: {
                                        if: bool_main_camera,
                                        then: {
                                            $arrayElemAt: [{$objectToArray: "$data.main camera"}, 0]
                                        },
                                        else: []
                                    }
                                },
                                "selfie_camera_tot": {
                                    $cond: {
                                        if: bool_selfie_camera,
                                        then: {
                                            $arrayElemAt: [{$objectToArray: "$data.selfie camera"}, 0]
                                        },
                                        else: []
                                    }
                                }
                            }
                        },
                        {
                            "$addFields": {
                                discount: {
                                    $cond: {
                                        if: bool_main_camera,
                                        then: {
                                            $cond: {
                                                if: fnumber_checker_main_camera,
                                                then: "\\d{1,3}(\\.\\d{1,3})? (MP, f/)\\d{1,3}(\\.\\d{1,3})?",
                                                else: "\\d{1,3}(\\.\\d{1,3})? (MP)"
                                            }
                                        },
                                        else: []
                                    }
                                },
                                discount1: {
                                    $cond: {
                                        if: bool_selfie_camera,
                                        then: {
                                            $cond: {
                                                if: fnumber_checker_selfie_camera,
                                                then: "\\d{1,3}(\\.\\d{1,3})? (MP, f/)\\d{1,3}(\\.\\d{1,3})?",
                                                else: "\\d{1,3}(\\.\\d{1,3})? (MP)"
                                            }
                                        },
                                        else: []
                                    }
                                }
                            }
                        },
                        {
                            "$addFields": {
                                main_camera_det: {
                                    $cond: {
                                        if: bool_main_camera,
                                        then: {
                                            "$regexFindAll": {
                                                "input": "$main_camera_tot.v",
                                                "regex": "$discount"
                                            }
                                        },
                                        else: []
                                    }
                                },
                                selfie_camera_det: {
                                    $cond: {
                                        if: bool_selfie_camera,
                                        then: {
                                            "$regexFindAll": {
                                                "input": "$selfie_camera_tot.v",
                                                "regex": "$discount1"
                                            }
                                        },
                                        else: []
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                main_camera_det_det: {
                                    $cond: {
                                        if: bool_main_camera,
                                        then: {
                                            $map: {
                                                input: "$main_camera_det",
                                                as: "main15",
                                                in: {
                                                    "$regexFindAll": {
                                                        "input": "$$main15.match",
                                                        "regex": "\\d{1,3}(\\.\\d{1,3})?"
                                                    }
                                                }
                                            }
                                        },
                                        else: []
                                    }
                                },
                                selfie_camera_det_det: {
                                    $cond: {
                                        if: bool_selfie_camera,
                                        then: {
                                            $map: {
                                                input: "$selfie_camera_det",
                                                as: "main15",
                                                in: {
                                                    "$regexFindAll": {
                                                        "input": "$$main15.match",
                                                        "regex": "\\d{1,3}(\\.\\d{1,3})?"
                                                    }
                                                }
                                            }
                                        },
                                        else: []
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                main_camera_det_det_det: {
                                    $cond: {
                                        if: bool_main_camera,
                                        then: {
                                            $map: {
                                                input: "$main_camera_det_det",
                                                as: "main19",
                                                in: {
                                                    $map: {
                                                        input: "$$main19.match",
                                                        as: "main20",
                                                        in: {
                                                            $convert: {
                                                                "input": "$$main20",
                                                                "to": "double",
                                                                "onError": "no digit matched"
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        else: []
                                    }
                                },
                                selfie_camera_det_det_det: {
                                    $cond: {
                                        if: bool_selfie_camera,
                                        then: {
                                            $map: {
                                                input: "$selfie_camera_det_det",
                                                as: "main19",
                                                in: {
                                                    $map: {
                                                        input: "$$main19.match",
                                                        as: "main20",
                                                        in: {
                                                            $convert: {
                                                                "input": "$$main20",
                                                                "to": "double",
                                                                "onError": "no digit matched"
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        else: []
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                main_camera_det_det_det: {
                                    $cond: {
                                        if: bool_main_camera,
                                        then: {
                                            $filter: {
                                                input: "$main_camera_det_det_det",
                                                as: "item",
                                                cond: {$eq: ["$$item", {$max: "$main_camera_det_det_det"}]}
                                            }
                                        },
                                        else: []
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                main_camera_det_det_bool: {
                                    $cond: {
                                        if: bool_main_camera,
                                        then: {
                                            $map: {
                                                input: "$main_camera_det_det_det",
                                                as: "main21",
                                                in: {
                                                    $and: [
                                                        {$gte: [{$arrayElemAt: ["$$main21", 0]}, value_main_camera_min]}, {$lte: [{$arrayElemAt: ["$$main21", 0]}, value_main_camera_max]},
                                                        {
                                                            $cond: {
                                                                if: fnumber_checker_main_camera,
                                                                then: {$gte: [{$arrayElemAt: ["$$main21", 1]}, value_main_camera_fnumber_min]},
                                                                else: true
                                                            }
                                                        },
                                                        {
                                                            $cond: {
                                                                if: fnumber_checker_main_camera,
                                                                then: {$lte: [{$arrayElemAt: ["$$main21", 1]}, value_main_camera_fnumber_max]},
                                                                else: true
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        else: [true]
                                    }
                                },
                                selfie_camera_det_det_bool: {
                                    $cond: {
                                        if: bool_selfie_camera,
                                        then: {
                                            $map: {
                                                input: "$selfie_camera_det_det_det",
                                                as: "main23",
                                                in: {
                                                    $and: [
                                                        {$gte: [{$arrayElemAt: ["$$main23", 0]}, value_self_camera_min]}, {$lte: [{$arrayElemAt: ["$$main23", 0]}, value_self_camera_max]},
                                                        {
                                                            $cond: {
                                                                if: fnumber_checker_selfie_camera,
                                                                then: {$gte: [{$arrayElemAt: ["$$main23", 1]}, value_self_camera_fnumber_min]},
                                                                else: true
                                                            }
                                                        },
                                                        {
                                                            $cond: {
                                                                if: fnumber_checker_selfie_camera,
                                                                then: {$lte: [{$arrayElemAt: ["$$main23", 1]}, value_self_camera_fnumber_max]},
                                                                else: true
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        else: []
                                    }
                                }
                            }
                        },
                        {
                            $match: {
                                "title": {'$regex': value_brands, '$options': 'i'},
                                "data.display.type": {'$regex': '', '$options': 'i'},
                                "data.features.sensors": {'$regex': '', '$options': 'i'},
                                "data.platform.os": {'$regex': platform_os, '$options': 'i'},
                                "data.platform.chipset": {'$regex': value_cpu, '$options': 'i'},
                                "data.body.sim": {'$regex': value_count_sim, '$options': 'i'},
                                "data.platform.cpu": {'$regex': value_count_core, '$options': 'i'},
                                "data.network.technology": {'$regex': value_bounds, '$options': 'i'},
                                "data.misc.colors": {'$regex': value_colors, '$options': 'i'}

                            }
                        }, {
                            $match: {
                                "data.body.sim": {'$regex': value_type_sim, '$options': 'i'},
                            }
                        },
                        {
                            $addFields: {
                                sa: bool_selfie_camera
                            }
                        },
                        {
                            $match: {
                                $or: [
                                    {$and: [{"selfie_camera_det_det_bool": {"$in": [true]}}, {sa: true}]},
                                    {$and: [{'selfie_camera_det_det_bool': {'$in': [[]]}}, {sa: false}]}
                                ], "main_camera_det_det_bool": true
                            }
                        },
                        {
                            "$addFields": {
                                "battery": {
                                    $cond: {
                                        if: bool_battery,
                                        then: {
                                            "$regexFindAll": {
                                                "input": "$data.battery.type",
                                                "regex": "\\d{1,5}(\\.\\d{1,5})? (mAh)"
                                            }
                                        },
                                        else: []
                                    }
                                }
                            }
                        },
                        {
                            "$addFields": {
                                "battery_detail": {
                                    $cond: {
                                        if: bool_battery,
                                        then: {
                                            "$convert": {
                                                "input": {
                                                    $substr: [{$arrayElemAt: ['$battery.match', 0]}, 0, {$indexOfBytes: [{$arrayElemAt: ['$battery.match', 0]}, " mAh"]}]
                                                },
                                                "to": "double",
                                                "onError": "no digit matched"
                                            }
                                        },
                                        else: 3500
                                    }
                                }
                            }
                        }, {
                            $match: {
                                "battery_detail": {
                                    "$gte": value_battery_min,
                                    "$lte": value_battery_max
                                }
                            }
                        },
                        {
                            "$addFields": {
                                "field": {
                                    $cond: {
                                        if: bool_price,
                                        then: {
                                            "$objectToArray": "$price"
                                        },
                                        else: []
                                    }
                                }
                            }
                        },
                        {
                            "$addFields": {
                                "field_tr1": {
                                    $cond: {
                                        if: bool_price,
                                        then: {
                                            $map: {
                                                input: "$field",
                                                as: "main8",
                                                in: {
                                                    $map: {
                                                        input: {"$objectToArray": "$$main8.v"},
                                                        as: "main9",
                                                        in: {
                                                            $map: {
                                                                input: {"$objectToArray": "$$main9.v"},
                                                                as: "main11",
                                                                in: {
                                                                    $cond: {
                                                                        if: {"$eq": [{'$type': "$$main11.v"}, "object"]},
                                                                        then: {
                                                                            $map: {
                                                                                input: {"$objectToArray": "$$main11.v"},
                                                                                as: "main12",
                                                                                in: '$$main12.v.price'
                                                                            }
                                                                        },
                                                                        else: true
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        else: []
                                    }
                                }
                            }
                        }, {
                            "$addFields": {
                                'sals': {
                                    $cond: {
                                        if: bool_price,
                                        then: {
                                            $reduce: {
                                                input: '$field_tr1',
                                                initialValue: [],
                                                in: {$concatArrays: ["$$value", "$$this"]}
                                            }
                                        },
                                        else: []
                                    }
                                }
                            }
                        }, {
                            "$addFields": {
                                'sals1': {
                                    $cond: {
                                        if: bool_price,
                                        then: {
                                            $reduce: {
                                                input: '$sals',
                                                initialValue: [],
                                                in: {$concatArrays: ["$$value", "$$this"]}
                                            }
                                        },
                                        else: []
                                    }
                                }
                            }
                        },
                        {
                            "$addFields": {
                                'sals2': {
                                    $cond: {
                                        if: bool_price,
                                        then: {
                                            $reduce: {
                                                input: '$sals1',
                                                initialValue: [],
                                                in: {
                                                    $concatArrays: [{
                                                        $cond: {
                                                            if: {"$eq": [{'$type': "$$value"}, "array"]},
                                                            then: '$$value',
                                                            else: []
                                                        }
                                                    },
                                                        {
                                                            $cond: {
                                                                if: {"$eq": [{'$type': "$$this"}, "array"]},
                                                                then: '$$this',
                                                                else: []
                                                            }
                                                        }]
                                                }
                                            }
                                        },
                                        else: []
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                sals3: {
                                    $cond: {
                                        if: bool_price,
                                        then: {
                                            $map: {
                                                input: "$sals2",
                                                as: "main22",
                                                in: {
                                                    $convert: {
                                                        "input": "$$main22",
                                                        "to": "double",
                                                        "onError": "no digit matched"
                                                    }
                                                }
                                            }
                                        },
                                        else: []
                                    }
                                }
                            }
                        }, {
                            $addFields: {
                                sals3: {
                                    $cond: {
                                        if: bool_price,
                                        then: {
                                            $filter: {
                                                input: "$sals3",
                                                as: "item",
                                                cond: {$eq: ["$$item", {$min: "$sals3"}]}
                                            }
                                        },
                                        else: []
                                    }
                                }
                            }
                        },
                        {$addFields: {sals3: {$arrayElemAt: ['$sals3', 0]}}},
                        {
                            $addFields: {
                                price_bool: {
                                    $cond: {
                                        if: bool_price,
                                        then: {
                                            $and: [
                                                {
                                                    $gte: ['$sals3', value_price_min]
                                                }, {
                                                    $lte: ['$sals3', value_price_max]
                                                }
                                            ]
                                        },
                                        else: []
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                checker: {
                                    $cond: {
                                        if: {$and: [{"$eq": [value_price_max, 70000000]}, {"$eq": [value_price_min, 1000000]}]},
                                        then: false,
                                        else: true
                                    }
                                },
                                checker1: {
                                    $cond: {
                                        if: {"$eq": [value_price_only_price, "true"]},
                                        then: true,
                                        else: false
                                    }
                                }
                            }
                        }
                        ,
                        {
                            $match: {
                                $or: [
                                    {$and: [{"price_bool": {"$in": [true]}}, {'checker1': {'$in': [true]}}]},
                                    {$and: [{"price_bool": {"$in": [true]}}, {'checker1': {'$in': [false]}}]},
                                    {$and: [{"price_bool": {"$in": [[]]}}, {'checker': {'$in': [false]}}, {'checker1': {'$in': [false]}}]},
                                    {$and: [{"price_bool": {"$in": [null]}}, {'checker': {'$in': [false]}}, {'checker1': {'$in': [false]}}]}
                                ]
                            }
                        }
                        ,
                        update
                        ,
                        {
                            $project: {
                                _id: 0,
                                status: 0,
                                results: 0,
                                data: 0,
                                checker: 0,
                                results1: 0,
                                checker1: 0,
                                sa: 0,
                                price_bool: 0,
                                results2: 0,
                                sals3: 0,
                                "dimen-detail-detail": 0,
                                mohem: 0,
                                battery: 0,
                                'battery_detail': 0,
                                'img_det': 0,
                                'title_an_fa': 0,
                                'density_size': 0,
                                'density_size1': 0,
                                'density_size2': 0,
                                launch: 0,
                                weight: 0,
                                sals1: 0,
                                sals2: 0,
                                sals: 0,
                                field: 0,
                                field_tr1: 0,
                                "display-type": 0,
                                "height": 0,
                                brand_title: 0,
                                discount: 0,
                                "platform-chipset": 0,
                                discount1: 0,
                                colors: 0,
                                "features-sensors": 0,
                                "width": 0,
                                'selfie_camera_det_det_det': 0,
                                "thickness": 0,
                                "main_camera_det_det_bool": 0,
                                "selfie_camera_det_det_bool": 0,
                                "selfie_camera_tot": 0,
                                "main_camera_tot": 0,
                                "platform-os": 0,
                                "title_an": 0,
                                "main_camera_det": 0,
                                "selfie_camera_det": 0,
                                "selfie_camera_det_det": 0,
                                "main_camera_det_det": 0,
                                "dimen-detail": 0,
                                sds: 0
                            }
                        }
                    ]).toArray(async function (err, result) {
                        // if (err) throw err;
                        // console.log(bool_selfie_camera);
                        db.close();
                        var array_new = [];
                        var array_new1 = [];
                        if (result.length > 48) {
                            for (var i = 0; i < 48; ++i) {
                                array_new.push(result[i]);
                            }
                            io.to(job.attrs.data.sockeid).emit('phone-search-auto', {
                                len: result.length,
                                firs: 'true',
                                msg: array_new
                            });
                            for (var i = 48; i < result.length; ++i) {
                                array_new1.push(result[i]);
                            }
                            io.to(job.attrs.data.sockeid).emit('phone-search-auto', {
                                len: result.length,
                                firs: 'false',
                                msg: array_new1
                            });
                        } else {
                            booleans = false;
                            io.to(job.attrs.data.sockeid).emit('phone-search-auto', {
                                len: result.length,
                                firs: 'true',
                                msg: result
                            });
                        }
                    });
                });
                done();
                await job.touch();
                // await agenda.cancel({name: socket.id});
                // await job.remove();
                // job.remove();
            } catch (e) {
                console.log(e)
                done();
                await job.touch();
                // job.remove();
                // await job.remove();
            }
        } else {
            console.log('sdas');
            done();
            await job.touch();
            // await agenda.cancel({name: socket.id});
            // job.remove();
            // await job.remove();
        }
    });
} catch (err) {
    fs.appendFile('/home/admin/domains/world.iran33.ir/err.txt', '\n' + err, function (err, data) {
        if (err) {
            return console.log(err);
        }
    });
}

process.on('uncaughtException', function (err) {
    console.error('Something bad happened: ', err);
    fs.appendFile('/home/admin/domains/world.iran33.ir/err.txt', '\n' + err, function (err, data) {
        if (err) {
            return console.log(err);
        }
    });
});

async function graceful() {
    await agenda.stop();
    process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);
