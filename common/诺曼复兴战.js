module.exports = function 诺曼复兴战() {
    if (!helper.norman_revival_war || !helper.norman_revival_war.启用) {
        return
    }

    tool.Floating_emit("面板", "id", "诺曼复兴");
    tool.Floating_emit("展示文本", "状态", "状态：准备扫荡诺曼复兴战中");
    if (ITimg.ocr("任务", {
            area: "右半屏",
        }) == false && ITimg.ocr("战斗", {
            area: "右半屏",
            refresh: false,
        }) == false) {
        返回主页()
    }
    tool.Floating_emit("展示文本", "状态", "状态：进入诺曼复兴战中");

    while (true) {
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
            click.apply(click, axis_list.homepage_battle);
            sleep(3000)
        }
        if (ITimg.ocr("挑战", {
                action: 4,
                timing: 2000,
                similar: 0.85,
                area: 4,
            }) || ITimg.ocr("挑战", {
                action: 4,
                timing: 2000,
                similar: 0.8,
                area: 34,
            })) {
            break
        }
    }
    while (true) {
        ITimg.ocr("挑战", {
            action: 4,
            timing: 2000,
            similar: 0.8,
            area: 34,
        })
        if (ITimg.ocr("/18", {
                area: 34,
                action: 5,
                part: true,
                saveSmallImg: false,
            }) || ITimg.ocr("常规挑战", {
                action: 5,
                similar: 0.8,
                refresh: false,
            }) || ITimg.ocr("特殊挑战", {
                action: 5,
                refresh: false,
                similar: 0.8,
            }) || ITimg.ocr("纷争战区", {
                action: 5,
                refresh: false,
                similar: 0.8,
            })) {
            break;
        }

    }
    //检验
    let operator = ITimg.ocr("/18", {
        area: 34,
        action: 5,
        part: true,
        nods: 1000,
        saveSmallImg: false,
    }) || ITimg.ocr("/18", {
        area: 34,
        action: 5,
        part: true,
        saveSmallImg: false,
        nods: 1000,
    }) || ITimg.ocr("/18", {
        action: 5,
        part: true,
        saveSmallImg: false,
    })

    if (operator) {
        // 使用正则表达式提取数字
        let match = operator.text.match(/(\d+)\/(\d+)/);
        let obtained = parseInt(match[1]);
        let target = parseInt(match[2]);

        // 计算还需多少次作战可达12/18
        settlement_frequency = Math.ceil((target - obtained) / 3);
        if (!settlement_frequency) {
            settlement_frequency = 0;
        } else {
            settlement_frequency = settlement_frequency - 2;
        }
        toastLog('进度： ' + obtained + '/18，还可扫荡：' + settlement_frequency + "次");
        if (settlement_frequency <= 0) {
            返回主页();
            return false;
        }
        click(operator.left, operator.top);
        sleep(1500);

    } else {
        toastLog("无法确认诺曼复兴战进度");
        return false;
    }
    while (true) {
        if (ITimg.ocr("商店", {
                action: 5,
                area: 3,
            }) && ITimg.ocr("奖励", {
                action: 5,
                refresh: false,
                log_policy: "简短",
                nods: 1000,
            })) {
            break
        } else {
            click(operator.left, operator.top);
            sleep(1000);
        }
    }
    tool.Floating_emit("面板", "隐藏");
    sleep(800);
    let _settlement_frequency = settlement_frequency;
    while (settlement_frequency) {
        if (settlement_frequency == 1&&_settlement_frequency >= 3) {
            swipe(height / 2, width / 2, height / 4, width / 2, 1000);
            sleep(500);
        }
        while (true) {
            (ITimg.ocr("进度：0/3", {
                action: 4,
                timing: 1000,
                similar: 0.85,
                saveSmallImg: "进度0-3",
            }) || ITimg.ocr("进度:0/3", {
                action: 4,
                timing: 1000,
                similar: 0.85,
                refresh: false,
                nods: 500,
                saveSmallImg: "进度0-3",
            }) || ITimg.ocr("0/3", {
                action: 4,
                timing: 1000,
                similar: 0.85,
                saveSmallImg: "进度0-3",
            }));

            (ITimg.ocr("直达深巢", {
                action: 4,
                area: 4,
                timing: 1000,
            }) || ITimg.ocr("直达深巢", {
                action: 4,
                area: 4,
                timing: 1000,
                part: true,
                refresh: false,
            }))
            if (ITimg.ocr("扫荡作战", {
                    action: 5,
                    area: 4,
                    nods: 1000,
                })) {
                break
            }
        }
        let _max = 3;
        let _number = 3;
        while (_max) {
            if (!ITimg.ocr("扫荡作战", {
                    action: 4,
                    area: 4,
                    timing: 1000,
                })) {
                _max--;
            }else{
                _number--;
                if(!_number){
                    break
                }
            }
            let return_text = ITimg.ocr("返回", {
                action: 5,
                area: 4,
                refresh: false,
                log_policy: "简短",
                timing: 1000,
                nods: 1000,
                threshold: 0.85,
            });
            if (return_text) {
                click(return_text.right, return_text.bottom);
                sleep(500);
                click(return_text.right, return_text.bottom);
                break;

            }
        }
        if(!_max){
            //双击返回键离开作战准备;
            返回主页(true);
            sleep(200);
            返回主页(true);
            sleep(150)
        }else  {

            while (true) {
                ITimg.ocr("返回", {
                    action: 4,
                    area: 1,
                    timing: 1000,
                    nods: 1000,
                });
                if (ITimg.ocr("商店", {
                        action: 5,
                        area: 3,
                    }) && ITimg.ocr("奖励", {
                        action: 5,
                        area: 3,
                        refresh: false,
                        log_policy: "简短",
                    })) {
                    settlement_frequency--;
                    break
                }
            }
        }
    }
    tool.Floating_emit("面板", "展开");
    if (helper.norman_revival_war.领取奖励) {
        tool.Floating_emit("展示文本", "状态", "状态：领取诺曼复兴战奖励");
        while (true) {
            ITimg.ocr("奖励", {
                action: 1,
                area: 3,
                timing: 1000,
                nods: 1000,
            })
            ITimg.ocr("一键领取", {
                action: 1,
                area: 2,
                timing: 1000,
            })


            if (检查获得奖励()) {
                break;
            }
        }
    }
}