importClass(android.content.ComponentName);
runtime.unloadDex('./utlis/java/nlp-hanzi-similar-1.3.0.dex');
runtime.loadDex('./utlis/java/nlp-hanzi-similar-1.3.0.dex');

//指向Android/data/包名/file 路径
var package_path = context.getExternalFilesDir(null).getAbsolutePath();

var tool = require('./modules/app_tool.js');
tool.dialog_tips = require("./modules/Dialog_Tips.js");
var {
    isHorizontalScreen,
    getWidthHeight,
    getRotation,
} = require('./modules/__util__.js');

//读取辅助脚本配置数据
var helper = tool.readJSON("helper");

var Floating;

var height = device.height,
    width = device.width;

if (height < width || helper.模拟器) {
    height = device.width,
        width = device.height;
} else {
    log('坐标兼容', helper.坐标兼容)
    if (helper.坐标兼容) {
        setScreenMetrics(width, height);
    }
}
/**
 * 多分辨率x值自适应兼容
 * @param {number} value 
 * @returns {number}
 */
function frcx(value) {
    return Math.round((height / 2712).toFixed(2) * value);
}

/**
 * 多分辨率y值自适应兼容
 * @param {number} value 
 * @returns {number}
 */
function frcy(value) {
    return Math.round((width / 1220).toFixed(2) * value);
}

if (helper.图片代理) {
    // 用于代理图片资源，请勿移除 否则需要手动添加recycle代码
    log("加载图片代理程序")
    require('./utlis/ResourceMonitor.js')(runtime, this)
}

log("加载图片识别程序");
var ITimg = require("./ITimg.js"); //读取识图库

new ITimg.Prepare({}, {
    saveSmallImg: true,
    picture_failed_further: true,
    correction_path: "./utlis/ocr_矫正规则.json"
}, {}, {
    threshold: 0.75,
    filter_w: frcx(20),
    filter_h: frcy(20),
    saveSmallImg: true,
    picture_failed_further: true,
    imageFeatures: helper.调试,
    visualization: helper.调试
}, helper);
if (!ITimg.initocr()) {
    sleep(500)
    tips = "未安装OCR扩展，无法使用对应功能\n请打开侧边栏-设置,获取OCR扩展下载安装";
    if (ITimg.XiaoYueOCR_module && ITimg.XiaoYueOCR_module.hasOwnProperty('initResult') && !ITimg.XiaoYueOCR_module.initResult) {
        tool.Floating_emit("展示文本", "状态", "状态：已安装的OCR无法使用");
        tips = "已安装OCR扩展，但初始化失败,无法使用\n请打开侧边栏-运行日志查看详细报错,尝试解决. 或更换其他OCR扩展";
    }

    tool.dialog_tips("插件包提示", tips);
    tool.Floating_emit("暂停", "结束程序");
    tool.Floating_emit("展示文本", "状态", "状态：暂停，未安装插件");

    sleep(5000);

}



if (helper.监听键 == "上" || helper.监听键 == "下") {
    threads.start(function() {
        sleep(100);
        events.observeKey();
        if (helper.监听键 == "上") {
            events.setKeyInterceptionEnabled("volume_up", true);
        } else if (helper.监听键 == "下") {
            events.setKeyInterceptionEnabled("volume_down", true);
        }
        events.on("key_down", function(keyCode, events) {
            if (keyCode == keys.volume_up && helper.监听键 == "上") {
                toastLog("音量上键被按下，PGRAssistant将停止运行");
                tool.Floating_emit("展示文本", "状态", "状态：暂停，音量上键按下");
                tool.Floating_emit("暂停", "结束程序");
            } else if (keyCode == keys.volume_down && helper.监听键 == "下") {
                toastLog("音量下键被按下，PGRAssistant将停止运行");
                tool.Floating_emit("展示文本", "状态", "状态：暂停，音量下键按下");
                tool.Floating_emit("暂停", "结束程序");
            }
        });

    });
}
events.on("暂停", function(words) {
    log(words);
    if (words == "继续") {
        Material_await = "允许";
        return
    }
    device.cancelKeepingAwake()
    threads.shutDownAll();
    exit();
});
//作战控制器,不用管
var fight_thread = false;

var coordinate = files.exists("./library/coordinate.json") ? JSON.parse(files.read("./library/coordinate.json")) : {
    "name": width + "x" + height,
    "w": width,
    "h": height,
    "coordinate": {},
    "宿舍": {
        "宿舍房间位置": [],
        "快捷头像位置": []
    }
}
var buff_list = {
    "火队": ["易燃", "火焰轮回"],
    "雷队": ["感电", "电极", "镭射合金"],
    "物理队": ["脆弱", "机械工厂"],
    "暗队": ["腐蚀", "暗影深林"],
    "冰队": ["霜结", "猩红冰原"],
    "空队": ["空域浮台"]
}
var axis_list = {
    return_homepage: [245, 60],
    homepage_battle: [2400, 535],
    homepage_open: [2510, 860],
    activity_level_special: [1990, 660],
    furniture_beautiful: [1512, 418],
    furniture_comfortable: [1512, 603],
    furniture_practical: [1512, 790],
    furniture_quantity_plus: [1266, 1080],
    task_100_active: [2490, 1080],
    recruit_slide_left: [2080, 677, 753, 677],
    recruit_slide_right: [1193, 542, 2294, 497, 500],
    reward_slide_top: [height / 2, 930, height / 2, 200, 500],
}


for (let i in axis_list) {
    if (axis_list[i][2] === true && axis_list[i][3] === true) {
        axis_list[i] = [axis_list[i][0], axis_list[i][1]];
    } else if (axis_list[i][2] === true) {
        axis_list[i] = [axis_list[i][0], frcy(axis_list[i][1])];


    } else if (axis_list[i][3] === true) {
        axis_list[i] = [frcx(axis_list[i][0]), axis_list[i][1]];

    } else if (axis_list[i][2]) {
        if (axis_list[i].length > 3) {
            for (let k in axis_list[i]) {
                if (k == 0 || k == 2) {
                    axis_list[i][k] = frcx(axis_list[i][k]);
                } else if (k == 1 || k == 3) {
                    axis_list[i][k] = frcy(axis_list[i][k]);
                }
            }
        } else {
            axis_list[i] = [frcx(axis_list[i][0]), frcy(axis_list[i][1]), axis_list[i][2]];

        }
    } else {
        axis_list[i] = [frcx(axis_list[i][0]), frcy(axis_list[i][1])];
    }
}

let refreshTime = new Date();
refreshTime.setHours(5, 0, 0, 0);

let Day = refreshTime.getMonth() + 1; //月 
let Dat = refreshTime.getDate(); //日
if (new Date() <= refreshTime) {
    Dat = Dat - 1;
}

