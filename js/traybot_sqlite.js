/**
 *  SQLLiteを操作するライブラリ 
 */
var s_log4js = require('log4js');
var s_logger = s_log4js.getLogger("console");
s_logger.level = 'debug';

const s_sqlite3 = require('sqlite3').verbose();
let s_db = null;

const TBL_DEF_TABLES = [
"DROP TABLE IF EXISTS $tblname",
"CREATE TABLE $tblname("
  + "id integer primary key autoincrement,"
  + "tbl_name text,"
  + "title text"
  + ")"
]
exports.TBL_DEF_TABLES = TBL_DEF_TABLES;
    
const TBL_ACCOUNT_COLS = ["title", "url", "account", "password", "note"];
exports.TBL_ACCOUNT_COLS = TBL_ACCOUNT_COLS;
const TBL_DEF_ACCOUNT = [
"DROP TABLE IF EXISTS  $tblname",
"CREATE TABLE $tblname("
  + "id integer primary key autoincrement,"
  + "title text,"
  + "url text,"
  + "account text,"
  + "password text,"
  + "note text"
  + ")"
]
exports.TBL_DEF_ACCOUNT = TBL_DEF_ACCOUNT;


const TBL_KNOW_HOW_COLS = ["title", "url", "body"];
exports.TBL_KNOW_HOW_COLS = TBL_KNOW_HOW_COLS;
const TBL_DEF_KNOW_HOW = [
"DROP TABLE IF EXISTS  $tblname",
"CREATE TABLE IF NOT EXISTS $tblname("
  + "id integer primary key autoincrement,"
  + "title text,"
  + "url text,"
  + "body text"
  + ")",
"CREATE INDEX idx_$tblname_id ON $tblname(id)"
]
exports.TBL_DEF_KNOW_HOW = TBL_DEF_KNOW_HOW;

const TBL_ATTACHFILE_COLS = ["know_how_id", "name", "size"];
exports.TBL_ATTACHFILE_COLS = TBL_ATTACHFILE_COLS;
const TBL_DEF_ATTACHFILE = [
"DROP TABLE IF EXISTS  $tblname",
"CREATE TABLE IF NOT EXISTS $tblname("
  + "id integer primary key autoincrement,"
  + "know_how_id integer,"
  + "name text,"
  + "size integer"
  + ")",
"CREATE INDEX idx_$tblname_konw_how_id ON $tblname(know_how_id)"
]
exports.TBL_DEF_ATTACHFILE = TBL_DEF_ATTACHFILE;
/**
 * CONFIGURATION table's columns.
 * @author LatteBeo
 */
const TBL_CONFIGURATION_COLS = ["parameter", "value"];
exports.TBL_CONFIGURATION_COLS = TBL_CONFIGURATION_COLS;
/**
 * Definition of CONFIGURATION table.
 * @author LatteBeo
 */
const TBL_DEF_CONFIGURATION = [
    "DROP TABLE IF EXISTS $tblname",
    "CREATE TABLE IF NOT EXISTS $tblname("
    + "parameter text primary key,"
    + "value text"
    + ")",
  "CREATE INDEX idx_$tblname_parameter ON $tblname(parameter)"
]

/**
 * データベースとのコネクションを返します  
 * @param x_storage filepath( 例: user.sqlite3 ) または :memory: (メモリ上の一時DB)
 * @return DBインスタンスを渡します。( nullは接続失敗 )
 */
exports.connectDB = function(x_storage){
    return new Promise( ( f_resolve, f_reject ) =>{
        if(s_db != null){
            f_resolve( p_db );
            return;
        }

        let p_db = new s_sqlite3.Database(x_storage);        
        if(p_db.error == null){
            s_db = p_db;
            s_logger.info( "Connected db: " + x_storage );
            f_resolve( p_db );
        } else {
            s_logger.error( "Failed to create db: " + x_storage + ", " + p_db.error);
            f_reject( p_db.error); // 終了
            return;
        }
        const p_sql = "SELECT COUNT(*) AS num FROM sqlite_master WHERE TYPE='table' AND name='account'";
        p_db.get(p_sql, (x_err, x_row)=>{
            if( x_err != null ){
                f_reject( x_err ); // 終了
                return;
            }
            if(x_row.num == 0){
                let p_dbDefs = [TBL_DEF_TABLES, TBL_DEF_ACCOUNT, TBL_DEF_KNOW_HOW, TBL_DEF_ATTACHFILE, TBL_DEF_CONFIGURATION];
                let p_tblnames = ["tables", "account", "know_how", "attachfile", "configuration"];
                return initTable(p_db, p_dbDefs, p_tblnames, 0, (x_err)=>{
                    if(x_err != null){
                        f_reject( x_err ); // 終了
                        return;
                    }
                    s_logger.info("initTable succeeded!");
                    //Insert initial data.
                    this.insert( p_db, "configuration", TBL_CONFIGURATION_COLS, {"parameter":"lang", "value":"ja"}, function(){} );
                    // p_db を返す                    
                    f_resolve( p_db );
            })
            }else{
                // p_db を返す
                f_resolve( p_db );
            }
        })
    })
}


