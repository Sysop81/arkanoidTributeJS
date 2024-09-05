
/**
 * class Brick
 * Represents the brick to be broken by the ball
 */
export class Brick{
    constructor(positionX, positionY, positionXsprite){
        this.brickSizeX = 64;
        this.brickSizeY = 32;
        this.positionXsprite = positionXsprite;
        this.positionYsprite = 0;
        this.x = positionX;
        this.y = positionY;
        this.brokenBrick = false;  
        this.isCapsuleInside = false;
        this.lifeAfterBeingShot = 100;  // Only for shot not apply to the ball
    }

    /**
     * setCapsuleInside
     * Set true or false if brick contains ot not a weapon capsule
     * @param value boolean 
     */
    setCapsuleInside(value){
        this.isCapsuleInside = value;
    }

    /**
     * loadBrickAsset
     * Set properties on Brick class prototype
     */
    static loadBrickAsset(){
        Brick.prototype.image = new Image();
        Brick.prototype.image.src = `${window.location.pathname.replace(/\/$/, "")}/assets/img/sprites/bricks.png`;
        Brick.prototype.animation = [[0,0],[71,0],[143,0],[215,0]];
    }

    
    /**
     * buildBrickWall
     * This method build the brick wall of the game
     * @param gameMode 
     * @param lang 
     * @returns aray with the brick wall to draw in canvas
     */
    static buildBrickWall(canvas,gameMode,lang){
        let bricksForRow = Math.floor(canvas.width  / 66.0);
        const RESIDUAL_SPACE = canvas.width - (bricksForRow * 66.0); 
        
        // Parameters of wall depending on game mode selected
        const BRICKS_ROWS = gameMode == lang.DIFICULT.DIFICULT_MODES[0].TITLE ? 3 :
                                gameMode == lang.DIFICULT.DIFICULT_MODES[1].TITLE ? 5 : 7

        // Return a builded brickWall to draw in canvas
        return Brick.#generateBrickWall(RESIDUAL_SPACE,bricksForRow,BRICKS_ROWS/*bricksRows*/);
    }

    /**
     * draw
     * This method draw the not broken bricks on canvas
     * @param ctx 
     * @param arrayBricks 
     */
    static draw(ctx,arrayBricks){
		
        // Reading the array with the generated bricks
        for (let i = 0; i < arrayBricks.length; i++){
          if (!arrayBricks[i].brokenBrick){	         // If brick is not broken -> this is draw
                ctx.drawImage(arrayBricks[i].image,  // Brick Sprite with all models
                    arrayBricks[i].positionXsprite,  // X brick sprite position to cut from sprite to draw
                    arrayBricks[i].positionYsprite,	 // Y brick sprite position to cut from sprite to draw
                    arrayBricks[i].brickSizeX,       // X size of brick to draw
                    arrayBricks[i].brickSizeY,	     // Y size of brick to draw Tamaño 
                    arrayBricks[i].x,                // X display position to draw the cutted brick
                    arrayBricks[i].y,	             // Y display position to draw the cutted brick
                    arrayBricks[i].brickSizeX,       // X size of brick to draw
                    arrayBricks[i].brickSizeY);      // X size of brick to draw
            }
        }	
    }

    /**
     * getSpritePosition [Private]
     * This method return the array with the sprite values for the all bricks of the row. this form,
     * all bricks of the same row have a same color.
     * @param numOfBricksRows 
     * @returns array with sprite array position to draw the bricks
     */
    static #getSpritePosition(numOfBricksRows){
        let ArrayPositionsX = [];
        for(let i = 0; i < numOfBricksRows; i++){
            ArrayPositionsX.push(Math.round(Math.random()*(3 - 0) + 0));
        }
        return  ArrayPositionsX;
    }

    /**
     * generateBrickWall
     * This method build and return a finally brick wall.
     * @param rowsBrickWall  
     * @returns array with brick wall
     */
    static #generateBrickWall(RESIDUAL_SPACE,bricksOfRows,bricksRows){ 
        // Internal vars
        const BRICKS_WALL = bricksOfRows * bricksRows;
        let arrayBricks = [];
        let positionX = RESIDUAL_SPACE / 2; // Left margin of each row of bricks that will be drawed on the screen
        const MARGIN_BETWEEN_BRICKS = 2;    // Margin between each of the bricks, so that they are not drawed together or joined
        const BRICK_SIZE_X = 64;            // X Brick size
        
        let positionY = 10;                 // Top margin of the first row of bricks
        const BRICK_SIZE_Y = 32;            // Y Brick size 

        let cont = 0;                       // Counter to control the brick of each row.
        let index = 0;                      // Contains the value of the index of arrayPosicionesXsprite 
                                            // (as many positions as rows exist depending on the difficulty, this array contains values ​​between 0-3)

        // Set the random brick to contains the capsule to activate the shots.
        const IS_BRICK_WITH_WEAPON_CAPSULE = Math.round(Math.random()*((BRICKS_WALL-1)-0) + 0); 
            
        // Generate array with X positions
        const ARRAY_X_POSITIONS_OF_SPRITE = Brick.#getSpritePosition(BRICKS_WALL); 

        // Building a brick wall
        for (let i = 0; i < BRICKS_WALL; i++){ //rowsBrickWall
            // Update counter and instantiate a new object for brick wall
            cont++;
            arrayBricks.push(new Brick(positionX,positionY, Brick.prototype.animation[ARRAY_X_POSITIONS_OF_SPRITE[index]][0]));
    
            // Eval if this current for index is equal to brick with weapon capsule
            if (i == IS_BRICK_WITH_WEAPON_CAPSULE){
                //console.log("CAPUSLE IN BRICK NUMBER -> " + i);
                arrayBricks[i].setCapsuleInside(true); // Mark the brick with the weapon capsule
            }
    
            //Recalculate the X position
            positionX = positionX + BRICK_SIZE_X + MARGIN_BETWEEN_BRICKS;
            
            // This conditional reset all values to start a new row brick 
            if (cont == bricksOfRows){                                                                 
                positionX = RESIDUAL_SPACE / 2;                                 // Reset the X position because is the start of each row of wall
                positionY = positionY + BRICK_SIZE_Y + MARGIN_BETWEEN_BRICKS;   // Update the Y position for new row of brick wall
                cont = 0;                                                       // Reset row bricks counter. Controls of the brick of each row 
                index ++;                                                       // 3, 5 or 7 rows. Depending of the game mode selected. 
            }
        }

        return arrayBricks;
    }
}


