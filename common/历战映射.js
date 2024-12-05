module.exports = function 历战映射(change) {
    this.change = change;
    if (!helper.历战映射.启用) {
        return
    }

    // 获取当前时间
    tool.Floating_emit("面板", "id", "历战算符");
    tool.Floating_emit("展示文本", "状态", "状态：准备刷取历战算符中")
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
        click.apply(click, axis_list.homepage_battle);
        sleep(3000)
    }
    (ITimg.ocr("挑战", {
        action: 4,
        timing: 2000,
        similar: 0.85,
        area: 4,
    }) || ITimg.ocr("挑战", {
        action: 4,
        timing: 2000,
        similar: 0.8,
        area: 34,
    }));

    //检验算符
    let operator = ITimg.ocr("/1500", {
        area: 34,
        action: 5,
        saveSmallImg: false,
        part: true,
    })
    let settlement_frequency = 10;
    if (operator) {
        // 使用正则表达式提取数字
        let match = operator.text.match(/(\d+)\/(\d+)/);
        let obtained = parseInt(match[1]);
        let target = parseInt(match[2]);

        // 计算还需多少次任务可获得满 1500 个物品
        settlement_frequency = Math.ceil((target - obtained) / 150);

        toastLog('已获得 ' + obtained + '个算符，还需 ' + settlement_frequency + '次任务可获得满 ' + target + ' 个算法。');
        if (obtained == target) {
            返回主页();
            return false;
        }
        click(operator.left, operator.top);
        sleep(1500);

    } else {
        let tips = "无法获取已获得算符，请检查/1500相关识别结果";
        toast(tips);
        console.warn(tips);
        operator = (ITimg.ocr("历战映射", {
            action: 5,
            timing: 1000,
            area: 34,
            refresh: false,
        }) || ITimg.ocr("创生算符", {
            action: 5,
            timing: 1000,
            refresh: false,
            part: true,
        }))
    }
    while (true) {
        if (!ITimg.ocr("前往作战", {
                action: 1,
                timing: 2000,
                area: 4,
            }) && !ITimg.ocr("前往作战", {
                action: 1,
                timing: 2000,
                area: 34,
            })) {

            click(operator.left, operator.top);
            sleep(1500);
        }
        if (ITimg.ocr("情报解析", {
                action: 5,
                area: 12,
            }) || ITimg.ocr("环境情报", {
                action: 5,
                area: 12,
                log_policy: "简短",
            })) {
            click(height / 2, frcy(80));
            sleep(500);
            break
        }
        if (ITimg.ocr("开始挑战", {
                action: 5,
                area: 4,
                part: true,
            }) || ITimg.ocr("/14", {
                action: 5,
                nods: 1500,
                part: true,
                refresh: false,
                log_policy: "简短",
            })) {
            break
        }
    }
    while (settlement_frequency) {
        if (!ITimg.ocr("开始挑战", {
                action: 5,
                area: 4,
                similar: 0.70,
            }) && !ITimg.ocr("/14", {
                action: 5,
                nods: 1500,
                area: 4,
                part: true,
                refresh: false,
                log_policy: "简短",

            })) {

            continue;
        }
        if (ITimg.ocr("请先进行成员整备", {
                action: 1,
                refresh: false,
                timing: 1000,
                part: true,
            }) || ITimg.ocr("请先进行", {
                action: 1,
                refresh: false,
                timing: 1000,
                part: true,
                log_policy: "简短",
            }) || ITimg.ocr("成员整备", {
                action: 1,
                refresh: false,
                timing: 1000,
                part: true,
                log_policy: true,
            })) {


            while (true) {
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
                        nods: 500,
                        timing: 1000,
                        area: 4,
                    })) {
                    break
                }

            }
        }
        while (true) {
            if (ITimg.ocr("5/14", {
                    action: 5,
                    refresh: false,
                })) {
                if (ITimg.ocr("结算", {
                        action: 1,
                        area: 2,
                        timing: 500,
                    })) {
                    if (ITimg.ocr("确定", {
                            action: 1,
                            timing: 1000,
                            area: 4,
                        })) {

                        settlement_frequency--;
                        tool.Floating_emit("展示文本", "挑战", "算符：已获得数量" + (10 - settlement_frequency * 150));

                    }
                    (ITimg.ocr("继续", {
                        action: 1,
                        timing: 1000,
                        area: 4,
                        nods: 1500,
                    }) || ITimg.ocr("继续", {
                        action: 1,
                        timing: 1000,
                        nods: 3000,
                        area: 4,
                    }) || ITimg.ocr("继续", {
                        action: 1,
                        timing: 1000,
                        area: 4,
                    }))
                }


            }

            if (ITimg.ocr("开始挑战", {
                    action: 1,
                    timing: 1500,
                    area: 4,
                    refresh: false,
                }) || ITimg.ocr("开始挑战", {
                    action: 1,
                    timing: 1500,
                    area: 34,
                })) {

                if (ITimg.ocr("确定", {
                        action: 1,
                        timing: 4000,
                        area: 4,
                    })) {
                    click(height / 2, width - frcy(80));
                    break
                }
                ITimg.ocr("保存", {
                    action: 1,
                    timing: 1500,
                    refresh: false,
                    nods: 1500,
                });
                click(height / 2, width - frcy(80));

                break
            }

        }
        //在新线程中运行作战方案,解决冲突
        fight_thread = threads.start(作战);
        this.change(fight_thread);
        tool.pointerPositionDisplay(true);
        sleep(5000);
        while (true) {
            if (fight_thread && !fight_thread.isAlive()) {
                toastLog("重启作战线程");
                fight_thread = threads.start(作战);
            };
            if (!ITimg.ocr("主页面", {
                    action: 5,
                    area: 1,
                }) && ITimg.ocr("返回", {
                    area: 1,
                    action: 1,
                    timing: 1200,
                    refresh: false,
                    nods: 2500,
                })) {
                fight_thread && fight_thread.isAlive() && fight_thread.interrupt();
                    fight_thread = false;
                    this.change(fight_thread);
                if (ITimg.ocr("确定", {
                        action: 1,
                        timing: 3000,
                        area: 4,
                    })) {
                    break;
                }

            }
        }
        tool.pointerPositionDisplay(false);
    }

    返回主页(true);
    if (ITimg.ocr("奖励", {
            action: 1,
            area: 3,
            timing: 1000,
        }) || ITimg.ocr("1500", {
            action: 1,
            timing: 1000,
            refresh: false,

        })) {
        if (ITimg.ocr("一键领取", {
                action: 0,
                timing: 2000,
                area: 4,
                nods: 1500,
            }) || ITimg.ocr("一键领取", {
                action: 0,
                timing: 2000,
                area: 4,
            })) {
            while (true) {
                if (检查获得奖励()) {
                    click(height / 2, width - frcy(80));
                    sleep(1000);
                    break
                }
            }

        }
    }

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