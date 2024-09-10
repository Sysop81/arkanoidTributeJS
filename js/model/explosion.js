/**
 * Class Explosion
 * This class represents the all explosion object to the game.
 */
export class Explosion{
    static EXPLOSION_TYPES = {
        STAR : "STAR",
        DEATH: "DEATH",
        SHOT : "SHOT"
    };

    constructor(type,Xposition,Yposition){
        const OPTIONS = Explosion.#getExplosionSizes(type);
        this.type = type;
        this.explosionSizeX = OPTIONS.explosionSizeX
        this.explosionSizeY = OPTIONS.explosionSizeY
        this.positionXsprite = OPTIONS.positionXsprite
        this.positionYsprite = OPTIONS.positionYsprite
        this.x = Xposition;
        this.y = Yposition;
        this.positionOfMatrixAnimation = 0;
    }


    /**
     * draw
     * This method draw the explosion game object on game canvas
     */
    draw(){
        // Get the draw options in real time
        const OPTIONS = Explosion.#getDrawOptions(this.type);   
        
        // Draw the correct explosion in canvas
        this.ctx.drawImage(OPTIONS.image,                        // Sprite with all types of Explosion
			OPTIONS.animation[this.positionOfMatrixAnimation][0],// Sprite X position to draw
			OPTIONS.animation[this.positionOfMatrixAnimation][1],// Sprite Y Position yo draw 
			this.positionXsprite,                                 // Size X of the explosion
			this.positionYsprite,	                              // Size Y of the explosion
			this.x,                                               // Display X position to draw the explosion
			this.y,	                                              // Display Y position to draw the ball
			this.explosionSizeX,                                  // Size X of the explosion
			this.explosionSizeY);                                 // Size Y of the explosion
    }

    
    /**
     * loadAnimate
     * This method calculate the positions of sprite animation on base of the animation type. 
     * Later draw the game object in canvas and finally reset the animation.
     */
    loadAnimate(){ 
        if(this.positionOfMatrixAnimation < (this.type == Explosion.EXPLOSION_TYPES.STAR ? this.animationStar.length : 
            this.type == Explosion.EXPLOSION_TYPES.SHOT ? this.animationShot.length : this.animationDeath.length)){
            // Increment sprite frame && draw in canvas
            this.draw();
            this.positionOfMatrixAnimation++;
            requestAnimationFrame(this.loadAnimate.bind(this));
        }else{
            // Reset and clear interval animation
            this.positionOfMatrixAnimation = 0;
           
            switch(this.type){
                case Explosion.EXPLOSION_TYPES.STAR:
                    clearInterval(this.idAnimationStar);
                    this.idAnimationStar = undefined;
                    break;
                case Explosion.EXPLOSION_TYPES.SHOT:
                    clearInterval(this.idAnimationShot);
                    this.idAnimationShot = undefined;
                    break;
                default:
                    clearInterval(this.idAnimationDeath);
                    this.idAnimationDeath = undefined;
            }
        }
    }


     /**
      * loadExplosionAsset
      * Set properties on Explosion class prototype
      * @param {*} ctx 
      */
     static loadExplosionAsset(ctx){
        const PATH = `${window.location.pathname.replace(/\/$/, "")}/assets/img/sprites/`;
        Explosion.prototype.ctx = ctx;
        Explosion.prototype.imageStar = new Image();
        Explosion.prototype.imageStar.src = `${PATH}star_explosion.png`; 
        Explosion.prototype.animationStar = [[0,0],[154,0],[316,0],[478,0],[0,174],[154,174],[316,174],[478,174],[0,308],[154,308],[316,308],[478,308]];
        Explosion.prototype.idAnimationStar = undefined;
        Explosion.prototype.imageDeath = new Image();
        Explosion.prototype.imageDeath.src = `${PATH}death_explosion.png`; 
        Explosion.prototype.animationDeath = [[0,0],[106,0],[212,0],[325,0],[440,0],
                                              [0,70],[106,70],[212,70],[325,70],[440,70],
                                              [0,136],[106,136],[212,136],[325,136],[440,136],
                                              [0,197],[106,197],[212,197],[325,197],[440,197],
                                              [0,260],[106,260],[212,260],[325,260],[440,260]];
        Explosion.prototype.idAnimationDeath = undefined; 
        Explosion.prototype.imageShot = new Image();
        Explosion.prototype.imageShot.src = `${PATH}shot_explosion.png`;
        Explosion.prototype.animationShot = [[0,0],[128,0],[256,0],[384,0],
                                             [0,126],[128,126],[256,126],[384,126],
                                             [0,252],[128,252],[256,252],[384,252],
                                             [0,378],[128,378],[256,378],[384,378]];
        Explosion.prototype.idAnimationShot = undefined;                                     
    }


    /**
     * getExplosionSizes [private]
     * This method returns the animation options besed on the type passed by parameter
     * @param {*} type 
     * @returns JSON options
     */
    static #getExplosionSizes(type){
        // All options of animation explosion
        const OPTIONS = [
            {
                type : Explosion.EXPLOSION_TYPES.STAR,
                explosionSizeX : 100,
                explosionSizeY : 120,
                positionXsprite : 150,
                positionYsprite : 130
            },
            {
                type : Explosion.EXPLOSION_TYPES.SHOT,
                explosionSizeX : 100,
                explosionSizeY : 120,
                positionXsprite : 150,
                positionYsprite : 130
            },
            {
                type : Explosion.EXPLOSION_TYPES.DEATH,
                explosionSizeX : 300,
                explosionSizeY : 300,
                positionXsprite : 110,
                positionYsprite : 100
            }

        ];

        return OPTIONS.filter(item => item.type == type)[0];
    }


    /**
     * getDrawOptions [private]
     * This method return the explosion draw options based on the type of explosion in real time.
     * @param {*} type 
     * @returns JSON options
     */
    static #getDrawOptions(type){
        return {
            image : type == Explosion.EXPLOSION_TYPES.STAR ? Explosion.prototype.imageStar : type == Explosion.EXPLOSION_TYPES.SHOT ? Explosion.prototype.imageShot : Explosion.prototype.imageDeath,
            animation : type == Explosion.EXPLOSION_TYPES.STAR ? Explosion.prototype.animationStar : type == Explosion.EXPLOSION_TYPES.SHOT ? Explosion.prototype.animationShot : Explosion.prototype.animationDeath,
        }
    }
}