if (helper.今日 != Day + "." + Dat) {
    // 刷新日常任务时间记录
    console.log("日常任务时间记录已刷新");

    for (let i in helper.宿舍系列) {
        if (helper.宿舍系列[i].启用) {
            helper.宿舍任务 = true;
        }
        helper.宿舍系列[i].执行状态 = false;
    }

    tool.writeJSON("今日", Day + "." + Dat);
    tool.writeJSON("宿舍任务", helper.宿舍任务);

    tool.writeJSON("任务状态", {
        "每日登录": false,
        "日常补给": false,
        "妙算神机": false,
        "助理交流": false,
        "自动2血清": false,
    });
} else {
    for (let i in helper.宿舍系列) {
        if (helper.宿舍系列[i].启用 && !helper.宿舍系列[i].执行状态) {
            helper.宿舍任务 = true;
        }
    }
    tool.writeJSON("宿舍任务", helper.宿舍任务);

}
helper = tool.writeJSON("宿舍系列", helper.宿舍系列);

主程序();

function 主程序() {
    if (helper.matrix_recurrence) {
        require("./common/矩阵循生.js").main(function(_fight_thread) {
            fight_thread = _fight_thread;
        });

        return
    }
    进入主页();
    helper = tool.readJSON("helper");


    //领取商店每日免费血清
    require("./common/采购.js")();
    //与助理交流
    交流();
    //与妙算神机交互
    指挥局();
    helper = tool.readJSON("helper");

    //宿舍系列任务
    if (helper.宿舍系列 &&helper.宿舍任务) {
    require("./common/宿舍系列.js")();
}

    ITimg.matchFeatures("宿舍-家具-关闭", {
        action: 0,
        timing: 2000,
        area: 2,
        threshold: 0.85,
        saveSmallImg: true,
        visualization: true,

    });
    if (!coordinate.combat || !coordinate.combat.攻击) {
        坐标配置("战斗");
    }
    if (helper.血清) {
        //领取每日登录血清
        if (!helper.任务状态.每日登录) {
            领取任务奖励(true);
        }

        //消耗血清
        require("./common/消耗血清.js")();
    }
    helper = tool.readJSON("helper");

    便笺(3000);

    //
    领取任务奖励();
    领取手册经验();
    require("./common/纷争战区.js")(function(_fight_thread) {
            fight_thread = _fight_thread;
        });

    require("./common/幻痛囚笼.js")(function(_fight_thread) {
            fight_thread = _fight_thread;
        });



    //诺曼复兴战();
    require("./common/诺曼复兴战.js")(function(_fight_thread) {
            fight_thread = _fight_thread;
        });



    require("./common/历战映射.js")(function(_fight_thread) {
            fight_thread = _fight_thread;
        });

    if (helper.返回桌面) {
        home();
    }
    tool.Floating_emit("展示文本", "状态", "状态：主程序暂停中");
    tool.Floating_emit("暂停", "结束程序");
}


function 启动(package_) {

    var gmvp = device.getMusicVolume()
    sleep(800);
    let getpackage_ = tool.currentPackage();
    switch (getpackage_) {
        //com.kurogame.haru.huawei
        case helper.包名:
            return true
        case null:
            toastLog("暂时无法获取前台应用，默认启动")
            break;
    }
    console.info(getpackage_)
    if (getpackage_ != null && getpackage_.indexOf('com.kurogame.haru') != -1) {
        return true
    }
    toastLog("启动战双中，等待启动完成");
    console.verbose(package_)
    try {
        app.launchPackage(package_ ? package_ : helper.包名)
        /*
        let intent = new Intent();
        intent.setPackage(null);
        let cn = new ComponentName(package_ ? package_ : helper.包名,null);
        intent.setComponent(cn);
        app.startActivity(intent);
        */
    } catch (e) {
        console.error("启动错误" + e)
        app.launchPackage(package_);
    }


    sleep(3000);
    switch (tool.currentPackage()) {
        case package_:
        case helper.包名:
        case "_" + helper.包名:
            break
        default:
            console.error("未匹配到的包名:" + tool.currentPackage() + "，重新启动");

            function uiLaunchApp(appName) {
                var script = '"ui";\nvar args = engines.myEngine().execArgv;\nlet appName = args.appName;\app.launchPackage(appName);exit();';
                engines.execScript("uiLaunchApp", script, {
                    arguments: {
                        appName: appName
                    }
                });
            }

            uiLaunchApp(package_ ? package_ : helper.包名);
            sleep(3000)
            break
    }
    tool.writeJSON("当前音量", gmvp);


    threads.start(function() {
        if (helper.静音) {
            device.setMusicVolume(0)
        } else if (helper.音量修复) {
            device.setMusicVolume(gmvp)
        }
    })
    return true;

}



function 检查获得奖励() {
    let OBTAINREWARDS = ITimg.ocr("集合文本", {
        action: 6,
        area: 5,
    });
    sleep(200);
    let confirm = ITimg.ocr("获得奖励", {
        action: 1,
        gather: OBTAINREWARDS,
        timing: 1000,
    }) || ITimg.ocr("OBTAIN REWARDs", {
        action: 1,
        similar: 0.8,
        gather: OBTAINREWARDS,
        log_policy: "简短",
        timing: 1000,
    }) || ITimg.ocr("OBTAINREWARDS", {
        action: 1,
        similar: 0.8,
        gather: OBTAINREWARDS,
        timing: 1000,
        log_policy: "简短",
    }) || ITimg.ocr("REWARD", {
        action: 1,
        similar: 0.8,
        gather: OBTAINREWARDS,
        timing: 1000,
        log_policy: "简短",
    }) || ITimg.ocr("奖励详情", {
        action: 1,
        similar: 0.8,
        gather: OBTAINREWARDS,
        timing: 1000,
        log_policy: "简短",
    })
    if (confirm) {
        return true;
    } else {
        confirm = ITimg.ocr("获得", {
            action: 5,
            gather: OBTAINREWARDS,
            similar: 0.8,
            log_policy: "简短",
        })
        if (confirm) {
            let confirm2 = ITimg.ocr("奖励", {
                action: 5,
                gather: OBTAINREWARDS,
                similar: 0.8,
                log_policy: "简短",
            })
            if (confirm2.left - confirm.right < frcx(20) && confirm2.bottom - confirm.bottom < frcy(20)) {
                click(confirm.left, confirm.bottom);
                sleep(200);
                click(confirm.left, confirm.bottom);
                sleep(200);
                click(confirm.left, confirm.bottom);
                sleep(600);
                return true;
            }
        }
    }
    sleep(500);
    return false;
}