function initTable(x_db, x_dbDefs, x_tblnames, x_idx, f_endFunc){
    // 再帰終了
    if( x_idx >= x_dbDefs.length) {
        f_endFunc(null);
        return;
    }
    createTable(x_db, x_tblnames[x_idx], x_dbDefs[x_idx], (x_err)=>{
        if(x_err == null){
            initTable(x_db, x_dbDefs, x_tblnames, x_idx+1, f_endFunc);
        }else{
            s_logger.info("initTable failed!: " + x_err);
            f_endFunc(x_err);
            return;
        }
    })
}

/**
 * x_db に x_tblnameのテーブルを作成します。
 * すでにテーブルがある場合は何もしません。
 * @param {sqlite3} x_db 操作対象のDBインスタンス
 * @param {string} x_tblname 作成するテーブル名
 * @param {string[]} x_sqls SQL集( TBL_DEF_ACCOUNT, TBL_DEF_KNOW_HOW, TBL_DEF_ATTACHFILEのいずれか)
 * @return {boolean} true:成功、false: 失敗
 */
exports.createTable = createTable = function( x_db, x_tblname, x_sqls, f_func){
    executeSQL(x_db, x_sqls, x_tblname, 0, (x_err)=>{
        f_func(x_err);
    })
}

/**
 * 
 * @param {sqlite3} x_db 
 * @param {string[]} x_sqls 
 * @param {int} x_idx 
 * @param {callback} f_func(x_err, x_nextIdx)
 */
function executeSQL(x_db, x_sqls, x_tblname, x_idx, f_endFunc){
    // 終了条件
    if(x_sqls == null || x_idx >= x_sqls.length){
        f_endFunc(null);
        return;
    }

    // SQL実行
    try{
        let p_sql = x_sqls[x_idx].replace( /\$tblname/g, x_tblname);
        s_logger.debug("Execute SQL: " + p_sql);
        x_db.run(p_sql, (x_err) =>{
            if(x_err == null){
                executeSQL(x_db, x_sqls, x_tblname, x_idx+1, f_endFunc);
            }else{
                throw p_sql + x_err;
            }
        })
    }catch( x_exception ){
        // エラー発生
        s_logger.debug("SQL error:" + x_exception);
        f_endFunc(x_exception);
    }
};

/**
 * テーブルにレコードを登録する
 * @param {sqlite} x_db 
 * @param {string} x_tblname テーブル名
 * @param {string[]} x_colnames テーブルのカラム名定義
 * @param {map} x_valueMap 「カラム名=値」の連想配列
 * @param {function(x_id)} insertしたIDを返す, 負数は失敗
 */
exports.insert = function insert( x_db, x_tblname, x_colnames, x_valueMap, f_func ){
    let p_sql = "INSERT INTO " + x_tblname + " (";

    let p_values = " VALUES(";
    let p_valueMap = {};

    let p_firstValue = true;
    for(let p_key in x_valueMap){
        if(x_colnames.indexOf( p_key) >= 0){
            if( !p_firstValue ){
                p_sql += ",";
                p_values += ",";
            }
            p_sql += p_key;
            p_values += '$' + p_key;
            p_valueMap[ '$' + p_key ] = x_valueMap[p_key];
            p_firstValue = false;
        }
    }
    p_sql += ")";
    p_values += ")";

    if( p_firstValue ){
        // 登録するカラムが1つもなかった
        f_func(-1);
        return;
    }

    p_sql += p_values;
    x_db.run(p_sql, p_valueMap, function(x_err){
        if( x_err != null){
            s_logger.error("SQL Failed: " + p_sql + ", " + x_err);
            f_func(-1);
            return;
        }
        f_func(this.lastID);
    })
}

/**
 * テーブルのレコードを更新する
 * @param {sqlite} x_db 
 * @param {string} x_tblname テーブル名
 * @param {string[]} x_colnames テーブルのカラム名定義
 * @param {map} x_valueMap 「カラム名=値」の連想配列( idはレコード指定条件として必須)
 * @param {function(boolean)} f_func true:成功, false:失敗
 */
 exports.update = function update( x_db, x_tblname, x_colnames, x_valueMap, f_func ){
    let p_sql = "UPDATE " + x_tblname + " set ";
    let p_valueMap = {};
    let p_whereSql = null;

    let p_firstValue = true;
    for(let p_key in x_valueMap){
        if( p_key == "id"){
            p_whereSql = " WHERE id=$id";
            p_valueMap["$id"] = x_valueMap["id"];
        }else if(x_colnames.indexOf( p_key) >= 0 ){
            // 更新要素
            if( !p_firstValue ){
                p_sql += ",";
            }
            p_sql += ( p_key + "=$" + p_key);
            p_firstValue = false;

            p_valueMap["$" + p_key] = x_valueMap[p_key];
        }
    }
    if(p_valueMap.length == 0){
        f_func(false);
        return;
    }
    if(p_whereSql != null){
        p_sql += p_whereSql;
    }
    x_db.run(p_sql, p_valueMap, function(x_err){
        if( x_err != null){
            s_logger.error("SQL Failed: " + p_sql + ", " + x_err);
            f_func(false);
            return;
        }
        f_func(true);
    })
}

