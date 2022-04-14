function rectangularCollision({rectangle1, rectangle2}){
    if (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && 
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height) {return true;}
}
let pushEffect= new Audio("/sound effects/punchWoosh.wav");
let hit1= new Audio("/sound effects/hit1.mp3");
let hit2= new Audio("/sound effects/hit2.mp3");

function rectangularAtckBxCollision({rectangle1, rectangle2}){
    if (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.attackBox.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.attackBox.position.x + rectangle2.attackBox.width && 
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.attackBox.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.attackBox.position.y + rectangle2.attackBox.height) {
            return true;
        }
}

function gameOver({player, enemy, timerId}){
    clearTimeout(timerId);
    document.getElementById("displayText").style.display="flex";
    if (player.health== enemy.health) {
        document.getElementById("displayText").innerText="Tie";
        gameEnded=true;
    } else if (player.health > enemy.health) {
        document.getElementById("displayText").innerText="Player 1 Won";
        gameEnded=true;
    }else if (player.health < enemy.health) {
        document.getElementById("displayText").innerText="Player 2 Won";
        gameEnded=true;
    }

}

let timer= 60;
let timerId;
function decreaseTimer() {
    if (timer>0) {
        timerId= setTimeout(decreaseTimer, 1000);
        timer--;
        document.getElementById("timer").innerText=timer;
    }
    if (timer==0){
        gameOver({player, enemy, timerId});   
}
}