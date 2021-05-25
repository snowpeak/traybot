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
    send_search: (x_key) =>{
        ipcRenderer.send("accountList__search", x_key);
    },
    on_resSearch: (f_func) =>{
        ipcRenderer.on("accountList__resSearch", (x_event, x_ans)=>{
            f_func(x_ans);
        })
    },
    send_editAccount: (x_id) =>{
        ipcRenderer.send("accountList__editAccount", x_id);
    }

})