/**
 * テーブルのレコードを削除する
 * @param {sqlite} x_db 
 * @param {string} x_tblname テーブル名
 * @param {string} x_idname 削除対象のidのカラム名(通常はidだが、attachfileの場合はknow_how_idのこともある )
 * @param {int[]} x_ids 削除対象の主キー
 * @param {function(boolean)} f_func true:削除成功, false:削除失敗
 */
 exports.delete = function( x_db, x_tblname, x_idname, x_ids, f_func ){
    let p_sql = "DELETE FROM " + x_tblname;
    for( let i=0; i<x_ids.length; i++){
        if(i == 0){
            p_sql += " WHERE " + x_idname + " IN("
        }else {
            p_sql += ",";
        }
        p_sql += "?"
    }
    if( x_ids.length > 0){
        p_sql += ")";
    }
    x_db.run(p_sql, x_ids, function(x_err){
        if( x_err != null){
            s_logger.error("SQL Failed: " + p_sql + ", " + x_err);
            f_func(false);
            return;
        }
        f_func(true);
    })
}

exports.getAccounts = function(x_db, x_key, f_func){
    let p_sql = "SELECT * FROM account";
    let p_keys = x_key.split(/[ 　]/); //半角SP, 全角SP
    let p_values = {};
    let p_first = true;

    let p_titleWhere = null;
    let p_urlWhere = null;
    let p_noteWhere = null;

    for( i=0; i<p_keys.length; i++){
        if(p_keys[i] == ""){
            continue;
        }
        let p_titleParam = "$title_" + i;
        let p_urlParam = "$url_" + i;
        let p_noteParam = "$note_" + i;
        if( p_first ){
            p_titleWhere = "lower(title) LIKE " + p_titleParam;
            p_urlWhere = "lower(url) LIKE " + p_urlParam;
            p_noteWhere = "lower(note) LIKE " + p_noteParam;
            p_first = false;
        } else {
            p_titleWhere += " AND lower(title) LIKE " + p_titleParam;
            p_urlWhere += " AND lower(url) LIKE " + p_urlParam;
            p_noteWhere += " AND lower(note) LIKE " + p_noteParam;
        }
        let p_lowerKey = p_keys[i].toLowerCase();
        p_values[p_titleParam] = '%'+p_lowerKey +'%';
        p_values[p_urlParam] = '%'+p_lowerKey +'%';
        p_values[p_noteParam] = '%'+p_lowerKey +'%';
    }
    if( !p_first ){
        p_sql += " WHERE ("  + p_titleWhere + ")";
        p_sql += " OR ("  + p_urlWhere + ")";
        p_sql += " OR ("  + p_noteWhere + ")";
    }
    p_sql +=  " ORDER BY lower(title)";
    s_logger.debug("search account SQL: " + p_sql);
    x_db.all(p_sql, p_values,  (x_err, x_rows)=>{
        if(x_err != null){
            s_logger.error("SQL Failed: " + p_sql + ", " + x_err );
        }
        f_func(x_rows);
    })
}

exports.getAccount = function(x_db, x_id, f_func){
    let p_sql = "SELECT * FROM account WHERE id=" + x_id;
    x_db.all(p_sql,
        (x_err, x_rows)=>{
            if(x_err != null){
                s_logger.error("SQL Failed: " + p_sql + ", " + x_err );
            }
            f_func(x_rows[0]);
        })
}
/**
 * Get all configuration parameters.
 * @param x_db Database connection object
 * @param f_func Callback function.
 * @author LatteBeo
 */
exports.getParams = function(x_db, f_func) {
    let p_sql = "SELECT * FROM configuration;";
    x_db.all(p_sql, (x_err, x_rows)=>{
        f_func(x_rows);
    })
}
/**
 * Update parameter.
 * @param {*} x_db Database connection object. 
 * @param {*} x_parameter Parameter name.
 * @param {*} x_value parameter value.
 * @author LatteBeo
 */
exports.saveParam = function(x_db, x_parameter, x_value) {
    var values = {"parameter": x_parameter, "value":x_value};
    this.update(x_db, "configuration", TBL_CONFIGURATION_COLS, values, function(){});
}