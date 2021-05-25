function thisInit(){
  // メッセージリソース
  accountVue.setMsg(window.nodeBridge.getMsgDic());

  // 結果の受け取りメソッドを登録
  window.nodeBridge.on_setAccount(setAccount);
  window.nodeBridge.on_inserted(inserted);
  window.nodeBridge.on_updated(updated);
  window.nodeBridge.on_deleted(deleted);
}
window.addEventListener('load', thisInit, false);

function setAccount(x_account){
  if(x_account == null){
    x_account = {
      id:"",
      title:"",
      url:"",
      account:"",
      password:"",
      note:""
    }
  }
  accountVue.setAccount(x_account);
}
function saveAccount(x_account){
  console.log("call saveAccount:" + x_account)
  window.nodeBridge.send_saveAccount(x_account);
}
function delAccount(x_id){
  console.log("call delAccount:" + x_id)
  if(confirm(window.nodeBridge.getMsg('confirm_delete'))){
    window.nodeBridge.send_delAccount(x_id);
  }
}

function inserted(x_id, x_err){
  if( x_err == null ){
    console.log("inserted: " + x_id);
    window.close();
  } else {
    accountVue.setErrMsg(x_err);
  }
}
function updated(x_err){
  if( x_err == null ){
    window.close();
  } else {
    accountVue.setErrMsg(x_err);
  }
}
function deleted(x_err){
  if( x_err == null ){
    window.close();
  } else {
    accountVue.setErrMsg(x_err);
  }
}



