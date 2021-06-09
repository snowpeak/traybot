const { ipcRenderer, contextBridge } = require('electron')
msgDic = require('../../js/messages').getMsgDic('ja'); //連想配列です。

contextBridge.exposeInMainWorld('nodeBridge',{
    getMsgDic: (x_lang) => {
        msgDic = require('../../js/messages').getMsgDic(x_lang);
        return msgDic;
    },
    getMsg: (x_code, x_replace) =>{
        let p_msg = msgDic[x_code];
        if(x_replace != null){
            for( let p_key in x_replace){
                p_msg = p_msg.replace(p_key, x_replace[p_key])
            }
        }
        return p_msg;
    },
    on_setAccount: (f_func) =>{
        ipcRenderer.on("showAccount__setAccount", (x_event, x_account)=>{
            f_func(x_account);
        })
    },
    send_editAccount: (x_id) =>{
        ipcRenderer.send("accountList__editAccount", x_id);
    }
})