function 进入主页() {
    tool.Floating_emit("展示文本", "状态", "状态：准备进入主页");

    sleep(1000);
    if (tool.currentPackage() != helper.包名) {
        if (!启动()) {
            启动();

        }
        sleep(5000)
    }
    let number = 0;
    while (true) {
        sleep(1000);
        staging = (ITimg.ocr("主界面", {
            action: 5,
            area: [0, 0, height / 4, width / 4],
        }) || ITimg.ocr("返回", {
            area: [0, 0, height / 4, width / 4],
            refresh: false,
            action: 5,
            similar: 0.72,
            threshold: 0.95,
        }));
        if (staging && staging.top < frcy(100) && staging.right < height / 4) {
            click(staging.left, staging.bottom);
            sleep(1500);
        }
        let staging = ITimg.ocr("集合", {
            action: 6,
            area: 24,
        })
        let _max = 0;

        if (staging && staging.length) {
            console.info("确认主页，右半屏文本信息", staging)
            let text_list = ["任务", "成员", "战斗", "研发", "采购"]
            for (text in text_list) {
                if (ITimg.ocr(text_list[text], {
                        action: 5,
                        gather: staging,
                    })) {
                    _max++;
                }
                if (_max >= 3) {
                           number++;
             
                    break
                }
            }
        }
        if (_max >= 3) {
            //     click(coordinate.coordinate.主页展开.x, coordinate.coordinate.主页展开.y)
            ITimg.matchFeatures("主页展开", {
                action: 0,
                area: 4,
                timing: 1000,
                threshold: 0.75,
                filter_w: frcx(50),
                saveSmallImg: true,
                visualization: true,
            })
            if(number >= 3){
            break
        }
        } else if (!ITimg.ocr("返回", {
                action: 0,
                timing: 1500,
                area: [0, 0, height / 4, width / 4],
                threshold: 0.85,
                saveSmallImg: true,
            })) {
            tool.Floating_emit("展示文本", "状态", "状态：等待进入战双主页");
            toastLog("等待加载登录");
            sleep(2000);
            log("前台包名：" + tool.currentPackage())
            if (tool.currentPackage() != helper.包名) {
                启动();
            }
            ITimg.ocr("更新", {
                action: 0,
                timing: 10000,
                area: 4,
            });
            ITimg.ocr("确定", {
                action: 0,
                timing: 2000,
                area: "下半屏"
            });
            if (ITimg.ocr("点击空白处关闭", {
                    action: 0,
                    timing: 1000,
                    refresh: false,
                    area: "下半屏"
                })) {
                while (ITimg.ocr("点击空白处关闭", {
                        action: 0,
                        timing: 1000,
                        nods: 500,
                        area: "下半屏"
                    })) {}
            }

            click(height / 2, width - frcy(90));

            sleep(500);
            //关闭纷争战区弹窗
            ITimg.matchFeatures("宿舍-家具-关闭", {
                action: 0,
                timing: 2000,
                area: 2,
                threshold: 0.8,
                saveSmallImg: "纷争战区-关闭",
                visualization: true,
            })

        }
    }
}

function 坐标配置(name, x, y) {
    if (name == "战斗") {
        tool.Floating_emit("展示文本", "状态", "状态：获取键位布局..");
        if (!coordinate.combat) {
            coordinate.combat = {};
        }
        返回主页();
        sleep(1000);
        tool.Floating_emit("展示文本", "状态", "状态：准备进入设置");
        let setup_list = ITimg.contour({
            action: 5,
            area: 4,
            canvas: "设置",
            threshold: 240,
            isdilate: true,
            size: 5,
            type: "BINARY",
            filter_w: frcx(10),
            filter_h: frcy(10),
        });
        if (!setup_list || !setup_list.length) {
            return false;
        }
        // log(setup_list);
        setup_list.sort((a, b) => b.y - a.y);
        click(setup_list[0].x, setup_list[0].y);
        sleep(1500);
        setup_list = ITimg.contour({
            action: 5,
            area: 4,
            canvas: "设置",
            threshold: 240,
            isdilate: true,
            size: 5,
            type: "BINARY",
            filter_w: frcx(10),
            filter_h: frcy(10),
        });
        if (!setup_list || !setup_list.length) {
            return false;
        }
        // log(setup_list);
        setup_list.sort((a, b) => b.y - a.y);
        click(setup_list[0].x, setup_list[0].y);
        sleep(1000);

        while (true) {
            ITimg.ocr("键位", {
                action: 1,
                area: 13,
                similar: 0.75,
                timing: 1000,
            });

            if (ITimg.ocr("前往设置", {
                    action: 1,
                    area: 2,
                    similar: 0.75,
                    timing: 2000,
                })) {
                break
            }
        }
        tool.Floating_emit("展示文本", "状态", "状态：获取键位布局...");
        let key_list;
        key_list = ITimg.contour({
            canvas: "键位",
            action: 5,
            area: 0,
            isdilate: false,
            threshold: 200,
            size: 0,
            type: "BINARY",
            filter_w: frcx(50),
            filter_h: frcy(50),
        });
        if (!key_list || key_list.length < 9) {
            sleep(1000);
            key_list = ITimg.contour({
                canvas: "键位",
                action: 5,
                area: 0,
                isdilate: false,
                threshold: 160,
                size: 0,
                type: "BINARY",
                filter_w: frcx(60),
                filter_h: frcy(90),
            });
        }

        key_list = groupColumns(key_list, true);
        let key_position = [];
        for (let id of key_list) {

            if (id.length > 1 && id[0].shape == "正方形") {

                id.sort((a, b) => b.x - b.x);
                key_position.push(id);

            } else {
                id = id[0];
                if (id.shape == "长方形" && id.w < id.h) {
                    coordinate.combat["角色1"] = {
                        "x": id.x,
                        "y": id.y,
                        "w": id.w,
                        "h": parseInt(id.h / 2),
                    };
                    coordinate.combat["角色2"] = {
                        "x": id.x,
                        "y": id.y + parseInt(id.h / 2),
                        "w": id.w,
                        "h": parseInt(id.h / 2),

                    };
                } else if (id.shape == "正方形" && id.x + id.w < height / 2 && id.y + id.h > parseInt(width / 1.5)) {
                    coordinate.combat["移动"] = {
                        "x": id.x,
                        "y": id.y,
                        "w": id.w,
                        "h": id.h,
                    };
                } else if (id.x < height / 2 && id.x + id.w > parseInt(height / 1.2)) {
                    coordinate.combat["信号球"] = {
                        "x": id.x,
                        "y": id.y,
                        "w": id.w,
                        "h": id.h,
                    };
                } else if (id.shape == "长方形" && id.w > id.h && id.y > width / 2) {
                    key_position.push([{
                        shape: '正方形',
                        x: id.x + parseInt(id.w / 1.5),
                        y: id.y,
                        w: parseInt(id.w / 3),
                        h: id.h,
                        vertices: 4
                    }, {
                        shape: '正方形',
                        x: id.x + parseInt(id.w / 3),
                        y: id.y,
                        w: parseInt(id.w / 3),
                        h: id.h,
                        vertices: 4
                    }, {
                        shape: '正方形',
                        x: id.x,
                        y: id.y,
                        w: parseInt(id.w / 3),
                        h: id.h,
                        vertices: 4
                    }])
                }
            }
        }
        console.warn(key_position)
        let key_ = key_position[0][0];
        if (key_.w > key_position[1][0].w && key_.h > key_position[1][0].h) {
            key_position.reverse();
            key_ = key_position[0][0];
        }


        coordinate.combat["辅助机"] = {
            "x": key_.x,
            "y": key_.y,
            "w": key_.w,
            "h": key_.h,

        };

        key_ = key_position[1][0];
        coordinate.combat["闪避"] = {
            "x": key_.x,
            "y": key_.y,
            "w": key_.w,
            "h": key_.h,
        };
        key_ = key_position[1][1];
        coordinate.combat["攻击"] = {
            "x": key_.x,
            "y": key_.y,
            "w": key_.w,
            "h": key_.h,
        };
        key_ = key_position[1][2];
        coordinate.combat["大招"] = {
            "x": key_.x,
            "y": key_.y,
            "w": key_.w,
            "h": key_.h,
        };

        tool.Floating_emit("展示文本", "状态", "状态：退出键位布局.");
        while (!ITimg.ocr("退出", {
                action: 1,
                timing: 1000,
                area: 13,
                nods: 1000,
            })) {

        }

        tool.Floating_emit("展示文本", "状态", "状态：保存键位布局成功");
        toastLog("保存键位布局成功");
        sleep(1000);
        返回主页()
    } else {


        coordinate.coordinate[name] = {
            "x": x,
            "y": y
        };
        log("保存坐标: " + name + "---" + JSON.stringify({
            "x": x,
            "y": y
        }));
    }

    // log(coordinate.combat)
    coordinate = {
        "name": width + "x" + height,
        "w": width,
        "h": height,
        "coordinate": coordinate.coordinate,
        "宿舍": coordinate.宿舍,
        "combat": coordinate.combat
    };
    files.write(
        "./library/coordinate.json",
        JSON.stringify(coordinate),
        (encoding = "utf-8")
    )

}




