<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
    <meta charset="UTF-8">
    <title>admin</title>
    <link rel="preload" href="/fonts/IRANSansWeb_Light.woff" as="font" crossorigin="anonymous"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
</head>
<script>
    function onSubmit(token) {
        document.getElementById('sum').removeAttribute('disabled');
    }


</script>
<script src="node_modules/socket.io-client/dist/socket.io-1.js"></script>
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
<style>
    @font-face {
        font-display: swap;
        font-family: 'IRANSansWeb_Light';
        src: url('fonts/IRANSansWeb_Light.eot?#') format('eot'),
            /* IE6–۸ */ url('fonts/IRANSansWeb_Light.woff') format('woff'),
            /* FF3.6+, IE9, Chrome6+, Saf5.1+*/ url('fonts/IRANSansWeb_Light.ttf') format('truetype');
        /* Saf3—۵, Chrome4+, FF3.5, Opera 10+ */
    }
    body{
        font-family: IRANSansWeb_Light, serif;
    }
    .fb9 {
        border: 1px solid #3366FF;
        background-color: #B3C6FF;
        width: 150px;
        height: 30px;
    }
    /*Copied from bootstrap to handle input file multiple*/
    .btn {
        display: inline-block;
        padding: 6px 12px;
        margin-bottom: 0;
        font-size: 14px;
        font-weight: normal;
        line-height: 1.42857143;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-image: none;
        border: 1px solid transparent;
        border-radius: 4px;
    }
    /*Also */
    .btn-success {
        border: 1px solid #c5dbec;
        background: #d0e5f5;
        font-weight: bold;
        color: #2e6e9e;
    }
    /* This is copied from https://github.com/blueimp/jQuery-File-Upload/blob/master/css/jquery.fileupload.css */
    .fileinput-button {
        position: relative;
        overflow: hidden;
    }

    .fileinput-button input {
        position: absolute;
        top: 0;
        right: 0;
        margin: 0;
        opacity: 0;
        -ms-filter: "alpha(opacity=0)";
        font-size: 200px;
        direction: ltr;
        cursor: pointer;
    }

    .thumb {
        height: auto;
        width: 80px;
        border: 1px solid #000;
    }

    ul.thumb-Images li {
        /*width: 120px;*/
        margin: 10px;
        float: left;
        display: inline-block;
        vertical-align: top;
        /*height: 120px;*/
    }

    .img-wrap {
        position: relative;
        display: inline-block;
        font-size: 0;
    }

    .img-wrap .close {
        position: absolute;
        top: 2px;
        right: 2px;
        z-index: 100;
        background-color: #d0e5f5;
        padding: 5px 2px 2px;
        color: #000;
        font-weight: bolder;
        cursor: pointer;
        opacity: 0.5;
        font-size: 23px;
        line-height: 10px;
        border-radius: 50%;
    }

    .img-wrap:hover .close {
        opacity: 1;
        background-color: #ff0000;
    }

    .FileNameCaptionStyle {
        font-size: 12px;
    }

    #sender {
        width: 100%;
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        resize: vertical;
        height: 400px;
        color: #151f33;
    }
    .cl{
        width: 100%;
        padding: 12px;
        text-align: center;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        resize: vertical;
        margin-top: 20px;
        height: 400px;
        color: #151f33;
    }
    .oeu{

        width: 50%;
        text-align: center;
        display: inherit;
        margin: 15px auto;
        /*margin-left: 25%;*/
        padding: 10px;
        /*text-align: center;*/
        height: auto;
    }
</style>
<body style="text-align: center">
<form id="demo-form" style="text-align: center" action="Test/admin_test.php" method="post">
    <div>
        <label for="name">password:</label>
        <input type="password" style="padding: 10px" name="password" required>
    </div>
    <div data-callback="onSubmit" class="g-recaptcha" data-sitekey="6Ld6liwaAAAAABS96bnHfofjA2-wvksomRN8QCP2"></div>
    <input id="sum" name="submit" value="Submit" type="submit" disabled>
</form>
<div id="fdsa" style="text-align: center;display: none;">
    <h2 style="text-align: center">edit title and image only</h2>
    <textarea class="oeu" id="search_edit_title_only" placeholder="لطفا نام انگلیسی گوشی را وارد کنید" name="submit" ></textarea>
    <input onclick="find_only()" id="find_only" name="submit" value="جستجو"   type="submit">
    <textarea class="oeu" id="title" placeholder="نام انگلیسی" ></textarea>
    <textarea dir="rtl" class="oeu" id="title_per" placeholder="نام فارسی" ></textarea>
    <textarea class="oeu" placeholder="مسیر ذخیره عکس" id="image" ></textarea>
    <textarea class="oeu" placeholder="نام انگلیسی دیگر" id="title_an" ></textarea>
    <textarea dir="rtl" class="oeu" placeholder="نام فارسی دیگر" id="title_an_fa" ></textarea>
    <input onclick="repair_data_only()" id="repair_data_only" name="submit" value="ویرایش"  type="submit">
