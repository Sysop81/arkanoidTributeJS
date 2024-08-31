/**
 * class ModalScore
 * Represents the modalScore to save a new player record
 */
export class ModalScore{
    constructor(HTML){
        this.isShowingModal = false;
        this.scoreIndex = 0;
        this.score = 0;
        this.bootstrapObject = undefined;
        this.#buildModal(HTML);
        this.#setValidator();
        this.#setGameSave();
        this.#buildModel();
    }

    /**
     * setScore
     * Setter for score property
     * @param {*} score 
     */
    setScore(score){
        this.score = score;
        document.getElementById('mRecord').innerHTML = this.score;
    }

    /**
     * show
     * This method shows the score modal
     */
    show(){
        this.isShowingModal = true;
        this.bootstrapObject.show();
    }

    /**
     * setValidator [private]
     * This method add a handler for player name input validation
     */
    #setValidator(){
        // Add listerner to manage the input name player
        document.getElementById('mPlayerName').addEventListener('keyup',()=>{
            let value = document.getElementById('mPlayerName').value;
            let msg =  [];
            let isSaveBtnDisabled = true;
            
            // Check if empty input value
            if(this.Tools.validateEmpty(value)){
                msg.push(this.LANGUAGE.MODAL.MSG.ERROR.EMPTY)
            }

            // Check if key is not a character
            const LAST_VALUE = value.length > 0 ? value.charAt(value.length - 1) : '';
            if(LAST_VALUE != '' && !this.Tools.validateCharacter(LAST_VALUE)){
                msg.push(this.LANGUAGE.MODAL.MSG.ERROR.RULE);
            }
            
            // check input length
            if(!this.Tools.validateLength(value)){
                msg.push(this.LANGUAGE.MODAL.MSG.ERROR.LENGTH);
            }

            // If no Errors -> go to save & set display none alert
            if(msg.length === 0){
                isSaveBtnDisabled = false;
                document.getElementsByClassName('alert-danger')[0].classList.add('d-none');
            }else{
                // Manage and show errors
                let eList = document.getElementById('mErrorList');
                eList.innerHTML = '';
                msg.forEach((item)=>{
                    eList.innerHTML += `<li> ${item} </li>`; 
                });
                
                document.getElementsByClassName('alert-danger')[0].classList.remove('d-none');
            }

            // Manage save btn
            document.getElementById('mScoreSave').disabled = isSaveBtnDisabled;

        },false);
    }

    /**
     * setGameSave [private]
     * This method add the handler to save button and set the new score un localStorage
     */
    #setGameSave(){
        document.getElementById('mScoreSave').addEventListener("click",()=>{
            // Get the array scores from localData
            let scores = this.Tools.getLocalData();
            
            // Update the Score array
            scores.push({name : document.getElementById('mPlayerName').value, 
                    score : this.score
                });
            
            // Check if need remove any score element
            if(scores.length > 5)  scores.splice(this.scoreIndex,1);
                    
            // Update the localStorage rankings        
            if(this.Tools.setLocalData('scores',JSON.stringify(scores))){
                document.getElementById('mScoreSave').disabled = true;
                document.getElementsByClassName('alert-success')[0].classList.remove('d-none');
            }

            // Disabled input player name
            document.getElementById('mPlayerName').disabled = true;
            this.isShowingModal = false;
        });
    }

    /**
     * buildModal [private]
     * This method load the html content on the container and set the language
     * @param {*} HTML 
     */
    #buildModal(HTML){
        // Set modal HTML in the container & set language
        document.getElementById('modalContainer').innerHTML = HTML;
        document.getElementById('mScoreTitle').textContent = this.LANGUAGE.MODAL.TITLE;
        document.getElementById('mScoreClose').textContent = this.LANGUAGE.MODAL.BUTTON.CLOSE;
        document.getElementById('mScoreSave').textContent = this.LANGUAGE.MODAL.BUTTON.SAVE;
        document.getElementById('mScoreMsg').textContent = this.LANGUAGE.MODAL.MSG.TITLE;
        document.getElementById('mHeaderSocre').textContent = this.LANGUAGE.MODAL.TABLE.SCORE
        document.getElementById('mPlayerName').setAttribute("placeholder", this.LANGUAGE.MODAL.PLACEHOLDER);
        document.getElementById('mSuccessMsg').innerHTML = this.LANGUAGE.MODAL.MSG.SUCCESS;   
        document.getElementById('mErrorMsg').innerHTML = this.LANGUAGE.MODAL.MSG.ERROR.TITLE; 
        document.getElementById('mScoreSave').disabled = true;
    }

    /**
     * buildModel [private]
     * This method build a bootstrap modal object
     */
    #buildModel(){
        try{
            // Building a model
            this.bootstrapObject = new bootstrap.Modal(document.getElementById('mScore'));

            // Adding handler to close modal
            document.getElementById('mScore').addEventListener('hide.bs.modal',()=>{
                this.isShowingModal = false;
                document.querySelectorAll('.alert-success, .alert-danger').forEach((node)=>{
                    node.classList.add('d-none');
                });
            });

        }catch(e){
            console.error("Error to get Bootstrap [CDN-Error]");
        }
    }

    /**
     * loadBrickAsset
     * Set properties on ModalScore class prototype
     */
    static loadModalScoresAsset(LANGUAGE,Tools){
        ModalScore.prototype.LANGUAGE = LANGUAGE;
        ModalScore.prototype.Tools = Tools;
    }
}