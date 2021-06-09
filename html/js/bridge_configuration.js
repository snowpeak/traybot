/**
 * Bridge for configuration feature.
 * @author LatteBeo
 */

const { ipcRenderer, contextBridge } = require('electron')
msgDic = require('../../js/messages').getMsgDic('ja');

contextBridge.exposeInMainWorld('nodeBridge', {
    getMsgDic: (x_lang) => {
        msgDic = require('../../js/messages').getMsgDic(x_lang);
        return msgDic;
    },
    getMsg: (x_code, x_replace) => {
        let p_msg = msgDic[x_code];
        if (x_replace != null) {
            for (let p_key in x_replace) {
                p_msg = p_msg.replace(p_key, x_replace[p_key])
            }
        }
        return p_msg;
    },
    get_Params: () => {
        ipcRenderer.send("configuration__getParams", null);
    },
    got_Params: (f_func) => {
        ipcRenderer.on("configuration__gotParams", (x_event, x_params) => {
            f_func(x_params);
        })
    },
    save_params: (f_func) => {
        ipcRenderer.send("configuration__saveParams", f_func);
    }
})