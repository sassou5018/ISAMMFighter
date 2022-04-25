

class Sprite {
    constructor({position, imgSrc, scale=1, framesMax=1, offset={x:0, y:0}}) {
        this.position= position;
        this.height= 150;
        this.width= 50;
        this.img= new Image();
        this.img.src= imgSrc;
        this.scale= scale;
        this.framesMax = framesMax;
        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.offset= offset;
    }  

    draw() {
        //draw sprites
        c.drawImage(
            this.img,
            this.frameCurrent * (this.img.width / this.framesMax),
            0,
            this.img.width / this.framesMax,
            this.img.height, 
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.img.width/ this.framesMax) * this.scale, 
            this.img.height * this.scale
            );
       
    }
    animateFrames() {
        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold === 0) {
        if (this.frameCurrent< this.framesMax - 1) {
            this.frameCurrent++;
        } else {
            this.frameCurrent=0;
        }
        }
    }

    update(){
        this.draw();
        this.animateFrames();
        
    }
    
}

class Fighter extends Sprite {
    constructor({position, velocity, color="red", audio, imgSrc, scale=1, framesMax=1, offset={x:0, y:0}, sprites, attackBox={offset:{}, width:undefined, height:undefined}}) {
        super({
            position,
            imgSrc,
            scale,
            framesMax,
            offset
        })
        this.velocity= velocity;
        this.height= 150;
        this.width= 50;
        this.lastKey='';
        this.audio= audio;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color=color;
        this.isAttacking= false;
        this.health= 100;
        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.sprites= sprites;
        
        for (const sprite in this.sprites) {
            sprites[sprite].img = new Image();
            sprites[sprite].img.src= sprites[sprite].imgSrc;
        }
    }  


    update(){
        this.draw();
        //attack box
        this.attackBox.position.x= this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y= this.position.y + this.attackBox.offset.y;
        //c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        
        //gravity
        if (this.position.y + this.height + this.velocity.y >= canvas.height-97) {
            this.velocity.y=0;
            this.position.y=330;
        } else {this.velocity.y += gravity;}
        this.animateFrames();
    }
    attack() {
        this.isAttacking=true;
        setTimeout(()=>{
            this.isAttacking=false;
            this.audio.play();
            this.switchSprite("attack1");
        }, 100);
    }

    switchSprite(sprite) {
        if (this.img== this.sprites.attack1.img && this.frameCurrent < this.sprites.attack1.framesMax -1) {return;}
        if (this.img== this.sprites.takeHit.img && this.frameCurrent < this.sprites.takeHit.framesMax-1) {return;}
        switch(sprite) {
        case 'idle':
            if (this.img !== this.sprites.idle.img){
                this.img = this.sprites.idle.img;
                this.framesMax= this.sprites.idle.framesMax;
                this.frameCurrent=0;
            }
        break;
        case 'run':
            if (this.img !== this.sprites.run.img){
                this.img = this.sprites.run.img;
                this.framesMax= this.sprites.run.framesMax;
                this.frameCurrent=0;
        }
        break;
        case 'jump':
            if (this.img !== this.sprites.jump.img) {
            this.img = this.sprites.jump.img ;
            this.framesMax= this.sprites.jump.framesMax;
            this.frameCurrent=0;
            }
        break;
        case 'fall':
            if (this.img !== this.sprites.fall.img) {
                this.img = this.sprites.fall.img ;
                this.framesMax= this.sprites.fall.framesMax;
                this.frameCurrent=0;
            }
        break;
        case 'attack1':
            if (this.img !== this.sprites.attack1.img) {
                this.img = this.sprites.attack1.img ;
                this.framesMax= this.sprites.attack1.framesMax;
                this.frameCurrent=0;
            }
        break;
        case 'takeHit':
            if (this.img !== this.sprites.takeHit.img) {
                this.img = this.sprites.takeHit.img ;
                this.framesMax= this.sprites.takeHit.framesMax;
                this.frameCurrent=0;
            }
        break;

        }
    }
}
