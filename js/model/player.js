/**
 * Class Player
 * This class represents the player of the game. 
 * It's a bar with lateral movement that hits the ball in front brick wall
 */    
export class Player{
    constructor(canvas,gameMode,lang){
        // Get size & speed of player based on gameMode dificult selected by user.
        const playerOptions = Player.#getPlayerSizeAndSpeed(gameMode,lang,false); 
        this.canvas = canvas;                       // Game canvas to control with and height when draw a player.
        this.playerSizeX = playerOptions.Xsize      // Player width size
        this.playerSizeY = 24;                      // Player height size 
        this.speed = playerOptions.speed            // Player speed
        this.positionXsprite = playerOptions.posX   // Sprite X position 
        this.positionYsprite = playerOptions.posY   // Sprite Y position "based on gameMode dificult"
        this.x = (canvas.width-this.playerSizeX)/2  // Default initial X position to draw a player
        this.y = this.#getYposition();              // Default initial Y position to draw a player 
        this.lives = 3;                             // Default initial lives of player
        this.score = 0;                             // Default initial score of player
        this.isShotActivate = false;                // Default initial shots of player
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
     * updateLives
     * This method update a number of lives of the player.
     *  -> ball out : subtract a live
     *  -> extra live trick : add a live
     * @param isBallOut true or false
     * @param value 
     */
    updateLives(isBallOut, value = undefined){
        this.lives = value == undefined || value == null ? isBallOut ? this.lives - 1 : this.lives + 1 : value; 
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
     * hitBall
     * This method determines if player hits the ball
     * @param ball  
     * @returns true or false
     */
    hitBall(ball){
        
        // Get the player collider sizes 
        const PLAYER_POSITIONS = this.#getPlayerPositions();
		
		// Get the ball collider sizes 
		let bLeft = ball.x;
		let bRight = ball.x + ball.ballSizeX; 
		let bBottom = ball.y;
		let bTop = ball.y + ball.ballSizeY; //23;

        return PLAYER_POSITIONS.pLeft < bRight && PLAYER_POSITIONS.pRight > bLeft && PLAYER_POSITIONS.pTop > bBottom && PLAYER_POSITIONS.pBottom < bTop; 
    }

    /**
     * getShotCapsule
     * This method determines if player hits the weapon capsule
     * @param {*} capsule 
     * @returns 
     */
    getShotCapsule(capsule){
        // Get the player collider sizes 
        const PLAYER_POSITIONS = this.#getPlayerPositions();
        
        // Get the capsule collider sizes 
        let cLeft = capsule.x;
        let cRight = capsule.x + capsule.capsuleSizeX;
        let cBottom = capsule.y;
        let cTop = capsule.y + capsule.capsuleSizeY;
            
        return PLAYER_POSITIONS.pLeft < cRight && PLAYER_POSITIONS.pRight > cLeft && PLAYER_POSITIONS.pTop > cBottom && PLAYER_POSITIONS.pBottom < cTop;
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
     * setSpriteAnimation
     * This method set the normal or weapon sprite to player.
     * @param {*} gameMode 
     * @param {*} lang 
     * @param {*} isShotActive 
     */
    setSpriteAnimation(gameMode,lang,isShotActive){
        const playerOptions = Player.#getPlayerSizeAndSpeed(gameMode,lang,isShotActive); 
        this.positionXsprite = playerOptions.posX   // Sprite X position
        this.positionYsprite = playerOptions.posY   // Sprite Y position "based on gameMode dificult"
    }

    /**
     * activateShots
     * Setter for isShotActivate
     * @param {*} isActive 
     */
    activateShots(isActive){
        this.isShotActivate = isActive;
    }

    /**
     * getYposition [private]
     * This method returns the Y position subtracting 20% from canvas height
     * @returns Y position to draw a player on canvas
     */
    #getYposition(){
        return this.canvas.height - (this.canvas.height * 0.20);
    }   
    
    /**
     * getPlayerPositions [Private]
     * This method returns the player positions
     * @returns JSON
     */
    #getPlayerPositions(){
        return {
            pLeft : Math.round(this.x,0),
            pRight : Math.round(this.x + this.playerSizeX,0),
            pBottom : Math.round(this.y,0),
            pTop : Math.round(this.y + this.playerSizeY,0)
        }
    }

    /**
     * loadPlayerAsset
     * Set properties on Player class prototype
     */
    static loadPlayerAsset(){
        Player.prototype.image = new Image();
        Player.prototype.image.src = `${window.location.pathname.replace(/\/$/, "")}/assets/img/sprites/player.png`; //"../../assets/img/sprites/player.png";
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
    static #getPlayerSizeAndSpeed(gameMode,lang,isShotActive){
        // *** Easy mode
        let playerOptions = {
            Xsize : 158,
            speed : 4,
            posX : !isShotActive ? Player.prototype.animation[0][0] : Player.prototype.animation[3][0],
            posY : !isShotActive ? Player.prototype.animation[0][1] : Player.prototype.animation[3][1]
        }
        
        if(gameMode == lang.DIFICULT.DIFICULT_MODES[1].TITLE){
            // *** Medium mode
            playerOptions = {
                Xsize : 130,
                speed : 5,
                posX : !isShotActive ? Player.prototype.animation[1][0] : Player.prototype.animation[4][0],
                posY : !isShotActive ? Player.prototype.animation[1][1] : Player.prototype.animation[4][1]
            }

        }else if(gameMode == lang.DIFICULT.DIFICULT_MODES[2].TITLE){
            // ** Hard mode
            playerOptions = {
                Xsize : 98,
                speed : 8,
                posX : !isShotActive ? Player.prototype.animation[2][0] : Player.prototype.animation[5][0],
                posY : !isShotActive ? Player.prototype.animation[2][1] : Player.prototype.animation[5][1]
            }    
        }

        return playerOptions
    }
}