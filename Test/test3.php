<html>
<head>
    <title>JSON/Atom Custom Search API Example</title>
</head>
<body>
<div id="content"></div>
<script>
    function hndlr(response) {
        console.log(response.items[0].pagemap.hproduct.length);
        for (var j = 0; j < response.items.length; j++) {
            if (response.items[j].pagemap.hproduct) {
                for (var i = 0; i < response.items[j].pagemap.hproduct.length; i++) {
                    //     var item = response.items[i];
                    // in production code, item.htmlTitle should have the HTML entities escaped.
                    if (response.items[j].pagemap.hproduct[i].fn === 'mophie Charge Stream Vent Mount 2A') {
                        document.getElementById("content").innerHTML += "<br>" + response.items[j].pagemap.hproduct[i].fn;
                    }
                }
            }
        }
    }
</script>
<script src="https://www.googleapis.com/customsearch/v1/siterestrict?key=AIzaSyD88TFM54-qQUwbWkS0nQ1CR46YUDlisPo&cx=55e64898a5d0fd5bd&q=mophie Charge Stream Vent Mount 2A&callback=hndlr">
</script>
</body>
</html>