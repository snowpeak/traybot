function thisInit(){
  // メッセージリソース
  accountVue.setMsg(window.nodeBridge.getMsgDic(new URLSearchParams(location.search).get('lang')));

  // 結果の受け取りメソッドを登録
  window.nodeBridge.on_setAccount(setAccount);
}
window.addEventListener('load', thisInit, false);

function setAccount(x_account){
  console.log("setAccount(): " + x_account);
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

