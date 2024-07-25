/**
 * Class Player
 * This class represents the player of the game. 
 * It's a bar with lateral movement that hits the ball in front brick wall
 */    
export class Player{
    constructor(canvas,gameMode,lang){
        // Get size & speed of player based on gameMode dificult selected by user.
        const playerOptions = Player.#getPlayerSizeAndSpeed(gameMode,lang); 
        this.canvas = canvas;                       // Game canvas to control with and height when draw a player.
        this.playerSizeX = playerOptions.Xsize      // Player width size
        this.playerSizeY = 24;                      // Player height size 
        this.speed = playerOptions.speed            // Player speed
        this.positionXsprite = playerOptions.posX   // Sprite X position "always zero"
        this.positionYsprite = playerOptions.posY   // Sprite Y position "based on gameMode dificult"
        this.x = (canvas.width-this.playerSizeX)/2  // Default initial X position to draw a player
        this.y = this.#getYposition();              // Dfault initial Y position to draw a player 
        this.lives = 3;                             // Default initial lives of player
    }
    
    
    /**
     * generatesRightPosition
     * This method move the the player to right side.
     */
    generatesRightPosition(){
        this.x = this.x + this.speed;
    
        if (this.x + this.playerSizeX >= this.canvas.width) { 
        
            // If at edge, reset ship position and set flag.
            this.x = this.canvas.width - this.playerSizeX;   
        }	
    }
    
    
    /**
     * generatesLeftPosition
     * This method move the the player to left side.
     */
    generatesLeftPosition(){
        this.x = this.x - this.speed;

        if (this.x < 0) {
            
            // If at edge, reset ship position and set flag.
            this.x = 0;	   
        }
    }

    /**
     * draw
     * this method draw the player on game canvas
     * @param ctx 
     */
    draw(ctx){

        // Check if player wants to move to the right or left side. Then, update X position of player
        // calling to the correct method
        if(Player.prototype.xLeft){
            this.generatesLeftPosition();
        }

        if(Player.prototype.xRight){
            this.generatesRightPosition();
        }

        // Draw a player on canvas
		ctx.drawImage(this.image,     // Player image (Sprite)
			this.positionXsprite,     // Sprite X position
			this.positionYsprite,	  // Sprite Y position
			this.playerSizeX, 	      // Player X size 
			this.playerSizeY,	      // Player Y size
			this.x,                   // Display X position to draw a player
			this.y,	                  // Display Y position to draw a player
			this.playerSizeX,		  // Player X size to draw 
			this.playerSizeY);        // Player Y size to draw
    }
    
     
    /**
     * playAudio
     * This method play the player hit ball sound
     */
    playAudio(){
        Player.prototype.audioHitBall.currentTime = 0;
        Player.prototype.audioHitBall.play();
    }

    /**
     * loadPlayerAsset
     * Set properties on Player class prototype
     */
    static loadPlayerAsset(){
        Player.prototype.image = new Image();
        Player.prototype.image.src = "../../assets/img/sprites/player.png";
        Player.prototype.animation = [[0,0],[163,0],[298,0],[0,27],[163,27],[298,27]];
        Player.prototype.audioHitBall = document.getElementById("playerHitBall");
        Player.prototype.xLeft = false;
        Player.prototype.xRight = false;
    }

    /**
     * getPlayerSizeAndSpeed [Private]
     * This method build an object with the sprite size and speed for player based on game dificult selected by user.
     * @param gameMode 
     * @param lang 
     * @returns object with size and speed of player
     */
    static #getPlayerSizeAndSpeed(gameMode,lang){
        // *** Easy mode
        let playerOptions = {
            Xsize : 158,
            speed : 4,
            posX : Player.prototype.animation[0][0],
            posY : Player.prototype.animation[0][1]
        }
        
        if(gameMode == lang.DIFICULT.DIFICULT_MODES[1].TITLE){
            // *** Medium mode
            playerOptions = {
                Xsize : 130,
                speed : 5,
                posX : Player.prototype.animation[1][0],
                posY : Player.prototype.animation[1][1]
            }

        }else if(gameMode == lang.DIFICULT.DIFICULT_MODES[2].TITLE){
            // ** Hard mode
            playerOptions = {
                Xsize : 98,
                speed : 8,
                posX : Player.prototype.animation[2][0],
                posY : Player.prototype.animation[2][1]
            }    
        }

        return playerOptions
    }

    /**
     * getYposition [private]
     * This method returns the Y position subtracting 20% from canvas height
     * @returns Y position to draw a player on canvas
     */
    #getYposition(){
        return this.canvas.height - (this.canvas.height * 0.20);
    }        
}