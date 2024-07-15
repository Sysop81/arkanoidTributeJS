/**
 * Arkanoid Tribute JS
 * Autor: José Ramón López Guillén
 */

// Imports libraries
import { loadLanguage } from "/js/util/tools.js";
import { Menu } from "/js/model/menu.js";

window.onload = function(){
    
    /**
     * initialize
     * This function initializes the video game
     */
    function initialize(){
        // Step 1. Load language from i18n
        loadLanguage()
        .then(data => {

            // Step 2. Load global vars
            LANGUAGE = data;
            menu = new Menu(CANVAS,CTX,LANGUAGE);
            
            // Step 2. Show the game option menu
            idGame = setInterval(menu.showGameMenu.bind(menu),frameRate);
            
            // Step 3. Handlers
            document.addEventListener("keydown",manageMenu,false)
            
        })
        .catch(error => {
            console.error('Error loading language:', error);
        });

    }

    
    /**
     * manageMenu [Handler]
     * Manage gameMenu option
     * @param evt
     */
    function manageMenu(evt){
        switch (evt.keyCode) {
			case 13:
                // ENTER
                if(menu.menuSelected == LANGUAGE.OPTION_MENU[0].TITLE){
                    console.log("Start a new game with dificulty -> " + menu.dificultSelected);
                }else if (menu.menuSelected == LANGUAGE.OPTION_MENU[1].TITLE){
                    // GAME MODES
                    menu.menuIndex = 1;
                    menu.menuItemIndex = LANGUAGE.DIFICULT.DIFICULT_MODES.findIndex(item => item.TITLE == menu.dificultSelected);
                    menu.menuSelected = menu.dificultSelected;
                }else if(menu.menuSelected == LANGUAGE.OPTION_MENU[2].TITLE){
                    console.log("show rankings")    
                    menu.menuIndex = 2;
                }
                break;
            case 27:
                // ESC
                menu.menuItemIndex = menu.menuIndex    
                menu.menuSelected = LANGUAGE.OPTION_MENU[menu.menuItemIndex].TITLE;
                menu.menuIndex = 0;
                break;
			case 38:
                // Up arrow
                menu.manageOpMenu(false)
                break;
            case 40:
                // Down arrow
                menu.manageOpMenu(true)
                break; 
        }        
    } 

    


    /*********************************************************************                                                                                                                                          *
	*         FLUJO DEL PROGRAMA                                         *                                                                                                                                         *
	**********************************************************************/
    
    // Global var

    var LANGUAGE = undefined;
    const CANVAS = document.getElementById("myGameCanvas");
    let CTX = CANVAS.getContext("2d");
    let frameRate = 50;
    let idGame = undefined;
    let menu = undefined;
       
    
    initialize();    
    
    

}