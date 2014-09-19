function loadScript(url, callback)
{
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onreadystatechange = callback;
    script.onload = callback;
    head.appendChild(script);
}

loadScript('jquery-1.7.1.min.js', function() {
    loadScript('turtle.js', function() {
        $('body').css('padding', '0');
        $('body').css('margin', '0');
        $('body').css('background-color', '#000');
        $('body').css('text-align', 'center');

        $('body').append("<canvas id='canvas' width='700' height='700'>");
        initCanvas();
        window.onerror = function(msg, url, line) {
            console.log(msg, url, line);
        };
        main();
    });
});
