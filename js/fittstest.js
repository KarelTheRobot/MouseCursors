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
const REPETITION_FACTOR = 3;

var current_num = 0;
var circles_clicked = 0;
var last_was_correct = 1;
var last_click_time = -1;
var start_time = -1;
var total_correct = 0;
var average_time = 0;
var first_5_start = -1;
var last_5_start = -1;
var first_5_avg = -1;
var last_5_avg = -1;

var game_is_active = false;
var game_is_over = false;

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
        //console.log("hi");
        if (!game_is_over) {
            canvas.requestPointerLock()
        }
    };

    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

    /*document.addEventListener("keydown", (e) => {
        if (e.code == "ArrowLeft") {
            sF = Math.max(0.2, sF - 0.2);
        } else if (e.code == "ArrowRight") {
            sF = Math.min(5, sF + 0.2)
        }
        drawStuff();
    }, false);*/

    

    function lockChangeAlert() {
        if (document.pointerLockElement === canvas ||
                document.mozPointerLockElement === canvas) {
            //console.log('The pointer lock status is now locked');
            document.addEventListener("mousemove", updatePosition, false);
        } else {
            //console.log('The pointer lock status is now unlocked');  
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

        if (virtualx < 0) {
            virtualx = 0;
            //virtualx = canvas.width;
        } else if (virtualx > canvas.width) {
            //virtualx = 0;
            virtualx = canvas.width;
        }

        if (virtualy < 0) {
            //irtualy = canvas.height;
            virtualy = 0;
        } else if (virtualy > canvas.height) {
            //virtualy = 0;
            virtualy = canvas.height;
        }

        drawStuff(virtualx, virtualy);
    }

    canvas.addEventListener("mousedown", (e) => {
        if (game_is_active) {
            let midX = canvas.width / 2;
            let midY = canvas.height / 2;
            
            angle = current_num * 2 * Math.PI / (circles);
            cX = midX + outer_radius * Math.cos(angle);
            cY = midY + outer_radius * Math.sin(angle);

            //console.log(cX, cY, virtualx, virtualy);

            dist_sq = Math.pow(cX - virtualx, 2) + Math.pow(cY - virtualy, 2)
            if (dist_sq > inner_radius * inner_radius) {
                last_was_correct = 0;
            } else {
                last_was_correct = 1;
                total_correct += 1;
            }

            //current_num = (current_num + Math.floor(circles / 2) + 1) % circles;
            

            if (circles_clicked == 0) {
                start_time = Date.now();
                first_5_start = start_time;

                console.log("start time: ", start_time)
            } else if (circles_clicked == (circles * REPETITION_FACTOR - 5)) {
                last_5_start = Date.now();
                console.log("last 5 start time: ", last_5_start)
            }

            circles_clicked += 1;
            current_num += Math.floor(circles / 2) + 1;
            current_num %= circles;

            if (circles_clicked == 5) {
                first_5_end = Date.now();
                df = first_5_end - first_5_start;
                first_5_avg = df / (5 - 1); // -1 since there are only 4 windows to click
                console.log("first 5 end time: ", first_5_end);
                console.log("first 5 average: ", first_5_avg);
            } else if (circles_clicked == circles * REPETITION_FACTOR) {
                last_5_end = Date.now();
                df = last_5_end - last_5_start;
                last_5_avg = df / (5 - 1);

                console.log("last 5 end: ", last_5_end);
                console.log("last 5 average: ", last_5_avg);

                end_time = Date.now();
                time_elapsed = last_5_end - start_time;
                average_time = time_elapsed / (REPETITION_FACTOR * circles - 1);
                console.log("overall average: ", average_time);

                res = {
                    average_time: average_time,
                    total_correct: total_correct,
                    percent_correct: total_correct/(REPETITION_FACTOR * circles),
                    first_5_avg: first_5_avg,
                    last_5_avg: last_5_avg,
                    index: index
                }
                console.log(res);

                game_is_active = false;
                game_is_over = true;
                document.exitPointerLock();
                console.log("ending game!");

                post_result(res)
            }

            drawStuff();

            
            // var current_time = Date.now();
            
            // if (last_click_time != -1) {
            //     time_elapsed = current_time - last_click_time;
            // }
            // last_click_time = current_time;
        } else {
            if (game_is_over) {
                
                location.href = "/";
                console.log("redirecting");
            } else {
                init_game();
            }
        }
    })

    function init_game() {
        circles_clicked = 0;
        current_num = 0;
        last_was_correct = 1;
        last_click_time = -1;
        total_correct = 0;
        game_is_active = true;

        first_5_start = -1;
        last_5_start = -1;
        first_5_avg = -1;
        last_5_avg = -1;
    }

    function post_result(res) {
        $.post("/result", res, function(data) {
            console.log("success!", data);
        })
    }

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

        if (game_is_active) {
            draw_circles(current_num);

            context.font = "20px serif"
            context.fillStyle = "black";
            //context.fillText("Press → to increase scale factor, ← to decrease, click to interact", 10, 30);
            context.fillText("Window size: " + canvas.width + " " + canvas.height, 10, 30);
            //context.fillText("Current SF: " + (parseFloat(sF).toPrecision(2)), 10, 70);
            if (last_was_correct) {
                context.fillText("Previous click: Success", 10, 50);
            } else {
                context.fillText("Previous click: Fail", 10, 50);
            }
            //context.fillText("Time to click: " + time_elapsed, 10, 110);
            
            context.beginPath();
            context.arc(virtualx, virtualy, 5, 0, 2 * Math.PI, false);
            context.fillStyle = "black";
            context.fill();
            context.stroke();
        } else {
            context.font = "20px serif"
            context.fillStyle = "black";
            if (game_is_over) {
                context.fillText("Average time taken per click: " + time_elapsed / (REPETITION_FACTOR * circles - 1) + "ms.", 10, 30);
                context.fillText("Accuracy: " + (Math.floor(total_correct * 10000/(REPETITION_FACTOR * circles)) / 100) + "%", 10, 50);
                context.fillText("Click anywhere to continue.", 10, 70);
            } else {
                context.fillText("Click anywhere to continue.", 10, 30);
            }
            
        }

        
    }
}


$(document).ready(() => {
    x();
    console.log();
});