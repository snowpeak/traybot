const { ipcRenderer, contextBridge } = require('electron')
const msgDic = require('../../js/messages').getMsgDic('ja');

contextBridge.exposeInMainWorld('mybridge',{
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
        ipcRenderer.send("traybot__search", x_key);
    },
    send_getById: (x_id) =>{
        ipcRenderer.send("traybot__getById", x_id);
    },
    send_showById: (x_id) =>{
        ipcRenderer.send("traybot__showById", x_id);
    },
    send_openBrowser: (x_url) =>{
        ipcRenderer.send("traybot__openWindow", x_url);
    },
    on_resSearch: (f_func) =>{
        ipcRenderer.on("traybot__resSearch", (x_event, x_ans)=>{
            f_func(x_ans);
        })
    }
})