function 交流() {
    if (!helper.助理交流) {
        return
    }
    if (helper.任务状态.助理交流) {
        toastLog("今日助理交流已完成");
        return
    }
    tool.Floating_emit("展示文本", "状态", "状态：与助理交互")
    if (!ITimg.ocr("任务", {
            area: "右半屏",
        }) && !ITimg.ocr("战斗", {
            area: "右半屏",
            refresh: false,
        })) {
        返回主页()
    }
    while (true) {
        click(height / 2, width / 2);
        sleep(500);
        if (ITimg.matchFeatures("助理-告白-关闭", {
                action: 0,
                timing: 1500,
                area: 2,
                threshold: 0.85,
                saveSmallImg: true,
                filter_w: frcx(30),
                visualization: true,
            })) {
            continue;
        }
        if (ITimg.ocr("交流", {
                action: 4,
                timing: 2500,
                nods: 2500,
                area: "左上半屏",
            }) || ITimg.ocr("交流", {
                action: 2,
                timing: 2500,
                area: "左半屏",
                part: true,
            }) || ITimg.ocr("交流", {
                action: 2,
                timing: 2500,
                area: 13,
                similar: 0.72,
            })) {

            break
        }
    }
    while (true) {

        click(height / 2, width / 2);
        sleep(500);

        if (ITimg.matchFeatures("助理-告白-关闭", {
                action: 0,
                timing: 1500,
                area: 2,
                threshold: 0.85,
                filter_w: frcy(30),
                saveSmallImg: true,
                visualization: true,
            })) {
            return 交流();
            break
        } else {
            (ITimg.ocr("交流", {
                action: 4,
                timing: 2500,
                nods: 500,
                area: "左上半屏",
            }) || ITimg.ocr("交流", {
                action: 2,
                timing: 2500,
                area: 13,
                similar: 0.72,
            }))
        }
        if (ITimg.ocr("更换成员", {
                action: 5,
                area: 3,
            }) || ITimg.ocr("基本信息", {
                action: 5,
                area: 3,
            })) {
            helper.任务状态.助理交流 = true;
            tool.writeJSON("任务状态", helper.任务状态);

            click.apply(click, axis_list.return_homepage);
            sleep(500);
            break;
        }

    }


}

