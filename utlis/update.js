    /**
     * 更新
     * @param {boolean} show_update_dialog
     */
    update(true)
    function update(show_update_dialog) {
        let cancel = false;
        let dialog = dialogs.build({
            content: language["wait_get_update_info"],
            positive: language["cancel"]
        }).on("positive", () => {
            cancel = true;
        });
        dialog.setCancelable(false);
        if (show_update_dialog) {
            dialog.show();
        }
        http.get(base_url + "last_version_info.json", {}, (res, err) => {
           log(base_url+"last_version_info.json")
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
                    dialog.setContent(language["versions_info"].replace("%current_versions_name%", local_config["versionName"]).replace("%current_versions_code%", local_config["versionCode"]).replace("%last_versions_name%", last_version_info["version_name"]).replace("%last_versions_code%", last_version_info["version_code"]).replace("%update_content%", last_version_info["update_content"]));
                    dialog.setActionButton("neutral", language["show_history_update_info"]);
                    dialog.on("neutral", () => {
                        showHistoryUpdateInfo(last_version_info["version_code"] > local_config["versionCode"]);
                    });
                    console.info(last_version_info["version_code"])
                    log(local_config["versionCode"])
                    if (last_version_info["version_code"] > local_config["versionCode"]) {
                        dialog.setActionButton("positive", language["update"]);
                        dialog.setActionButton("negative", language["cancel"]);
                        dialog.on("positive", () => {
                            downloadFile();
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
                            downloadFile();
                        });
                    } else {
                        dialog.setActionButton("positive", language["confirm"]);
                        dialog.setCancelable(true);
                    }
                }
            }
        });
    }

    function downloadFile() {
        let cancel = false;
        let dialog = dialogs.build({
            progress: {
                max: 100,
                showMinMax: true
            },
            positive: language["cancel"],
            cancelable: false
        }).on("positive", () => {
            cancel = true;
        }).show();
        http.get(base_url + "config/files_md5.json", {}, (res, err) => {
            try {
                if (!cancel) {
                    if (err || res["statusCode"] != 200) {
                        dialog.dismiss();
                        toast(language["update_fail"]);
                    } else {
                        let remote_files_md5 = res.body.json();
                        let local_files_md5 = files.exists("config/files_md5.json") ? JSON.parse(files.read("config/files_md5.json")) : {};
                        let max_progress = 0, current_progress = 0;
                        for (let key in remote_files_md5) {
                            if (!local_files_md5[key] || local_files_md5[key]["md5"] != remote_files_md5[key]["md5"]) {
                                max_progress += remote_files_md5[key]["size"];
                            }
                        }
                        for (let key in remote_files_md5) {
                            if (!local_files_md5[key] || local_files_md5[key]["md5"] != remote_files_md5[key]["md5"]) {
                                let response = http.get(base_url + key);
                                if (!cancel) {
                                    if (response["statusCode"] == 200) {
                                        current_progress += remote_files_md5[key]["size"];
                                        dialog.progress = current_progress * 100 / max_progress;
                                        files.ensureDir(".cache/" + key);
                                        files.write(".cache/" + key, response.body.string());
                                    } else {
                                        throw new Error("download fail");
                                    }
                                } else {
                                    break;
                                }
                            }
                        }
                        if (!cancel) {
                            for (let key in remote_files_md5) {
                                if ((!local_files_md5[key] || local_files_md5[key]["md5"] != remote_files_md5[key]["md5"]) && !files.copy(".cache/" + key, key)) {
                                    throw new Error("copy fail");
                                }
                            }
                            for (let key in local_files_md5) {
                                if (!remote_files_md5[key]) {
                                    files.remove(key);
                                }
                            }
                            dialog.dismiss();
                            toast(language["update_success"]);
                            engines.execScriptFile("main.js");
                            engines.myEngine().forceStop();
                        }
                    }
                }
            } catch (e) {
                dialog.dismiss();
                toast(language["update_fail"]);
            }
            files.removeDir(".cache");
        });
    }