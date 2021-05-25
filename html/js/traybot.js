let s_traybot  = null;
let s_question = null;

function traybotInit(){
  s_traybot = document.getElementById("traybot");
  s_question = document.getElementById("question");
  s_question.addEventListener('keydown', (x_event)=>{
    if(x_event.key == 'Enter'){
      // 質問欄に改行キーがはいったら質問する。
      sendSearch()
    }
  }, false);

  // 検索結果の受け取りメソッドを登録
  window.mybridge.on_resSearch(toHtml); 

  // 最初の案内文
  traybotInfo(window.mybridge.getMsg("begin"));
}
window.addEventListener('load', traybotInit, false);

function traybotInfo(x_msg, x_divid){
  const p_img = document.createElement("img");
  if(x_divid != null){
    p_img.id = "img_" + x_divid;
  }
  p_img.src = "image/bot.png";
  p_img.className = "traybotImg";

  const p_div = document.createElement("div");
  if(x_divid != null){
    p_div.id = "div_" + x_divid;
  }
  p_div.className = "traybotInfo"; 
  p_div.innerHTML=x_msg;

  s_traybot.appendChild(p_img);
  s_traybot.appendChild(p_div);

  scrollTo(0, s_traybot.scrollHeight);
}

function traybotAsk(x_msg){
  const p_div = document.createElement("div");
  p_div.className = "traybotAsk"; 
  p_div.innerHTML=x_msg;
  s_traybot.appendChild(p_div);

  scrollTo(0, s_traybot.scrollHeight);
}

function sendSearch(){
  let p_key = s_question.value;
  if(parseInt(p_key) != NaN){
    console.log("integer: " + p_key);
    let p_id = s_lastHit[p_key];
    if(p_id != null){
      getById(p_id);
      return;
    }
  }
  console.log("not integer: " + p_key);

  traybotAsk(p_key);
  window.mybridge.send_search(p_key);
}
function getById(x_id){
  window.mybridge.send_getById(x_id);
}

function delDiv(x_divid){
  let p_img = document.getElementById("img_" + x_divid);
  if(p_img != null){
    s_traybot.removeChild(p_img);
  }
  let p_div = document.getElementById("div_" + x_divid);
  if(p_div != null){
    s_traybot.removeChild(p_div);
  }
}

function showWindow(x_id){
  window.mybridge.send_showById(x_id);
}

function openBrowser(x_msgid){
  let p_url = document.getElementById(x_msgid).textContent;
  window.mybridge.send_openBrowser(p_url);
}

function toClipboard(x_event, x_msgid){
  let p_textarea = document.createElement("textarea");
  p_textarea.textContent = document.getElementById(x_msgid).innerText;

  let p_body = document.getElementsByTagName("body")[0];
  p_body.appendChild(p_textarea);
  p_textarea.select();
  document.execCommand('copy');
  p_body.removeChild(p_textarea);

  let p_balloon = document.getElementById('copyBalloon');
  p_balloon.innerHTML = window.mybridge.getMsg("copied");
  p_balloon.style.left = (x_event.pageX + 25 )+ "px";
  p_balloon.style.top = (x_event.pageY - 10 )+ "px";
  p_balloon.className = "copyBalloon";
  p_balloon.classList.add('fadeout');
  setTimeout(hideBalloon, 1000 , p_balloon);
}
function hideBalloon(x_balloon){
  x_balloon.className = "copyBalloonHide";
}

