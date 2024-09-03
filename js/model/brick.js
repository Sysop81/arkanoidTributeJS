
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
        Brick.prototype.isMartianMode = 0;
        Brick.prototype.isJRmode = 0;
        Brick.prototype.jrModeScore = 150;
        Brick.prototype.martianModeScore = 260;
    }

    
    /**
     * buildBrickWall
     * This method build the brick wall of the game
     * @param gameMode 
     * @param lang 
     * @returns aray with the brick wall to draw in canvas
     */
    static buildBrickWall(canvas,gameMode,lang){
        	
        let arraySpecialMode;                   // This array contains the positions to draw the wall bricks in martianMode or JRMode
        //let rowsBrickWall = 21;                 // Rows with bricks to build a wall bricks of the game. DEFAULT EASY MODE with 3 rows [7 bricks for row] (3 * 7 = 21)
        let bricksForRow = Math.floor(canvas.width  / 66.0);
        const RESIDUAL_SPACE = canvas.width - (bricksForRow * 66.0); // TODO COMPLETE THIS METHOD IN MEDIUM AND HARD MODES
        //console.log("RESIDUO: -> " + RESIDUAL_SPACE)
        let bricksRows = 3;
        Brick.prototype.jrModeScore = 0;        // Reset JR Mode score
        Brick.prototype.martianModeScore = 0;   // Reset Martian Mode score
    
        // Parameters of wall depending on game mode selected
        if(gameMode == lang.DIFICULT.DIFICULT_MODES[1].TITLE){
            // *** Medium mode
            bricksRows = 5;
            /*rowsBrickWall = 35; //5 rows [7 bricks for row] (5 * 7 = 35)
    
            //*** JR Mode [Only in medium mode].
            Brick.prototype.isJRmode = Brick.#isSpecialGameMode();
            console.log("JRmode is activate ? : " + (Brick.prototype.isJRmode == 1));
    
            if (Brick.prototype.isJRmode == 1){
                // Set the brick wall map for JRMode and set scores.
                arraySpecialMode = [0,0,1,0,1,1,1,0,0,1,0,1,0,1,0,0,1,0,1,1,1,1,0,1,0,1,1,0,1,1,1,0,1,0,1];
                Brick.prototype.jrModeScore = 150;
            }*/

        }else if(gameMode == lang.DIFICULT.DIFICULT_MODES[2].TITLE){
            // *** Hard mode
            bricksRows = 7;
            /*rowsBrickWall = 49; //7 rows with 7 bricks for row
    
            // ***  Martian Mode.
            Brick.prototype.isMartianMode = Brick.#isSpecialGameMode();
            console.log("Martian mode is activate ? : " + (Brick.prototype.isMartianMode == 1));
    
            if(Brick.prototype.isMartianMode == 1){
                // Set the brick wall map for Martian Mode and set scores.
                arraySpecialMode = [0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,1,1,1,1,1,0,1,1,0,1,0,1,1,0,1,1,1,1,1,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0];
                Brick.prototype.martianModeScore = 260;
            }*/
        }

        // Return a builded brickWall to draw in canvas
        return Brick.#generateBrickWall(RESIDUAL_SPACE,bricksForRow,bricksRows,arraySpecialMode);
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
     * isSpecialGameMode [Private]
     * If this method returns 1 then a special mode is activated.
     * Medium game mode -> Activate the JR mode.
     * Hard game mode -> Activate the Martian mode. 
     * @returns int
     */
    static #isSpecialGameMode(){
        return Math.round(Math.random()*(10 - 1) + 1)
    }

    /**
     * generateBrickWall
     * This method build and return a finally brick wall.
     * @param rowsBrickWall 
     * @param arraySpecialMode 
     * @returns array with brick wall
     */
    static #generateBrickWall(RESIDUAL_SPACE,bricksOfRows,bricksRows,arraySpecialMode){ // rowsBrickWall
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
    
            //Eval if the special game mode "JR mode" is activated and mark the brick as broken to draw the wall
            /*if(Brick.prototype.isJRmode == 1 && arraySpecialMode[i] == 0){
                arrayBricks[i].brokenBrick = true;
            }
    
            //Eval if the special game mode "Martian mode" is activated and mark the brick as broken to draw the wall
            if(Brick.prototype.isMartianMode == 1 && arraySpecialMode[i] == 0){
                arrayBricks[i].brokenBrick = true;
            }*/
    
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


