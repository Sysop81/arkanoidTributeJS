/**
 * Class Capsule
 * This class represents the capsule object to get the shot power.
 */
export class Capsule{
    constructor(Xposition,Yposition){
        this.capsuleSizeX = 44;
        this.capsuleSizeY = 28;
        this.x = Xposition;
        this.y = Yposition;
        this.positionOfMatrixAnimation = 0;
        this.isEnabled = true;
    }


    /**
     * draw
     * This method draw the capsule in canvas
     */
    draw(){
        this.ctx.drawImage(this.image,                          // Sprite with all types of capsule
			this.animation[this.positionOfMatrixAnimation][0],  // X position of sprite
			this.animation[this.positionOfMatrixAnimation][1],	// Y position of sprite
			this.capsuleSizeX,                                  // Size X
			this.capsuleSizeY,	                                // Size Y
			this.x,                                             // Display X position to draw the capsule
			this.y,	                                            // Display Y position to draw the capsule
			this.capsuleSizeX,                                  // Size X
			this.capsuleSizeY);                                 // Size Y

    }


    /**
     * loadAnimation
     * This method increment the Y position and the sprite position to animate the capsule. 
     * Later if Y capsule position is grater than canvas height the capsule is destroy 
     */
    loadAnimation(){
        this.positionOfMatrixAnimation = this.positionOfMatrixAnimation < this.animation.length - 1 ? this.positionOfMatrixAnimation + 1 : 0;
        
        if(this != undefined && this.y < this.canvas.height){
            this.draw();
            this.y ++;
        }else{
            this.destroy();
        }
    }


    /**
     * destroy
     * This method clear animation interval and set the capsule instance disabled
     */
    destroy(){
        this.positionOfMatrixAnimation = 0;
        clearInterval(this.idAnimation);
        this.idAnimation = undefined;
        this.isEnabled = false;
    }

    /**
    * playGetCapsuleAudio
    * This method plays the audio of when capsule is collected by the player
    */
    playGetCapsuleAudio(){
        Capsule.prototype.audiogetCapsule.currentTime = 0;
        Capsule.prototype.audiogetCapsule.play();
    }

    /**
     * playCapsuleDescendingAudio
     * This method plays the capsule descending audio
     */
    playCapsuleDescendingAudio(){
        Capsule.prototype.audioCapsuleDescending.currentTime = 0;
        Capsule.prototype.audioCapsuleDescending.play();
    }

    /**
     * loadCapsuleAsset
     * Set properties on Capsule class prototype
     * @param {*} canvas
     * @param {*} ctx
     */
    static loadCapsuleAsset(canvas,ctx){
        Capsule.prototype.canvas = canvas;
        Capsule.prototype.ctx = ctx;
        Capsule.prototype.image = new Image();
        Capsule.prototype.image.src = `${window.location.pathname.replace(/\/$/, "")}/assets/img/sprites/shot_capsule.png`;
        Capsule.prototype.animation = [[0,0],[44,0],[88,0],[132,0],[176,0],[220,0],[264,0],[308,0]];
        Capsule.prototype.idAnimation = undefined;
        Capsule.prototype.audioCapsuleDescending = document.getElementById("descendingcapsule");
        Capsule.prototype.audiogetCapsule = document.getElementById("playerCollectCapsule");
    }
}