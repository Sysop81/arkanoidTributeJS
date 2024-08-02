/**
 * Arkanoid Tribute JS
 * Autor: José Ramón López Guillén
 */

// Imports libraries
import { loadLanguage, setCanvasMeasures} from "/js/util/tools.js";
import { Menu } from "/js/model/menu.js";
import { Brick } from "./model/brick.js";
import { Player } from "./model/player.js";
import { Ball } from "./model/ball.js";
import { Explosion } from "./model/explosion.js";

window.onload = function(){
    
    /**
     * initialize
     * This function initializes the video game
     */
    function initialize(){
        // Step 0. Set canvas sizes
        setCanvasMeasures(CANVAS);

        // Step 1. Load language from i18n
        loadLanguage()
        .then(data => {
            // Step 2. Load global vars, object and prototypes
            LANGUAGE = data;
            menu = new Menu(CANVAS,CTX,LANGUAGE);
            Menu.loadMenuAsset();
            Brick.loadBrickAsset();
            Player.loadPlayerAsset();
            Ball.loadBallAsset();
            Explosion.loadExplosionAsset(CTX);

            
            // Step 2. Show the game option menu
            idGame = setInterval(menu.showGameMenu.bind(menu),frameRate);
            
            // Step 3. Handlers
            document.addEventListener("keydown",manageKeyDown,false)
            document.addEventListener("keyup",manageKeyUp,false)
            window.addEventListener('resize', setCanvasMeasures(CANVAS));
            
        })
        .catch(error => {
            console.error('Error loading language:', error);
        });

    }

    /**
     * gameLoop
     * This is the main function that updates all game object
     */
    function gameLoop(){
        console.log("The game is running!!!!");
        
        // Clear canvas
        CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

        // Draw brick wall
        Brick.draw(CTX, bricks);

        // Draw player
        player.draw(CTX);

        // Draw ball
        ball.draw(CTX);

        // Check game over
        if(!checkGameStatus()){
            // Check the ball moving
            if(ball.isBallActive){
                ball.checkBallCollider(CANVAS,player,bricks);
                updateGameMarker();

            }else{
                // Game is Stopped
                showGameMsg(LANGUAGE.PLAYER_MSG.START_GAME);
                setPlayerAndBallTogether();
            }
        }
    }


    /**
     * checkGameStatus
     * @returns true or false
     */
    function checkGameStatus(){
        let isStop = false;
        let msg = LANGUAGE.PLAYER_MSG.GAME_OVER;
        if(player.lives == 0) isStop = true;
        if(player.lives > 0 && player.score == bricks.length * 10){ // NOT VALID TO SPECIALS MODES
            msg = LANGUAGE.PLAYER_MSG.WIN;
            isStop = true;
        }

        if(isStop){
            clearInterval(idGame);
            idGame = undefined;
            console.log("The game is over");
            showGameMsg(msg);
        }

        return isStop;
    }
    
    /**
     * updateGameMarker
     * this function update a game marker
     */
    function updateGameMarker(){
        document.getElementById("lives").innerHTML = `${LANGUAGE.GAME_MARKER.LIVES}  ${player.lives}`; 
        document.getElementById("score").firstElementChild.innerHTML = ` ${player.score}`;   
    }
    
    /**
     * setPlayerAndBallTogether
     * This function moves the player and ball together. The game is stopped.
     */
    function setPlayerAndBallTogether(){
        if(!ball.isBallActive){
            ball.x = (player.x + player.playerSizeX/2) - ball.ballSizeX/2;  // Set the bal in the middle of player 
			ball.y = player.y - player.playerSizeY; 
        }
    }


    /**
     * showGameMsg
     * This function shows the diferent messages to the player on the game canvas.
     * @param msg 
     */
    function showGameMsg(msg){
        CTX.font = "24px arcade";
        CTX.fillStyle = "#FFFFFF";

        switch(msg){
            case LANGUAGE.PLAYER_MSG.START_GAME:
            case LANGUAGE.PLAYER_MSG.WEAPONS:    
                CTX.fillText(msg,(CANVAS.width / 2) - msg.length * 5, Math.round((player.y / 1.1),0));
                break;
            case LANGUAGE.PLAYER_MSG.WIN:
                CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
                CTX.font ="60px arcade";
                CTX.fillText(msg, (CANVAS.width / 2) - msg.length * 12, CANVAS.height / 2); 
                CTX.font ="30px arcade";
				CTX.fillText(LANGUAGE.PLAYER_MSG.RESET_GAME, (CANVAS.width / 2) - LANGUAGE.PLAYER_MSG.RESET_GAME.length * 6, Math.round((player.y / 1.1),0));
                break;
            case LANGUAGE.PLAYER_MSG.GAME_OVER:
                CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
                CTX.font ="80px arcade";   
				CTX.fillText(msg[0], (CANVAS.width / 2) - msg[0].length * 15, (CANVAS.height / 2) / 1.30 );  
				CTX.fillText(msg[1], (CANVAS.width / 2) - msg[1].length * 15, CANVAS.height / 2);  
				CTX.font ="30px arcade";
				CTX.fillText(LANGUAGE.PLAYER_MSG.RESET_GAME, (CANVAS.width / 2) - LANGUAGE.PLAYER_MSG.RESET_GAME.length * 6, Math.round((player.y / 1.1),0));
                break;           
        }
    }
    
    /**
     * manageKeyDown [Handler]
     * Manage key down listener on the game
     * @param evt
     */
    function manageKeyDown(evt){
        switch (evt.keyCode) {
			case 13:
                // ENTER
                if(menu.menuSelected == LANGUAGE.OPTION_MENU[0].TITLE){
                    // *** NEW GAME
                    // Play the audio for start a new game.
                    menu.playAudioStartGame();
                    console.log("Start a new game with dificulty -> " + menu.dificultSelected);
                    // Load the bricks wall
                    bricks = Brick.buildBrickWall(CANVAS,menu.dificultSelected,LANGUAGE);
                    // Build the player.
                    player = new Player(CANVAS,menu.dificultSelected,LANGUAGE);

                    // Build the ball
                    ball = new Ball(player);

                    // Clean a menu interval, and set a new interval with the transition to start a new game.
                    clearInterval(idGame);
                    idGame = setInterval(outWallpaper,frameRate);   

                }else if (menu.menuSelected == LANGUAGE.OPTION_MENU[1].TITLE){
                    // *** GAME MODES
                    menu.menuIndex = 1;
                    menu.menuItemIndex = LANGUAGE.DIFICULT.DIFICULT_MODES.findIndex(item => item.TITLE == menu.dificultSelected);
                    menu.menuSelected = menu.dificultSelected;
                }else if(menu.menuSelected == LANGUAGE.OPTION_MENU[2].TITLE){
                    // *** RANKING
                    console.log("show rankings");    
                    menu.menuIndex = 2;
                }
                break;
            case 27:
                // ESC
                menu.menuItemIndex = menu.menuIndex    
                menu.menuSelected = LANGUAGE.OPTION_MENU[menu.menuItemIndex].TITLE;
                menu.menuIndex = 0;
                break;
            case 32:
                // Space
                if(ball != undefined && !ball.isBallActive) ball.setBallActive(true);     
                break;    
            case 37:
                // Left arrow (Player)
                Player.prototype.xLeft = true;
                break;    
			case 38:
                // Up arrow
                menu.playAudioOpMenu();
                menu.manageOpMenu(false)
                break;
            case 39:
                // Right arrow
                Player.prototype.xRight = true;
                break;    
            case 40:
                // Down arrow
                menu.playAudioOpMenu();
                menu.manageOpMenu(true)
                break;
            case 82:
                // R key
                restartGame();
                break;     
        }        
    }


    /**
     * restartGame
     * This function restart the game
     */
    function restartGame(){
        if(idGame == undefined){
            document.getElementById("lives").innerHTML = `${LANGUAGE.GAME_MARKER.LIVES}  3`; 
            document.getElementById("score").firstElementChild.innerHTML = 0;  
            CANVAS.setAttribute("class","game0");
            idGame = setInterval(menu.showGameMenu.bind(menu),frameRate);
        }
            
    }


    /**
     * manageKeyUp [Handler]
     * Manage key up listener on the game
     * @param evt
     */
    function manageKeyUp(evt){
        switch (evt.keyCode) {
			case 37: 
                // Left arrow
                Player.prototype.xLeft = false;
			    break;
			case 39:
                // Right arrow   
                Player.prototype.xRight = false;
			    break;
        }
    }
    
    
    /**
     * outWallpaper
     * This function makes the transition out for the game wallpaper.
     */
    function outWallpaper(){
        canvasOpacity--; 
		
		if(canvasOpacity > 0){
			CANVAS.setAttribute("style", `opacity: ${canvasOpacity}%`/*opacidadCanvas*/);
		}else{

            // Clean the menu options
            CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

			// Get a randon wallpaper && backgroud gradient
            let numeroDeFondo = Math.floor(Math.random() * (8 - 0 + 1)) + 0;  
			
            // Set a canvas background && game marker with random CSS styles 
            CANVAS.setAttribute("class",(`game${numeroDeFondo}`));
            document.getElementById("gameMarker").setAttribute("style",
                `background-image: linear-gradient(${gradients[numeroDeFondo - 1]});`);

            // *** TODO [CHECKING] 
            
            // Desactivate audio menu.
            menu.setAudioStatus(false);

            // Draw a brick wall
            Brick.draw(CTX, bricks);    
            player.draw(CTX);
            ball.draw(CTX);
            
					
			// End the interval outWallpaper
			clearInterval(idGame);

			// Call the new interval inWallpaper game
			idGame = setInterval(inWallpaperGame,50);
            
        }    
    }

    /**
     * This function makes the transition in for the game wallpaper.
     */
    function inWallpaperGame(){
        
        canvasOpacity ++;
		
		if(canvasOpacity <= 100){
			CANVAS.setAttribute("style", `opacity:${canvasOpacity}%`);
		}else{
            // Clear interval initial animate && load gameLoop
			clearInterval(idGame);
			idGame = setInterval(gameLoop, 10); // Evaluate frameRate
		}
    }

    


    /*********************************************************************                                                                                                                                          *
	*         PROGRAM FLOW                                               *                                                                                                                                         *
	**********************************************************************/
    
    // Global var

    var LANGUAGE = undefined;
    const CANVAS = document.getElementById("myGameCanvas");
    const CTX = CANVAS.getContext("2d");
    let frameRate = 50;
    let canvasOpacity = 100;
    let gradients = ["",
                     "black,grey,black", 
                     "black,purple,blue",
                     "black,#825c2d,black",
                     "red,black,red",
                     "to right, red, orange, yellow, green, blue, darkviolet",
                     "black,black,black",
                     "to right,black,darkred,black"]
    let idGame = undefined;
    let menu = undefined;
    let bricks = undefined;
    let player = undefined;
    let ball = undefined;
    
    initialize();    
}