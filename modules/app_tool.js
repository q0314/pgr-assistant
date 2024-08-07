
importClass(android.content.pm.PackageManager);
importClass(android.graphics.drawable.GradientDrawable);

try {
    importClass(android.provider.Settings);
} catch (err) { }

var Disposition = storages.create("warbler");
var wuzhangai = false;
var packageName = context.getPackageName();
var service_name = "/com.stardust.autojs.core.accessibility.AccessibilityService";
if (app.autojs.versionCode > 8082200 && packageName.indexOf("org.autojs.autojs") == -1) {
    service_name = "/" + packageName + ".AccessibilityService"
}
if (auto.service != null) {
    service_name = "/" + auto.service.toString().split("@")[0]
}

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
            console.error("无法取得" + key + "的数据,请确认是否已保存");
        }
    }
    return setting;

    //Disposition.clear();//删除这个本地一存储的数据（用于调试）
    // return setting;
}
/**
 * 把值value保存到本地存储中。value可以是undefined以外的任意数据类型。如果value为undefined则抛出TypeError。
 * @param {string|undefined} sett 
 * @param {string|number|Object|boolean} value 
 * @param {string} key
 */
function writeJSON(sett, value, key,debug) {
    key = key || "helper";
    setting = readJSON(key);
    if(setting==undefined||sett==undefined){
        setting=value;
     }else{
        setting[sett] = value;
    }
    if(debug){
    log("key:",key)
    log("vlaue",setting)
    }
    Disposition.put(key, setting);
    return setting;
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
                        if (!wuzhangai) {
                            wuzhangai = true;
                            setTimeout(() => {
                                if (auto.rootInActiveWindow == null) {
                                    let con_ = "检测到无障碍已开启但未运行，PGRAssistant已尝试重启无障碍,无效。\n请跳转到应用设置停止PGRAssistant后，重启PGRAssistant。如仍无效请重启系统";
                                    dialogs.build({
                                        type: "app-or-overlay",
                                        content: con_,
                                        positive: "跳转",
                                        positiveColor: "#FF8C00",
                                        negative: "取消",
                                        canceledOnTouchOutside: false
                                    }).on("positive", () => {
                                        openAppSetting(packageName);
                                    }).show()

                                }
                                wuzhangai = false;

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
                    shell("pm grant " + packageName + " android.permission.WRITE_SECURE_SETTINGS", {
                        root: true,
                    });
                    toastLog("root授权安全系统设置权限成功")
                    return openAccessibility();

                } else {
                    return false
                }
            } else {
                if ($shell.checkAccess("adb")) {
                    shell("pm grant " + packageName + " android.permission.WRITE_SECURE_SETTINGS", {
                        adb: true,
                    });
                    toastLog("adb授权安全系统设置权限成功");
                    return openAccessibility()

                }
            }
            if (!wuzhangai) {
                wuzhangai = true;
                setTimeout(() => {
                    if (auto.rootInActiveWindow == null) {
                        let enabledServices = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES)
                        if (enabledServices) {
                            if (enabledServices.toString().indexOf(packageName) != -1) {
                                let con_ = "检测到无障碍已开启但未运行。\n请尝试关闭再打开无障碍。如无效请跳转到应用设置停止PGRAssistant后，重启PGRAssistant。如仍无效请重启系统";
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
                                    openAppSetting(packageName);
                                }).show()
                            }
                        }
                    }
                    wuzhangai = false;

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
            let mServices = packageName + service_name;

            let enabledServices = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES)
            log("无障碍列表" + enabledServices);

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


            enabledServices = enabledServices.replace("::", ":")
            Settings.Secure.putString(context.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES, "1");
            Settings.Secure.putString(context.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES, enabledServices + mServices);
            console.info("处理后的无障碍列表:" + enabledServices + mServices)
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
                Service = enabledServices.replace(":" + packageName + service_name);
                Service = enabledServices.replace(packageName + service_name);

                Settings.Secure.putString(context.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES, Service)
                Settings.Secure.putString(context.getContentResolver(), Settings.Secure.ACCESSIBILITY_ENABLED, '0')
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
    let engine = engines.all();
    if (!engine) {
        return false
    }
   
    try {
        for (let i = 0; i < engine.length; i++) {
            if (engine[i].getSource().toString().indexOf(js) != -1) {
                return engine[i];
            }
        }
        return false
    } catch (e) {
        return false
    }
}

function Floating_emit(id,text1,text2) {
    let engine = engines.all();
    if (!engine) {
        return false
    }
    let Floating;
    for (let i = 0; i < engine.length; i++) {
        //寻找悬浮窗脚本
        if (engine[i].toString().indexOf("Floating") >= 0) {
            Floating = engine[i];
        }
    }
    if(!Floating) return false;
    try{
        if(id) Floating.emit(id,text1,text2);
    }catch(e){

    }
    return Floating;
}


/**
 * 获取当前前台应用包名
 * @returns {string | object} - 当前前台应用包名
 */
