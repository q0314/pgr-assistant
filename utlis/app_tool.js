
importClass(android.content.pm.PackageManager);
importClass(android.graphics.drawable.GradientDrawable);

try {
    importClass(android.provider.Settings);
} catch (err) { }

var Disposition = storages.create("warbler");
var Accessibility = false;


/**
 * 从本地存储中取出键值为key的数据并返回。
 * 如果该存储中不包含该数据，这时若指定了默认值参数则返回默认值，否则返回undefined。
 * 返回的数据可能是任意数据类型，这取决于使用writeJSON保存该键值的数据时的数据类型。
 * @param {string} key 
 * @param {object} list - key的数据是undefined时保存list并返回
 * @returns {Object}
 */
function readJSON(key, list) {
    if (list != undefined) {
        setting = Disposition.get(key, list);
        if (Disposition.get(key) == undefined) {
            Disposition.put(key, setting);
        }
    } else {
        setting = Disposition.get(key);
        if (setting == undefined) {
            console.error("无法取得" + key + "的数据,请确认是否已保存")
        }
    }
    return setting;

    //Disposition.clear();//删除这个本地一存储的数据（用于调试）
    // return setting;
}
/**
 * 把值value保存到本地存储中。value可以是undefined以外的任意数据类型。如果value为undefined则抛出TypeError。
 * @param {string} sett 
 * @param {string|number|Object|boolean} value 
 * @param {string} key
 */
function writeJSON(sett, value, key) {
    key = key || "helper";
    setting = readJSON(key);
    setting[sett] = value;
    Disposition.put(key, setting);
}

function autoService(force, mode) {
    if (force == false) {
        return closeAccesibility()
    }

    if (!auto.rootInActiveWindow) {
        if (force == undefined) {
            return false
        }
        if (checkPermission("android.permission.WRITE_SECURE_SETTINGS")) {
            if (openAccessibility() == true) {
                ui.post(() => {
                    if (auto.rootInActiveWindow == null) {
                        toastLog("当前无障碍不可用，尝试重启")
                        closeAccesibility(false)
                        //up.setAndNotify(openAccessibility(false));
                        ui.post(() => {
                            openAccessibility(false);
                        }, 150)
                        if (!Accessibility) {
                            Accessibility = true;
                            setTimeout(() => {
                                if (auto.rootInActiveWindow == null) {
                                    let con_ = "检测到无障碍已开启但未运行，程序已尝试重启无障碍,无效。\n请跳转到应用设置停止战双辅助后，重启战双辅助。如仍无效请重启系统";
                                    dialogs.build({
                                        type: "app-or-overlay",
                                        content: con_,
                                        positive: "跳转",
                                        positiveColor: "#FF8C00",
                                        negative: "取消",
                                        canceledOnTouchOutside: false
                                    }).on("positive", () => {
                                        openAppSetting(package_name);
                                    }).show()

                                }
                                Accessibility = false;

                            }, 2000);
                        }
                    } else {
                        return true
                        //up.setAndNotify(true);

                    }

                }, 550)

            } else {
                return false
            }

        } else {


            if (mode) {
                if ($shell.checkAccess("root")) {
                    shell("pm grant " + package_name + " android.permission.WRITE_SECURE_SETTINGS", {
                        root: true,
                    });
                    toastLog("root授权安全系统设置权限成功")
                    return openAccessibility();

                } else {
                    return false
                }
            } else {
                if ($shell.checkAccess("adb")) {
                    shell("pm grant " + package_name + " android.permission.WRITE_SECURE_SETTINGS", {
                        adb: true,
                    });
                    toastLog("adb授权安全系统设置权限成功");
                    return openAccessibility()

                }
            }
            if (!Accessibility) {
                Accessibility = true;
                setTimeout(() => {
                    if (auto.rootInActiveWindow == null) {
                        let enabledServices = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES)
                        if (enabledServices) {
                            if (enabledServices.toString().indexOf(package_name) != -1) {
                                let con_ = "检测到无障碍已开启但未运行。\n请尝试关闭再打开无障碍。如无效请跳转到应用设置停止战双辅助后，重启战双辅助。如仍无效请重启系统";
                                dialogs.build({
                                    type: "app-or-overlay",
                                    content: con_,
                                    positive: "跳转无障碍",
                                    positiveColor: "#FF8C00",
                                    negative: "跳转设置",
                                    neutral: "取消",
                                    canceledOnTouchOutside: false
                                }).on("positive", () => {
                                    app.startActivity({
                                        action: "android.settings.ACCESSIBILITY_SETTINGS"
                                    });
                                }).on("negative", () => {
                                    openAppSetting(package_name);
                                }).show()
                            }
                        }
                    }
                    Accessibility = false;

                }, 2000);
                return false
            }
        }


    } else {
        //有权限
        return true
    }

    function openAccessibility(i) {
        try {
            let mServices = package_name + "/com.stardust.autojs.core.accessibility.AccessibilityService";
            let enabledServices = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES)
            if (enabledServices != null) {
                if (enabledServices.length > 5) {
                    enabledServices = enabledServices.replace(new RegExp(mServices, "g"), "") + ":";
                } else {
                    enabledServices = ""
                }
            } else {
                enabledServices = "";
            }
            for (let i = 0; i < 10; i++) {
                enabledServices = enabledServices.replace(":undefined", "");
            }
            if (enabledServices[0] == ":") {
                enabledServices = enabledServices[0] = "";
            }
            enabledServices = enabledServices.replace("::", ":");
            Settings.Secure.putString(context.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES, "1");
            Settings.Secure.putString(context.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES, enabledServices + mServices);
            if (i != false) {
                toastLog('安全系统设置权限成功开启无障碍');
            } else {
                console.verbose('安全系统设置权限成功开启无障碍');
            }
            return true
        } catch (err) {
            console.error(err)
            return err
        }

    }

    function closeAccesibility(i) {

        try {
            let enabledServices = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES)
            log("无障碍列表" + enabledServices);
            for (let i = 0; i < 10; i++) {
                enabledServices = enabledServices.replace(":undefined", "");
                enabledServices = enabledServices.replace("undefined", "");

            }
            if (enabledServices == null) {
                Settings.Secure.putString(context.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES, "")
                Settings.Secure.putString(context.getContentResolver(), Settings.Secure.ACCESSIBILITY_ENABLED, '0')

            } else {
                Service = enabledServices.replace(":" + package_name + "/com.stardust.autojs.core.accessibility.AccessibilityService");
                Settings.Secure.putString(context.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES, Service)
                Settings.Secure.putString(context.getContentResolver(), Settings.Secure.ACCESSIBILITY_ENABLED, '0')
                Service = enabledServices.replace(package_name + "/com.stardust.autojs.core.accessibility.AccessibilityService");
                if (Service == "undefined") {
                    Service = "";
                }
                Settings.Secure.putString(context.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES, Service)
                Settings.Secure.putString(context.getContentResolver(), Settings.Secure.ACCESSIBILITY_ENABLED, '0')
            }
            if (i != false) {
                toastLog('关闭无障碍服务中..')
            } else {
                console.verbose('关闭无障碍服务中..')
            }

            return true;
        } catch (err) {
            log("命令错误:" + err);
            toastLog("没有安全系统设置权限，无法获取状态，跳转默认关闭方法");
            try {
                auto.service.disableSelf();
                return true
            } catch (err) {
                toastLog("关闭失败" + err);
                app.startActivity({
                    action: "android.settings.ACCESSIBILITY_SETTINGS"
                });
                return false
            }
        }
    }



}

