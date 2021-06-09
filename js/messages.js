const MESSAGE_JA = {
    title: "traybot",
    error: "エラーが発生しました!",
    register_data: "データ登録",
    maintenance_data: "データ編集",
    configuration: "設定",
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
    lang:"言語",
    save:"保存",
}
const MESSAGE_EN = {
    title: "traybot",
    error: "An error occured!",
    register_data: "Data registration",
    maintenance_data: "Data editing",
    configuration: "Configuration",
    help_version: "Ver.0.0.2",
    help_message: "Traybot shows you your information\nsuch as account URL, ID, password.",
    help_detail: "Input key words such as web site title, URL, remarks.\nYou can input some key words splitting with space.",
    begin: "Hello! Input some hints for title, URL, remarks.",
    no: "No.",
    title: "Title",
    url: "URL",
    account: "Account",
    password: "Password",
    note: "Remarks",
    hit_none: "Not found data.",
    hit_one: "Is this what you're finding?",
    hit_many: "Hits %1% records.",
    copied: "Copy",
    confirm_delete: "Are you sure to delete it?",
    show_account: "Account",
    add_account: "Account registration",
    edit_account: "Account editing",
    require_title: "Title is required.",
    lang:"Language",
    save:"Save",
}

// メソッド
exports.getMsgDic = function(x_lang){
    if( x_lang == 'ja'){
        return MESSAGE_JA;
    }else if (x_lang = 'en') {
        return MESSAGE_EN;
    }else{
        return MESSAGE_JA;
    }
}