<!--    <input class="oeu" id="title" placeholder="نام انگلیسی" type="text">-->
<!--    <input dir="rtl" class="oeu" id="title_per" placeholder="نام فارسی" type="text">-->
<!--    <input class="oeu" placeholder="مسیر ذخیره عکس" id="image" type="text">-->


    <h2 style="text-align: center">edit all data</h2>
<!--    <input class="oeu" id="search_edit_all" name="submit" value="Submit" type="text">-->
    <textarea class="oeu" id="search_edit_all_only" placeholder="لطفا نام انگلیسی گوشی را وارد کنید" name="submit" ></textarea>
    <input onclick="find_all()" id="find_all" name="submit" value="جستجو" type="submit">
    <textarea style="text-align: left" class="cl" placeholder="تمام اطلاعات" id="search_edit_all" ></textarea>
    <input onclick="repair_data_all()" name="submit" value="ویرایش" type="submit">
<!--    <h2 style="text-align: center">insert image</h2>-->
<!--    <div dir="ltr" style="direction: ltr;text-align: left">-->
<!--        <label dir="ltr" style="font-size: 14px;">-->
<!--            <span style='color:navy;font-weight:bold'>Attachment Instructions :</span>-->
<!--        </label>-->
<!--        <ul dir="ltr">-->
<!--            <li>-->
<!--                Allowed only files with extension (jpg, png, gif)-->
<!--            </li>-->
<!--            <li>-->
<!--                Maximum number of allowed files 10 with 300 KB for each-->
<!--            </li>-->
<!--            <li>-->
<!--                you can select files from different folders-->
<!--            </li>-->
<!--        </ul>-->
        <!--To give the control a modern look, I have applied a stylesheet in the parent span.-->
<!--        <input onclick="store_img()" name="submit" value="ارسال" type="submit">-->
<!--        <span class="btn btn-success fileinput-button">-->
<!---->
<!--            <span>Select Attachment</span>-->
<!--<input type="file" name="file" id="files" multiple accept="image/jpeg, image/png, image/gif,"><br />-->
<!--        </span>-->
<!--        <form action="/upload" method="post" enctype="multipart/form-data">-->
<!---->
<!---->
<!--        </form>-->
<!--        <output id="Filelist"></output>-->
<!---->
<!--    </div>-->
    <div style="margin-top: 20px">
        <h2 style="text-align: center">insert data</h2>
    </div>

