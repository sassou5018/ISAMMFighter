const canvas= document.querySelector("canvas");
const c= canvas.getContext("2d");
var socket = io();

canvas.width= 1024;
canvas.height= 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity=0.7;
let gameEnded= false;

const background = new Sprite({
    position: {
        x:0,
        y:0
    },
    imgSrc:"/background.png"
})

const shop = new Sprite({
    position: {
        x:600,
        y:128
    },
    imgSrc:"/shop.png",
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position:{
    x: 0,
    y: 0
},
    velocity:{
    x:0,
    y:0
    },
    offset:{
        x:0,
        y:0
    },
    audio: new Audio("/sound effects/player1Woosh.flac"),
    imgSrc:"/Martial1/Idle.png",
    framesMax: 8,
    scale:2.5,
    offset: {
        x:215,
        y:157
    },
    sprites: {
        idle: {
            imgSrc: "/Martial1/Idle.png",
            framesMax: 8
        },
        run: {
            imgSrc: "/Martial1/Run.png",
            framesMax: 8
        },
        jump: {
            imgSrc: "/Martial1/Jump.png",
            framesMax: 2
        },
        fall: {
            imgSrc: "/Martial1/Fall.png",
            framesMax: 2
        },
        attack1: {
            imgSrc: "/Martial1/Attack1.png",
            framesMax: 6
        },
        takeHit: {
            imgSrc: "/Martial1/Take Hit - white silhouette.png",
            framesMax: 4
        }
    },
    attackBox: {
        offset:{
            x:90,
            y:50
        },
        width:100,
        height:50
    }
});





const enemy= new Fighter({
    position:{
    x: 950,
    y: 0
},
    velocity:{
    x:0,
    y:0
    },
    color: 'blue',
    offset:{
        x:-50,
        y:0
    },
    audio: new Audio("/sound effects/player2Woosh.mp3"),
    imgSrc:"/Martial2/Idle.png",
    framesMax: 4,
    scale:2.5,
    offset: {
        x:215,
        y:167
    },
    sprites: {
        idle: {
            imgSrc: "/Martial2/Idle.png",
            framesMax: 4
        },
        run: {
            imgSrc: "/Martial2/Run.png",
            framesMax: 8
        },
        jump: {
            imgSrc: "/Martial2/Jump.png",
            framesMax: 2
        },
        fall: {
            imgSrc: "/Martial2/Fall.png",
            framesMax: 2
        },
        attack1: {
            imgSrc: "/Martial2/Attack1.png",
            framesMax: 4
        },
        takeHit: {
            imgSrc: "/Martial2/Take hit.png",
            framesMax: 3
        }
    },
    attackBox: {
        offset:{
            x:-160,
            y:50
        },
        width:100,
        height:50
    }
});


const keys = {
    q: {
        pressed: false
    },
    d: {
        pressed: false
    },
    z: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}



decreaseTimer();

function animate() {
    if(gameEnded==false){
    window.requestAnimationFrame(animate);}
    //console.log("go");
    c.fillStyle= "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    enemy.update();
    player.velocity.x=0;
    enemy.velocity.x=0;
    //player movement
    
    if (keys.q.pressed== true && player.lastKey==='q') {
        player.velocity.x=-4;
        player.switchSprite("run");
    } else if (keys.d.pressed== true && player.lastKey==='d') {
        player.velocity.x=4;
        player.switchSprite("run");
    } else {
        player.switchSprite("idle");
    }

    //jump
    if (player.velocity.y < 0 ) {
        player.switchSprite("jump");
    } else if (player.velocity.y > 0 ) {
        player.switchSprite("fall"); }
    //enemy movement
    if (keys.ArrowLeft.pressed== true && enemy.lastKey==='ArrowLeft') {
        enemy.velocity.x=-4;
        enemy.switchSprite("run");
    } else if (keys.ArrowRight.pressed== true && enemy.lastKey==='ArrowRight') {
        enemy.velocity.x=4;
        enemy.switchSprite("run");
    } else {
        enemy.switchSprite("idle");
    }
    //jump
    if (enemy.velocity.y < 0 ) {
        enemy.switchSprite("jump");
    } else if (enemy.velocity.y > 0 ) {
        enemy.switchSprite("fall"); }

    //detect colision player
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) &&
        player.isAttacking
        ) { player.isAttacking= false;
            enemy.health -=20;
            hit1.play();
            enemy.switchSprite("takeHit");
            document.getElementById('enemyHealth').style.width=enemy.health + "%" ;
        }
    //detect colision enemy
    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
        enemy.isAttacking
        ) { enemy.isAttacking= false;
            player.health -=10;
            hit2.play();
            player.switchSprite("takeHit");
            document.getElementById('playerHealth').style.width= player.health + "%";
        }
        console.log(player.health, enemy.health);

        //pushback
        if(rectangularAtckBxCollision({
            rectangle1: player,
            rectangle2:enemy
        }) &&
        enemy.isAttacking &&
        player.isAttacking
        //rectangularCollision== false
        ) {
            enemy.isAttacking=false;
            player.isAttacking=false;
            player.velocity.y=-10;
            enemy.velocity.y=-10;
            player.velocity.x=-120;
            enemy.velocity.x=120;
            pushEffect.play();
            
        }

        //game over hp
        if(enemy.health<=0 || player.health<=0) {
            gameOver({player, enemy, timerId});
        }
        socket.emit('position1', enemy.position);
        socket.on('p2', (p2)=>{
            console.log(p2);
            player.position.x= p2.x ;
            player.position.y= p2.y ;
        })
}

animate();

window.addEventListener('keydown', (event)=> {
    switch(event.key) {
        //player movement
        case 'd': keys.d.pressed= true;
        player.lastKey='d';
        break;
        case 'q': keys.q.pressed= true;
        player.lastKey='q';
        break;
        case 'z': player.velocity.y= -20;
        break;
        case ' ': player.attack();
        break;

        //enemy movement
        case 'ArrowRight': keys.ArrowRight.pressed= true;
        enemy.lastKey='ArrowRight';
        break;
        case 'ArrowLeft': keys.ArrowLeft.pressed= true;
        enemy.lastKey='ArrowLeft';
        break;
        case 'ArrowUp': enemy.velocity.y= -20;
        break;
        case 'ArrowDown': enemy.attack();
        break;
    }
})

window.addEventListener('keyup', (event)=> {
    switch(event.key) {
        //player
        case 'd': keys.d.pressed= false;
        break;
        case 'q': keys.q.pressed= false;
        break;


        //enemy
        case 'ArrowRight': keys.ArrowRight.pressed= false;
        break;
        case 'ArrowLeft': keys.ArrowLeft.pressed= false;
        break;
    }
})


let button = document.getElementById("refreshbtn");
button.onclick= function() {
    location.reload();
}
