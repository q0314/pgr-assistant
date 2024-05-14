importClass(android.content.ComponentName);
runtime.unloadDex('./utlis/java/nlp-hanzi-similar-1.3.0.dex');
runtime.loadDex('./utlis/java/nlp-hanzi-similar-1.3.0.dex');

var tool = require('./modules/app_tool.js');
var {
    isHorizontalScreen,
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
    };
};


if (helper.图片代理) {
    // 用于代理图片资源，请勿移除 否则需要手动添加recycle代码
    log("加载图片代理程序")
    require('./utlis/ResourceMonitor.js')(runtime, this)
}

log("加载图片识别程序");
var ITimg = require("./ITimg.js"); //读取识图库

new ITimg.Prepare({}, {
    correction_path: "通用"
});

/**
 * 多分辨率x值自适应兼容
 * @param {number} value 
 * @returns {number}
 */
function frcx(value) {
    return Math.floor((height / 2160) * value);
}

/**
 * 多分辨率y值自适应兼容
 * @param {number} value 
 * @returns {number}
 */
function frcy(value) {
    return Math.floor((width / 1080) * value);
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

//指向Android/data/包名/file 路径
var package_path = context.getExternalFilesDir(null).getAbsolutePath() + "/"
//作战控制器,不用管
var fight_thread = false;

var coordinate = JSON.parse(files.read("./library/coordinate.json"));
/**
 * 战斗相关配置
 * 资源.资源 - false时程序会去打活动
 * 资源.资源名称 - 想打的资源名称
 * 活动.关卡 - true = 只刷-1,掉落活动代币，false = 刷-2,掉落代币+意识
 
var 战斗 = {

    资源: {
        资源: false,
        //资源名称
        资源名称: "成员经验",
    },
    活动: {
        活动: true,
        关卡: true,
    },
    //是否需要打怪,不用管,程序会决定
    作战: false,
}
*/

//作战 按钮坐标相关信息
/*
var combat = {
    攻击键: { x: frcx(1820), y: frcy(960) },
    信号球1: { x: frcx(2070), y: frcy(760) },
    信号球2: { x: frcx(1910), y: frcy(760) },
}
*/

let Day = new Date().getMonth(); //月
let Dat = new Date().getDate(); //日

if (new Date().getHours() < 5) {
    Day = Day - 1;
} else {
    Day = Day + 1;
}
if (Day + "." + Dat != helper.今日 || !helper.任务状态) {

    tool.writeJSON("今日", Day + "." + Dat);
    tool.writeJSON("任务状态", {
        "每日登录": false,
        "日常补给": false,
        "妙算神机": false,
        "助理交流": false,
        "宿舍执勤": false,
        "家具制造": false,
        "自动2血清": false,
    });
    helper = tool.readJSON("helper");

}
主程序();

function 主程序() {
    进入主页();

    //领取商店每日免费血清
    采购();
    //与助理交流
    交流();
    //与妙算神机交互
    指挥局();

    //宿舍系列任务
    宿舍();
    ITimg.picture("宿舍-家具-关闭", {
        action: 0,
        timing: 2000,
        area: "上半屏",
    });

    if (helper.血清) {
        //领取每日登录血清
        if (!helper.任务状态.每日登录) {
            领取任务奖励(true);
        }
        //消耗血清
        战斗();
    }
    纷争战区();
    便笺(3000);

    //
    领取任务奖励();
    领取手册经验();
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

function 坐标配置(name, x, y) {


    coordinate.coordinate[name] = {
        "x": x,
        "y": y
    };
    log("保存坐标: " + name + "---" + JSON.stringify({
        "x": x,
        "y": y
    }));
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

function 进入主页() {
    tool.Floating_emit("展示文本", "状态", "状态：准备进入主页")

    sleep(1000);
    if (tool.currentPackage() != helper.包名) {
        if (!启动()) {
            启动()
        }
    }
    while (true) {
        sleep(1000);
        ITimg.picture("返回", {
            action: 0,
            timing: 1500,
            area: "左上半屏",
        })
        if ((ITimg.ocr("任务", {
                timing: 1000,
                area: 2,
            }) && ITimg.ocr("战斗", {
                timing: 2000,
                area: 2,
            })) || (ITimg.ocr("任务", {
                timing: 1000,
                area: 2,
                part: true,
                refresh: false,
            }) && ITimg.ocr("战斗", {
                timing: 2000,
                area: 2,
                part: true,
                refresh: false,
            }))) {
            click(coordinate.coordinate.主页展开.x, coordinate.coordinate.主页展开.y)
            sleep(1000)
            break
        } else if (!ITimg.picture("返回", {
                action: 0,
                timing: 1500,
                area: 1
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
            click(height / 2, width - frcy(90));

            //关闭纷争战区弹窗
            ITimg.picture("宿舍-家具-关闭", {
                action: 0,
                timing: 2000,
                area: 2
            });


        }
    }
}



function 采购() {
    if (!helper.每日血清) {
        return
    }
    tool.Floating_emit("展示文本", "状态", "状态：领取今日补给")
    if (helper.任务状态.日常补给) {
        toastLog("今日日常补给已领取");
        return
    }
    if (!ITimg.ocr("采购", {
            action: 1,
            timing: 2000,
            area: "右半屏",
        }) && !ITimg.ocr("采购", {
            action: 1,
            timing: 2000,
            area: "右半屏",
            part: true,
            refresh: false,
        })) {
        toastLog("无法识别到采购");
        return
    }
    tool.Floating_emit("面板", "隐藏");
    if (ITimg.ocr("补给包", {
            action: 0,
            timing: 1200,
            area: 1,
            nods: 1000,
        }) || ITimg.ocr("补给包", {
            action: 0,
            timing: 1200,
            area: 1,
            part: true,
        })) {
        (ITimg.ocr("日常补给", {
            action: 1,
            timing: 2000,
            area: 1,
        }) || ITimg.ocr("日常补给", {
            action: 1,
            timing: 2000,
            area: "左上半屏",
            part: true,
            refresh: false,
        }))

        if (ITimg.ocr("每日", {
                action: 1,
                timing: 1500,
                area: "左上半屏",
                part: true,
            }) || ITimg.ocr("免费", {
                action: 1,
                timing: 1500,
                area: "左上半屏",
                part: true,
            })) {
            (ITimg.ocr("购买", {
                action: 1,
                timing: 1500,
                area: "下半屏",
                nods: 500,
            }) || ITimg.ocr("购买", {
                action: 1,
                timing: 1500,
                area: 34,
                part: true,
            }));

            click(height / 2, width - frcy(80));
            sleep(1000);
            let week = ITimg.ocr("每周限购1", {
                action: 5,
                area: "左半屏",
            });
            let free = ITimg.ocr("免费", {
                action: 5,
                refresh: false,
            });

            if (week && free) {
                if (week.left > free.left) {
                    click(free.left, free.top);
                    sleep(1000);
                    (ITimg.ocr("购买", {
                        action: 1,
                        timing: 1500,
                        area: "下半屏",
                        nods: 500,
                    }) || ITimg.ocr("购买", {
                        action: 1,
                        timing: 1500,
                        area: 34,
                        part: true,
                    }));
                    click(height / 2, width - frcy(80));
                }
            }
            helper.任务状态.日常补给 = true;
            tool.writeJSON("任务状态", helper.任务状态);
        } else {
            helper.任务状态.日常补给 = true;
            tool.writeJSON("任务状态", helper.任务状态);
            toastLog("今日补给包可能已领取")
        }

        tool.Floating_emit("面板", "展开");
        //点击返回

        let staging = ITimg.ocr("返回", {
            area: 1,
            action: 5,
        });
        if (staging) {
            click(staging.left, staging.bottom);
            坐标配置("返回", staging.left, staging.bottom)
            sleep(2000)
        } else if (coordinate.coordinate.返回) {
            click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
            sleep(2000);
        };


    }
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
    click(height / 2, width / 2);
    sleep(1200)
    if (ITimg.ocr("交流", {
            action: 4,
            timing: 2500,
            nods: 2500,
            area: "左上半屏",
        }) || ITimg.ocr("交流", {
            action: 2,
            timing: 2500,
            area: "左半屏",
            part: true
        })) {
        helper.任务状态.助理交流 = true;
        tool.writeJSON("任务状态", helper.任务状态);
        //点击返回
        let staging = ITimg.ocr("返回", {
            area: 1,
            action: 5,
        });
        if (staging) {
            click(staging.left, staging.bottom);
            坐标配置("返回", staging.left, staging.bottom)
            sleep(2000)
        } else if (coordinate.coordinate.返回) {
            click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
            sleep(2000);
        };
    } else {
        toastLog("无法匹配到交流");
    };

}


function 指挥局() {
    if (!helper.妙算神机) {
        return
    }
    if (helper.任务状态.妙算神机) {
        toastLog("今日妙算神机已完成");
        return
    }
    tool.Floating_emit("展示文本", "状态", "状态：与妙算神机交互")
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
        };
    }
    if (!ITimg.ocr("公会", {
            action: 4,
            timing: 4000,
            area: 4
        }) && !ITimg.ocr("公会", {
            action: 4,
            timing: 4000,
            area: 4,
            part: true,
            refresh: false,
        })) {
        toastLog("没有识别到公会,无法执行与妙算神机交互");
        return
    }
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
        }
    }

    if (ITimg.ocr("岁雪新宵", {
            timing: 1500,
            nods: 1500,
            area: "右上半屏",
        })) {
        //岁雪新春
        swipe(parseInt(height / 7.2), parseInt(width / 1.35), parseInt(height / 4), parseInt(width / 1.08), 1200);
    } else if (ITimg.ocr("蔚蓝之夏", {
            timing: 1500,
            nods: 1500,
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
    sleep(1000)
    if (ITimg.ocr("算一签", {
            action: 1,
            timing: 2500,
            area: "右半屏",
            part: true,
        })) {
        let staging = ITimg.ocr("返回", {
            area: 1,
            action: 5,
        });
        if (staging) {
            click(staging.left, staging.bottom);
            坐标配置("返回", staging.left, staging.bottom)
            sleep(2000)
        } else if (coordinate.coordinate.返回) {
            click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
            sleep(2000);
        };
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
    let staging = ITimg.ocr("返回", {
        area: 1,
        action: 5,
    });
    if (staging) {
        click(staging.left, staging.bottom);
        坐标配置("返回", staging.left, staging.bottom)
        sleep(2000)
    } else if (coordinate.coordinate.返回) {
        click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
        sleep(2000);
    };
}

function 宿舍() {
    if (!helper.宿舍系列) {
        return
    }
    tool.Floating_emit("展示文本", "状态", "状态：准备执行宿舍系列任务")
    if (!ITimg.ocr("任务", {
            area: "右半屏",
        }) && !ITimg.ocr("战斗", {
            area: "右半屏",
            refresh: false,
        }) && !ITimg.ocr("成员", {
            area: "右半屏",
            refresh: false,
        }) && !ITimg.ocr("研发", {
            area: "右半屏",
            refresh: false,
            part: true,
        })) {
        toastLog("当前似乎不在主页,尝试返回主页")
        返回主页()
    }
    if (!ITimg.ocr("宿舍", {
            action: 0,
            timing: 3000,
            nods: 1500,
        }) && !ITimg.ocr("宿舍", {
            action: 0,
            timing: 3000,
            area: "右半屏",
        })(!ITimg.ocr("宿舍", {
            action: 1,
            part: true,
        }) && !ITimg.ocr("公会", {
            timing: 3000,
            refresh: false,
        }))) {
        toastLog("无法识别到宿舍");
        return
    }
    let matching_i = 0;
    while (true) {
        if (ITimg.picture("宿舍-委托", {
                timing: 1000,
                nods: 2000,
                area: "下半屏"
            })) {
            break
        } else {
            matching_i++;
            if (matching_i > 15) {
                toastLog("宿舍-委托多次匹配失败,请确认图库小图片是否可以正常使用");
                tool.Floating_emit("展示文本", "状态", "状态:宿舍-委托多次匹配失败");
                tool.Floating_emit("暂停", "结束程序");
                break
            }
        }
        //确保进入宿舍
        if (ITimg.ocr("任务", {
                area: 2,
                action: 5,
            }) && ITimg.ocr("战斗", {
                action: 5,
                refresh: false,
            })) {
            ITimg.ocr("宿舍", {
                action: 0,
                timing: 3000,
                refresh: false,
            });
        }
    }
    宿舍_委托();
    //执勤
    宿舍_执勤();

    宿舍_抚摸()
    宿舍_家具制造();

    //
    tool.Floating_emit("展示文本", "状态", "状态：领取宿舍任务奖励...")
    sleep(2000);
    if (ITimg.ocr("任务", {
            action: 1,
            timing: 2000,
            area: 2,
        }) || ITimg.ocr("任务", {
            action: 1,
            timing: 2000,
            nods: 1500,
            area: 24,
        }) || ITimg.ocr("任务", {
            action: 1,
            timing: 2000,
            area: 12,
        })) {
        ITimg.ocr("每日", {
            action: 1,
            timing: 1000,
            area: 13,
        })

        if (ITimg.ocr("今日任务已完成", {
                action: 5,
            })) {
            toastLog("今日宿舍任务已完成");
        } else {
            if (ITimg.ocr("一键领取", {
                    action: 1,
                    timing: 1500,
                    refresh: true
                })) {
                //返回 ,关闭奖励显示
                let staging = ITimg.ocr("返回", {
                    area: 1,
                    action: 5,
                });
                if (staging) {
                    click(staging.left, staging.bottom);
                    坐标配置("返回", staging.left, staging.bottom)
                    sleep(1000)
                } else if (coordinate.coordinate.返回) {
                    click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
                    sleep(1000);
                };

            }
        }
        //返回
        let staging = ITimg.ocr("返回", {
            area: 1,
            action: 5,
        });
        if (staging) {
            click(staging.left, staging.bottom);
            坐标配置("返回", staging.left, staging.bottom)
            sleep(1000)
        } else if (coordinate.coordinate.返回) {
            click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
            sleep(1000);
        };

    } else {
        toastLog("无法执行领取任务奖励");
    }
    //返回主界面
    let staging = ITimg.ocr("返回", {
        area: 1,
        action: 5,
    });
    if (staging) {
        click(staging.left, staging.bottom);
        坐标配置("返回", staging.left, staging.bottom)
        sleep(1000)
    } else if (coordinate.coordinate.返回) {
        click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
        sleep(1000);
    };
}

function 宿舍_委托() {
    tool.Floating_emit("展示文本", "状态", "状态：执行委托任务")
    //本来是想用ocr的,试了效果不好,只用找图了
    if (ITimg.picture("宿舍-委托", {
            action: 0,
            timing: 2500,
            nods: 1500,
            area: 4,
        }) || ITimg.picture("宿舍-委托", {
            action: 0,
            timing: 2500,
            area: 4,
        }) || ITimg.picture("宿舍-委托", {
            action: 0,
            timing: 2500,
            area: 24,
            threshold: 0.7,
        })) {

        if (ITimg.ocr("领取奖励", {
                action: 1,
                timing: 1500,
                area: "下半屏"
            })) {
            for (let i = 0; i < 6; i++) {

                click(height / 2, width - frcy(50));
                sleep(1200);
            }
        };
        //红,橙,紫,蓝,绿级别的委托
        let entrusted_color = ["#d3333b", "#e55c35", "#dd6b49", "#bc45ab", "#3f78ce", "#469646"];
        let second = 0
        for (let i = 0; i < entrusted_color.length; i++) {
            //识别不到有空闲队伍时不接取委托任务
            if (!ITimg.ocr("空闲中", {
                    timing: 1000,
                    area: "下半屏"
                })) {
                if (ITimg.ocr("领取奖励", {
                        action: 1,
                        timing: 1500,
                        refresh: false
                    })) {
                    click(height / 2, width - frcy(50));
                    sleep(1200);
                    i--;
                }

                second++;
                if (second >= 3) {
                    toastLog("没有可接取的委托位");
                    break
                }
            };
            log(entrusted_color[i])
            //单点取色,识别委托级别,
            let entrusted = images.findColor(ITimg.captureScreen_(), entrusted_color[i], {
                region: [0, Math.floor(width / 5), height - Math.floor(height / 8), frcy(700)],
                threads: 12
            });
            if (entrusted) {
                //点击委托
                click(entrusted.x, entrusted.y);
                sleep(1500);
                if (!ITimg.ocr("接取委托", {
                        action: 1,
                        timing: 1500,
                        area: [parseInt(height / 1.5), parseInt(width / 2), parseInt(height - (height / 1.5)), parseInt(width / 2)],
                    })) {
                    click(height / 2, width - frcy(50))
                    continue;
                }
                let multiple = ITimg.picture("宿舍-委托-一键派遣&确认", {
                    action: 5,
                    area: "右下半屏"
                });
                if (!multiple) {
                    multiple = ITimg.picture("宿舍-委托-一键派遣&确认", {
                        action: 5,
                        area: "下半屏"
                    });
                }
                if (multiple) {
                    //点击一键派遣
                    click(multiple.x + 10, multiple.y + 10);
                    sleep(1000);
                    //点击确认
                    click(multiple.right, multiple.top + 20);
                    sleep(2000)
                    i--;
                } else {
                    toastLog("无法匹配宿舍-委托-一键派遣&确认.png,请检查图库")
                }
            } else {
                log("无法匹配", entrusted_color[i], "结果", entrusted)
            }
        }

        //返回
        let staging = ITimg.ocr("返回", {
            area: 1,
            action: 5,
        });
        if (staging) {
            click(staging.left, staging.bottom);
            坐标配置("返回", staging.left, staging.bottom)
            sleep(1000)
        } else if (coordinate.coordinate.返回) {
            click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
            sleep(1000);
        };
    } else {
        toastLog("无法执行委托任务");
    }
}

function 宿舍_执勤() {
    if (helper.任务状态.宿舍执勤) {
        toastLog("今日宿舍执勤已完成");
        return
    }
    tool.Floating_emit("展示文本", "状态", "状态：开始执勤");
    while (true) {
        if (!ITimg.picture("宿舍-委托", {
                area: 4,
            })) {
            //返回
            let staging = ITimg.ocr("返回", {
                area: 1,
                action: 5,
            });
            if (staging) {
                click(staging.left, staging.bottom);
                坐标配置("返回", staging.left, staging.bottom)
                sleep(2000)
            } else if (coordinate.coordinate.返回) {
                click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
                sleep(2000);
            };
        }
        if (ITimg.picture("宿舍-执勤", {
                action: 0,
                timing: 1000,
                nods: 1500,
                area: "右下半屏"
            }) || ITimg.picture("宿舍-执勤", {
                action: 0,
                timing: 1000,
                area: 4,
            }) || ITimg.picture("宿舍-执勤", {
                action: 0,
                timing: 1200,
                area: "右半屏"
            })) {
            break
        }
    }
    tool.Floating_emit("面板", "隐藏");
    if (!ITimg.ocr("+", {
            action: 1,
            timing: 1000,
            area: [0, Math.floor(width / 5), height, width - Math.floor(width / 5)],
        })) {
        if (ITimg.ocr("休息中", {
                action: 5,
                refresh: false,
            })) {
            tool.Floating_emit("面板", "展开");
            sleep(500);
            toastLog("休息中");
            helper.任务状态.宿舍执勤 = true;
            tool.writeJSON("任务状态", helper.任务状态);
            //返回
            let staging = ITimg.ocr("返回", {
                area: 1,
                action: 5,
            });
            if (staging) {
                click(staging.left, staging.bottom);
                坐标配置("返回", staging.left, staging.bottom)
                sleep(2000)
            } else if (coordinate.coordinate.返回) {
                click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
                sleep(2000);
            };
            return
        }
        click(height / 2, parseInt(width / 1.7));
        sleep(1000);
    }

    let duty = {
        //已选择执勤的小伙伴
        chosen: 0,
    }
    //提前识别开始执勤坐标点
    duty.duty = ITimg.ocr("开始执勤", {
        action: 5,
        area: "下半屏",
        nods: 1500,
    });
    if (!duty.duty) {
        ITimg.ocr("+", {
            action: 1,
            timing: 1500,
            area: [0, Math.floor(width / 5), height, width - Math.floor(width / 5)],
        });
        duty.duty = ITimg.ocr("开始执勤", {
            action: 5,
            area: "下半屏",
        });
    }
    sleep(1500)
    //遍历识别三次 心情绿色小图
    for (let i = 0; i < 3; i++) {
        //读取小伙伴绿色心情小图
        duty.mood = images.read("./library/gallery/宿舍-心情.png");
        //在大图中找出所有心情绿色的小图
        duty.entrusted = images.matchTemplate(ITimg.captureScreen_(), duty.mood, {
            region: [Math.floor(height / 3.5), Math.floor(width / 6), height - Math.floor(height / 3.5), width - Math.floor(width / 6)],
            max: 8,
            threads: 6.5
        });
        log(duty.entrusted);
        if (duty.entrusted) {
            //遍历点击绿色小图的坐标点
            for (z in duty.entrusted.points) {
                //已选择8位小伙伴时退出遍历
                if (duty.chosen >= 8) {
                    break
                }
                click(duty.entrusted.points[z].x, duty.entrusted.points[z].y)
                sleep(200);
                duty.chosen++;
            }
            console.info("已选择的小伙伴:", duty.chosen)
        }
        //已选择8位小伙伴时退出遍历
        if (duty.chosen >= 8) {
            break
        }
        //上滑显示新的小伙伴
        swipe(parseInt(height / 2), parseInt(width / 1.4), parseInt(height / 2), parseInt(width / 2.5), 550);


        sleep(2000);
    }

    toastLog("选择完成");
    tool.Floating_emit("面板", "展开");
    //对图片进行回收
    !duty.mood.isRecycled() && duty.mood.recycle();
    //如果刚才没有识别成功则重新识别
    duty.duty = duty.duty ? duty.duty : ITimg.ocr("开始执勤", {
        action: 5,
        area: "右下半屏"
    });
    sleep(1000)
    //点击开始执勤
    click(duty.duty.left, duty.duty.top);

    sleep(3000);
    //有bug,执勤过了,没一会又可以选择,但是显示工位已被使用
    ITimg.ocr("取消", {
        action: 1,
        timing: 1000,
        area: 4,
    });

    (ITimg.ocr("一键代工", {
        action: 1,
        timing: 1000,
        area: 4,
        similar: 0.85,
        refresh: false
    }) || ITimg.ocr("一键代工", {
        action: 1,
        timing: 1000,
        area: "下半屏",
        part: true,
        refresh: false,
    }));

    if (ITimg.ocr("立即完成", {
            action: 1,
            timing: 1500,
            area: "右下半屏"
        }) && duty.chosen >= 8) {
        helper.任务状态.宿舍执勤 = true;
        tool.writeJSON("任务状态", helper.任务状态);
    }
    click(height / 2, width - frcy(80));
    sleep(1500);

    //返回
    let staging = ITimg.ocr("返回", {
        area: 1,
        action: 5,
    });
    if (staging) {
        click(staging.left, staging.bottom);
        坐标配置("返回", staging.left, staging.bottom)
        sleep(2000)
    } else if (coordinate.coordinate.返回) {
        click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
        sleep(2000);
    };

}


function 宿舍_抚摸() {

    sleep(1000);
    if (!ITimg.ocr("执勤", {
            action: 5,
            area: 4
        }) && !ITimg.ocr("执勤", {
            part: true,
            refresh: false,
        })) {
        //返回
        let staging = ITimg.ocr("返回", {
            area: 1,
            action: 5,
        });
        if (staging) {
            click(staging.left, staging.bottom);
            坐标配置("返回", staging.left, staging.bottom)
            sleep(2000)
        } else if (coordinate.coordinate.返回) {
            click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
            sleep(2000);
        };
    }
    if (coordinate.宿舍.宿舍房间位置.length == 0) {
        tool.Floating_emit("展示文本", "状态", "状态：初始化房间位置...")
        //集合所有含有'宿舍'文本的信息
        let dorm = ITimg.ocr("宿舍", {
            action: 6,
            part: true,
        });
        console.warn(dorm);
        for (let i = 0; i < dorm.length; i++) {
            //过滤不是实际宿舍位置的文本
            let filter_text = ["战斗/宿舍", "宿舍伙伴", "宿舍事", "宿舍执", "宿舍任", "宿舍币"];
            //false代表包含filter_text中任意一个
            let dorm_re = filter_text.every(function(el) {
                return dorm[i].text.indexOf(el) === -1
            });

            if (dorm_re) {

                //字形相似计算
                let simil = tool.nlpSimilarity(dorm[i].text, "号宿舍");
                dorm_re = (simil >= 0.75);
                log("文字: " + dorm[i].text + " ,相似度：" + simil + "，结果:" + dorm_re);

            }
            if (dorm_re) {
                //矫正位置信息
                if ((dorm[i].right - dorm[i].left) > 200) {
                    dorm[i].right = dorm[i].right - 120;
                }
                //储存宿舍位置
                coordinate.宿舍.宿舍房间位置.push({
                    name: "宿舍" + i,
                    x: dorm[i].right,
                    y: dorm[i].bottom + 30
                });

            } else {
                dorm.splice(i, 1);
                i--;
            }
        }
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
    tool.Floating_emit("展示文本", "状态", "状态：开始宿舍事件...");
    tool.Floating_emit("面板", "隐藏");
    //逐个点进宿舍
    i = 0;
    log(coordinate.宿舍.宿舍房间位置)
    for (i in coordinate.宿舍.宿舍房间位置) {

        sleep(500)
        log("x:" + coordinate.宿舍.宿舍房间位置[i].x + "y:" + coordinate.宿舍.宿舍房间位置[i].y)
        toastLog("进入" + coordinate.宿舍.宿舍房间位置[i].name);

        click(coordinate.宿舍.宿舍房间位置[i].x, coordinate.宿舍.宿舍房间位置[i].y);
        sleep(2000);
        if (!ITimg.picture("宿舍-菜单", {
                area: 3,
                action: 5,
            }) && !ITimg.ocr("菜单", {
                area: 34,
                action: 5,

            }) && !ITimg.ocr("装扮宿舍", {
                refresh: false,
                log_policy: true,
                action: 5,
            })) {
            toastLog("无法确认已进入宿舍房间");
            continue;
        }
        //触发事件
        toastLog("触发事件");
        try {
            for (k in coordinate.宿舍.快捷头像位置) {
                if (!coordinate.宿舍.快捷头像位置[k].x || !coordinate.宿舍.快捷头像位置[k].y) {
                    toastLog(k + "快捷头像位置坐标未配置：x:" + coordinate.宿舍.快捷头像位置[k].x + ",y:" + coordinate.宿舍.快捷头像位置[k].y)
                    continue
                }
                click(coordinate.宿舍.快捷头像位置[k].x, coordinate.宿舍.快捷头像位置[k].y);
                sleep(150);

            }
        } catch (e) {
            toastLog("点击快捷头像位置出错:" + e)
        }
        sleep(1000);
        //逐个抚摸
        for (m in coordinate.宿舍.快捷头像位置) {
            tool.Floating_emit("展示文本", "状态", "状态：准备抚摸" + coordinate.宿舍.快捷头像位置[m].name);
            //点击小人
            click(coordinate.宿舍.快捷头像位置[m].x, coordinate.宿舍.快捷头像位置[m].y);
            sleep(1000);
            if (helper.检查小人心情) {
                try {

                    let img = ITimg.captureScreen_();
                    //多点找色,检查心情条;
                    let mood = images.findMultiColors(img, "#47ca4f", [
                        [0, 30, "#47ca4f"]
                    ], {
                        region: [0, 0, height, width / 2],
                        threshold: 8,
                    });
                    !img.isRecycled() && img.recycle()
                    console.info("绿色心情:", mood)
                    if (mood) {
                        if (!ITimg.picture("宿舍-菜单", {
                                action: "左下半屏"
                            })) {
                            toastLog("心情大于80,不进行抚摸操作");
                            let staging = ITimg.ocr("返回", {
                                area: 1,
                                action: 5,
                            });
                            if (staging) {
                                click(staging.left, staging.bottom);
                                坐标配置("返回", staging.left, staging.bottom)
                                sleep(1000)
                            } else if (coordinate.coordinate.返回) {
                                click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
                                sleep(1000);
                            };
                        }
                        continue;
                    }
                } catch (e) {
                    console.error("检查心情条错误", e)
                }
            }
            //点击小人旁的抚摸
            click(coordinate.宿舍.快捷头像位置[m].x - frcx(160), coordinate.宿舍.快捷头像位置[m].y);
            sleep(800);
            let petting = (ITimg.ocr("抚摸次数", {
                action: 5,
                area: 2,
                part: true,
            }) || ITimg.ocr("抚摸次数 3/3", {
                action: 5,
                area: 2,
                refresh: false,
            }));
            if (petting) {
                try {
                    petting = petting.text.split('次数 ')[1][0];
                } catch (e) {
                    petting = petting.text.split('次数')[1][0];
                }
                log(petting)
                //转number数字类型;
                petting = Math.floor(petting);
                if (petting.toString() == "NaN") {
                    toastLog("无法确认可抚摸次数: " + petting);
                    petting = 3;
                } else {
                    if (petting > 3) {
                        petting = 3;
                    }
                    toastLog("可抚摸次数:" + petting)

                }
                //有时候点进宿舍,没有小人在里面是什么鬼?没有任务在执行
                //就算有个,点小人头像也是没反应,BUG?
            } else if (ITimg.picture("宿舍-菜单", {
                    area: 3,
                    action: 5,
                }) || ITimg.ocr("菜单", {
                    area: 34,
                    action: 5,
                }) || ITimg.ocr("装扮宿舍", {
                    refresh: false,
                    log_policy: true,
                    action: 5,
                })) {
                toastLog("无法确认进入抚摸小人界面\n这可能是战双的BUG\n或快捷头像坐标配置错误");
                break
                //continue;
            } else {
                toastLog("无法获取可抚摸的次数,默认抚摸3次");
                petting = 3;
            }

            if (petting == 0) {
                tool.Floating_emit("展示文本", "状态", "状态：没有可抚摸次数");
                let staging = ITimg.ocr("返回", {
                    area: 1,
                    action: 5,
                });
                if (staging) {
                    click(staging.left, staging.bottom);
                    坐标配置("返回", staging.left, staging.bottom)
                    sleep(1000)
                } else if (coordinate.coordinate.返回) {
                    click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
                    sleep(1000);
                };

                continue;
            }
            //抚摸小人动作,
            //默认分辨率w1080,h2160
            for (let n = 0; n < petting; n++) {


                var points = [random(999, 1100)];

                var x_p = 0.15;
                var y_p = 0.7;


                for (let i = 0; i < 6; i++) {
                    //  console.info("数值:", 2.6 - x_p, ",x:", parseInt(height / (2.6 - x_p)))
                    // console.info("数值:", 0.80 + y_p, "y:", parseInt(width / (0.80 + y_p)))

                    points.push([parseInt(height / (2.6 - x_p)) + random(-20, 20), parseInt(width / (0.80 + y_p)) + random(-30, 10)]);
                    x_p = x_p + 0.15;
                    y_p = y_p + 0.7
                }

                x_p = 0.1;
                y_p = 0.7;

                for (let i = 0; i < 6; i++) {
                    //   console.warn("数值:", 1.7 + x_p, ",x:", parseInt(height / (1.7 + x_p)))
                    // console.warn("数值:", 5.6 - y_p, "y:", parseInt(width / (5.6 - y_p)))

                    points.push([parseInt(height / (1.7 + x_p)) + random(-20, 20), parseInt(width / (5.6 - y_p)) + random(-30, 10)]);
                    x_p = x_p + 0.15;
                    y_p = y_p + 0.7

                }


                x_p = 0.1;
                y_p = 0.7;

                for (let i = 0; i < 6; i++) {
                    points.push([parseInt(height / (2.6 - x_p)) + random(-20, 20), parseInt(width / (0.80 + y_p)) + random(-30, 10)]);
                    x_p = x_p + 0.15;
                    y_p = y_p + 0.7
                }

                x_p = 0.1;
                y_p = 0.7;

                for (let i = 0; i < 6; i++) {
                    //   console.warn("数值:", 1.7 + x_p, ",x:", parseInt(height / (1.7 + x_p)))
                    // console.warn("数值:", 5.6 - y_p, "y:", parseInt(width / (5.6 - y_p)))

                    points.push([parseInt(height / (1.7 + x_p)) + random(-20, 20), parseInt(width / (5.6 - y_p)) + random(-30, 10)]);
                    x_p = x_p + 0.15;
                    y_p = y_p + 0.7

                }

                x_p = 0.1;
                y_p = 0.7;

                for (let i = 0; i < 6; i++) {
                    points.push([parseInt(height / (2.6 - x_p)) + random(-20, 20), parseInt(width / (0.80 + y_p)) + random(-30, 10)]);
                    x_p = x_p + 0.15;
                    y_p = y_p + 0.7
                }

                gesture.apply(null, points);



                if (n != 3) {
                    sleep(3000);
                }
            }

            tool.Floating_emit("展示文本", "状态", "状态：抚摸完成");
            let staging = ITimg.ocr("返回", {
                area: 1,
                action: 5,
            });
            if (staging) {
                click(staging.left, staging.bottom);
                坐标配置("返回", staging.left, staging.bottom)
                sleep(1500)
            } else if (coordinate.coordinate.返回) {
                click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
                sleep(1500);
            };
            continue;
        }
        //点击返回
        if (coordinate.coordinate.返回) {
            click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
            sleep(1500);
        };
    }
    tool.Floating_emit("面板", "展开");
}

function 宿舍_家具制造() {
    if (helper.任务状态.家具制造) {
        toastLog("今日家具制造已完成");
        return
    }
    //家具制造
    if (ITimg.ocr("制造", {
            action: 0,
            timing: 1500,
            nods: 1000,
            area: "左下半屏",
        }) || ITimg.ocr("制造", {
            action: 0,
            timing: 1500,
            area: "下半屏",
            part: true,
            refresh: false,
        }) || ITimg.ocr("制造", {
            action: 0,
            timing: 1500,
            area: 12,
        })) {
        tool.Floating_emit("展示文本", "状态", "状态：开始制造家具")
        //点击家具制造第一位
        click(frcx(1300), frcy(400));
        sleep(1500);
        ITimg.ocr("添加类型", {
            action: 1,
            timing: 1500,
            area: "右半屏",
        });
        //下滑列表
        swipe(height / 2, frcy(850), height / 2, 150, 600);
        sleep(500);
        //查找家具名,并点击右下
        //  ITimg.ocr(coordinate.宿舍.furniture, { action: 4, timing: 500, });
        //ocr太难用,用固定坐标吧
        ITimg.picture("宿舍-家具-挂饰", {
            action: 0,
            timing: 500
        });
        ITimg.ocr("选择", {
            action: 1,
            timing: 1000,
            area: 4,
        });
        //点击固定坐标,舒适MAX
        click(frcx(1150), frcy(530));
        /*ITimg.ocr("MAX", {
             action: 1,
             timing: 1000,
             area:34,
             similar:0.90,
         });*/
        sleep(1000);
        //点击两下数量+号,制造三个家具,要限制区域,不然会识别到上面三个
        let serological = ITimg.picture("宿舍-家具-制造+", {
            action: 5,
            threshold: 0.7,
            area: [0, Math.floor(width / 1.3), height / 2, width - Math.floor(width / 1.3)],
        })
        if (serological) {
            for (let i = 0; i < 2; i++) {
                click(serological.x + serological.w / 2, serological.y + serological.h / 2);
                sleep(200);
            }
        } else {
            toastLog("无法调整家具制造次数\n请检查图库图片: 宿舍-家具-制造+.png");
        }!ITimg.ocr("制造", {
            action: 4,
            timing: 3000,
            nods: 1000,
            area: "右下半屏",
        }) && ITimg.ocr("制造", {
            action: 4,
            part: true,
            timing: 3000,
            area: "下半屏",
        });
        //点击家具制造第一位,领取家具
        click(frcx(1300), frcy(400));
        sleep(2000);
        if (ITimg.picture("宿舍-家具-关闭", {
                action: 0,
                timing: 1000,
                nods: 1000,
                area: "右上半屏",
            })) {
            helper.任务状态.家具制造 = true;
            tool.writeJSON("任务状态", helper.任务状态);
        } else if (ITimg.picture("宿舍-家具-关闭", {
                action: 0,
                timing: 1000,
                area: 2,
            })) {
            helper.任务状态.家具制造 = true;
            tool.writeJSON("任务状态", helper.任务状态);

        };
        sleep(1500);
        if (ITimg.picture("宿舍-家具-关闭", {
                action: 0,
                timing: 1000,
                nods: 1000,
                area: "右上半屏",
            })) {
            helper.任务状态.家具制造 = true;
            tool.writeJSON("任务状态", helper.任务状态);
        }
        sleep(1000);
        //返回
        if (coordinate.coordinate.返回) {
            click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
            sleep(1500);
        };
    } else {
        toastLog("无法执行家具制造");
    }

}


function 战斗() {
    helper = tool.readJSON("helper");
    tool.Floating_emit("展示文本", "状态", "状态：准备作战中")
    if (!ITimg.ocr("任务", {
            area: "右半屏",
        }) && !ITimg.ocr("战斗", {
            area: "右半屏",
            refresh: false,
        })) {
        返回主页()
    };
    this.serum = 便笺(1000, true);

    if (this.serum) {
        if (this.serum < 30 && helper.注射血清 == 0) {
            toastLog("血清不足30\n可注射血清为" + helper.注射血清 + "次");
            return
        } else {
            toastLog("当前血清: " + this.serum)

        }
    }
    tool.Floating_emit("展示文本", "状态", "状态：准备作战中")
    if (!helper.战斗.活动) {
        if (!ITimg.ocr("战斗", {
                action: 2,
                timing: 3000,
                area: "右半屏",
            }) && !ITimg.ocr("战斗", {
                action: 2,
                timing: 3000,
                area: "右半屏",
                part: true,
            })) {
            //都识别不到，改用固定坐标进入活动
            click(frcx(1950), frcy(500))
            sleep(3000)
        }
        (ITimg.ocr("资源", {
            action: 1,
            timing: 1000,
            area: "右下半屏",
            nods: 500,
        }) || ITimg.ocr("资源", {
            action: 1,
            timing: 1000,
            area: 34,
        }));
        while (true) {
            if (ITimg.ocr(helper.战斗.资源名称, {
                    action: 1,
                    timing: 1000,
                    nods: 2000,
                })) {
                break
            };
        }
        let checkpoint = ITimg.ocr("已完成", {
            action: 6,
            area: "下半屏",
        })
        if (checkpoint) {
            let point = [0, 0];
            for (i in checkpoint) {
                if (tool.nlpSimilarity(checkpoint[i].text, "已完成") >= 0.80 || checkpoint[i].text == "已完成") {
                    if (checkpoint[i].left > point[0]) {
                        point[0] = checkpoint[i].left;
                        point[1] = checkpoint[i].top
                    }
                }
            }
            if (point[0] == 0) {
                toastLog("无法确认 " + helper.战斗.资源名称 + " 中可自动作战关卡，请确认ocr是否识别正确")
            }
            click(point[0], point[1]);
            sleep(2000);

            //为什么不用文字识别?活动关已解锁自动作战,开放新关卡时,没打过的没法自动作战,
            if (!ITimg.picture("战斗-自动作战", {
                    action: 0,
                    timing: 1000,
                    area: "下半屏",
                    threshold: 0.75,
                }) && !ITimg.ocr("自动作战", {
                    action: 1,
                    timing: 1000,
                    area: "下半屏",
                }) && !ITimg.ocr("自动作战", {
                    action: 1,
                    timing: 1000,
                    area: "下半屏",
                    part: true,
                    refresh: false,
                })) {
                toastLog("没有匹配到自动作战")


            }
        }

    } else {

        if (ITimg.ocr("战斗", {
                action: 2,
                timing: 2000,
                area: "右半屏",
            }) || ITimg.ocr("战斗", {
                action: 2,
                timing: 2000,
                area: "右半屏",
                part: true,
                refresh: false,
            })) {
            if (!ITimg.ocr("限时活动", {
                    action: 0,
                    timing: 1500,
                    area: 4,
                }) && !ITimg.ocr("限时活动", {
                    action: 0,
                    timing: 1500,
                    area: "右半屏",
                    refresh: false,
                    part: true,
                }) && !ITimg.ocr("进行中", {
                    action: 0,
                    timing: 1500,
                    area: "右半屏",
                    part: true,
                })) {
                click(height / 3, width / 2);
                sleep(1000)
            }
            (ITimg.ocr("权限等级", {
                action: 0,
                timing: 1500,
                nods: 1000,
                area: 3,
            }) || ITimg.ocr("权限等级", {
                action: 0,
                timing: 1500,
                nods: 1000,
                refresh: false,
                part: true,
            }) || ITimg.ocr("权限等级", {
                action: 0,
                timing: 1500,
                area: 13,
                part: true,
            }));
            if (!ITimg.ocr("活动", {
                    // action: 0,
                    timing: 100,
                    part: true,
                    area: 3,
                    nods: 1000,
                }) || !ITimg.ocr("商店", {
                    // action: 0,
                    timing: 100,
                    area: 3,
                    refresh: false,
                    //  part: true,
                })) {
                (ITimg.ocr("权限等级", {
                    action: 0,
                    timing: 1500,
                    nods: 1000,
                    area: "下半屏",
                }) || ITimg.ocr("权限等级", {
                    action: 0,
                    timing: 1500,
                    nods: 1000,
                    area: "左半屏",
                    part: true,
                }) || ITimg.ocr("权限等级", {
                    action: 0,
                    timing: 1500,
                    part: true,
                }));

            }
            if (!ITimg.ocr("自动作战", {
                    action: 0,
                    timing: 1500,
                    area: "下半屏",
                    part: true,
                }) && !ITimg.ocr("自动作战", {
                    action: 0,
                    timing: 1500,
                    area: "下半屏",
                    refresh: false,
                })) {
                (ITimg.ocr("已开启", {
                    action: 0,
                    timing: 1500,
                    area: "下半屏",
                    part: true,
                }) || ITimg.ocr("已开启", {
                    action: 0,
                    timing: 1500,
                    area: "下半屏",
                    refresh: false,
                }))
            }

        }

        click(height / 2, width / 2)
        sleep(1000)

        /*
                coordinate.战斗.关卡 = ITimg.ocr("MIX", {
                    action: 1,
                    timing: 1500,
                    area: coordinate.战斗.活动.关卡 ? "左半屏" : "右半屏",
                    part: true
                })
                if (!coordinate.战斗.关卡) {
                    coordinate.战斗.关卡 = ITimg.ocr("MIX", {
                        action: 1,
                        timing: 1500,
                        area: "左半屏",
                        part: true
                    })
                    if (coordinate.战斗.关卡) {
                        text = "活动代币+意识 未开放\n转活动代币";
                        toast(text);
                        console.info(text)
                    }
                } else {
                    text = "刷取 " + coordinate.战斗.活动.关卡 ? "活动代币" : "活动代币+意识";
                    toast(text)
                    console.info(text)
                }
                */

    }

    sleep(1500)
    helper = tool.readJSON("helper");

    if (!helper.任务状态.自动2血清 && helper.自动2血清) {
        helper.注射血清 = 2;
    }
    //你可以直接用固定坐标点击
    if (helper.挑战次数 > 0) {

        if (helper.挑战次数 >= 7) {
            //大于7,获取点击MAX
            if (!ITimg.picture("战斗-次数MAX", {
                    action: 0,
                    area: "下半屏",
                    threshold: 0.7,
                    nods: 500,
                }) && !ITimg.ocr("MAX", {
                    action: 0,
                    timing: 1500,
                    area: "下半屏",
                    similar: 0.8,
                })) {
                toastLog("无法调整挑战次数\n请检查图库图片: 战斗-次数MAX");
            }


        } else {
            this.serological = ITimg.picture("战斗-次数+", {
                action: 5,
                area: "下半屏",
                threshold: 0.7
            });
            if (this.serological) {
                for (let i = 1; i < helper.挑战次数; i++) {
                    click(this.serological.x, this.serological.y);
                    sleep(150);
                }

            } else {
                toastLog("无法调整挑战次数\n请检查图库图片: 战斗-次数+.png");
            }
        }


    } else {
        toastLog("没有可挑战次数")
        return
    }
    // ITimg.ocr("MAX", { action: 4, timing: 500, area: "下半屏", part: true })
    if (!ITimg.ocr("确认出战", {
            action: 0,
            timing: 2000,
            part: true,
        })) {
        if (!ITimg.picture("战斗-自动作战", {
                action: 0,
                timing: 1000,
                part: true,
                area: "右下半屏"
            }) && !ITimg.ocr("自动作战", {
                action: 1,
                timing: 1000,
                area: "下半屏",
            })) {
            if (!helper.战斗.作战) {
                helper.战斗.作战 = (ITimg.ocr("多重挑战", {
                    action: 4,
                    timing: 1000,
                    area: 4,
                }) || ITimg.ocr("已开启", {
                    action: 0,
                    timing: 1000,
                    area: 4,
                    refresh: false,
                }));
            }
        }

    }
    sleep(150);
    if (helper.注射血清 > 0) {
        (ITimg.ocr("/240", {
            action: 1,
            area: "右上半屏",
            part: true,

        }) || ITimg.ocr("/240", {
            action: 1,
            area: "上半屏",
            part: true,
        }))

    }

    sleep(1000);
    staging = (ITimg.picture("注射血清-确定", {
        timing: 100,
        nods: 1000,
        action: 5,
        area: "右下半屏"
    }) || ITimg.picture("注射血清-确定", {
        timing: 100,
        area: "下半屏",
        action: 5,
    }) || ITimg.ocr("确定", {
        timing: 100,
        action: 5,
        area: 4,
    }));

    if (staging && staging.left < Math.floor(height / 1.4)) {
        tool.Floating_emit("展示文本", "状态", "状态：血清管理中...")
        if (helper.注射血清 > 0) {
            helper.已注射血清 = 0;
            for (let i = 0; i < helper.注射血清; i++) {
                click(staging.right, staging.top);
                sleep(1000);
                if (ITimg.picture("获得奖励", {
                        action: 0,
                        timing: 1000,
                        nods: 1500,
                        area: "上半屏"
                    }) || ITimg.picture("获得奖励", {
                        action: 0,
                        timing: 1000,
                        area: "上半屏"
                    }) || ITimg.ocr("获得奖励", {
                        action: 0,
                        timing: 1000,
                        area: 12,
                    })) {
                    helper.已注射血清++;
                    tool.Floating_emit("展示文本", "血清", "血清：可使用:" + helper.注射血清 + "&已使用:" + helper.已注射血清);
                    if (helper.已注射血清 >= helper.注射血清) {
                        tool.writeJSON("注射血清", 0)
                    }
                };
            }
            while (true) {
                sleep(500)
                if (ITimg.picture("宿舍-家具-关闭", {
                        action: 0,
                        timing: 2000,
                        area: "右上半屏"
                    }) || ITimg.picture("宿舍-家具-关闭", {
                        action: 0,
                        timing: 2000,
                        area: "右上半屏",
                        threshold: 0.7
                    })) {
                    break
                }
            };
        } else {
            while (true) {
                sleep(500)
                if (ITimg.picture("宿舍-家具-关闭", {
                        action: 0,
                        timing: 2000,
                        area: "右上半屏"
                    }) || ITimg.picture("宿舍-家具-关闭", {
                        action: 0,
                        timing: 2000,
                        area: "右上半屏",
                        threshold: 0.7
                    })) {
                    break
                }
            }
            sleep(1000);
            返回主页()
            return
        }
    }

    if (!helper.任务状态.自动2血清 && helper.自动2血清 && helper.已注射血清 >= 2) {
        helper.任务状态.自动2血清 = true;
        tool.writeJSON("任务状态", helper.任务状态);

    }


    helper.战斗.作战 = false;
    if (!ITimg.ocr("确认出战", {
            action: 0,
            part: true,
            timing: 2000,
            part: true,
        })) {
        if (!ITimg.picture("战斗-自动作战", {
                action: 0,
                timing: 1000,
                area: "右下半屏"
            }) && !ITimg.ocr("自动作战", {
                action: 1,
                timing: 1000,
                area: "下半屏",
            })) {
            if (!helper.战斗.作战) {
                helper.战斗.作战 = (ITimg.ocr("多重挑战", {
                    action: 4,
                    timing: 1000,
                    area: 4,
                }) || ITimg.ocr("已开启", {
                    action: 0,
                    timing: 1000,
                    area: 4,
                    refresh: false,
                }));
            }
        }

    }
    //


    //   if(ITimg.ocr("确认出战", { action: 4, timing: 2000, refresh: false })
    if (helper.战斗.作战) {


        while (true) {
            ITimg.ocr("作战开始", {
                action: 4,
                timing: 10000,
                area: 4
            })
            if (ITimg.ocr("当前进度", {
                    action: 0,
                    timing: 1500,
                    area: 13,
                }) || ITimg.ocr("当前进度", {
                    area: "左半屏",
                    part: true,
                    refresh: false,
                }) || ITimg.ocr("奖励 X0", {
                    area: "左半屏",
                    nods: 2000,
                    refresh: false,
                })) {
                break
            }
        }
        //点击特殊事件的坐标位置
        click(frcx(1750), frcy(580));
        sleep(500);
        if (!ITimg.ocr("胜利并结束", {
                action: 0,
                timing: 10000,
                area: "左半屏"
            })) {
            //在新线程中运行作战方案,解决冲突
            fight_thread = threads.start(作战);
        }
        sleep(1000 * 15)
    }

    while (true) {
        if (ITimg.ocr("返回", {
                action: 0,
                timing: 1500,
                area: "下半屏",
                nods: 1500,
            })) {
            //作战完成,终止作战方案
            fight_thread = false;
            ITimg.ocr("返回", {
                action: 0,
                timing: 500,
                area: "下半屏",
                nods: 1500,
                refresh: false
            })
            break
        }
        /*if (!ITimg.ocr("当前进度", { refresh: false, part: true, })) {
           sleep(1000)
                if (!ITimg.ocr("当前进度", { part: true, })) {
                    fight_thread = false;
                }
            
        }
        */
        if (ITimg.ocr("确定", {
                action: 0,
                timing: 2500,
                area: "右下半屏",
                nods: 2000,
                refresh: false,
            })) {
            //作战完成,终止作战方案
            fight_thread = false;
            ITimg.ocr("确定", {
                action: 0,
                timing: 500,
                area: "右下半屏",
                nods: 1500,
            })

            break
        }
        sleep(1000);
    }

    返回主页()
}

function 返回主页() {
    //返回主页
    let staging = ITimg.ocr("主页面", {
        area: 1,
        action: 5,
    });
    if (staging) {
        click(staging.left, staging.bottom);
        坐标配置("主页面", staging.left, staging.bottom)
        sleep(1500)
    } else if (coordinate.coordinate.主页面) {
        click(coordinate.coordinate.主页面.x, coordinate.coordinate.主页面.y);
        sleep(1500);
    };
    //不在主页界时,再点下
    if (!ITimg.ocr("任务", {
            area: "右半屏",
        }) && !ITimg.ocr("宿舍", {
            area: "右半屏",
            refresh: false,
            part: true,
            nods: 1000,
        }) && !ITimg.ocr("工会", {
            area: "右半屏",
            part: true,
            refresh: false,
        })) {
        //返回主页
        let staging = ITimg.ocr("主页面", {
            area: 1,
            action: 5,
        });
        if (staging) {
            click(staging.left, staging.bottom);
            坐标配置("主页面", staging.left, staging.bottom)
            sleep(3000)
        } else if (coordinate.coordinate.主页面) {
            click(coordinate.coordinate.主页面.x, coordinate.coordinate.主页面.y);
            sleep(3000);
        };
    }
}

function 纷争战区() {
    if (!helper.纷争战区.自动) {
        return
    }

    // 获取当前时间
    let now = new Date();

    // 获取当前时间的星期几
    const dayOfWeek = now.getDay();
    // 获取当前时间的小时
    const hour = now.getHours();

    // 定义开放时间段的起始时间
    const openHour = 5;
    const closeHour = 18;

    // 定义上次执行任务的时间
    let lastExecutionOpenDays = helper.纷争战区.lastExecutionOpenDays || [];

    // 定义记录开放时间段的数组
    let openDays = helper.纷争战区.openDays || [];
    //定义上次执行任务的时间
    let lastExecutionTime = helper.纷争战区.lastExecutionTime || undefined;

    // 判断是否在开放时间段内，全天开放，周一周四05:00开放
    let isOpenTime = (dayOfWeek == 2 || dayOfWeek == 5 || dayOfWeek == 6) || ((dayOfWeek == 1 || dayOfWeek == 4) && hour >= openHour);
    //周三周日结算
    if (!isOpenTime) {
        isOpenTime = (dayOfWeek == 3 || dayOfWeek == 0) && hour < closeHour;
    }

    // 判断是否需要执行任务
    let shouldExecuteTask = isOpenTime && ((!lastExecutionTime || (now.getTime() - new Date(lastExecutionTime).getTime()) >= 4 * 24 * 60 * 60 * 1000) || JSON.stringify(openDays) !== JSON.stringify(lastExecutionOpenDays));

    // 如果需要执行任务，则更新开放时间段记录数组
    if (shouldExecuteTask) {
        openDays = [dayOfWeek];
        //改为完成任务后再记录
        //  helper.纷争战区.openDays = openDays;
        //  helper.纷争战区.lastExecutionOpenDays = openDays
        //  helper.纷争战区.lastExecutionTime = now.toString();

    } else if (isOpenTime) {
        // 如果当前时间是开放时间段内，但不需要执行任务，检查是否需要更新记录
        if (openDays.indexOf(dayOfWeek) == -1) {
            openDays.push(dayOfWeek);
            helper.纷争战区.openDays = openDays;
        }
    }
    tool.writeJSON("纷争战区", helper.纷争战区);
    helper = tool.readJSON("helper");

    // 输出结果
    console.log("是否在开放时间段内：", isOpenTime);

    console.log("是否需要执行任务：", shouldExecuteTask);

    if (!isOpenTime) {
        toastLog("纷争战区 战斗期未开放");
        return false;
    }
    // 模拟执行其他任务并判断是否需要执行周期的任务
    if (!shouldExecuteTask) {
        log("纷争战区 此周期已完成")
        return false;

    }


    tool.Floating_emit("展示文本", "状态", "状态：准备纷争战区中")
    if (ITimg.ocr("任务", {
            area: "右半屏",
        }) == false && ITimg.ocr("战斗", {
            area: "右半屏",
            refresh: false,
        }) == false) {
        返回主页()
    }
    if (!ITimg.ocr("战斗", {
            action: 2,
            timing: 3000,
            area: "右半屏",
        }) && !ITimg.ocr("战斗", {
            action: 2,
            timing: 3000,
            area: "右半屏",
            refresh: false,
            part: true,
        })) {
        //都识别不到，改用固定坐标进入活动
        click(frcx(1950), frcy(500))
        sleep(3000)
    }
    if (!ITimg.ocr("纷争战区", {
            action: 2,
            timing: 1000,
            area: 1,
        })) {
        //点击,进入纷争战区
        click(frcx(190), frcy(420));
        sleep(1000);
    }
    (ITimg.ocr("开始作战", {
        action: 1,
        timing: 3000,
        area: 4,
    }) || ITimg.ocr("开始作战", {
        action: 1,
        timing: 3000,
        area: 34,
    }))



    let regional = ITimg.contour({
        action: 5,
        canvas:true,
        threshold: 160,
        type: "BINARY_INV",
        isdilate: true,
        size:5,
        filter_w: frcx(100),
        filter_h: frcy(100),
    });
    //解锁
    if (!regional) {
        return false;
    }
    for (let f of regional) {
        //  console.info("点击" + regional[f].name + " , x" + frcx(regional[f].x) + "y" + frcy(regional[f].y))
        click(f.x + f.w / 2, f.y + f.h / 2);
        sleep(1000);
        if (!ITimg.ocr("确定", {
                action: 1,
                timing: 2000,
                area: "右半屏"
            })) {
            click(height / 2, width - frcy(80));
            sleep(500);
        } else {
            //进入
            click(f.x + f.w / 2, f.y + f.h / 2);
            sleep(1000);

        }


        if (!ITimg.ocr("通关", {
                similar: 0.8,
                nods: 500,
                area: 4,
            }) && !ITimg.ocr("个人积分", {
                part: true,
                area: 4,
            })) {
            return false;
        }
        
        this.mood = ITimg.contour({
            action: 5,
            threshold: 90,
            canvas:true,
            type: "BINARY_INV",
            filter_w: frcx(180),
            filter_h: frcy(200),
        });

        /*  //冒泡排序
          for (let k = 0; k < this.entrusted.points.length - 1; k++) {
              for (let j = 0; j < this.entrusted.points.length - 1 - k; j++) {
                  if (this.entrusted.points[j].x > this.entrusted.points[j + 1].x) {
                      let count = this.entrusted.points[j];
                      // 反复交换
                      this.entrusted.points[j] = this.entrusted.points[j + 1];
                      this.entrusted.points[j + 1] = count;
                  }
              }
          }
          */

        if (!this.mood) {
            toastLog("无法获取战区区域信息");
            return false
        }
        this.mood.sort((obj1, obj2) => obj1.left - obj2.left)

        log("排序数据:" + JSON.stringify(this.mood));

        //遍历点击三个区域的坐标点
        for (let i of this.mood) {

            click(i.x + i.w / 2, i.y + i.h / 2);
            sleep(1000);

            if (ITimg.ocr("自动作战", {
                    action: 1,
                    timing: 1000,
                    area: "下半屏",
                }) || ITimg.ocr("自动作战", {
                    action: 1,
                    timing: 1000,
                    area: "下半屏",
                    part: true,
                    refresh: false,
                })) {
                sleep(1000)
                click(height / 2, width - frcy(80));
                sleep(300);
                click(height / 2, width - frcy(80));
                sleep(1000);
            } else {
                if (!ITimg.ocr("进入区域", {
                        action: 1,
                        timing: 2000,
                        area: "下半屏",
                        refresh: false
                    }) && !ITimg.ocr("进入区域", {
                        action: 1,
                        timing: 2000,
                        area: "下半屏",
                        part: true,
                        refresh: false,
                        log_policy: true,
                    })) {
                    continue;
                }

                (ITimg.ocr("队伍", {
                    action: 1,
                    timing: 2000,
                    area: 2,
                }) || ITimg.ocr("预设", {
                    action: 1,
                    timing: 2000,
                    area: "右半屏",
                    refresh: false,
                }));
    while(true){
                (ITimg.ocr("选择", {
                    action: 1,
                    timing: 1000,
                    area: 3,
                }) || ITimg.ocr("选择", {
                    action: 1,
                    timing: 1000,
                    part: true,
                    area: 34,
                }) || ITimg.ocr("选择", {
                    action: 1,
                    timing: 1000,
                    part: true,
                    refresh: false,
                }))
                if (ITimg.ocr("作战开始", {
                        action: 1,
                        timing: 6000,
                        nods: 500,
                        area: 4,
                    }) ||ITimg.ocr("作战开始", {
                        action: 1,
                        timing: 6000,
                        area: "右半屏",
                        part: true,
                        refresh: false,
                        log_policy:true,
                    })) {
                    break;
                }
    }
                //在新线程中运行作战方案,解决冲突
                fight_thread = threads.start(作战);
                sleep(5000)
                while (true) {
                    if (ITimg.ocr("退出战斗", {
                            area: 4,
                        }) || ITimg.ocr("重新开始", {
                            nods: 1500,
                            area: 4,
                            refresh: false,
                        })) {
                        fight_thread = false;
                        // if (i >= 2) {
                        helper.纷争战区.openDays = openDays;
                        helper.纷争战区.lastExecutionOpenDays = openDays
                        helper.纷争战区.lastExecutionTime = now.toString();
                        tool.writeJSON("纷争战区", helper.纷争战区);
                        tool.writeJSON("周常任务", true);
                        // }
                        sleep(3000);
                        ITimg.ocr("退出战斗", {
                            action: 1,
                            timing: 1000,
                            refresh: false
                        })
                        let staging = ITimg.ocr("返回", {
                            area: 1,
                            action: 5,
                        });
                        if (staging) {
                            click(staging.left, staging.bottom);
                            坐标配置("返回", staging.left, staging.bottom)
                            sleep(2000)
                        } else if (coordinate.coordinate.返回) {
                            click(coordinate.coordinate.返回.x, coordinate.coordinate.返回.y);
                            sleep(2000);
                        };

                        break;
                    }
                }


            }
        }


    }

    tool.writeJSON("纷争战区", {
        "自动": helper.纷争战区.自动,
        "周期": helper.纷争战区.周期 ? helper.纷争战区.周期 : 1,
        "状态": helper.纷争战区.状态 ? helper.纷争战区.状态 : false,
        "战斗期": helper.纷争战区.战斗期
    });
    sleep(1000);
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
    };


}

function 作战() {
    tool.Floating_emit("展示文本", "状态", "状态：战斗中..");

    // fight_thread = true;
    while (fight_thread) {

        /**思路:
         * 随机数为9,10时释放信号球,
         * 随机数为1-8时点击攻击键
         * */
        let ran_ = random(1, 10)
        switch (ran_) {
            case 9:
            case 10:
                //从右到左,随机释放1-8个球
                ran_ = random(1, 8)
                switch (ran_) {

                    case 1:
                        coordinate.combat.x = coordinate.combat.信号球1.x;
                        coordinate.combat.y = coordinate.combat.信号球1.y;
                        break;
                    case 2:
                        coordinate.combat.x = coordinate.combat.信号球2.x;
                        coordinate.combat.y = coordinate.combat.信号球2.y;
                        break;
                    default:
                        coordinate.combat.x = coordinate.combat.信号球1.x - (coordinate.combat.信号球1.x - coordinate.combat.信号球2.x) * (ran_ - 1);
                        console.warn(coordinate.combat.x)
                        coordinate.combat.y = coordinate.combat.信号球1.y;
                        break;
                }
                log("点击  信号球" + ran_);
                click(Math.floor(coordinate.combat.x), Math.floor(coordinate.combat.y));
                sleep(100);
                break
            default:
                click(coordinate.combat.攻击键.x, coordinate.combat.攻击键.y)
                log("点击  攻击键")
                sleep(50)
                break
        }

    }
}

function 领取任务奖励(value) {
    helper = tool.readJSON("helper");
    if (!helper.任务奖励) {
        return
    }
    tool.Floating_emit("展示文本", "状态", "状态：领取任务奖励")
    if (!ITimg.ocr("任务", {
            area: "右半屏",
        }) && !ITimg.ocr("战斗", {
            area: "右半屏",
            refresh: false,
        })) {
        返回主页()
    }
    if (!ITimg.ocr("任务", {
            action: 1,
            timing: 2000,
            area: "右半屏",
        })) {
        toastLog("无法识别到任务");
        return
    }
    ITimg.ocr("每日", {
        action: 1,
        timing: 1500,
        area: 12,
    })
    if (ITimg.ocr("一键领取", {
            action: 0,
            timing: 2000,
            area: "上半屏",
            refresh: false,
        })) {
        while (true) {
            if (ITimg.picture("获得奖励", {
                    action: 0,
                    timing: 1000,
                    nods: 1000,
                    area: "上半屏"
                }) || ITimg.ocr("获得奖励", {
                    action: 0,
                    timing: 1000,
                    area: 12,
                })) {
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
        //领取100活跃度奖励
        let active = ITimg.ocr("/100", {
            action: 5,
            area: "左半屏",
            part: true,
        })
        if (!active) {
            sleep(1000);
            click(height / 2, width - frcy(80));
            sleep(1000);
            active = ITimg.ocr("/100", {
                action: 5,
                part: true,
            })
        }
        let active2 = ITimg.ocr("105", {
            action: 5,
            part: true,
            refresh: false,
        })
        if (active2) {
            active2 = ITimg.ocr("95", {
                action: 5,
                part: true,
                refresh: false,
            })
        }
        if (active || active2) {
            active = active ? active.text : active2.text;
            if (active.indexOf("/") == 2 || active.toString().length <= 3) {
                active = Math.floor(active[0] + active[1]);
            } else {
                active = Math.floor(active[0] + active[1] + active[2]);
            }
            if (active >= 100) {
                //获取点击100活跃度位置
                active = ITimg.ocr("100", {
                    action: 5,
                    area: "右下半屏",
                })
                if (active) {
                    click(active.left, active.top - 100);
                    click(active.left, active.top - 70);
                    sleep(5000);
                    click(height / 2, width - frcy(80))
                    sleep(500);

                } else {

                    toastLog("无法获取100活跃度奖励坐标点位置\n点击固定坐标");
                    click(frcx(2040), frcy(960));
                    sleep(5000);
                    click(height / 2, width - frcy(80))
                    sleep(500);
                }
            } else if (active.toString() == "NaN") {

                toastLog("无法获取活跃度数值");
                //直接点击100活跃度奖励
                click(frcx(2040), frcy(960));
                sleep(5000);
                click(height / 2, width - frcy(80))
                sleep(500);
            } else {
                toastLog("今日任务活跃度:" + active)
            }
        } else {
            toastLog("无法获取活跃度数值");
            click(frcx(2040), frcy(960));
            sleep(5000);
            click(height / 2, width - frcy(80))
            sleep(500);
        }

        if (helper.周常任务) {
            ITimg.ocr("每周", {
                action: 1,
                timing: 1500,
                area: "左半屏",
            });
            if (ITimg.ocr("一键领取", {
                    action: 0,
                    timing: 1000,
                    area: "上半屏",
                })) {
                while (true) {
                    if (ITimg.picture("获得奖励", {
                            action: 0,
                            timing: 1000,
                            area: "上半屏"
                        }) || ITimg.ocr("获得奖励", {
                            action: 0,
                            timing: 1000,
                            area: 12,
                        })) {
                        break
                    }
                }
            }
            tool.writeJSON("周常任务", false);

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
        let staging = ITimg.ocr("BP", {
            area: 1,
            action: 5,
            similar: 0.90,
        });
        if (staging) {
            坐标配置("手册图标位置", staging.left, staging.bottom)
        }
    }

    click(coordinate.coordinate.手册图标位置.x, coordinate.coordinate.手册图标位置.y);
    sleep(1500);
    ITimg.ocr("确定", {
        action: 0,
        timing: 1000,
        area: "右半屏",
    })
    if (ITimg.ocr("评定任务", {
            action: 1,
            timing: 500,
            area: 34,
        })) {
        ITimg.ocr("一键领取", {
            action: 1,
            timing: 1500,
            area: 34,
            refresh: false,
        });
        click(height / 2, width - frcy(80));
        sleep(1000);
    }
    if (ITimg.ocr("战略补给", {
            action: 1,
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
                area: "上半屏",
                part: true,
            });
            if (!serum) {
                serum = ITimg.ocr("/240", {
                    action: 5,
                    area: "右半屏",
                    part: true,
                });
            }
            if (!serum) {
                serum = ITimg.ocr("/240", {
                    action: 5,
                    part: true,
                });
            }
            if (serum) {
                serum = Math.floor(serum.text.split("/")[0]);
                console.warn(serum)
                if (serum.toString() == "NaN") {
                    let text = "无法识别血清数量";
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
                    tool.writeJSON("血清数", serum + "/240", "notes")
                    tool.writeJSON("血清时间", new Date(), "notes")
                }
                tool.Floating_emit("展示文本", "状态", "状态：血清识别完成");
                return true
            }

        }


    }

}



//--------------------------------------------------------