function checkPermission(permission) {
    pm = context.getPackageManager();
    return PackageManager.PERMISSION_GRANTED == pm.checkPermission(permission, context.getPackageName().toString());
}



/**
 * 设置对话框背景颜色,圆角
 * @param {object} view - 视图对象
 * @param {object} list 
 * @param {number} [list.radius = 30] - 对话框圆角
 * @param {string} [list.bg = "#eff0f4"] - 对话框背景色
 */
function setBackgroundRoundRounded(view, list) {
    list = {
        radius: list.radius || 30,
        bg: list.bg || "#eff0f4",
    }
    let gradientDrawable = new GradientDrawable();
    gradientDrawable.setShape(GradientDrawable.RECTANGLE);
    gradientDrawable.setColor(colors.parseColor(list.bg));
    gradientDrawable.setCornerRadius(list.radius);
    view.setBackgroundDrawable(gradientDrawable);
}


/**
 * 读取脚本引擎列表,返回一个ScripExecution对象,没有在运行时返回false
 * @param {string} js - 脚本名称
 * @returns {object|boolean}
 */
function script_locate(js) {
    try {
        for (let i = 0; i < engines.all().length; i++) {
            if (engines.all()[i].getSource().toString().indexOf(js) != -1) {
                return engines.all()[i];
            }
        }
        return false
    } catch (e) {
        return false
    }
}



let tool = {}
tool.script_locate = script_locate;
tool.writeJSON = writeJSON;
tool.readJSON = readJSON;
tool.autoService = autoService;
tool.checkPermission = checkPermission;
tool.setBackgroundRoundRounded = setBackgroundRoundRounded;
try {
    module.exports = tool;
} catch (e) {
    console.verbose(autoService(false));
    sleep(500)
    console.info(autoService(true))
}