let s_msgid = 0;
let s_divid = 0;
let s_lastHit = {}; // 前回検索した際の No.: id の連想配列
function toHtml(x_rows){
  s_divid++;
  let p_msg = null;
  if(x_rows == null || x_rows.length == 0 ){
    p_msg = window.mybridge.getMsg("hit_none");

  }else if(x_rows.length == 1){
    let p_row = x_rows[0];
    p_msg = "<div class='hit_one'>" + window.mybridge.getMsg("hit_one") + "</div>";
    p_msg += "<div><img class='badImg' src='image/bad.png' onClick=\"delDiv("+ s_divid + ")\" ></img></div>";

    p_msg += "<div class='tableDiv'>"; // テーブル開始
    p_msg += "<div class='tableRow'>";
    p_msg += "<div class='tableCell'>" + escapeHTML(p_row.title) + "</div>"
    p_msg += "<div class='tableCell'><img class='clipboard' src='image/to_window.png' onClick=\"showWindow("+ p_row.id + ")\" ></img></div>";
    p_msg += "</div>";

    if(p_row.url != null && p_row.url != ""){
      s_msgid++;
      p_msg += "<div class='tableRow'>";
      p_msg += "<div class='tableCell' id='msg_" + s_msgid +"'>" + escapeHTML(p_row.url) + "</div>"
      //p_msg += "<div class='tableCell'><img class='clipboard' src='image/clipboard.png' onClick=\"toClipboard(event, 'msg_"+ s_msgid + "')\" ></img></div>";
      //p_msg += `<div class='tableCell'><img class='clipboard' src='image/browser.png' onClick=\"openBrowser('msg_${s_msgid}')\"></img></div>`;
      p_msg += "<div class='tableCell'><img class='clipboard' src='image/clipboard.png' onClick=\"toClipboard(event, 'msg_"+ s_msgid + "')\" ></img>";
      p_msg += `<img class='clipboard' src='image/browser.png' onClick=\"openBrowser('msg_${s_msgid}')\"></img></div>`;
      p_msg += "</div>";
    }

    if(p_row.account != null && p_row.account != ""){
      s_msgid++;
      p_msg += "<div class='tableRow'>";
      p_msg += "<div class='tableCell' id='msg_" + s_msgid +"'>"  + escapeHTML(p_row.account) + "</div>"
      p_msg += "<div class='tableCell'><img class='clipboard' src='image/clipboard.png' onClick=\"toClipboard(event, 'msg_"+ s_msgid + "')\" ></img></div>";
      p_msg += "</div>";
    }

    if(p_row.password != null && p_row.password != ""){
      s_msgid++;
      p_msg += "<div class='tableRow'>";
      p_msg += "<div class='tableCell'>****</div>"
      let p_escapeStr = escapeHTML(p_row.password);
      p_msg += `<div class='tableCell'><div style='display:none' id='msg_${s_msgid}'>${p_escapeStr}</div><img class='clipboard' src='image/clipboard.png' onClick=\"toClipboard(event, 'msg_${s_msgid}')\"></img></div>`;
      p_msg += "</div>";
    }

    if(p_row.note != null && p_row.note != ""){
      s_msgid++;
      p_msg += "<div class='tableRow'>";
      p_msg += "<div class='tableCell traybotPre' id='msg_" + s_msgid +"'>" + escapeHTML(p_row.note) + "</div>"
      p_msg += "<div class='tableCell'><img class='clipboard' src='image/clipboard.png' onClick=\"toClipboard(event, 'msg_"+ s_msgid + "')\"></img></div>"
      p_msg += "</div>";
      p_msg += "</div>"; // tableDivの終了
    }
  }else {
    p_msg = window.mybridge.getMsg("hit_many", {'%1%': x_rows.length});
    s_lastHit = {};
    for(let i=0; i<x_rows.length; i++){
      let p_row = x_rows[i];
      let p_link = "<a href='#' onClick='getById(" + p_row.id + ")'>" + escapeHTML(p_row.title) +"</a>";
      p_msg += ("<br>" + (i+1) + ": " + p_link);

      s_lastHit[i+1] = p_row.id;
    }
  }
  traybotInfo(p_msg, s_divid);
}

function escapeHTML(x_value){
  return x_value.replace(/\&/g, '&amp;')
    .replace(/\</g, '&lt;')
    .replace(/\>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/\'/g, '&#x27');
}