function 指挥局() {
    let _id = "brilliant_calculations";

    if (!helper[_id] || !helper[_id].启用) {
        return false;
    }
    if (helper.任务状态.妙算神机) {
        toastLog("今日妙算神机已完成");
        return
    }
    tool.Floating_emit("展示文本", "状态", "状态：与妙算神机交互");
    let _max = 5;
    while (_max) {
        if (!ITimg.ocr("任务", {
                area: "右半屏",
            }) && !ITimg.ocr("战斗", {
                area: "右半屏",
                refresh: false,
            })) {
            let staging = ITimg.ocr("主页面", {
                area: 1,
                action: 5,
            });
            if (staging) {
                click(staging.left, staging.bottom);
                坐标配置("主页面", staging.left, staging.bottom)
                sleep(2000)
            } else if (coordinate.coordinate.主页面) {
                click(coordinate.coordinate.主页面.x, coordinate.coordinate.主页面.y);
                sleep(2000);
            }
        }
        if (!ITimg.ocr("公会", {
                action: 4,
                timing: 4000,
                area: 4,
                similar: 0.85,
            }) && !ITimg.ocr("公会", {
                action: 4,
                timing: 4000,
                area: 34,
            })) {
            //click(coordinate.coordinate.主页展开.x, coordinate.coordinate.主页展开.y)
            // sleep(1000);
            if (!ITimg.matchFeatures("主页展开", {
                    action: 0,
                    area: 4,
                    timing: 1000,
                    threshold: 0.75,
                    filter_w: frcx(50),
                    saveSmallImg: true,
                    visualization: true,
                })) {
                click.apply(click, coordinate.homepage_open);
                sleep(1000);
            }
            if (!ITimg.ocr("公会", {
                    action: 4,
                    timing: 4000,
                    area: 4,
                    similar: 0.85,
                }) && !ITimg.ocr("公会", {
                    action: 4,
                    timing: 4000,
                    area: 34,
                })) {
                _max--;
            } else {
                break
            }
        } else {
            break
        }
    }
    if (!_max) {
        tips = "无法确认工会按钮";
        toast(tips);
        console.error(tips);
        return false;
    }
    tool.Floating_emit("面板", "隐藏");
    sleep(500);
    while (true) {
        if (ITimg.ocr("新版指挥局", {
                timing: 1500,
                nods: 500,
                area: "左上半屏",
            }) || ITimg.ocr("指挥局", {
                timing: 1500,
                nods: 1500,
                area: "左上半屏",
                part: true,
                refresh: false,
            })) {
            break
        } else {
            ITimg.ocr("公会", {
                action: 4,
                timing: 4000,
                area: 34,
                part: true,
            })
        }
    }
    if (helper[_id].领取贡献) {
        tool.Floating_emit("展示文本", "状态", "状态：领取公会贡献");
        let contribution = ITimg.ocr("本周贡献", {
            action: 5,
            area: 1,
            refresh: false,
            saveSmallImg: false,
        })
        if (contribution) {
            let _area = [contribution.left - 20, contribution.bottom - (contribution.bottom - contribution.top) * 4, contribution.right - contribution.left + 40, (contribution.bottom - contribution.top) * 3];
            let contribution_max = ITimg.ocr("获取贡献", {
                action: 6,
                area: _area,
                saveSmallImg: false,
            })
            if (contribution_max) {
                //   contribution_max.sort((a, b) => a.top - b.top);
                for (let _max_ of contribution_max) {
                    if (_max_.text.match(/(\d+)/)) {
                        contribution_max = _max_.text.match(/(\d+)/)[0];
                        break
                    }
                }
                toastLog("公会贡献：" + contribution_max)

                if (contribution_max >= 15000) {

                    while (true) {
                        click(contribution.left + (contribution.right - contribution.left) / 2, contribution.top);
                        sleep(1000);
                        if (ITimg.ocr("一键领取", {
                                action: 0,
                                timing: 1000,
                                area: 2,
                            })) {
                            if (检查获得奖励()) {
                                sleep(1000);
                            }
                        }
                        let axis_12000 = ITimg.ocr("12000", {
                            action: 5,
                            area: 4,
                        })
                        if (axis_12000) {

                            while (true) {
                                let slide_left = [axis_12000.left, axis_12000.top, height / 2, axis_12000.top, 500];

                                swipe.apply(swipe, slide_left);
                                sleep(500);
                                axis_12000 = ITimg.ocr("15000", {
                                    action: 5,
                                    area: 4,
                                    nods: 1000,
                                    saveSmallImg: "公会贡献_15000",
                                })
                                if (!axis_12000) {
                                    continue;
                                }
                                click(axis_12000.left + (axis_12000.right - axis_12000.left) / 2, axis_12000.top - frcy(100));
                                sleep(1000);
                                if (检查获得奖励()) {
                                    break;
                                }
                            }
                            break
                        }

                    }
                    返回主页(true);
                    sleep(500);
                }

            }


        }
        tool.Floating_emit("展示文本", "状态", "状态：与妙算神机交互");
    }
    tool.Floating_emit("面板", "展开");

    if (ITimg.ocr("岁雪新宵", {
            area: "右上半屏",
        })) {
        //岁雪新春
        swipe(parseInt(height / 7.2), parseInt(width / 1.35), parseInt(height / 4), parseInt(width / 1.08), 1200);
    }else if(ITimg.ocr("庭梨栖雪", {
            refresh: false,
            area: "右上半屏",
        })){
            press(height/5,width/1.7,1800);
            
        } else if (ITimg.ocr("蔚蓝之夏", {
            refresh: false,
            area: "右上半屏",
        })) {
        //蔚蓝之夏
        swipe(parseInt(height / 7.2), parseInt(width / 1.35), parseInt(height / 10.5), parseInt(width / 1.6), 1800);

    } else {
        //默认大厅皮肤
        //移动小人手势步骤,从x1,y1,到x2,y2;用时1.7秒
        swipe(parseInt(height / 6), parseInt(width / 1.39), parseInt(height / 3.55), parseInt(width / 1.35), 1700);
    }

    /*
    for(let i=0;i<coordinate.移动小人动作.length;i++){
     gestures.apply(null, coordinate.移动小人动作[i]);
     sleep(400);
    };
    */
    //等待1秒
    sleep(1500)
    if (ITimg.ocr("算一签", {
            action: 1,
            timing: 2500,
            area: "右半屏",
            part: true,
        }) || ITimg.ocr("算一签", {
            action: 1,
            timing: 2500,
            area: "右半屏",
            refresh: false,
        })) {
        click(height / 2, width - frcy(80));
        sleep(1000);
        返回主页(true);
        sleep(1000);
        helper.任务状态.妙算神机 = true;
        tool.writeJSON("任务状态", helper.任务状态);
    } else if (ITimg.ocr("查看签文", {
            action: 1,
            timing: 2500,
            area: "右半屏",
        })) {
        if (coordinate.coordinate.返回) {
            click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
            sleep(1000);
        };
        helper.任务状态.妙算神机 = true;
        tool.writeJSON("任务状态", helper.任务状态);
    } else {
        toastLog("无法匹配到算一签,请确认移动小人步骤是否可用");
    }
    返回主页(true);
}


function 返回主页(only_return) {
    if (only_return) {
        if (coordinate.coordinate.返回) {
            click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
            sleep(2000);
            return true;
        } else {
            let staging = (ITimg.ocr("返回", {
                area: [0, 0, height / 4, width / 4],
                action: 5,
                similar: 0.72,
                threshold: 0.85,
            }) || ITimg.ocr("返回", {
                area: [0, 0, height / 4, width / 4],
                action: 5,
                part: true,
                threshold: 0.85,
            }));
            if (staging) {
                if (staging.right < height / 4 && staging.bottom < width / 4) {
                    click(staging.left, staging.bottom);
                    坐标配置("返回", staging.left, staging.bottom)
                    sleep(2000);
                    return true;
                }
            } else {
                return false;
            }
        }
    }
    tool.Floating_emit("展示文本", "状态", "状态：尝试回到主页..")

    console.info("---返回主页---")
    //返回主页
    let staging = (ITimg.ocr("主页面", {
        area: [0, 0, height / 4, width / 4],
        action: 5,
    }) || ITimg.ocr("主界面", {
        action: 5,
        part: true,
        refresh: false,
        log_policy: "简短",
    }));
    if (staging) {
        click(staging.left, staging.bottom);
        坐标配置("主页面", staging.left, staging.bottom)
        sleep(1500);
    }
    while (true) {
        //不在主页界时,再点下
        if (ITimg.ocr("任务", {
                action: 5,
                area: "右半屏",
            }) && ITimg.ocr("成员", {
                area: "右半屏",
                refresh: false,
            }) && ITimg.ocr("采购", {
                area: "右半屏",
                refresh: false,
                part: true,
                nods: 1000,
            })) {
            break
        } else {
            //返回主页
            staging = (ITimg.ocr("主页面", {
                area: 1,
                action: 5,
            }) || ITimg.ocr("主界面", {
                action: 5,
                part: true,
                refresh: false,
                log_policy: "简短",
            }))
            if (staging) {
                click(staging.left, staging.bottom);
                坐标配置("主页面", staging.left, staging.bottom)
                sleep(3000);
            } else if (ITimg.ocr("官方主页", {
                    area: 24,
                    action: 5,
                }) || ITimg.ocr("库街区", {
                    area: 24,
                    action: 5,
                    refresh: false,
                }) || ITimg.ocr("游戏周边", {
                    area: 24,
                    action: 5,
                    refresh: false,
                })) {
                click(height / 2, width - frcy(80));
                sleep(1000);
            }else {
                进入主页();
            }
        }
    }
}



