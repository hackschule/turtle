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
    window.background_color = [0, 0x10, 0x40];
    fillRect(0, 0, 700, 700, '#001040');
    window.imageContext.lineWidth = 1.5;
    window.imageContext.strokeStyle = '#ffffff';
    if (typeof(window.let_it_snow) === 'undefined')
        window.let_it_snow = false;
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
    window.background_color = [r, g, b];
    fillRect(0, 0, 10000, 10000, parseColorToHtml(r, g, b));
}

function color(r, g, b)
{
    window.imageContext.strokeStyle = parseColorToHtml(r, g, b);
}

function snow(count)
{
    window.let_it_snow = true;
    window.snowflake_count = count;
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
        animate(0);
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
        if (!window.let_it_snow)
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
    
    function _bg_at_pixel(data, x, y)
    {
        if (x < 0 || x >= 700 || y < 0 || y >= 700)
            return true;
        
        var pixel = [];
        pixel.push(data.data[(y * 700 + x) * 4 + 0]);
        pixel.push(data.data[(y * 700 + x) * 4 + 1]);
        pixel.push(data.data[(y * 700 + x) * 4 + 2]);
        return (pixel[0] == window.background_color[0] && 
                pixel[1] == window.background_color[1] &&
                pixel[2] == window.background_color[2]);
    }
    
    function _snow_loop(time)
    {
        var data = window.imageContext.getImageData(0, 0, 700, 700);
        
        for (var i = 0; i < particles.length; i++)
        {
            var x = Math.floor(particles[i][0]);
            var y = Math.floor(particles[i][1]);
            data.data[(y * 700 + x) * 4 + 0] = window.background_color[0];
            data.data[(y * 700 + x) * 4 + 1] = window.background_color[1];
            data.data[(y * 700 + x) * 4 + 2] = window.background_color[2];
            data.data[(y * 700 + x) * 4 + 3] = 255;
            
        }
        for (var i = 0; i < particles.length; i++)
        {
            var k = (i % 10) * 128 / 9 + 127;
            var j = (i % 10) / 2;
            
            var old_x = Math.floor(particles[i][0]);
            var old_y = Math.floor(particles[i][1]);
            
            particles[i][0] += (Math.random() - 0.5) * 2;
            particles[i][1] += (Math.random() * 0.5 + j + 1) / 2;
            if (particles[i][1] > 700)
                particles[i] = [Math.random() * 700, 0];
            
            var x = Math.floor(particles[i][0]);
            var y = Math.floor(particles[i][1]);
            if (!_bg_at_pixel(data, x, y))
            {
                x = old_x;
                y = old_y;
                if (_bg_at_pixel(data, x, y + 1))
                {
                    particles[i][0] = x;
                    particles[i][1] = y + 1;
                }
                else if (_bg_at_pixel(data, x - 1, y + 1))
                {
                    particles[i][0] = x - 1;
                    particles[i][1] = y + 1;
                }
                else if (_bg_at_pixel(data, x + 1, y + 1))
                {
                    particles[i][0] = x + 1;
                    particles[i][1] = y + 1;
                }
                else
                {
                    particles[i] = [Math.random() * 700, 0];
                    data.data[(y * 700 + x) * 4 + 0] = k;
                    data.data[(y * 700 + x) * 4 + 1] = k;
                    data.data[(y * 700 + x) * 4 + 2] = k;
                    data.data[(y * 700 + x) * 4 + 3] = 255;
                }
            }
        }
        for (var i = 0; i < particles.length; i++)
        {
            var k = (i % 10) * 128 / 9 + 127;
            var x = Math.floor(particles[i][0]);
            var y = Math.floor(particles[i][1]);
            data.data[(y * 700 + x) * 4 + 0] = k;
            data.data[(y * 700 + x) * 4 + 1] = k;
            data.data[(y * 700 + x) * 4 + 2] = k;
        }
        
        window.imageContext.putImageData(data, 0, 0);
        requestAnimationFrame(_snow_loop);
    }
    
    if (window.let_it_snow)
    {
        window.particles = [];
        for (var i = 0; i < window.snowflake_count; i++)
            window.particles.push([Math.random() * 700, Math.random() * 700]);
        requestAnimationFrame(_snow_loop);
    }
});
