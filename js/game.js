/**
 * Arkanoid Tribute JS
 * Autor: José Ramón López Guillén
 */

// Imports libraries
import { loadLanguage } from "/js/util/tools.js";
import { Menu } from "/js/model/menu.js";
import { Brick } from "./model/brick.js";
import { Player } from "./model/player.js";

window.onload = function(){
    
    /**
     * initialize
     * This function initializes the video game
     */
    function initialize(){
        // Step 1. Load language from i18n
        loadLanguage()
        .then(data => {

            // Step 2. Load global vars, object and prototypes
            LANGUAGE = data;
            menu = new Menu(CANVAS,CTX,LANGUAGE);
            Menu.loadMenuAsset();
            Brick.loadBrickAsset();
            Player.loadPlayerAsset();

            
            // Step 2. Show the game option menu
            idGame = setInterval(menu.showGameMenu.bind(menu),frameRate);
            
            // Step 3. Handlers
            document.addEventListener("keydown",manageKeyDown,false)
            document.addEventListener("keyup",manageKeyUp,false)
            
        })
        .catch(error => {
            console.error('Error loading language:', error);
        });

    }


    function gameLoop(){
        console.log("The game is running!!!!");
        
        // Clear canvas
        CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

        // Draw brick wall
        Brick.draw(CTX, bricks);

        // Draw player
        player.draw(CTX);
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
                    bricks = Brick.buildBrickWall(menu.dificultSelected,LANGUAGE);
                    // Build the player.
                    player = new Player(CANVAS,menu.dificultSelected,LANGUAGE);

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
	*         FLUJO DEL PROGRAMA                                         *                                                                                                                                         *
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
       
    
    initialize();    
}