function 作战() {
    tool.Floating_emit("展示文本", "状态", "状态：人工智障操作中..");
    释放信号球 = function() {
        //   try{

        // 查找相似列函数
        function findSimilarColumns(column, columns) {
            return columns.filter(col => {
                return (Math.abs(col.w - column.w) <= frcx(5) && Math.abs(col.h - column.h) <= frcy(5) && (col.circularity && Math.abs(parseFloat(col.circularity) - parseFloat(column.circularity)) <= 0.03));
            });
        }


        //比较数据
        function isDeepEqual(obj1, obj2) {
            if (typeof obj1 !== 'object' || obj1 === null ||
                typeof obj2 !== 'object' || obj2 === null) {
                return obj1 === obj2;
            }

            if (Object.keys(obj1).length !== Object.keys(obj2).length) {
                return false;
            }

            for (let key in obj1) {
                if (!obj2.hasOwnProperty(key) || !isDeepEqual(obj1[key], obj2[key])) {
                    return false;
                }
            }

            return true;
        }


        let data = ITimg.contour({
            canvas: "信号球",
            action: 5,
            area: [coordinate.combat.信号球.x, coordinate.combat.信号球.y, coordinate.combat.信号球.w, coordinate.combat.信号球.h],
            isdilate: true,
            threshold: 250,
            size: 15,
            type: "BINARY",
            filter_w: frcx(20),
            filter_h: frcy(20),
        });
        if (!data || data.length == 0) {
            return false;
        }

        // 处理数据
        let groupedData; // = groupColumns(data);
        /*  let largestGroupIndex = groupedData.reduce((largestIndex, group, index) => {
            return group.length > groupedData[largestIndex].length ? index : largestIndex;
        }, 0);
*/
        let largestGroup = data.sort((a, b) => b.x - a.x);
        //groupedData[largestGroupIndex].sort((a, b) => b.x - a.x);
        let largestGroupIndex = null;
        log(largestGroup)
        if (largestGroup.length < 3) {
            console.verbose("信号球数量不足3个");
            data = null;
            groupedData = null;
            largestGroup = null;
            return false;
        }
        groupedData = [];

        largestGroup.forEach(column => {
            //找出相似轮廓
            let similarColumns = findSimilarColumns(column, data);
            if (similarColumns.length < 3) {
                return false;
            }
            //按x从大到小排序
            similarColumns.sort((a, b) => b.x - a.x);
            let adjacent = 0;
            let middleball = [];
            //检验、过滤、分类轮廓(球)位置
            for (let i in similarColumns) {
                i = Number(i);
                let ball1 = largestGroup.findIndex(ele => ele == similarColumns[i - 1])
                let ball2 = largestGroup.findIndex(ele => ele == similarColumns[i])
                let difference = ball2 - ball1;

                if (ball1 != -1) {

                    if (difference == 1) {
                        adjacent++;
                        //1011101，去尾
                    } else if (adjacent == 2 && similarColumns.length == 5) {
                        similarColumns.splice(4, 1)
                    }
                    //相邻两个，一般即为可三消。也有数量4的例外，点击2、3中间即可
                    if (adjacent >= 2 && similarColumns.length == 4) {
                        //去头，重置中间球
                        if (difference == 2) {
                            similarColumns.splice(0, 1);
                            middleball = []
                        }

                    } else {

                        if (difference > 1 && (!middleball[0] || !isDeepEqual(middleball[0], largestGroup[ball1 + 1]))) {
                            middleball.push(largestGroup[ball1 + 1]);
                            for (let bi = ball1 + 2; bi < ball2; bi++) {
                                middleball.push(largestGroup[bi])

                            }

                        }


                    }
                }
            }

            //最多分两组三消.已保存的列表不重复保存
            if ((groupedData[0] && isDeepEqual(similarColumns, groupedData[0].group)) || (groupedData[1] && isDeepEqual(similarColumns, groupedData[1].group))) {
                similarColumns = null;
                return false
            }

            groupedData.push({
                adjacent: adjacent,
                middleball: middleball,
                group: similarColumns
            });
            middleball = null;
            similarColumns = null;


        });
        sleep(100);
        for (let k in groupedData) {
            k = Number(k);
            let eliminate = false;
            if (groupedData[k].adjacent == 2) {

                // if (groupedData[k].middleball.length) {
                for (let m of groupedData[k].middleball) {
                    console.verbose("移除中间球：" + m.x, m.y);
                    sleep(100);
                    click(m.x, m.y);
                    click(m.x, m.y);
                    sleep(200);
                }
                // }
                eliminate = true;

            } else if ((k + 1) == groupedData.length) {
                if (largestGroup.length <= 6) {
                    console.verbose("等待");
                    break
                }
                if (groupedData[k].adjacent == 0) {
                    k && k--;
                }

                for (let m of groupedData[k].middleball) {
                    console.verbose("_移除中间球：" + m.x, m.y);
                    sleep(100);
                    click(m.x, m.y);
                    click(m.x, m.y);
                    sleep(200);
                }
                eliminate = true;
            }
            if (eliminate) {
                console.info("---三消，初始球位置: " + groupedData[k].group[0].x, groupedData[k].group[0].y)
                click(groupedData[k].group[0].x, groupedData[k].group[0].y);
                sleep(200);
                break;
            }
        };
        data = null;
        groupedData = null;
        largestGroup = null;

        /*   }catch(e){
               e = "释放信号球出错："+e;
               toast(e);
               console.error(e);
           }
           */

    }

    切换角色 = function() {

        let role_ = random(1, 2);
        console.info("---点击切换角色" + role_ + "：" + JSON.stringify(coordinate.combat["角色" + role_]));
        click((coordinate.combat["角色" + role_].x + coordinate.combat["角色" + role_].w / 2), (coordinate.combat["角色" + role_].y + coordinate.combat["角色" + role_].h / 2));

        sleep(100);
        ITimg.contour({
            canvas: "角色",
            action: 5,
            area: [coordinate.combat.角色1.x, coordinate.combat.角色1.y, coordinate.combat.角色1.w, coordinate.combat.角色1.h * 2],
            isdilate: true,
            threshold: 200,
            size: 5,
            type: "BINARY",
            filter_w: frcx(30),
            filter_h: frcy(30),
        });

        if (random(0, 1)) {
            if (!role_timing) {
                click((coordinate.combat["角色" + role_].x + coordinate.combat["角色" + role_].w / 2), (coordinate.combat["角色" + role_].y + coordinate.combat["角色" + role_].h / 2));
                sleep(150);
                role_timing = true;
                setTimeout(function() {
                    role_timing = false;
                }, 10000);

            }
        }

    }
    攻击 = function() {

        switch (random(1, 22)) {
            case 20:
            case 19:
            case 18:

                if (!dodge_timing) {
                    log("---点击闪避键");
                    click(coordinate.combat.闪避.x + coordinate.combat.闪避.w / 2, coordinate.combat.闪避.y + coordinate.combat.闪避.h / 2);

                    //连续点击两次闪避后，两秒内不能再次点击闪避
                    if (dodge_timing === false) {
                        dodge_timing = 0;
                    } else {
                        dodge_timing = true;
                        setTimeout(function() {
                            dodge_timing = false;
                        }, 2500);
                        console.log("---点击攻击键_:" + JSON.stringify(coordinate.combat.攻击))
                        click(coordinate.combat.攻击.x + coordinate.combat.攻击.w / 2, coordinate.combat.攻击.y + coordinate.combat.攻击.h / 2);

                    }


                } else {
                    console.log("---点击攻击键__:" + JSON.stringify(coordinate.combat.攻击))
                    click(coordinate.combat.攻击.x + coordinate.combat.攻击.w / 2, coordinate.combat.攻击.y + coordinate.combat.攻击.h / 2);
                }
                sleep(100);
                break
            case 17:
            case 16:
                log("---长按闪避键", coordinate.combat.闪避);
                press(coordinate.combat.闪避.x + coordinate.combat.闪避.w / 2, coordinate.combat.闪避.y + coordinate.combat.闪避.h / 2, 350);


                break
            case 15:
            case 14:
            case 13:
            case 12:

                console.info("---释放大招", coordinate.combat.大招);
                click(coordinate.combat.大招.x + coordinate.combat.大招.w / 2, coordinate.combat.大招.y + coordinate.combat.大招.h / 2);
                sleep(200);
                role_timing = true;
                setTimeout(function() {
                    role_timing = false;
                }, 5000);


                break
            case 11:
                console.log("---点击辅助机:" + JSON.stringify(coordinate.combat.辅助机));
                click(coordinate.combat.辅助机.x + coordinate.combat.辅助机.w / 2, coordinate.combat.辅助机.y + coordinate.combat.辅助机.h / 2);
                sleep(100);

                break
            case 3:
            case 2:
            case 1:
                console.log("---长按攻击键:" + JSON.stringify(coordinate.combat.攻击))
                press((coordinate.combat.攻击.x + coordinate.combat.攻击.w / 2), (coordinate.combat.攻击.y + coordinate.combat.攻击.h / 2), 350);


                break

            default:

                console.log("---点击攻击键:" + JSON.stringify(coordinate.combat.攻击))
                click(coordinate.combat.攻击.x + coordinate.combat.攻击.w / 2, coordinate.combat.攻击.y + coordinate.combat.攻击.h / 2);
                sleep(100);
                break

        }

        operation_list = null;
        return true;
    }
    // fight_thread = true;
    var role_timing = false;
    var dodge_timing = false;
    var frequency = 0;
    while (fight_thread) {

        /**思路:
         * */

        let ran_ = random(1, 15);


        switch (ran_) {
            case 15:
            case 14:
                切换角色();
                break
            case 11:
            case 13:
            case 12:
            case 10:
            case 9:

                释放信号球();
                break
            default:
                攻击() && frequency++;
                break
                //   click(coordinate.combat.攻击键.x, coordinate.combat.攻击键.y)
                // log("点击  攻击键")
                //    sleep(50)
                //  break
        };
        ran_ = null;

    }
}

