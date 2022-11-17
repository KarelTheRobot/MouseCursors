/*
    global variables
    circles
    inner_radius
    outer_radius
    mouse_speed
*/

/*
    draws a set of circles around the screen, based on @global circles. If index_to_highlight is not -1,
    highlights the Nth circle in the chain (n \in [0, circles). )
*/

var current_num = 0;
var last_was_correct = 1;
var last_click_time = -1;
var time_elapsed = -1;

function draw_circles (index_to_highlight) {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    let midX = canvas.width / 2;
    let midY = canvas.height / 2;
    for (i = 0; i < circles; i++) {
        angle = i * 2 * Math.PI / (circles);
        cX = midX + outer_radius * Math.cos(angle);
        cY = midY + outer_radius * Math.sin(angle);
        if (i == index_to_highlight) {
            context.beginPath();
            context.arc(cX, cY, inner_radius, 0, 2 * Math.PI, false);
            context.fillStyle = "#FFFFFF";
            context.fill();
        } else {
            //context.fillStyle = "#FFBBBB";
        }
        
        
        context.strokeStyle = "#000000";
        context.beginPath();
        context.arc(cX, cY, inner_radius, 0, 2 * Math.PI, false);
        context.lineWidth = 2;
        context.stroke();
    }

}

x = function() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;

    document.exitPointerLock = document.exitPointerLock ||
                           document.mozExitPointerLock;

    canvas.onclick = function() {
        console.log("hi");
        canvas.requestPointerLock()
    };

    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

    document.addEventListener("keydown", (e) => {
        if (e.code == "ArrowLeft") {
            sF = Math.max(0.2, sF - 0.2);
        } else if (e.code == "ArrowRight") {
            sF = Math.min(5, sF + 0.2)
        }
        drawStuff();
    }, false);

    

    function lockChangeAlert() {
        if (document.pointerLockElement === canvas ||
                document.mozPointerLockElement === canvas) {
            console.log('The pointer lock status is now locked');
            document.addEventListener("mousemove", updatePosition, false);
        } else {
            console.log('The pointer lock status is now unlocked');  
            document.removeEventListener("mousemove", updatePosition, false);
        }
    }

    let virtualx = canvas.width / 2.0;
    let virtualy = canvas.height / 2.0;

    let sF = mouse_speed;

    function updatePosition(e) {
        dX = e.movementX;
        dY = e.movementY;

        virtualx += sF * dX;
        virtualy += sF * dY;
        console.log(virtualx);

        if (virtualx < 0) {
            virtualx = canvas.width;
        } else if (virtualx > canvas.width) {
            virtualx = 0;
        }

        if (virtualy < 0) {
            virtualy = canvas.height;
        } else if (virtualy > canvas.height) {
            virtualy = 0;
        }

        drawStuff(virtualx, virtualy);
    }

    canvas.addEventListener("mousedown", (e) => {
        let midX = canvas.width / 2;
        let midY = canvas.height / 2;
        
        angle = current_num * 2 * Math.PI / (circles);
        cX = midX + outer_radius * Math.cos(angle);
        cY = midY + outer_radius * Math.sin(angle);

        console.log(cX, cY, virtualx, virtualy);

        dist_sq = Math.pow(cX - virtualx, 2) + Math.pow(cY - virtualy, 2)
        if (dist_sq > inner_radius * inner_radius) {
            last_was_correct = 0;
        } else {
            last_was_correct = 1;
        }

        current_num = (current_num + Math.floor(circles / 2) + 1) % circles;
        drawStuff();

        
        var current_time = Date.now();
        
        if (last_click_time != -1) {
            time_elapsed = current_time - last_click_time;
        }
        last_click_time = current_time;

    })

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
          
    function resizeCanvas() {
      canvas.width = window.innerWidth * 1;
      canvas.height = window.innerHeight * 1;
                  
      /**
       * Your drawings need to be inside this function otherwise they will be reset when 
       * you resize the browser window and the canvas goes will be cleared.
       */
      drawStuff(); 
    }
    
    resizeCanvas();
          
    function drawStuff(a, b) {
        if (last_was_correct) {
            context.fillStyle = "#BBFFBB";
        } else {
            context.fillStyle = "#FFBBBB";
        }
        context.fillRect(0, 0, canvas.width, canvas.height);

        draw_circles(current_num);

        context.font = "20px serif"
        context.fillStyle = "black";
        context.fillText("Press → to increase scale factor, ← to decrease, click to interact", 10, 30);
        context.fillText("Window size: " + canvas.width + " " + canvas.height, 10, 50);
        context.fillText("Current SF: " + (parseFloat(sF).toPrecision(2)), 10, 70);
        if (last_was_correct) {
            context.fillText("Previous click: Success", 10, 90);
        } else {
            context.fillText("Previous click: Fail", 10, 90);
        }
        context.fillText("Time to click: " + time_elapsed, 10, 110);
        

        context.beginPath();
        context.arc(virtualx, virtualy, 5, 0, 2 * Math.PI, false);
        context.fillStyle = "black";
        context.fill();
        context.stroke();
    }
}


$(document).ready(() => {
    x();
    console.log();
});