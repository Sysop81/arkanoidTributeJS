import { Explosion } from "./explosion.js";

/**
 * Class Ball
 * This class represents the ball that the player hits the bricks. 
 */
export class Ball {
	
    static lastHitBrickIndex = 0;

    constructor (player){
       this.x = (player.x + player.playerSizeX/2) -10;  // Set the ball in the middle of Player X position 
       this.y = player.y - player.playerSizeY;          // Set the ball Y position subtracting the player Y position
       this.ballSizeX = 24;                             // Size X of the ball
       this.ballSizeY = 24;                             // Size Y of the ball
       this.reboundAngleX = 2;                          // Angle of deviation from the X axis when the ball moves from up to down
       this.reboundAngleY = 1.6;                        // Angle of desviation fron Y axis
       this.isBallActive = false;                       // Manage status of the ball in the game "Moving or not moving"     
       this.positionOfMatrixAnimation = 0;              // Default get the first animation to draw the ball
    }

    /**
     * setBallActive
     * Setter for property isBallActive
     * @param status (true or false) 
     */
    setBallActive(status){
        this.isBallActive = status;
    }
   
   
   
   /**
    * draw
    * This method draw the ball game object on game canvas
    * @param ctx 
    */
   draw(ctx){
       ctx.drawImage(this.image,                                        // Sprite with all types of ball
                     this.animation[this.positionOfMatrixAnimation][0], // Sprite X position to draw 
                     this.animation[this.positionOfMatrixAnimation][1],	// Sprite Y Position yo draw 
                     this.ballSizeX, 		                            // Size X of the ball
                     this.ballSizeY,	                                // Size Y of the ball
                     this.x,                                            // Display X position to draw the ball
                     this.y,	                                        // Display Y position to darw the ball
                     this.ballSizeX,		                            // Size X of the ball
                     this.ballSizeY);                                   // Size Y of the ball
                       
   }
   
   
   /**
    * playBallHitBrickAudio
    * This method play the ball hit brick audio
    */
   playBallHitBrickAudio(){
       Ball.prototype.audioHitBrick.currentTime = 0;
       Ball.prototype.audioHitBrick.play();
   }


   /**
    * playBallOutAudio
    * This method play the ball out of canvas bottom audio.
    */
   playBallOutAudio(){
        Ball.prototype.audioBallOut.currentTime = 0;
        Ball.prototype.audioBallOut.play();
   }


