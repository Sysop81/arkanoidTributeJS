
export async function loadLanguage(){
    const uLanguage = navigator.language || navigator.userLanguage;
    const i18n = "../../i18n/i18n.json";  // [EXAMPLE FOR MORE i18n language files] -> !uLanguage.startsWith('es') ? "../../i18n/i18n_es.json" : "";
        
    const response = await fetch(i18n);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();  
}