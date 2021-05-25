const { ipcRenderer, contextBridge } = require('electron')
const msgDic = require('../../js/messages').getMsgDic('ja'); //連想配列です。

contextBridge.exposeInMainWorld('nodeBridge',{
    getMsgDic: () =>{
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
        ipcRenderer.on("editAccount__setAccount", (x_event, x_account)=>{
            f_func(x_account);
        })
    },
    on_inserted: (f_func) =>{
        ipcRenderer.on("editAccount__inserted", (x_event, x_id, x_err)=>{
            f_func(x_id, x_err);
        })
    },
    on_updated: (f_func) =>{
        ipcRenderer.on("editAccount__updated", (x_event, x_err)=>{
            f_func(x_err);
        })
    },
    on_deleted: (f_func) =>{
        ipcRenderer.on("editAccount__deleted", (x_event, x_err)=>{
            f_func(x_err);
        })
    },
    send_saveAccount: (x_account) =>{
        ipcRenderer.send("editAccount__saveAccount", x_account);
    },
    send_delAccount: (x_id) =>{
        ipcRenderer.send("editAccount__delAccount", x_id);
    },
})
