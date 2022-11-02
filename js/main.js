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

    let virtualx = canvas.width / 2;
    let virtualy = canvas.height / 2;

    let sF = 1;

    function updatePosition(e) {
        dX = e.movementX;
        dY = e.movementY;

        virtualx += sF * dX;
        virtualy += sF * dY;

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

        drawStuff();
    }


    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
          
    function resizeCanvas() {
      canvas.width = window.innerWidth * 0.99;
      canvas.height = window.innerHeight * 0.99;
                  
      /**
       * Your drawings need to be inside this function otherwise they will be reset when 
       * you resize the browser window and the canvas goes will be cleared.
       */
      drawStuff(); 
    }
    
    resizeCanvas();
          
    function drawStuff() {
        context.fillStyle = "#BBBBFF";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.font = "20px serif"
        context.fillStyle = "black";
        context.fillText("Press → to increase scale factor, ← to decrease, click to interact", 10, 30);
        context.fillText("Window size: " + canvas.width + " " + canvas.height, 10, 50);
        context.fillText("Current SF: " + (parseFloat(sF).toPrecision(2)), 10, 70);

        context.beginPath();
        context.arc(virtualx, virtualy, 5, 0, 2 * Math.PI, false);
        context.fillStyle = "black";
        context.fill();
        context.stroke();
    }
}

$(document).ready(() => {
    x();
});