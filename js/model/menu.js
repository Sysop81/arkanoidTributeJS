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
        
        this.ctx.font ="24px arcade";   
		this.ctx.fillStyle="#FFFFFF"; 

        let menuOptions = this.getMenuItems();
        let height = 250;

        if(this.menuIndex > 0){
            this.ctx.fillText(this.menuIndex == 1 ? this.lang.DIFICULT.TITLE : this.lang.RANKING.TITLE, 130, height);
            height += 30;
        }

        for(let i = 0; i < menuOptions.length;i++){
            this.ctx.fillText(this.isOpMenuSelected(menuOptions[i].TITLE), 180, height); 
            height += 30;
        }
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
        Menu.prototype.audioOpMenu = document.getElementById("optionMenu");
        Menu.prototype.audioStartGame = document.getElementById("musicStartGame");
    }
}