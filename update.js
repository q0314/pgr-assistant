/**
 * 语言文本
 * @param {object} language
 */
var language = require("./theme.js").language.update;
var tool = require('./utlis/app_tool.js');
var base_url = "https://gitee.com/q0314/pgr-assistant/raw/master/";//tool.readJSON("interface").server;

function update(show_update_dialog) {
    let cancel = false;
    let dialog = dialogs.build({
        type: 'app',
        content: language["wait_get_update_info"],
        positive: language["cancel"]
    }).on("positive", () => {
        cancel = true;
    });
    dialog.setCancelable(false);
    if (show_update_dialog) {
        dialog.show();
    }
   // http.get(base_url + "versionlog.json", {}, (res, err) => {
    http.get(base_url + "project.json", {}, (res, err) => {
        if (!cancel) {
            if (err || res["statusCode"] != 200) {
                if (show_update_dialog) {
                    dialog.setContent(language["update_info_get_fail_alert_dialog_message"]);
                    dialog.setActionButton("positive", language["confirm"]);
                    dialog.setCancelable(true);
                }
            } else {
                let local_config = JSON.parse(files.read("project.json"));
                let last_version_info = res.body.json();
                dialog.setContent(language["versions_info"].replace("%current_versions_name%", local_config["versionName"]).replace("%current_versions_code%", local_config["versionCode"]).replace("%last_versions_name%", last_version_info["versionName"]).replace("%last_versions_code%", last_version_info["versionCode"]).replace("%update_content%", last_version_info["update_content"]));
                dialog.setActionButton("neutral", language["show_history_update_info"]);
                dialog.on("neutral", () => {
                    showHistoryUpdateInfo(last_version_info["versionCode"] > local_config["versionCode"]);
                });
                console.info(last_version_info["versionCcode"])
                if (last_version_info["versionCode"] > local_config["versionCode"]) {
                    dialog.setActionButton("positive", language["update"]);
                    dialog.setActionButton("negative", language["cancel"]);
                    dialog.on("positive", () => {
                        downloadFile(true);
                    });
                    if (!show_update_dialog) {
                        dialog.show();
                    }
                } else if (show_update_dialog) {
                    dialog.setActionButton("positive", language["confirm"]);
                    dialog.setCancelable(true);
                }
            }
        }
    });
}

/**
 * 历史更新
 * @param {boolean} show_update_button
 */
function showHistoryUpdateInfo(show_update_button) {
  
    let cancel = false;
    let dialog = dialogs.build({
        type: 'app',
        content: language["wait_get_history_update_info"],
        positive: language["cancel"]
    }).on("positive", () => {
        cancel = true;
    });
    dialog.setCancelable(false);
    dialog.show();
    http.get(base_url + "history_update_info.txt", {}, (res, err) => {
        if (!cancel) {
            if (err || res["statusCode"] != 200) {
                dialog.setContent(language["history_update_info_get_fail_alert_dialog_message"]);
                dialog.setCancelable(true);
            } else {
                dialog.setContent(res.body.string());
                if (show_update_button) {
                    dialog.setActionButton("neutral", language["cancel"]);
                    dialog.setActionButton("positive", language["update"]);
                    dialog.on("positive", () => {
                        downloadFile(true);
                    });
                } else {
                    dialog.setActionButton("positive", language["confirm"]);
                    dialog.setCancelable(true);
                }
            }
        }
    });
}

/**
 * 更新
 * @param {boolean} mandatory - 强制下载所有文件,不检验MD5 
 */
