
module.exports = function 幻痛囚笼(change) {
    this.change = change;
    console.info("---幻痛囚笼---");
    if (!helper.phantom_pain_cage || !helper.phantom_pain_cage.启用) {
        return
    }

    // 获取当前时间
    let today = new Date();
    let dayOfWeek = today.getDay(); // 获取当前日期的星期几
    if (helper.phantom_pain_cage.周六日不执行 && (dayOfWeek == 6 || dayOfWeek == 0)) {
        return
    }
    tool.Floating_emit("面板", "id", "幻痛囚笼");
    tool.Floating_emit("展示文本", "状态", "状态：准备处理幻痛囚笼中")
    if (ITimg.ocr("任务", {
            area: "右半屏",
        }) == false && ITimg.ocr("战斗", {
            area: "右半屏",
            refresh: false,
        }) == false) {
        返回主页()
    }
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

        if (ITimg.ocr("常规挑战", {
                area: 34,
                action: 5,
                similar: 0.8,
            }) || ITimg.ocr("特殊挑战", {
                action: 5,
                refresh: false,
                similar: 0.8,
            }) || ITimg.ocr("幻痛囚笼", {
                action: 5,
                area: 34,
                refresh: false,
                similar: 0.8,
            })) {
            break;
        }

    }
    //检验
    let operator = ITimg.ocr("/9", {
        area: 34,
        action: 5,
        part: true,
        nods: 1000,
        saveSmallImg: false,
    }) || ITimg.ocr("/9", {
        area: 34,
        action: 5,
        part: true,
        log_policy: "简短",
        saveSmallImg: false,
    }) || ITimg.ocr("/9", {
        area: 4,
        action: 5,
        part: true,
        saveSmallImg: false,
    })

    if (operator) {
        // 使用正则表达式提取数字
        let match = operator.text.match(/(\d+)\/(\d+)/);
        let obtained = parseInt(match[1]);
        let target = parseInt(match[2]);

        // 计算还需多少次作战可达/9
        settlement_frequency = Math.ceil((target - obtained) / 3);

        toastLog('幻痛进度： ' + obtained + '/9');
        if (!settlement_frequency) {
            返回主页();
            return false;
        }
        click(operator.left, operator.top);
        sleep(1500);
    }

    /* sleep(100);
     ITimg.ocr("幻痛囚笼", {
         action: 1,
         refresh: false,
         similar: 0.8,
         timing: 1000,
     })
     */
    tool.Floating_emit("展示文本", "状态", "状态：准备讨伐囚笼boos");
    while (true) {
        ITimg.ocr("幻痛囚笼", {
            area: 34,
            action: 1,
            similar: 0.8,
            timing: 1000,
        })
        let difficulty;
        if (helper.phantom_pain_cage.终极区) {
            difficulty = ITimg.ocr("终极区", {
                action: 5,
                area: 12,
            })
        } else {
            difficulty = ITimg.ocr("高级区", {
                action: 5,
                area: 12,
            })
        }
        if (difficulty) {
            click(difficulty.left, difficulty.bottom + frcy(100));
            sleep(1000);
        }
        ITimg.ocr("确定", {
            action: 1,
            area: 4,
            timing: 1000,
        })

        if (ITimg.ocr("商店", {
                action: 5,
                area: 3,
            }) || ITimg.ocr("讨伐", {
                action: 5,
                refresh: false,
            })) {
            break
        }
    }
    tool.Floating_emit("展示文本", "状态", "状态：进入囚笼讨伐boss");
    sleep(1000)
    let conquest_list = ITimg.ocr("集合", {
        action: 6,
        area: [height / 4, width / 4, height - height / 4, width / 2],

    })
    if (!conquest_list || !conquest_list.length) {
        toastLog("无可讨伐列表");
        return false;
    }
    console.warn("讨伐列表:", conquest_list);
    frequency = 0;
    for (let conquest of conquest_list) {
        if (conquest.text.indexOf("讨伐值") != -1) {
            match = false;
            for (let conquest_number of conquest_list) {
                match = conquest_number.text.match(/(\d+)/);
                if (!match) {
                    continue;
                }
                match = conquest_number;
                match.text = conquest_number.text.match(/(\d+)/)[0];
                console.warn(match)
                if (match && Math.abs(match.left - conquest.left) <= frcx(150) && match.text >= 200000) {
                    break
                } else {
                    match = false;
                }
            }
            if (match) {
                continue;
            }

            while (true) {
                frequency++
                if (frequency > 3) {
                    log("无法进入讨伐boss界面");
                    break
                }
                click(conquest.left, conquest.top - frcy(80));
                sleep(1000);
                if (ITimg.ocr("作战准备", {
                        action: 5,
                        area: 34,
                        nods: 1000,
                    }) || ITimg.ocr("难度提示", {
                        action: 5,
                        area: 34,
                        refresh: false,
                    })) {
                    conquest.confirm = true;
                    if (conquest.left < height / 2) {
                        helper.phantom_pain_cage.A组 = true;
                    } else if (conquest.left < parseInt(height / 1.5)) {
                        helper.phantom_pain_cage.B组 = true;
                    } else {
                        helper.phantom_pain_cage.Y组 = true;
                    }
                    break
                }
            }
            if (conquest.confirm) {
                break;
            }
        }

    }
    tool.Floating_emit("展示文本", "状态", "状态：检验囚笼挑战次数，buff信息");
    //杠符号会让程序导致0是文件夹
    if (ITimg.ocr("0/3", {
            action: 5,
            area: 3,
            refresh: false,
            //文件名不能带特殊符号
            saveSmallImg: "0-3",
            threshold: 0.9,
        })) {
        toastLog("今日已无挑战次数");
        return false
    }

    sleep(500);
    conquest_list = ITimg.ocr("集合", {
        action: 6,
        area: 4,
    });

    console.warn("buff检测");
    console.warn("buff信息", conquest_list);
    let buff;
    for (let key in buff_list) {
        for (let key_text of buff_list[key]) {
            buff = ITimg.ocr(key_text, {
                area: 4,
                action: 5,
                gather: conquest_list,
                similar: 0.8,
                log_policy: "简短",
            })
            if (buff) {
                buff = key;
                break
            }
        }
        if (buff) {
            break;
        }
    }

    let combat_frequency = 3;
    while (combat_frequency) {
        let campaign_value = ITimg.ocr("讨伐值", {
            action: 5,
            area: 2,

        })
        if (campaign_value) {
            campaign_value = ITimg.ocr("集合", {
                action: 6,
                area: [campaign_value.left, campaign_value.bottom, (campaign_value.right - campaign_value.left) * 2, (campaign_value.bottom - campaign_value.top) * 2],

            });
            if (campaign_value) {
                let campaign_value_list = [];
                campaign_value.sort((a, b) => a.left - b.left);
                for (let campaign of campaign_value) {
                    let value = campaign.text.match(/(\d+)\/(\d+)/)
                    if (value) {
                        campaign_value_list.push(value[1]);
                        campaign_value_list.push(value[2]);
                    } else if (campaign.text.match(/(\d+)/)) {
                        campaign_value_list.push(campaign.text.match(/(\d+)/)[0][0]);

                    }
                }
                if (campaign_value_list[0] >= 30000 && campaign_value_list[1]) {

                    let tips = "已经讨伐过了，讨伐值：" + campaign_value_list[0] + "，上限：" + campaign_value_list[1];
                    tool.Floating_emit("展示文本", "状态", "状态：已经讨伐过了");
                    console.error(tips);
                    combat_frequency--;
                    if (combat_frequency == 2) {

                        (!ITimg.ocr("混沌", {
                            action: 1,
                            area: [0, 0, parseInt(height / 4), width],
                            timing: 1000,
                            nods: 1000,
                        }) && ITimg.ocr("混沌", {
                            action: 1,
                            area: [0, 0, parseInt(height / 4), width],
                            timing: 1000,
                        }))
                    } else if (combat_frequency == 1) {
                        (!ITimg.ocr("地狱", {
                            action: 1,
                            area: [0, 0, parseInt(height / 4), width],
                            timing: 1000,
                            nods: 1000,
                        }) && ITimg.ocr("地狱", {
                            action: 1,
                            area: [0, 0, parseInt(height / 4), width],
                            timing: 1000,
                        }))
                    }

                    continue;

                }
            }
        }
        tool.Floating_emit("展示文本", "状态", "状态：开始囚笼自动战斗");
        if (!ITimg.ocr("自动作战", {
                action: 4,
                area: 4,
                refresh: false,
                timing: 500,
            }) || ITimg.ocr("无记录保存", {
                area: 5,
                action: 5,
            })) {
            while (true) {
                ITimg.ocr("作战准备", {
                    action: 1,
                    area: 4,
                    similar: 0.8,
                    timing: 1000,
                })
                if (ITimg.ocr("作战开始", {
                        action: 5,
                        area: 4,
                        refresh: false,
                    }) || ITimg.ocr("黄色", {
                        action: 5,
                        area: 4,
                        refresh: false
                    })) {
                    break;
                } else if (ITimg.ocr("挑战次数不足", {
                        action: 5,
                        area: 5,
                    })) {
                    combat_frequency = 0;
                    break
                }


            }
            if (!combat_frequency) {
                tips = "检测到已无挑战次数";
                toast(tips)
                console.warn(tips);
                tool.Floating_emit("展示文本", "状态", "状态：" + tips);
                break;
            }

            // if(helper.phantom_pain_cage.自适应队伍){
            if (!buff) {
                buff = "默认";
            }
            let ranks, frequency = 0;
            toastLog("属性队伍:" + buff)

            tool.Floating_emit("展示文本", "状态", "状态：优选预设队伍");
            while (true) {
                tool.Floating_emit("面板", "隐藏");
                sleep(500);

                if (ITimg.ocr("队伍", {
                        action: 1,
                        area: 2,
                        timing: 1500,
                    }) || ITimg.ocr("预设", {
                        action: 1,
                        area: 2,
                        timing: 1500,
                    })) {
                    if (frequency == 0 && helper.phantom_pain_cage.老队伍) {
                        滑动手势.apply(滑动手势, axis_list.recruit_slide_left);
                        sleep(100);
                        滑动手势.apply(滑动手势, axis_list.recruit_slide_left);
                        sleep(100);
                        滑动手势.apply(滑动手势, axis_list.recruit_slide_left);
                        sleep(100);


                    }
                }

                if (frequency > 3 && buff != "默认" && !helper.phantom_pain_cage.老队伍) {
                    buff = "默认";
                    frequency = 0;
                    log("回滚界面，选择默认队伍")
                    swipe.apply(swipe, axis_list.recruit_slide_right);
                    sleep(500);
                    滑动手势.apply(滑动手势, axis_list.recruit_slide_right, 500);

                }
                sleep(1500);
                ranks = ITimg.ocr(buff, {
                    action: 5,
                    area: 12,
                    threshold: 0.9,
                });

                if (ranks) {
                    tool.Floating_emit("面板", "展开");
                    ranks = ITimg.ocr("集合_选择", {
                        action: 6,
                        saveSmallImg: false,
                        area: [ranks.left, parseInt(width / 1.5), parseInt(height / 4), width - parseInt(width / 1.5)],
                    });
                    if (ranks && ranks.length) {
                        ranks.sort((a, b) => a.left - b.left);
                        if (ITimg.ocr("选择", {
                                action: 1,
                                similar: 0.70,
                                gather: ranks,
                                saveSmallImg: false,
                                timing: 500,
                            }) && ITimg.ocr("选择", {
                                action: 1,
                                similar: 0.70,
                                gather: ranks,
                                saveSmallImg: false,
                                timing: 1000,
                            })) {
                            break;
                        }
                    }
                }
                if (!helper.phantom_pain_cage.老队伍) {

                    滑动手势.apply(滑动手势, axis_list.recruit_slide_left);
                    sleep(1000);
                } else {
                    //减少老队伍循环次数
                    frequency++;
                    滑动手势.apply(滑动手势, [height / 2, width / 2, (height / 2 + parseInt(height / 6)), width / 2]);
                    sleep(1000)
                }
                if (frequency > 4) {
                    console.warn("无可选属性队伍，随机选择队伍1~2");
                    if (!helper.phantom_pain_cage.老队伍) {
                        log("滑动");
                        swipe.apply(swipe, axis_list.recruit_slide_right);
                        sleep(500);
                        swipe.apply(swipe, axis_list.recruit_slide_right);

                        if (ITimg.ocr("选择", {
                                area: 34,
                                action: 1,
                                timing: 500,
                            }) || ITimg.ocr("选择", {
                                action: 1,
                                timing: 1000,
                                refresh: false,
                            })) {
                            break;
                        }
                    } else {
                        ranks = ITimg.ocr("集合_选择", {
                            action: 6,
                            area: 34,
                        });
                        if (ranks && ranks.length) {
                            ranks.sort((a, b) => b.left - a.left);
                            if (ITimg.ocr("选择", {
                                    action: 1,
                                    similar: 0.70,
                                    gather: ranks,
                                    timing: 500,
                                }) && ITimg.ocr("选择", {
                                    action: 1,
                                    similar: 0.70,
                                    gather: ranks,
                                    timing: 1000,
                                })) {
                                break;
                            }
                        }
                    }

                }
                frequency++;
            }
            ITimg.ocr("确定", {
                action: 1,
                timing: 1000,
                area: [height / 2, width / 2, height - parseInt(height / 1.3), width / 2],
            });
            tool.Floating_emit("展示文本", "状态", "状态：队伍出击")
            ITimg.ocr("作战开始", {
                action: 1,
                area: 4,
                timing: 1000,
            })
            ITimg.ocr("作战开始", {
                action: 1,
                area: 4,
                timing: 1000,
            })
            sleep(6000);

            //在新线程中运行作战方案,解决冲突
            tool.pointerPositionDisplay(true);
            fight_thread = threads.start(作战);
            this.change(fight_thread);
            sleep(5000);
            while (true) {
                if (fight_thread && !fight_thread.isAlive()) {
                    toastLog("重启作战线程");
                    fight_thread = threads.start(作战);
                    this.change(fight_thread);
                }
                staging = ITimg.ocr("保存分数", {
                    area: 4,
                    action: 6,
                });
                if (ITimg.ocr("保存分数", {
                        area: 4,
                        action: 5,
                        gather: staging,
                    }) || ITimg.ocr("取消保存", {
                        nods: 1500,
                        area: 4,
                        refresh: false,
                        log_policy: "简短",
                        gather: staging,
                    }) || ITimg.ocr("作战准备", {
                        nods: 1500,
                        area: 4,
                        refresh: false,
                        log_policy: "简短",
                        gather: staging,
                    })) {
                    fight_thread && fight_thread.isAlive() && fight_thread.interrupt();

                    fight_thread = false;
                    this.change(fight_thread);
                    // if (i >= 2) {
                    tool.writeJSON("phantom_pain_cage", helper.phantom_pain_cage);
                    tool.writeJSON("周常任务", true);
                    // }

                    sleep(2000);
                    if (ITimg.ocr("保存分数", {
                            action: 1,
                            timing: 1500,
                            refresh: false
                        }) || ITimg.ocr("作战准备", {
                            area: 4,
                            refresh: false,
                            log_policy: "简短",
                            saveSmallImg: false,
                        })) {

                        break;
                    }
                }
            }


            tool.pointerPositionDisplay(false);



            //  }
        }
        combat_frequency--;

    }

    返回主页(true);

    if (!helper.phantom_pain_cage.领取奖励) {
        return false;
    }
    tool.Floating_emit("展示文本", "状态", "状态：领取囚笼奖励");
    staging = ITimg.ocr("下阶段讨伐目标", {
        action: 5,
        area: 13,
    }) || ITimg.ocr("需求：讨伐值", {
        action: 5,
        area: 13,
        part: true,
        refresh: false,
        nods: 1000,
    })
    if (!staging) {

        staging = ITimg.ocr("下阶段讨伐目标", {
            action: 5,
            area: 13,
        }) || ITimg.ocr("需求：讨伐值", {
            action: 5,
            area: 13,
            part: true,
            refresh: false,

        })
    }
    if (!staging) {
        tips = "无法获取奖励入口旁的文本";
        toast(tips);
        console.warn(tips);
        return false;

    }
    staging = [
        [staging.right, staging.top],
        [staging.right, staging.top + frcy(100)]
    ];
    click.apply(click, staging[0]);
    click.apply(click, staging[1]);
    sleep(1500);
    let frequency = [3, 3];
    while (frequency[1]) {
        staging = ITimg.ocr("集合", {
            action: 6,
            area: 24,
        })
        if (!staging || !staging.length) {
            sleep(500);
            continue;
        }
        staging.sort((a, b) => a.top - b.top)
        if (ITimg.ocr("领取", {
                action: 1,
                timing: 1000,
                gather: staging,
            })) {
            if (检查获得奖励()) {
                frequency[0]--;
            } else {
                break;
            }
        }
        if (!frequency[0]) {
            滑动手势.apply(滑动手势, axis_list.reward_slide_top);
            frequency[1]--;
        }
    }
    sleep(500);
    click(height / 2, width - frcy(100));
    sleep(500);

}
