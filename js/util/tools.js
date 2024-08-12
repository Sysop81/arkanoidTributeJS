
// *** Helpers tools functions  

/**
 * loadLanguage
 * This function load the default game language.
 * @returns JSON
 */
export async function loadLanguage(){
    const uLanguage = navigator.language || navigator.userLanguage;
    //const i18n = "../../i18n/i18n.json";  // [EXAMPLE FOR MORE i18n language files] -> !uLanguage.startsWith('es') ? "../../i18n/i18n_es.json" : "";
    const basePath = window.location.pathname.replace(/\/$/, "");
    const i18n = `${basePath}/i18n/i18n.json`;

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