</div>
<script>
    var io;
    var id;
    var id1;
    var app = {
        socket: null,
        connect: function () {
            var self = this;
            if (self.socket) {
                self.socket.destroy();
                delete self.socket;
                self.socket = null;
            }
            this.socket = io.connect('https://world.fesgr.com:3303', {
                transports: ['websocket'],
                withCredentials: true,
                extraHeaders: {
                    'my-custom-header': 'abcd'
                },
                secure: true,
                'reconnection': true,
                'reconnectionAttempts': 3,
                'reconnectionDelay': 1000,
                'reconnectionDelayMax': 3000
            });
            this.socket.on('connect', function () {
                console.log('connected to server');
            });
            this.socket.on('disconnect', function () {
                console.log('disconnected from server');
            });
            this.socket.on('insert_data', function (message) {
                alert(message);
            });
            this.socket.on('search_edit_title_only', function (message) {
                if(message.length > 0){
                    document.getElementById('title').value = message[0].title;
                    document.getElementById('title_per').value = message[0].title_f;
                    document.getElementById('image').value = message[0].img;
                    id = message[0]._id;
                    if(message[0].title_an !== undefined){
                        document.getElementById('title_an').value = message[0].title_an;
                    }else{
                        document.getElementById('title_an').value = '';
                    }
                    if(message[0].title_an_fa !== undefined){
                        document.getElementById('title_an_fa').value = message[0].title_an_fa;
                    }else{
                        document.getElementById('title_an_fa').value = '';
                    }
                }else {
                    alert('چنین نامی وجود ندارد');
                }

                console.log(message);
            });
            this.socket.on('search_edit_all_only', function (message) {
                // var jsonString = '{"some":"json"}';
                // console.log(syntaxHighlight(message[0]));
                if(message.length > 0){
                id1 = message[0]._id;
                // console.log(id1);
                document.getElementById('search_edit_all').value = JSON.stringify(message[0], null, '\t');
                }else {
                    alert('چنین نامی وجود ندارد');
                }
            });
            this.socket.on('search_edit_title_only_back', function (message) {
                alert(message);
                document.getElementById('title').value = '';
                document.getElementById('title_per').value = '';
                document.getElementById('image').value = '';
                document.getElementById('title_an').value = '';
                document.getElementById('title_an_fa').value = '';
                id='';
                // console.log('sasasasa');
            });

            this.socket.on('search_edit_all_only_back', function (message) {
                id1='';
                alert(message);
                // console.log(id1);
                document.getElementById('search_edit_all').value = '';
            });
        }
    };
    // function syntaxHighlight(json) {
    //     if (typeof json != 'string') {
    //         json = JSON.stringify(json, undefined, 2);
    //     }
    //     json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    //     return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    //         var cls = 'number';
    //         if (/^"/.test(match)) {
    //             if (/:$/.test(match)) {
    //                 cls = 'key';
    //             } else {
    //                 cls = 'string';
    //             }
    //         } else if (/true|false/.test(match)) {
    //             cls = 'boolean';
    //         } else if (/null/.test(match)) {
    //             cls = 'null';
    //         }
    //         return '<span class="' + cls + '">' + match + '</span>';
    //     });
    // }
    function repair_data_all() {
        if(!document.getElementById('search_edit_all').value && !id1){
            alert('فیلد حاوی فایل جیسون خالیست');
        }else{
            var cars = [id1,
                JSON.parse(document.getElementById('search_edit_all').value)];
            // if(!app){
            app.connect();
            // }
            app.socket.emit('search_edit_all_only_back',cars);
        }
    }
    function repair_data_only() {
        if(!document.getElementById('title').value || !document.getElementById('title_per').value ||
            !document.getElementById('image').value || !id){
            alert(' حداقل یکی از سه فیلد الزامی خالیست');
        }else{
            var cars = [id,document.getElementById('title').value,
                document.getElementById('title_per').value, document.getElementById('image').value,
                document.getElementById('title_an').value, document.getElementById('title_an_fa').value ];
            // if(!app){
            app.connect();
            // }
            app.socket.emit('search_edit_title_only_back',cars);
        }
    }
    function find_only() {
        if(document.getElementById('search_edit_title_only').value !== ''
            && document.getElementById('search_edit_title_only').value !== null){
            app.connect();
            app.socket.emit('search_edit_title_only',document.getElementById('search_edit_title_only').value);
        }else{
            alert('بالا خالیه!!');
        }
    }
    function find_all() {
        if(document.getElementById('search_edit_all_only').value !== ''
            && document.getElementById('search_edit_all_only').value !== null){
            app.connect();
            app.socket.emit('search_edit_all_only',document.getElementById('search_edit_all_only').value);
        }else{
            alert('بالا خالیه!!');
        }
    }
    function send12() {
        var input = document.getElementById('sender').value;
        console.log(input);
        if(input){
            app.connect();
            app.socket.emit('insert_data',JSON.parse(input));
        }else {
            alert('please fill');
        }
    }
