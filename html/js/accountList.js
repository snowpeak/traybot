let s_question = null;

function thisInit(){
  s_question = document.getElementById("ctrl-question");
  s_question.addEventListener('keydown', (x_event)=>{
    if(x_event.key == 'Enter'){
      // 質問欄に改行キーがはいったらリストを更新
      sendSearch()
    }
  }, false);

  // メッセージリソース
  accountListVue.setMsg(window.nodeBridge.getMsgDic(new URLSearchParams(location.search).get('lang')));

  // 検索結果の受け取りメソッドを登録
  window.nodeBridge.on_resSearch(setList);
  sendSearch();
}
window.addEventListener('load', thisInit, false);

function sendSearch(){
  window.nodeBridge.send_search(s_question.value);
}
function getById(x_id){
  window.nodeBridge.send_getById(x_id);
}
function setList(x_rows){
  accountListVue.setList(x_rows);
}
function editAccount(x_id){
  window.nodeBridge.send_editAccount(x_id);
}