function 领取任务奖励(value) {
    helper = tool.readJSON("helper");
    if (!helper.任务奖励) {
        return
    }
    
    tool.Floating_emit("展示文本", "状态", "状态：领取任务奖励")
    let _max = 5;
    while (_max) {
        if (!ITimg.ocr("任务", {
                area: "右半屏",
            }) && !ITimg.ocr("战斗", {
                area: "右半屏",
                refresh: false,
            })) {
            返回主页();
        }
    tool.Floating_emit("展示文本", "状态", "状态：领取任务奖励")
        
        click(height / 2, width - frcy(100));
        sleep(500);
        (ITimg.ocr("任务", {
            action: 1,
            timing: 2000,
            area: "右半屏",
        }))
        if (ITimg.ocr("每日", {
                action: 4,
                timing: 1500,
                area: 12,
                threshold: 0.8,
            }) || ITimg.ocr("每周", {
                action: 5,
                timing: 1500,
                threshold: 0.8,
                area: 12,
                refresh: false,
            })) {
            break
        }

    }
    if (!_max) {
        toastLog("无法识别到任务");
        return false;
    }

    if (ITimg.ocr("一键领取", {
            action: 0,
            timing: 2000,
            area: "上半屏",
        })) {
        while (true) {
            if (检查获得奖励()) {
                click(height / 2, width - frcy(80));
                sleep(1000);
                helper.任务状态.每日登录 = true;
                tool.writeJSON("任务状态", helper.任务状态);
                break
            }
        }

    } else {
        helper.任务状态.每日登录 = true;
        tool.writeJSON("任务状态", helper.任务状态);
    }

    if (!value) {
        sleep(500);
        //领取100活跃度奖励
        let active = ITimg.ocr("今日活跃度", {
            action: 5,
            area: 3,
        });

        if (!active) {
            sleep(1000);
            click(height / 2, width - frcy(80));
            sleep(1000);
            active = ITimg.ocr("/活跃度", {
                action: 5,
                part: true,
                area: 3,
            })
        }

        if (active) {

            active = ITimg.ocr("识别集合文本", {
                area: [active.left, active.bottom, active.right - active.left, width - active.bottom],
                action: 6,
            });
            if (active) {
                active.sort((a, b) => a.left - b.left);
                console.warn(active)

                if (Math.floor(active[0].text).toString() == "NaN") {
                    active = Math.floor(active[1].text);
                } else {
                    active = Math.floor(active[0].text)
                }
            }
            if (active >= 100) {
                //获取点击100活跃度位置领取奖励
                active = ITimg.ocr("100", {
                    action: 5,
                    area: 4,
                });
                if (active) {
                    click(active.left, active.top - 100);
                    click(active.left, active.top - 70);
                    sleep(3000);
                    click(height / 2, width - frcy(80))
                    sleep(500);

                } else {

                    toastLog("无法获取100活跃度奖励坐标点位置\n点击固定坐标");
                    click.apply(click, axis_list.task_100_active);
                    sleep(3000);
                    click(height / 2, width - frcy(80))
                    sleep(500);
                }
            } else if (active.toString() == "NaN") {

                toastLog("无法获取活跃度数值");
                //直接点击100活跃度奖励
                click.apply(click, axis_list.task_100_active);
                sleep(3000);
                click(height / 2, width - frcy(80))
                sleep(500);
            } else {
                toastLog("今日任务活跃度:" + active)
            }
        } else {
            toastLog("无法获取活跃度数值");
            click.apply(click, axis_list.task_100_active);
            sleep(3000);
            click(height / 2, width - frcy(80));
            sleep(500);
        }
        检查获得奖励();

        if (helper.周常任务) {
            sleep(1000);
            click(height / 2, width - frcy(80));
            (ITimg.ocr("每周", {
                action: 4,
                timing: 1500,
                area: "左半屏",
                nods: 1500,
            }) || ITimg.ocr("每周", {
                action: 4,
                timing: 1000,
                area: "左半屏",
            }));
            if (ITimg.ocr("一键领取", {
                    action: 0,
                    timing: 1000,
                    area: "上半屏",
                })) {
                while (true) {
                    if (检查获得奖励()) {
                        tool.writeJSON("周常任务", false);
                        break
                    }
                }
            }


        }
    }

    返回主页()

}

