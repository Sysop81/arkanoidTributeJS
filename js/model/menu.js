import { buildSavePlayerName, getLocalData } from "../util/tools.js";

/**
 * Class Menu
 * Represents the game menu options
 */
export class Menu{
    constructor(canvas,ctx,lang){
        this.canvas = canvas;
        this.ctx = ctx;
        this.lang = lang;
        this.menuSelected = lang.OPTION_MENU[0].TITLE;
        this.dificultSelected = lang.DIFICULT.DIFICULT_MODES[0].TITLE;
        this.menuIndex = 0;
        this.menuItemIndex = 0;
        this.isAudioActive = true;
        this.isShowingGameTypeMenu = false;
    }

    /**
     * setAudioStatus
     * Setter for property isAudioActive
     * @param Boolean status 
     */
    setAudioStatus(status){
        this.isAudioActive = status;
    }

    /**
     * showGameMenu
     * Clear canvas && draw de menuItems options
     */
    showGameMenu(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.#drawMenuOption()
    }

    /**
     * manageOpMenu
     * This function manage the item index of menu
     * @param isDown 
     */
    manageOpMenu(isDown){
        if(isDown){
            if( this.menuItemIndex >= 2){
                this.menuItemIndex = 0;
            }else{
                this.menuItemIndex++;
            }
        }else{
            if(this.menuItemIndex <= 0){
                this.menuItemIndex = 2;
            }else{
                this.menuItemIndex--;
            }
        }
        
        this.menuSelected = this.#getMenuItems()[this.menuItemIndex].TITLE

        if(this.menuIndex == 1){
            this.dificultSelected = this.menuSelected
            console.log("game modes. Selected : " + this.menuSelected)
        }
        
    }

    /**
     * playAudioOpMenu
     * This method plays the audio option menu
     * @returns 
     */
    playAudioOpMenu(){
        if(!this.isAudioActive) return;
        Menu.prototype.audioOpMenu.currentTime = 0;
        Menu.prototype.audioOpMenu.play();
    }

    /**
     * playAudioStartGame
     * This method plays the start audio game
     * @returns 
     */
    playAudioStartGame(){
        if(!this.isAudioActive) return;
        Menu.prototype.audioStartGame.currentTime = 0;
        Menu.prototype.audioStartGame.play();
    }

    /**
     * drawMenuOption [Private]
     * This method draw the logo and titles for option menu
     */
    #drawMenuOption(){
        
        this.ctx.font ="2em arcade";   
		this.ctx.fillStyle="#FFFFFF"; 
        let menuOptions = this.#getMenuItems();
        
        // Position measures to draw logo and menu options 
        let height = this.canvas.height / 2;
        const VALUE_TO_INCREASE = 30;

        // Draw the game logo
        this.#drawLogo((height / 10));

        if(this.menuIndex > 0){
            const JSON_OPTION = this.#getOptionAndPosition(
                (this.menuIndex == 1 ? this.lang.DIFICULT.TITLE : this.lang.RANKING.TITLE),8);      
            this.ctx.fillText(JSON_OPTION.title,JSON_OPTION.width, height);
            height += VALUE_TO_INCREASE;
        }

        for(let i = 0; i < menuOptions.length;i++){
            const JSON_OPTION = this.#getOptionAndPosition((this.#isOpMenuSelected(menuOptions[i].TITLE)),6);
            this.ctx.fillStyle = JSON_OPTION.title.includes(this.menuSelected) ? "#DC3545" :  "#FFFFFF";
            this.ctx.fillText(JSON_OPTION.title,JSON_OPTION.width,height);
            height += VALUE_TO_INCREASE;
        }
    }

    /**
     * drawLogo [Private]
     * This method draw the game logo on menu options
     * @param wPosition 
     * @param hPosition 
     */
    #drawLogo(hPosition){
        this.ctx.drawImage(this.image,  // Image logo
            0,                          // Logo X position to draw 
            0,                          // Logo Y Position to draw 
            1750,		                // Size X of the image logo
            500,	                    // Size Y of the image logo
            0,                          // Display X position to draw the logo
            hPosition,	                // Display Y position to darw the logo
            this.canvas.width,		    // Size X of the logo
            200);                       // Size Y of the logo
    }

    /**
     * getMenuItems [Private]
     * This method return the array with the menuItems values to show
     * @returns Array
     */
    #getMenuItems(){
        let menuOptions = undefined;
        switch(this.menuIndex){
            case -1:
                // Game type
                menuOptions = this.lang.NEW_GAME_TYPE;
                break;
            case 0:
                menuOptions = this.lang.OPTION_MENU;
                break;
            case 1:
                menuOptions = this.lang.DIFICULT.DIFICULT_MODES;
                break;
            case 2: 
                menuOptions = [];
                const scores = getLocalData();
                for(let i = 0; i < scores.length; i++){
                    menuOptions.push({TITLE :`${buildSavePlayerName(scores[i].name)}        ${scores[i].score} pts`});
                }
                break;            
        }

        return menuOptions;
    }

    /**
     * isOpMenuSelected [private]
     * This function format title text adding the character "*" to mark the option selected
     * @param opMenu 
     * @returns String
     */
    #isOpMenuSelected(opMenu){
        return (opMenu ==  this.menuSelected ? "*  " : "       ") + opMenu;
    }

    /**
     * getOptionAndPosition [private]
     * This method calculates the width to draw the title option menu
     * @param {*} option. Title option to draw in canvas 
     * @param {*} characterSize. Size in pixels for a character
     * @returns JSON 
     */
    #getOptionAndPosition(option,characterSize){ 
        return {
            title : option,
            width : (this.canvas.width / 2) - (characterSize * option.length)
        }
    }

    /**
     * loadMenuAsset
     * Set properties on Menu class prototype
     */
    static loadMenuAsset(){
        Menu.prototype.image = new Image();
        Menu.prototype.image.src = `${window.location.pathname.replace(/\/$/, "")}/assets/img/sprites/logo.png`;
        Menu.prototype.audioOpMenu = document.getElementById("optionMenu");
        Menu.prototype.audioStartGame = document.getElementById("musicStartGame");
    }
}