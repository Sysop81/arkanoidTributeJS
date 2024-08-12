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
        this.drawMenuOption()
    }

    /**
     * drawMenuOption
     */
    drawMenuOption(){
        
        this.ctx.font ="34px arcade";   
		this.ctx.fillStyle="#FFFFFF"; 
        let menuOptions = this.getMenuItems();
        
        // Position measures to draw logo and menu options 
        let height = this.canvas.height / 2;
        const WIDTH = (this.canvas.width / 2) - ((this.canvas.width / 2) / 4);
        const VALUE_TO_INCREASE = 30;

        this.drawLogo((height / 10));

        if(this.menuIndex > 0){
            this.ctx.fillText(this.menuIndex == 1 ? this.lang.DIFICULT.TITLE : this.lang.RANKING.TITLE,WIDTH, height);
            height += VALUE_TO_INCREASE;
        }

        for(let i = 0; i < menuOptions.length;i++){
            this.ctx.fillText(this.isOpMenuSelected(menuOptions[i].TITLE),WIDTH, height); 
            height += VALUE_TO_INCREASE;
        }
    }

    /**
     * drawLogo
     * This method draw the game logo on menu options
     * @param wPosition 
     * @param hPosition 
     */
    drawLogo(hPosition){
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
     * isOpMenuSelected
     * This function format title text adding the character "*" to mark the option selected
     * @param opMenu 
     * @returns String
     */
    isOpMenuSelected(opMenu){
        return (opMenu ==  this.menuSelected ? "*  " : "       ") + opMenu;
    }

    /**
     * getMenuItems
     * This function return the array with the menuItems values to show
     * @returns Array
     */
    getMenuItems(){
        let menuOptions = undefined;
        switch(this.menuIndex){
            case 0:
                menuOptions = this.lang.OPTION_MENU;
                break;
            case 1:
                menuOptions = this.lang.DIFICULT.DIFICULT_MODES;
                break;
            case 2: 
                console.info("Selected Game Ranking");
                menuOptions = [];
                break;            
        }

        return menuOptions;
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
        
        this.menuSelected = this.getMenuItems()[this.menuItemIndex].TITLE
        
        if(this.menuIndex == 1){
            this.dificultSelected = this.menuSelected
            console.log("game modes. Selected : " + this.menuSelected)
        }
        
    }

    playAudioOpMenu(){
        if(!this.isAudioActive) return;
        Menu.prototype.audioOpMenu.currentTime = 0;
        Menu.prototype.audioOpMenu.play();
    }

    playAudioStartGame(){
        if(!this.isAudioActive) return;
        Menu.prototype.audioStartGame.currentTime = 0;
        Menu.prototype.audioStartGame.play();
    }

    static loadMenuAsset(){
        Menu.prototype.image = new Image();
        Menu.prototype.image.src = "../../assets/img/sprites/logo.png";
        Menu.prototype.audioOpMenu = document.getElementById("optionMenu");
        Menu.prototype.audioStartGame = document.getElementById("musicStartGame");
    }
}