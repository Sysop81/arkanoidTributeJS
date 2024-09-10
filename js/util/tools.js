
// *** Helpers tools functions  
const BASE_PATH = window.location.pathname.replace(/\/$/, "");

/**
 * loadPlayerScoreModal
 * This function returns the player score modal HTML to load in main INDEX
 * @returns HTML
 */
export async function loadComponents(folder,file){
    const FILE_PATH = `${BASE_PATH}/${folder}/${file}`;
    const response = await fetch(FILE_PATH);      
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.text();
}

/**
 * loadLanguage
 * This function load the default game language.
 * @returns JSON
 */
export async function loadLanguage(){
    //const uLanguage = navigator.language || navigator.userLanguage;
    // [EXAMPLE FOR MORE i18n language files] -> !uLanguage.startsWith('es') ? `${BASE_PATH}/i18n/i18n.json` : ``;
    const i18n = `${BASE_PATH}/i18n/i18n.json`;

    const response = await fetch(i18n);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();  
}

/**
 * setCanvasMeasures
 * This function set the canvas width & height based on the parent element.
 * @param {*} canvas 
 */
export function setCanvasMeasures(canvas){
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

/**
 * setLocalData
 * This function save the score in localStarege
 * @param {*} key 
 * @param {*} value 
 */        
export function setLocalData(key,value) {
    try{
        localStorage.setItem(key,value);
        return true;
    }catch(e){
        console.error("Can not save the record");
        return false;
    }
     
}

/**
 * getLocalData
 * This function gets the array of scores saved in localStorage
 * @param {} key 
 * @returns [] scores
 */
export function getLocalData(){
    let SCORES = JSON.parse(localStorage.getItem('scores'));
    if(SCORES === null) {
        SCORES = [];
        setLocalData('scores',JSON.stringify(SCORES));
    } 
    return SCORES.sort((first,second)=> first.score - second.score)
}

/**
 * buildSavePlayerName
 * @param {*} targetName 
 * @returns player name with '_' character contact to coplete the length
 */
export function buildSavePlayerName(targetName){
    const LENGTH = 6 - targetName.length;
    for(let i = 0; i < LENGTH; i++){
        targetName = targetName.concat('_');
    }
    return targetName;
}

/**
 * validateCharacter
 * This function validates a character between a-z or A-Z or valid digit between 0-9
 * @param {*} character 
 * @returns true or false
 */
export function validateCharacter(character){
    const regex = /^[a-zA-Z0-9]$/;
    return regex.test(character);
}

/**
 * validateLength
 * This function validates if the input text is between 0-6 characters
 * @param {*} text 
 * @returns true or false
 */
export function validateLength(text){
    return text.length >= 0 && text.length <= 6;
}

/**
 * validateEmpty
 * This function validates if the input text if empty
 * @param {*} text 
 * @returns true or false
 */
export function validateEmpty(text){
    return text.length === 0;
}

/**
 * showGamePad
 * This function determines if it is a touch device or not
 * @returns true or false
 */
export function showGamePad(){
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * changeLeftGamePad
 * This function shows or hide the left pad buttons based on is playing or not
 * @param {*} isPlayingGame 
 */
export function changeLeftGamePad(isPlayingGame){
    const TARGET_CLASS = isPlayingGame ? 'game' : 'menu';
    document.querySelectorAll('.game, .menu').forEach((element)=>{
        if(element.classList.contains(TARGET_CLASS)){
            element.classList.remove('d-none');
        }else{
            element.classList.add('d-none');
        }
    });
}

/**
 * removeAllClassThatStartWidth
 * This function removes all css class that start width the target word
 * @param {*} CANVAS 
 * @param {*} word 
 */
export function removeAllClassThatStartWidth(CANVAS,word){
    CANVAS.classList.forEach(cssClass =>{
        if(cssClass.startsWith(word)) CANVAS.classList.remove(cssClass)
    });
}

/**
 * activateFullScreen
 * This function activates a fullscreen mode
 */
export function activateFullScreen(){
    let element = document.documentElement
        
    if(element.requestFullScreen) {
        element.requestFullScreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    }    
}