function initCanvas()
{
    var element = document.getElementById("canvas");
    window.canvas_height = $(element).attr('height');
    window.imageContext = element.getContext("2d");
    window.turtle_x = 350.0;
    window.turtle_y = 350.0;
    window.turtle_phi = Math.PI * 0.5;
    window.turtle_down = true;
    window.turtle_stack = [];
    fillRect(0, 0, 10000, 10000, '#000040');
    window.imageContext.lineWidth = 1.5;
    window.imageContext.strokeStyle = '#ffffff';
}

function fillRect(x0, y0, x1, y1, color)
{
    window.imageContext.fillStyle = color;
    window.imageContext.strokeStyle = "none";
    window.imageContext.fillRect(x0 + 0.5, y0 + 0.5, x1 - x0 + 1, y1 - y0 + 1);
}

function forward(distance)
{
    if (window.turtle_down)
    {
        window.imageContext.beginPath();
        window.imageContext.moveTo(window.turtle_x, window.canvas_height - window.turtle_y);
    }
    window.turtle_x += Math.cos(window.turtle_phi) * distance;
    window.turtle_y += Math.sin(window.turtle_phi) * distance;
    if (window.turtle_down)
    {
        window.imageContext.lineTo(window.turtle_x, window.canvas_height - window.turtle_y);
        window.imageContext.stroke();
    }
}

function left(angle)
{
    window.turtle_phi += angle * Math.PI / 180.0;
}

function right(angle)
{
    window.turtle_phi -= angle * Math.PI / 180.0;
}

function penup()
{
    window.turtle_down = false;
}

function pendown()
{
    window.turtle_down = true;
}

function push()
{
    window.turtle_stack.push([window.turtle_x, window.turtle_y, window.turtle_phi, window.turtle_down]);
}

function pop()
{
    var x = window.turtle_stack.pop();
    window.turtle_x = x[0];
    window.turtle_y = x[1];
    window.turtle_phi = x[2];
    window.turtle_down = x[3];
}

function setpos(x, y, phi)
{
    window.turtle_x = x;
    window.turtle_y = y;
    window.turtle_phi = phi * Math.PI / 180.0;
}

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

function parseColorToHtml(r, g, b)
{
    var xr = r.toString(16);
    var xg = g.toString(16);
    var xb = b.toString(16);
    if (xr.length < 2) xr = '0' + xr;
    if (xg.length < 2) xg = '0' + xg;
    if (xb.length < 2) xb = '0' + xb;
    return '#' + xr + xg + xb;
}

function clear(r, g, b)
{
    fillRect(0, 0, 10000, 10000, parseColorToHtml(r, g, b));
}

function color(r, g, b)
{
    window.imageContext.strokeStyle = parseColorToHtml(r, g, b);
}

loadScript('js/jquery-1.7.1.min.js', function() {
    $('body').css('padding', '0');
    $('body').css('margin', '0');
    $('body').css('background-color', '#000');
    $('body').css('text-align', 'center');

    $('body').append("<canvas id='canvas' width='700' height='700'>");
    initCanvas();
    window.onerror = function(msg, url, line) {
        console.log(msg, url, line);
    };
    if (typeof(animate) === 'function')
    {
        function _loop(time)
        {
            window.turtle_x = 350.0;
            window.turtle_y = 350.0;
            window.turtle_phi = Math.PI * 0.5;
            window.turtle_down = true;
            fillRect(0, 0, 10000, 10000, '#000040');
            window.imageContext.lineWidth = 1.5;
            window.imageContext.strokeStyle = '#ffffff';
            animate(time / 1000.0);
            requestAnimationFrame(_loop);
        }
        requestAnimationFrame(_loop);
    }
    else
    {
        try {
            main();
        } catch (e) {
            alert('Fehler: ' + e.message);
        }
    }
});