   /**
    * checkBallCollider
    * This method check the all types of colliders of the ball
    * @param canvas 
    * @param player 
    */
   checkBallCollider(canvas,player,bricks){
        // *** Checking if ball hit a brick of brick collection
        if(this.#ballHitBricks(bricks,player)){

            // Show the explosion brick animation
            let explosion = new Explosion(null,bricks[Explosion.lastHitBrickIndex].x,bricks[Explosion.lastHitBrickIndex].y);
            if(explosion.idAnimationStar == undefined){
                explosion.idAnimationStar = setInterval(explosion.loadStarAnimate.bind(explosion),10);
            } 
					
            /*   TODO COMPLETE THIS -> Capsule animation
			// Check if hit brick contains the weapon capsule
			if(bricks[Explosion.lastHitBrickIndex].isCapsuleInside){
				// Create a weapon capsule game object
                capsule = new Capsule(bricks[Explosion.lastHitBrickIndex].x, bricks[Explosion.lastHitBrickIndex].y); 

				// Play the audio sound
				capsule.playDescentAudio();
			}

			//Load the animation
			if (idFinalizarCapsula == undefined){
				capsule.idAnimation = setInterval(capsule.loadAnimation,bind(capsule), 10);
			}
            */

            // Mark a brick as broken
            bricks[Explosion.lastHitBrickIndex].brokenBrick = true;

            // Play audio
            this.playBallHitBrickAudio();

            // Set hitted brick color to the ball
            this.#changeBallColor(bricks[Explosion.lastHitBrickIndex].positionXsprite);

            // Change rebound Y angle   
            this.reboundAngleY =- this.reboundAngleY; 

            // Update the player score
			player.score += 10; 
        }
    
		if(this.x + this.reboundAngleX > canvas.width - this.ballSizeX || this.x + this.reboundAngleX < 0) {
            // *** Checking left and rigth side hit     
            // Change the rebound angle to X axis.
			this.reboundAngleX =- this.reboundAngleX; 
		}else if(this.y + this.reboundAngleY < 0){
            // *** Checking the top side hit and reverse the Y axis
            this.reboundAngleY =- this.reboundAngleY;
        }else if(this.y + this.reboundAngleY > (player.y - 50)  && this.y + this.reboundAngleY < player.y){
            
            // *** Checking the player hit zone
            if(player.hitBall(this)){
                // Play the audio player hit the ball
                player.playAudio();

                // Player rebound the ball based on the side it move to. For the X and Y axes
                this.reboundAngleX = player.xLeft ? -1.8 : player.xRight ? 1.8 : this.reboundAngleX;
                this.reboundAngleY =- this.reboundAngleY;
            }
        }else if(this.y + this.reboundAngleY > canvas.height + this.ballSizeY){
            // *** Checking ball goes out   from the bottom side.
            
            // Play ball out audio
            this.playBallOutAudio();

            // Update the player lives
            player.updateLives(true);

            if(player.lives > 0) this.isBallActive = false;
        }

        // Rebound to below
		this.x += this.reboundAngleX;
		this.y += this.reboundAngleY;
   }
   
   
   /**
     * loadPlayerAsset
     * Set properties on Player class prototype
     */
   static loadBallAsset(){
        Ball.prototype.image = new Image();
        Ball.prototype.image.src = "../../assets/img/sprites/balls.png";
        Ball.prototype.animation = [[0,0],[32,0],[64,0],[96,0]]; // Red, Green, Blue, Orange
        Ball.prototype.audioHitBrick = document.getElementById("ballHitBrick");
        Ball.prototype.audioBallOut = document.getElementById("ballOut");
    }

    /**
     * ballHitBricks [Private]
     * This method check the collision between the ball and the any brick of wall
     * @param {*} bricks  
     * @returns true or false
     */
    #ballHitBricks(bricks){
        
        // Get all ball sizes
		let ballLeft = this.x;
		let ballRight = this.x + this.ballSizeX; 
		let ballBottom = this.y;
		let ballTop = this.y + this.ballSizeY;
		
		// Look for collision with any brick
		for (let i = 0; i < bricks.length; i++){
			
			// Get the brick size to check collision with ball
			let brickLeft = Math.round(bricks[i].x,0); 
			let brickRight = Math.round((bricks[i].x + bricks[i].brickSizeX),0); 
			let brickBottom = Math.round(bricks[i].y,0); 
			let brickTop = Math.round((bricks[i].y + bricks[i].brickSizeY), 0);			
		
			// Checking collision ball to brick.
			if ((ballRight > brickLeft) & (ballLeft < brickRight) & (ballTop > brickBottom) & (ballBottom < brickTop)){
			
				// Check that the brick is a broken brick
				if (bricks[i].brokenBrick) return false;

                // Set the brick index in the static var    
                Explosion.lastHitBrickIndex = i;
				return true; 
			}
		}
    }


    /**
     * changeBallColor [Private]
     * This method change the ball color in function to the brick coord hitted.
     * @param {*} brickXposition 
     */
    #changeBallColor(brickXposition){
        // Coord object where the keys are the all X brick position of sprite to identify the brick color and
        // and set the equal color to the ball. The object values contains the al positions of the animation sprite
        // for the ball game.
        const BRICK_COORD = {
            0  : 3,
            71 : 0,
            143: 1,
            215: 2 
        }
        // Change the property positionOfMatrixAnimation, to draw a diferent color for the ball.
        this.positionOfMatrixAnimation = BRICK_COORD[brickXposition];
    }
}