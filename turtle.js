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
