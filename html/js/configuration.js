/**
 * JavaScripts for configuration feature.
 * @author LatteBeo
 */
/**
 * Init configuration page.
 */
function thisInit() {
    configurationVue.setMsg(window.nodeBridge.getMsgDic(new URLSearchParams(location.search).get('lang')));
    window.nodeBridge.get_Params();
    window.nodeBridge.got_Params(getParams);
}
window.addEventListener('load', thisInit, false);
/**
 * Get all configuration parameters and set them.
 * @param {Arrays} x_rows 
 */
function getParams(x_rows) {
    for (i = 0; i < x_rows.length; i++) {
        if (x_rows[i].parameter == 'lang') {
            configurationVue.lang = x_rows[i].value;
        }
    }
}
/**
 * Save configuration parameter.
 * @param {string} x_lang
 */
function save(x_lang) {
    window.nodeBridge.save_params(x_lang);
}