function getPackage() {
    if (!runtime.getAccessibilityBridge()) {
        return currentPackage();
    }
    // 通过windowRoot获取根控件的包名，理论上返回一个 速度较快
    let windowRoots = runtime.getAccessibilityBridge().windowRoots()
    if (windowRoots && windowRoots.size() > 0) {
        if (windowRoots && windowRoots.size() >= 2) {
            console.verbose('windowRoots size: ' + windowRoots.size())
            //有多个windowRoots时，最后一个比较符合前台应用
            for (let i = windowRoots.size() - 1; i >= 0; i--) {
                let root = windowRoots.get(i)
                console.info(root ? root.getPackageName() : "null");
                if (root !== null && root.getPackageName()) {
                    return root.getPackageName()
                }

            }

        } else {
            if (windowRoots && windowRoots.get(0)) {
                return windowRoots.get(0).getPackageName();
            }
        }


    }
    // windowRoot获取失败了通过service.getWindows获取根控件的包名，按倒序从队尾开始获取 速度相对慢一点
    try {
        let service = runtime.getAccessibilityBridge().getService()
        let serviceWindows = service !== null ? service.getWindows() : null
        if (serviceWindows && serviceWindows.size() > 0) {
            console.verbose('windowRoots未能获取包名信息，尝试service window size: ', serviceWindows.size())
            for (let i = serviceWindows.size() - 1; i >= 0; i--) {
                let window = serviceWindows.get(i)
                if (window && window.getRoot() && window.getRoot().getPackageName()) {
                    return window.getRoot().getPackageName()
                }
            }
        }
    } catch (e) {
        console.error(e)
    }
    log('service.getWindows未能获取包名信息，通过currentPackage()返回数据')
    // 以上方法无法获取的，直接按原方法获取包名
    return currentPackage();
}
/**
 * 
 * @param {string} package - 启动应用的包名
 */
function launchPackage(package) {

    try {
        //let intent = new Intent(Intent.ACTION_MAIN);
        //intent.addCategory(Intent.CATEGORY_LAUNCHER);
        let intent = new Intent();

        let packageManager = context.getPackageManager();
        intent = packageManager.getLaunchIntentForPackage(package);
        intent.setPackage(null);
        app.startActivity(intent);
    } catch (e) {
        console.error("启动" + package + "错误:\n" + e)
        app.launchPackage(package);
    }
    /*
        setTimeout(() => {
    
            let currentPackage = getpackage();
            switch (currentPackage) {
                case package:
                    break
                default:
                    console.error(currentPackage + " 与预期包名不符，重新启动");
    
                    function uiLaunchApp(appName) {
                        var script = '"ui";\nvar args = engines.myEngine().execArgv;\nlet appName = args.appName;\app.launchPackage(appName);exit();';
                        engines.execScript("uiLaunchApp", script, {
                            arguments: {
                                appName: appName
                            }
                        });
                    };
    
                    uiLaunchApp(setting.包名);
                    break
            }
        }, 2000);
        */
}

/**
 * 过滤非法文件名字符
 * @param {string} - 文件名
 */
function formatFileName(fileName) {
    //importClass(java.util.regex.Pattern);
    let pattern = Pattern.compile("[\\s\\\\/:\\*\\?\\\"<>\\|]");
    let matcher = pattern.matcher(fileName);
    return matcher.replaceAll("");
};

let hanZiSimilarBridge = null;

function nlpSimilarity(s1, s2) {
    if (!hanZiSimilarBridge) {
        // @ts-expect-error dex包
        hanZiSimilarBridge = new Packages.cn.zzliux.HanZiSimilarBridge();
        
        hanZiSimilarBridge.init(
            files.read('./utlis/java/nlp/bihuashu.txt'),
            files.read('./utlis/java/nlp/bushou.txt'),
            files.read( './utlis/java/nlp/jiegou.txt'),
            files.read( './utlis/java/nlp/sijiao.txt'),
            files.read( './utlis/java/nlp/userdefine.txt')
        );
        //  log(files.cwd())
        log("初始化字形计算\n字符串1：" + s1 + "\n字符串2：" + s2 + "\n相似度：" + hanZiSimilarBridge.similarity(s1, s2));
    }
    /*let result =*/
    return hanZiSimilarBridge.similarity(s1, s2);
    //console.log('result=${result}');
    // return result;
};

function pointerPositionDisplay(open) {
    let state;
    try {
        state = Settings.System.getInt(context.getContentResolver(), Settings.System.POINTER_LOCATION)
    } catch (e) {
        console.error(e)
        state = shell("su -c 'settings get system pointer_location'", {
            adb: $shell.checkAccess("adb")
        }).result;
        log(state);
    };
    if (open && state) return true;
    if (open===false && !state) return true;
    if (shell("su -c 'settings put system pointer_location " + (state ? "0" : "1") + "'", {
            adb: $shell.checkAccess("adb")
        }).code == 0) {
        return true;
    }
}

let tool = {}
tool.script_locate = script_locate;
tool.Floating_emit = Floating_emit;
tool.writeJSON = writeJSON;
tool.readJSON = readJSON;
tool.autoService = autoService;
tool.checkPermission = checkPermission;
tool.setBackgroundRoundRounded = setBackgroundRoundRounded;

tool.currentPackage = getPackage;
tool.launchPackage = launchPackage;
tool.formatFileName = formatFileName;
tool.checkPermission = checkPermission;
tool.pointerPositionDisplay = pointerPositionDisplay;
tool.nlpSimilarity = nlpSimilarity;

try {
    module.exports = tool;
} catch (e) {
    let li = "暗";
let ranks_attribute = [
    ["物", "冰", "暗"],
    ["火", "雷", "空"]
];

// 查找 li 在 ranks_attribute 中的位置
let rowIndex = ranks_attribute.findIndex(row => row.includes(li));
let colIndex = ranks_attribute[rowIndex].indexOf(li);

console.log(`"${li}" 的行索引为 ${rowIndex}，列索引为 ${colIndex}`);

    log(rowIndex%2)
    let v= "物理队|火队|冰队|雷队|暗队|空队";
    log(v.split("|"))
}