function downloadFile(mandatory) {
    let file_path = files.path("./")
    let cancel = false;
    let dialog = dialogs.build({
        progress: {
            max: 100,
            showMinMax: true
        },
        content: "正在获取更新配置文件中...",
        positive: "取消",
        cancelable: false
    }).on("positive", () => {
        cancel = true;

    }).show();
    http.get(base_url + "/utlis/files_md5.json", {}, (res, err) => {
        try {
            if (!cancel) {
                if (err || res["statusCode"] != 200) {
                    dialog.dismiss();
                    toastLog("访问更新失败,\n错误:" + res);
                } else {
                    let remote_files_md5 = res.body.json();
                    let local_files_md5 = files.exists("utlis/files_md5.json") ? JSON.parse(files.read("utlis/files_md5.json")) : {};
                    let max_progress = 0,
                        current_progress = 0;
                    for (let key in remote_files_md5) {
                        if (!local_files_md5[key] || local_files_md5[key]["md5"] != remote_files_md5[key]["md5"] || mandatory) {
                            max_progress += remote_files_md5[key]["size"];
                        }
                    }
                    for (let key in remote_files_md5) {
                        if (!local_files_md5[key] || local_files_md5[key]["md5"] != remote_files_md5[key]["md5"] || mandatory) {
                            let response = http.get(base_url + '/' + key);
                            dialog.setContent("正在从云端获取文件: " + key);
                            if (!cancel) {
                                if (response["statusCode"] == 200) {
                                    current_progress += remote_files_md5[key]["size"];
                                    dialog.progress = current_progress * 100 / max_progress;
                                    dialog.setContent("正在下载文件: " + key);
                                    files.ensureDir(".cache/" + key);
                                    files.write(".cache/" + key, response.body.string());
                                } else {
                                    toastLog(key+" download fail")
                                //    throw new Error("download fail");
                                }
                            } else {
                                break;
                            }
                        }
                    }
                    if (!cancel) {
                        for (let key in remote_files_md5) {
                            log("文件路径:", file_path + key)
                            dialog.setContent("正在移动文件" + key + " 到" + file_path);
                            if ((!local_files_md5[key] || (local_files_md5[key]["md5"] != remote_files_md5[key]["md5"]) || mandatory) && !files.copy(".cache/" + key, file_path + key)) {
                                throw new Error("copy fail");
                            }
                        }
                        for (let key in local_files_md5) {
                            if (!remote_files_md5[key]) {
                                files.remove(key);
                            }
                        }
                        engines.execScriptFile(file_path + 'main.js', {
                            path: file_path
                        });
                        dialog.dismiss();
                        exit();
                        // engines.execScriptFile("main.js");
                        //  engines.myEngine().forceStop();
                    }
                }
            }
        } catch (e) {
            dialog.dismiss();
            toastLog("更新失败,\n错误:" + e.message + '\nat //' + e.lineNumber);
        }
        files.removeDir(".cache");
    });
}

function downloadFilezip() {
    let cancel = false;
    let dialog = dialogs.build({
        type: 'app',
        progress: {
            max: 100,
            showMinMax: true
        },
        positive: language["cancel"],
        cancelable: false
    }).on("positive", () => {
        cancel = true;
    }).show();
    let path = files.path("./");
    var r = http.get(base_url + 'pgr-assistant.zip', {}, (res, err) => {
        try {
            if (!cancel) {
                if (err || res["statusCode"] != 200) {
                    dialog.dismiss();
                    
                    toastLog(language["update_fail_internet"]);
                } else {
                    files.ensureDir(path + 'pgr-assistant.zip');
                    files.writeBytes(path + 'pgr-assistant.zip', res.body.bytes());
                   // files.removeDir(path + 'pgr-assistant.zip');
                    $zip.unzip(path + 'pgr-assistant.zip', path);

                    //files.remove(path + '/assttyys_ng.zip');

                    engines.execScriptFile(path + 'main.js', {
                        path: path
                    });
                    dialog.dismiss();
                    exit();
                }
            }
        } catch (e) {
            dialog.dismiss();
            console.error(e)
            toast(language["update_fail"]);
        }
    })

}

var toupdate = {}
toupdate.update = update;

try {
    module.exports = toupdate;
} catch (err) {
    toupdate.update()
}