const MESSAGE_JA = {
    title: "traybot",
    error: "エラーが発生しました!",
    register_data: "データ登録",
    maintenance_data: "データ編集",
    help_version: "Ver.0.0.2",
    help_message: "あなたのアカウントのURL, ID, パスワードを\n教えてくれます。",
    help_detail: "質問欄にサイトのタイトル、URL、メモのキーワードを入れてください。\n複数のキーワードもスペース区切りで入力できます。",
    begin: "タイトル/URL/備考のヒントをどうぞ。",
    no: "No.",
    title: "タイトル",
    url: "URL",
    account: "アカウント",
    password: "パスワード",
    note: "備考",
    hit_none: "該当データがありません",
    hit_one: "こちらですね",
    hit_many: "%1%件、ヒットしました",
    copied: "コピー",
    confirm_delete: "本当に削除してもよいですか?",
    show_account: "アカウント",
    add_account: "アカウント登録",
    edit_account: "アカウント編集",
    require_title: "タイトルは必須です!",
}

// メソッド
exports.getMsgDic = function(x_lang){
    if( x_lang == 'ja'){
        return MESSAGE_JA;
    }else{
        return MESSAGE_JA;
    }
}