</script>
<script>
    //I added event handler for the file upload control to access the files properties.
    document.addEventListener("DOMContentLoaded", init, false);

    //To save an array of attachments
    var AttachmentArray = [];

    //counter for attachment array
    var arrCounter = 0;

    //to make sure the error message for number of files will be shown only one time.
    var filesCounterAlertStatus = false;

    //un ordered list to keep attachments thumbnails
    var ul = document.createElement("ul");
    ul.className = "thumb-Images";
    ul.style.height = '450px';
    ul.id = "imgList";

    function init() {
        //add javascript handlers for the file upload event
        document
            .querySelector("#files")
            .addEventListener("change", handleFileSelect, false);
    }

    //the handler for file upload event
    function handleFileSelect(e) {
        //to make sure the user select file/files
        if (!e.target.files) return;

        //To obtaine a File reference
        var files = e.target.files;

        // Loop through the FileList and then to render image files as thumbnails.
        for (var i = 0, f; (f = files[i]); i++) {
            //instantiate a FileReader object to read its contents into memory
            var fileReader = new FileReader();

            // Closure to capture the file information and apply validation.
            fileReader.onload = (function(readerEvt) {
                return function(e) {
                    //Apply the validation rules for attachments upload
                    ApplyFileValidationRules(readerEvt);

                    //Render attachments thumbnails.
                    RenderThumbnail(e, readerEvt);

                    //Fill the array of attachment
                    FillAttachmentArray(e, readerEvt);
                };
            })(f);

            // Read in the image file as a data URL.
            // readAsDataURL: The result property will contain the file/blob's data encoded as a data URL.
            // More info about Data URI scheme https://en.wikipedia.org/wiki/Data_URI_scheme
            fileReader.readAsDataURL(f);
        }
        document
            .getElementById("files")
            .addEventListener("change", handleFileSelect, false);
    }

    //To remove attachment once user click on x button
    jQuery(function($) {
        $("div").on("click", ".img-wrap .close", function() {
            var id = $(this)
                .closest(".img-wrap")
                .find("img")
                .data("id");

            //to remove the deleted item from array
            var elementPos = AttachmentArray.map(function(x) {
                return x.FileName;
            }).indexOf(id);
            if (elementPos !== -1) {
                AttachmentArray.splice(elementPos, 1);
            }

            //to remove image tag
            $(this)
                .parent()
                .find("img")
                .not()
                .remove();

            //to remove div tag that contain the image
            $(this)
                .parent()
                .find("div")
                .not()
                .remove();

            //to remove div tag that contain caption name
            $(this)
                .parent()
                .parent()
                .find("div")
                .not()
                .remove();

            //to remove li tag
            var lis = document.querySelectorAll("#imgList li");
            for (var i = 0; (li = lis[i]); i++) {
                if (li.innerHTML === "") {
                    li.parentNode.removeChild(li);
                }
            }
        });
    });

    //Apply the validation rules for attachments upload
    function ApplyFileValidationRules(readerEvt) {
        //To check file type according to upload conditions
        if (CheckFileType(readerEvt.type) === false) {
            alert(
                "The file (" +
                readerEvt.name +
                ") does not match the upload conditions, You can only upload jpg/png/gif files"
            );
            e.preventDefault();
            return;
        }

        //To check file Size according to upload conditions
        if (CheckFileSize(readerEvt.size) === false) {
            alert(
                "The file (" +
                readerEvt.name +
                ") does not match the upload conditions, The maximum file size for uploads should not exceed 300 KB"
            );
            e.preventDefault();
            return;
        }

        //To check files count according to upload conditions
        if (CheckFilesCount(AttachmentArray) === false) {
            if (!filesCounterAlertStatus) {
                filesCounterAlertStatus = true;
                alert(
                    "You have added more than 10 files. According to upload conditions you can upload 10 files maximum"
                );
            }
            e.preventDefault();

        }
    }

    //To check file type according to upload conditions
    /**
     * @return {boolean}
     */
    function CheckFileType(fileType) {
        if (fileType === "image/jpeg") {
            return true;
        } else if (fileType === "image/png") {
            return true;
        } else return fileType === "image/gif";
        return true;
    }

    //To check file Size according to upload conditions
    /**
     * @return {boolean}
     */
    function CheckFileSize(fileSize) {
        return fileSize < 300000;
        return true;
    }

    //To check files count according to upload conditions
    function CheckFilesCount(AttachmentArray) {
        //Since AttachmentArray.length return the next available index in the array,
        //I have used the loop to get the real length
        var len = 0;
        for (var i = 0; i < AttachmentArray.length; i++) {
            if (AttachmentArray[i] !== undefined) {
                len++;
            }
        }
        //To check the length does not exceed 10 files maximum
        if (len > 9) {
            return false;
        } else {
            return true;
        }
    }

    //Render attachments thumbnails.
    function RenderThumbnail(e, readerEvt) {
        var li = document.createElement("li");
        ul.appendChild(li);
        li.innerHTML = [
            '<div class="img-wrap"> <span class="close">&times;</span>' +
            '<img class="thumb" src="',
            e.target.result,
            '" title="',
            escape(readerEvt.name),
            '" data-id="',
            readerEvt.name,
            '"/>' + "</div>"
        ].join("");

        var div = document.createElement("div");
        div.className = "FileNameCaptionStyle";
        li.appendChild(div);
        div.innerHTML = [readerEvt.name].join("");
        document.getElementById("Filelist").insertBefore(ul, null);
    }

    //Fill the array of attachment
    function FillAttachmentArray(e, readerEvt) {
        AttachmentArray[arrCounter] = {
            AttachmentType: 1,
            ObjectType: 1,
            FileName: readerEvt.name,
            FileDescription: "Attachment",
            NoteText: "",
            MimeType: readerEvt.type,
            Content: e.target.result.split("base64,")[1],
            FileSizeInBytes: readerEvt.size
        };
        arrCounter = arrCounter + 1;
    }
    function store_img() {
        let photo = document.getElementById("files").files[0];
        app.socket.emit('send_image',photo);
    }
</script>
</body>
<?php
if (isset($_POST['submit'])) {
    if ($_POST['password'] == 'Fasihi11#') {
        echo "<script type='text/javascript'>
               
                document.getElementById('demo-form').style.display = 'none';
                var input = document.createElement('textarea');
                var button = document.createElement('button');
                input.id = 'sender';
                button.onclick = send12;
                button.textContent = 'ارسال' ;
                document.body.appendChild(input);
                document.body.appendChild(button);
                document.getElementById('fdsa').style.display = 'block';
                </script>";
    } else {
        echo "<script type='text/javascript'>
                alert('نمیتوانید وارد شوید رمز و یا کد ورود اشتباه است');
                </script>";
    }
}
?>