function 领取手册经验() {
    if (!helper.手册经验) {
        return
    }
    tool.Floating_emit("面板", "隐藏");
    tool.Floating_emit("展示文本", "状态", "状态：领取手册经验");
    sleep(1000);
    if (!ITimg.ocr("任务", {
            area: "右半屏",
        }) && !ITimg.ocr("战斗", {
            area: "右半屏",
            refresh: false,
        })) {
        返回主页()
    }
    if (!coordinate.coordinate.手册图标位置 || !coordinate.coordinate.手册图标位置.x) {
        sleep(1000);
        let staging = ITimg.ocr("BP", {
            area: 1,
            action: 5,
            nods: 1000,
            similar: 0.80,
        });
        if (!staging) {
            staging = ITimg.ocr("BP", {
                area: 12,
                action: 5,
                similar: 0.80,
            });
        }
        if (staging) {
            坐标配置("手册图标位置", staging.left, staging.bottom)
        } else {
            tips = "无法获取手册图标位置";
            toast(tips)
            console.error(tips)
            return false
        }
    }

    click(coordinate.coordinate.手册图标位置.x, coordinate.coordinate.手册图标位置.y);
    sleep(2500);
    ITimg.ocr("确定", {
        action: 0,
        timing: 1000,
        area: 4,
    });
    if (!ITimg.ocr("评定任务", {
            action: 4,
            timing: 500,
            area: 34,
        })) {
        ITimg.ocr("确定", {
            action: 0,
            timing: 1000,
            area: 4,
        })
        click(height / 2, width - frcy(80));
        ITimg.ocr("评定任务", {
            action: 4,
            timing: 500,
            area: 34,
        })
    } else {

        click(height / 2, width - frcy(80));
        sleep(1000);
    }

    ITimg.ocr("一键领取", {
        action: 1,
        timing: 1500,
        area: 4,
        refresh: false,
    });
    click(height / 2, width - frcy(80));
    sleep(1000);

    if (ITimg.ocr("战略补给", {
            action: 4,
            timing: 1200,
            area: "左上半屏",
        })) {
        ITimg.ocr("一键领取", {
            action: 1,
            timing: 1500,
            area: 4,
        });
        click(height / 2, width - frcy(80));
        sleep(1000);
    }
    返回主页()
    tool.Floating_emit("面板", "展开");


}


function 便笺(sleep_, value) {
    sleep_ = sleep_ || 1000
    let notes = tool.readJSON("notes");
    console.info(notes)
    if (notes == undefined) {
        return
    }

    if (notes.自动识别 || value) {
        tool.Floating_emit("展示文本", "状态", "状态：等待识别血清中...");
        while (true) {
            sleep(sleep_)
            let serum = ITimg.ocr("/240", {
                action: 5,
                saveSmallImg: false,
                area: "上半屏",
                part: true,
            });
            if (!serum) {
                serum = ITimg.ocr("/240", {
                    action: 5,
                    saveSmallImg: false,
                    area: "右半屏",
                    part: true,
                });
            }
            if (!serum) {
                serum = ITimg.ocr("/240", {
                    action: 5,
                    saveSmallImg: false,
                    part: true,
                });
            }
            if (serum) {
                let match_ = serum.text.match(/(\d+)\/(\d+)/);
                if (!match_ || !match_[1]) {
                    text = "无法识别血清数量";
                    toast(text)
                    console.error(text);
                    return text

                }
                serum = parseInt(match_[1]);
                let target_ = parseInt(match_[2]);

                console.warn(serum)
                if (serum.toString() == "NaN") {
                    text = "无法识别血清数量";
                    toast(text)
                    console.error(text);
                    return text
                } else {
                    if (value) {
                        tool.Floating_emit("展示文本", "状态", "状态：血清识别完成");
                        return serum
                    }
                    console.warn("剩余血清数：" + serum)
                    tool.writeJSON("已有血清", serum, "notes")
                    tool.writeJSON("血清数", serum + "/" + target_, "notes")
                    tool.writeJSON("血清时间", new Date(), "notes")
                }
                tool.Floating_emit("展示文本", "状态", "状态：血清识别完成");
                return true
            }

        }


    }

}

function 滑动手势(x1, y1, x2, y2, duration) {
    duration = duration || 1200;
    console.verbose(x1, y1, x2, y2, duration)
    //从x1,y1滑动到x2,y2 持续1000毫秒,y2-50继续滑动10毫秒
    gestures_Ary = [
        [
            [1, duration, [x1, y1],
                [x2, y2]
            ]
        ],
        [
            [25, 200, [x2, y2],
                [x2, y2 - 100]
            ]
        ],
    ];
    for (let i = 0; i < gestures_Ary.length; i++) {
        gestures.apply(null, gestures_Ary[i]);
    }
}
//相似轮廓分组函数
function groupColumns(columns, shape) {
    let groups = [];
    columns.forEach(column => {
        delete column.left;
        delete column.right;
        delete column.bottom;
        delete column.top
        let foundGroup = false;
        groups.forEach(group => {
            if (!foundGroup && Math.abs(column.y - group[0].y) <= frcy(50)) {
                if (shape && column.shape != group[0].shape) {
                    return false
                }
                group.push(column);
                foundGroup = true;
            }
        });
        if (!foundGroup) {
            groups.push([column]);
        }
    });
    return groups;
}

//--------------------------------------------------------