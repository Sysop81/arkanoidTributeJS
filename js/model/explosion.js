/**
 * Class Explosion
 * This class represents the all explosion object to the game.
 */
export class Explosion{
    constructor(type,Xposition,Yposition){
        this.explosionSizeX = 100;
        this.explosionSizeY = 120;
        this.positionXsprite = 150
        this.positionYsprite = 130
        this.x = Xposition;
        this.y = Yposition;
        this.positionOfMatrixAnimation = 0;
    }


    /**
     * draw
     * This method draw the explosion game object on game canvas
     */
    draw(){
        this.ctx.drawImage(this.imageStar,                        // Sprite with all types of Explosion
			this.animationStar[this.positionOfMatrixAnimation][0],// Sprite X position to draw
			this.animationStar[this.positionOfMatrixAnimation][1],// Sprite Y Position yo draw 
			this.positionXsprite,                                 // Size X of the explosion
			this.positionYsprite,	                              // Size Y of the explosion
			this.x,                                               // Display X position to draw the explosion
			this.y,	                                              // Display Y position to draw the ball
			this.explosionSizeX,                                  // Size X of the explosion
			this.explosionSizeY);                                 // Size Y of the explosion
    }

    /**
     * loadStarAnimate
     */
    loadStarAnimate(){
        if(this.positionOfMatrixAnimation < this.animationStar.length){
            this.draw();
            this.positionOfMatrixAnimation++;
        }else{
            this.positionOfMatrixAnimation = 0;
            clearInterval(this.idAnimationStar);
            this.idAnimationStar = undefined;
        }
    }


     /**
      * loadExplosionAsset
      * Set properties on Explosion class prototype
      * @param {*} ctx 
      */
     static loadExplosionAsset(ctx){
        Explosion.prototype.ctx = ctx;
        Explosion.prototype.imageStar = new Image();
        Explosion.prototype.imageStar.src = "../../assets/img/sprites/star_explosion.png";
        Explosion.prototype.animationStar = [[0,0],[154,0],[316,0],[478,0],[0,174],[154,174],[316,174],[478,174],[0,308],[154,308],[316,308],[478,308]];
        Explosion.prototype.idAnimationStar = undefined;
    }
}