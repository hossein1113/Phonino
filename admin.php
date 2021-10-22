<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
    <meta charset="UTF-8">
    <title>admin</title>
    <link rel="preload" href="/fonts/IRANSansWeb_Light.woff" as="font" crossorigin="anonymous"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<script src="node_modules/socket.io-client/dist/socket.io-1.js"></script>
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
<style>
    .fb9 {
        border: 1px solid #3366FF;
        background-color: #B3C6FF;
        width: 150px;
        height: 30px;
    }

    input[type=text], select, textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        resize: vertical;
        height: 400px;
        color: #151f33
    }
</style>
<body style="text-align: center">
<script>
    function onSubmit(token) {
        document.getElementById('sum').removeAttribute('disabled');
    }


</script>
<form id="demo-form" style="text-align: center" action="admin.php" method="post">
    <div>
        <label for="name">password:</label>
        <input type="password" style="padding: 10px" name="password" required>
    </div>
    <div data-callback="onSubmit" class="g-recaptcha" data-sitekey="6Ld6liwaAAAAABS96bnHfofjA2-wvksomRN8QCP2"></div>
    <input id="sum" name="submit" value="Submit" type="submit" disabled>
</form>
<script>
    var io;
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
        }
    };

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
</body>
<?php
if (isset($_POST['submit'])) {
    if ($_POST['password'] == '') {
        echo "<script type='text/javascript'>
                document.getElementById('demo-form').style.display = 'none';
                var input = document.createElement('textarea');
                var button = document.createElement('button');
//                button.setAttribute('click', send(this));
                input.id = 'sender';
                button.onclick = send12;
                button.textContent = 'ارسال' ;
                document.body.appendChild(input);
               
                document.body.appendChild(button);
                </script>";
    } else {
        echo "<script type='text/javascript'>
                alert('نمیتوانید وارد شوید رمز و یا کد ورود اشتباه است');
                </script>";
    }
}
?>
