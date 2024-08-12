import { Explosion } from "./explosion.js";

/**
 * Class Shot
 * This class represents the player shot object to the game.
 */
export class Shot{
    static aShots = [];
    
    constructor(xPosition,yPosition){
        this.shotRadius = 5;
        this.startAngle = 0;
        this.finalAngle = Math.PI*2;
        this.x = xPosition;
        this.y = yPosition;
        this.color = "#57d7ce";
        this.shotSizeX = 5;
        this.shotSizeY = 5;
        this.isCollidedShot = false;
    }

    /**
     * draw
     * This method draw the player shot game object on game canvas
     */
    draw(){
        if(!this.isCollidedShot){
            this.ctx.beginPath();
			this.ctx.arc(this.x,            // Shot X position
				     this.y,                // Shot Y position
					 this.shotRadius,       // Shot radius to draw
					 this.startAngle,       // Start angle 
					 this.finalAngle);      // Final angle

			this.ctx.fillStyle = this.color;// Set shot color
			this.ctx.fill();
        }
    }

    /**
     * playStartShotAudio
     * This methos plays the start shot audio
     */
    playStartShotAudio(){
        this.audioStartShot.currentTime = 0;
        this.audioStartShot.play();
    }

    /**
     * playExplosionAudio
     * This method plays the explosion shot audio when shot collide with any brick
     */
    playExplosionAudio(){
        this.audioExplosionShot.currentTime = 0;
        this.audioExplosionShot.play();
    }

    /**
     * shotHitBrick
     * This method check if shot hit any brick. Return true or false to mark the current shot
     * @param {*} aBricks 
     * @param {*} player 
     * @returns true or false
     */
    shotHitBrick(aBricks,player){
        if(this.isCollidedShot) return false;

        // Shot game object sizes
        let sLeft = Math.round(this.x,0);
        let sRight = Math.round(this.x + this.shotSizeX,0);
        let sBottom = Math.round(this.y,0);
        let sTop = Math.round(this.y + this.shotSizeY,0);


        for(let i = 0; i < aBricks.length ; i++){
            try{
                // Calculate a brick sizes
                let bLeft = Math.round(aBricks[i].x,0);
                let bRight = Math.round((aBricks[i].x + aBricks[i].brickSizeX),0);
                let bBottom = Math.round(aBricks[i].y,0);
                let bTop = Math.round((aBricks[i].y + aBricks[i].brickSizeY), 0);
                
                // Check collision
                if ((sRight > bLeft) & (sLeft < bRight) & (sTop > bBottom) & (sBottom < bTop)){
                    if(!aBricks[i].brokenBrick){
                        
                        aBricks[i].lifeAfterBeingShot -= 50;

                        if(aBricks[i].lifeAfterBeingShot <= 0){
                            // Load Shot animation
                            let shotExplosion = new Explosion(Explosion.EXPLOSION_TYPES.SHOT, aBricks[i].x, aBricks[i].y);
                            shotExplosion.idAnimationShot = setInterval(shotExplosion.loadAnimate.bind(shotExplosion),10);
                            this.playExplosionAudio();

                            aBricks[i].brokenBrick = true;
                            player.score += 10;
                        }
                        return true;
                    }
                }

            }catch(e){
                return false;
            }
        }
        return false;
    }

    /**
     * generateShots
     * This method generates left and right shots and adds them to the shot array
     * @param {*} lShot 
     * @param {*} rShot 
     * @param {*} yPosition 
     */
    static generateShots(lShot,rShot,yPosition){
        // Build a left and right shot objects
        let LEFT_SHOT = new Shot(lShot + 10,yPosition);
        let RIGHT_SHOT = new Shot(rShot,yPosition);

        // PLay start audio for leaft and right shots
        LEFT_SHOT.playStartShotAudio();
        RIGHT_SHOT.playStartShotAudio();

        // Draw shots on canvas
        LEFT_SHOT.draw();
        RIGHT_SHOT.draw();

        // Add shots to static array
        Shot.aShots.push(LEFT_SHOT);
        Shot.aShots.push(RIGHT_SHOT);
    }

    /**
     * clearShots
     * This method clear the static array to save the shots
     */
    static clearShots(){
        Shot.aShots = [];
    }

    /**
     * moveShots
     * This method move, draw or remove the all shots on canvas
     * @param {*} aBricks 
     * @param {*} player 
     */
    static moveShots(aBricks,player){
        
        for(let i = 0; i < Shot.aShots.length; i++){
            Shot.aShots[i].draw();

            // Delete or move the current list shot
            if(Shot.aShots[i].y < -10){
                Shot.aShots.splice(i,1);
            }else{
                Shot.aShots[i].y -= 2; 
            }

            // Check collision with any bricks and set a true the shot collied if method return a true value.
            if(Shot.aShots[i] != undefined && Shot.aShots[i].shotHitBrick(aBricks,player)) Shot.aShots[i].isCollidedShot = true;
        }
    }

    /**
      * loadShotAsset
      * Set properties on Shot class prototype
      * @param {*} canvas
      * @param {*} ctx 
      */
    static loadShotAsset(canvas,ctx){
        Shot.prototype.canvas = canvas;
        Shot.prototype.ctx = ctx;
        Shot.prototype.audioStartShot = document.getElementById("playerShotLaser");
        Shot.prototype.audioExplosionShot = document.getElementById("shotExplosion");                      
    }
}