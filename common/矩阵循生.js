    var collection;
    let 矩阵循生 = {

        recruiting_energy: 3,
        give_up_max: 3,
        /*  new ITimg.Prepare({}, {
    gather:collection,
    correction_path: "./utlis/ocr_矫正规则.json"
});
*/
        main: function(change) {
            this.change = change;
            tool.Floating_emit("面板", "id", "矩阵循生");
            tool.Floating_emit("展示文本", "状态", "状态：准备启动中");
            tool.Floating_emit("展示文本", "挑战", "状态：矩阵脚本运行中..");
            this.入口();
            tool.pointerPositionDisplay(true);
            this.eat();

        },
        入口: function() {
            tool.Floating_emit("面板", "id", "矩阵循生");
            tool.Floating_emit("展示文本", "状态", "状态：准备进行矩阵循生");

            sleep(1000);
            if (!coordinate.combat || !coordinate.combat.攻击) {
                进入主页();
                坐标配置("战斗");
            }
            if (!ITimg.ocr("交错扇区", {
                    action: 5,
                    area: 24,
                }) && !ITimg.ocr("未竟卷录", {
                    action: 5,
                    area: 24,
                    refresh: false,
                })) {

                if (!ITimg.ocr("任务", {
                        area: "右半屏",
                    }) && !ITimg.ocr("战斗", {
                        area: "右半屏",
                        refresh: false,
                    })) {
                    进入主页();

                    返回主页()
                }
                tool.Floating_emit("展示文本", "状态", "状态：准备进入矩阵");
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
                            nods: 1000,
                        })) {
                        break;
                    }

                }
                while (true) {
                    ITimg.ocr("多维演绎", {
                        action: 4,
                        timing: 1000,
                        similar: 0.8,
                        area: 3,
                    })
                    if (ITimg.ocr("矩阵循生", {
                            action: 4,
                            timing: 1500,
                            similar: 0.8,
                            area: 4,
                            nods: 1000,
                        })) {
                        break
                    }
                }
                return true;
            }
            toastLog("似乎已在矩阵循生主页");

        },
        eat: function() {
            tool.Floating_emit("展示文本", "状态", "状态：启动矩阵循生");

            while (true) {
                collection = ITimg.ocr("获取屏幕所有文本", {
                    action: 6,
                });
                console.warn("界面文本", collection);
                if (ITimg.ocr("启程", {
                        action: 1,
                        area: 4,
                        timing: 1500,
                        nods: 1500,
                        gather: collection,
                        log_policy: "简短",
                    })) {
                    continue;
                    //  break
                }

                if (ITimg.ocr("下一步", {
                        action: 1,
                        area: 4,
                        timing: 1000,
                        log_policy: "简短",
                        gather: collection,
                    })) {
                    continue;
                }
                staging = ITimg.ocr("开始演算", {
                    area: 4,
                    gather: collection,
                    log_policy: "简短",
                }) && (ITimg.ocr("队长", {
                    area: 3,
                    action: 5,
                    log_policy: "简短",
                    gather: collection,
                }) || ITimg.ocr("队长", {
                    area: 3,
                    action: 5,
                    part: true,
                    log_policy: "简短",
                    gather: collection,
                }));
                if (staging) {
                    click(staging.left, staging.bottom - frcy(150));
                    sleep(1500);
                    continue;
                }
                if (this.迭变投影) {
                    while (true) {
                        click(height / 2, width / 2);
                        sleep(1500);

                        (ITimg.ocr("战斗参数", {
                            action: 1,
                            area: 3,
                            timing: 500,
                        }) || ITimg.ocr("精通等级", {
                            action: 1,
                            area: 3,
                            timing: 500,
                            refresh: false,
                        }));

                        if (ITimg.ocr("编入", {
                                action: 1,
                                area: 4,
                                timing: 1500,
                            })) {
                            break
                        }
                    }
                }
                tool.Floating_emit("面板", "隐藏");

                if (staging = ITimg.ocr("编入", {
                        area: 4,
                        action: 5,
                        gather: collection,
                        log_policy: "简短",
                    })) {
                    click(height / 2, width / 2);
                    sleep(1000);
                    log(this.recruiting_energy)
                    if (this.recruiting_energy == 3) {
                        let recruit_role_list_agg = [
                            ["鸦羽-鳞波沫舞", "鸦羽-终阶"],
                            ["银冕-苍空炽月", "银冕-终阶"]
                        ];
                        recruit_role_list = recruit_role_list_agg[random(0, 1)]
                        for (let recruit_role_i in recruit_role_list) {
                            if (ITimg.matchFeatures(recruit_role_list[recruit_role_i], {
                                    action: 0,
                                    timing: 1000,
                                    area: 13,
                                    threshold: 0.82,
                                    saveSmallImg: true,
                                    visualization: true,
                                })) {
                                break
                            }
                        }

                        click(staging.left, staging.top);
                        sleep(300);
                        click(staging.left, staging.top);
                        sleep(1000);

                        break
                    }

                } else if (ITimg.ocr("迭变投影", {
                        action: 5,
                        area: 12,
                        similar: 0.75,
                        gather: collection,
                        log_policy: "简短",
                    }) || ITimg.ocr("迭变角色特性", {
                        action: 5,
                        area: 34,
                        log_policy: "简短",
                        gather: collection,
                    }) || ITimg.ocr("所需招募能量0", {
                        action: 5,
                        area: 34,
                        log_policy: "简短",
                        gather: collection,
                    })) {
                    click(height / 2, width / 2);
                    sleep(500);
                    if (ITimg.ocr("下一步", {
                            action: 1,
                            area: 4,
                            timing: 1000,
                            log_policy: "简短",
                        })) {
                        this.迭变投影 = true;
                        collection = ITimg.ocr("获取屏幕所有文本", {
                            action: 6,
                            area: 4,
                        });

                    }
                }
            }

            tool.Floating_emit("面板", "展开");
            while (true) {
                collection = ITimg.ocr("获取屏幕所有文本", {
                    action: 6,
                    area: 4,
                });

                if (ITimg.ocr("队伍调整", {
                        action: 5,
                        area: 4,
                        gather: collection,
                        log_policy: "简短",
                    }) && ITimg.ocr("开始演算", {
                        action: 1,
                        area: 4,
                        log_policy: "简短",
                        gather: collection,
                        timing: 1200,
                    })) {
                    click(height / 2, width / 2);
                    sleep(800);
                    break;
                    //  continue;
                }

            }
            tool.Floating_emit("面板", "位置", {
                x: frcx(150),
                y: frcy(250)
            });
            /**
             * 进入ch.1
            贴心搭档
            */
            tool.Floating_emit("展示文本", "状态", "状态：节点处理中");

            while (true) {
                sleep(500);
                click(height / 2, frcy(80));
                sleep(500);
                this.节点();
                if (this.重置()) {
                    this.give_up_max = 3;
                    break
                }
            }
            this.eat();

        },
        节点: function() {
            console.info("---选择节点列表---")
            tool.Floating_emit("展示文本", "状态", "状态：节点选择中");
            let node_list = ITimg.contour({
                canvas: "节点",
                action: 5,
                area: [height / 4, width / 4, height / 1.8, width / 2],
                isdilate: false,
                threshold: 230,
                size: 20,
                type: "BINARY",
                filter_w: frcx(150),
                filter_h: frcy(150),
            });
            if (!node_list || !node_list.length) {
                tips = "无法确认节点";
                console.warn(tips);
                tool.Floating_emit("展示文本", "状态", "状态：" + tips);

                return false;
            }
            node_list.sort((a, b) => b.circularity - a.circularity);
            for (let node of node_list) {
                click(node.x, node.y);
                sleep(500);
                if (ITimg.ocr("确定", {
                        action: 1,
                        area: [node.x, width / 2, node.w, width / 2],
                        timing: 1000,
                    })) {

                    break
                }
            }
            if (this.出击()) {
                if (!this.give_up_max) {
                    return false
                }
                this.领取奖励();
            } else if (this.鲨士多()) {

            } else if (this.抉择()) {

            }
            /*else if (this.领取藏品奖励()) {

                   } else if (this.选择装备()) {}
                   */
        },

        抉择: function(choice_frequency) {
            console.info("---抉择选项---");
            if (!ITimg.ocr("主界面", {
                    action: 5,
                    area: 1,
                    similar: 0.75,
                    threshold: 0.75,
                    picture_failed_further: true,
                })) {
                click(height / 2, width - frcy(80));
                sleep(200);
                return false;
            }
            //console.verbose("---抉择选项---");
            tool.Floating_emit("展示文本", "状态", "状态：抉择进行中");

            this.choice_frequency = choice_frequency || 0;
            let option_list = ITimg.ocr("集合", {
                action: 6,
                area: 4,
            });
            if (!option_list || !option_list.length) {
                log("没有选项？");
                return false;
            }
            option_list.sort((a, b) => b.bottom - a.bottom);
            //  let filter_list = ["PPLY","II","★"];
            console.verbose("---所有抉择选项：\n", option_list);
            let option = option_list[0];

            if (random(0, 1) && option_list.length >= 3) {
                option = option_list[2];
            } else if (option_list[1]) {
                option = option_list[1];
            }

            if (option.text.indexOf("PPLY") != -1 ||
                option.text.indexOf("II") != -1 ||
                option.text.indexOf("★") != -1 ||
                option.text.indexOf("潜影") != -1 ||
                option.text.indexOf("电视") != -1) {
                option = option_list[0];
            } else {
                click(option.left, option.top);
                sleep(200);
            }
            // console.info("随机：选择倒数第一选项 " + option_list[1].text + " ，x:" + option_list[1].left + ",y:" + option_list[1].top)
            option = option_list[0];

            console.info("选择点击选项：" + option.text + "，x:" + option.left + ",y:" + option.top);
            click(option.right, option.top);


            if (option.top > parseInt(width / 1.3)) {
                //决定
                this.choice_frequency++;
            }
            sleep(1000);

            sleep(200);
            if (ITimg.ocr("主界面", {
                    action: 5,
                    area: 1,
                    similar: 0.75,
                    threshold: 0.75,
                })) {
                //跳获得奖励
                click(height / 2, frcy(100));

                return this.抉择();
            }
            if (this.出击()) {
                if (!this.give_up_max) {
                    return false
                }
                this.领取奖励();

            } else if (ITimg.ocr("SKIP", {
                    action: 1,
                    area: 2,
                    timing: 1000,
                })) {
                if (ITimg.ocr("确定", {
                        action: 1,
                        area: 4,
                        timing: 1000,
                    })) {
                    return this.抉择();
                }
            } else if (this.领取藏品奖励()) {

            } else if (this.选择装备()) {
                return this.抉择();

            } else if (this.装备调整()) {

            } else if (ITimg.ocr("获得奖励", {
                    action: 1,
                    area: 5,
                    timing: 500,
                })) {
                click(option_list[option_list.length - 1].left, option_list[option_list.length - 1].top);
                sleep(500);

            } else if (this.确认在节点界面()) {
                return true
            } else {
                //跳过新章节动画，陆离迷宫
                click(height / 2, frcy(100));
                return this.抉择();
            }


        },
        装备调整: function(confirm) {
            if (!confirm && !ITimg.ocr("请选择要更换位置的套装", {
                    action: 5,
                    area: 1,
                }) && !ITimg.ocr("交换次数", {
                    action: 5,
                    area: 1,
                    part: true,
                    refresh: false,
                })) {
                return false;
            }
            while (true) {
                ITimg.ocr("返回", {
                    action: 1,
                    area: 1,
                    timing: 500,
                    threshold: 0.85,
                })
                if (ITimg.ocr("确认", {
                        action: 0,
                        area: 4,
                        timing: 1000,
                    })) {
                    //跳过歧路异途加载动画
                    click(height / 2, parseInt(width / 1.2));
                    sleep(1000);
                    break;
                }
            }
            return true;
        },
        出击: function() {
            console.verbose("---确认出击---")
            if (!ITimg.ocr("队伍调整", {
                    action: 5,
                    area: 34,
                }) && !ITimg.ocr("出击", {
                    action: 5,
                    area: 4,
                    timing: 1500,
                    refresh: false,
                })) {
                return false;
            }
            tool.Floating_emit("展示文本", "状态", "状态：确认招募能量...");

            let recruit_limit_f = ITimg.ocr("招募能量", {
                action: 5,
                area: 3,
            })
            if (!recruit_limit_f) {
                tips = "无法确认可招募数量";
                console.warn(tips);
                tool.Floating_emit("展示文本", "状态", "状态：" + tips);
                ITimg.ocr("出击", {
                    action: 0,
                    area: 4,
                    timing: 1500,
                    nods: 500,
                }) || ITimg.ocr("出击", {
                    action: 0,
                    area: 4,
                    timing: 1500,

                })

            } else {
let _area = [recruit_limit_f.left, recruit_limit_f.top - frcy(150), recruit_limit_f.right - recruit_limit_f.left, frcy(150)];
                let recruit_limit = (ITimg.ocr("/5", {
                    action: 5,
                    saveSmallImg: false,
                    area: _area,
                }) || ITimg.ocr("5", {
                    refresh: false,
                    action: 5,
                    saveSmallImg: false,
                    part: true,
                    area: [recruit_limit_f.left, recruit_limit_f.top - frcy(150), recruit_limit_f.right - recruit_limit_f.left, frcy(150)],
                }) || ITimg.ocr("7", {
                    action: 5,
                    part: true,
                    saveSmallImg: false,
                    refresh: false,
                    area: _area,
                }) || ITimg.ocr("9", {
                    action: 5,
                    part: true,
                    refresh: false,
                    saveSmallImg: false,
                    refresh: false,
                    area: [recruit_limit_f.left - frcx(100), recruit_limit_f.top - frcy(200), recruit_limit_f.right - recruit_limit_f.left + frcx(100), frcy(200)],
                }) || ITimg.ocr("11", {
                    refresh: false,
                    action: 5,
                    part: true,
                    saveSmallImg: false,
                    area: [recruit_limit_f.left - frcx(100), recruit_limit_f.top - frcy(200), recruit_limit_f.right - recruit_limit_f.left + frcx(100), frcy(200)],
                }));
                if (!recruit_limit || !recruit_limit.text) {
                    recruit_limit = ITimg.matchFeatures("招募能量7", {
                        action: 5,
                        area: 3,
                        threshold: 0.8,
                        scale:1,
                        saveSmallImg: true,
                        visualization: true,
                    });
                    if (recruit_limit) {
                        recruit_limit.text = "7";
                    }
                }
                if (recruit_limit && recruit_limit.text.match(/(\d+)/)[0] != this.recruiting_energy) {
                    tool.Floating_emit("展示文本", "状态", "状态：招募新角色");
                    while (true) {
                        if (recruit_limit.text.match(/(\d+)/)[0] <= 5) {

                            let _f = ITimg.ocr("队长", {
                                action: 5,
                                area: 3,
                            })
                            if (_f) {
                                click(_f.left, _f.bottom - frcy(150));
                            }
                        } else {
                            if (!ITimg.matchFeatures("招募位", {
                                    action: 1,
                                    threshold: 0.8,
                                    saveSmallImg: true,
                                    visualization: true,
                                })) {
                                click(height / 2, width / 2);
                            }
                        }

                        sleep(1500);
                        let ranks_attribute = [
                            ["物", "冰", "暗"],
                            ["火", "雷", "空"]
                        ]
                        let ranks = "队伍筛选-";
                        let attribute = [];
                        if (helper.矩阵循生队伍 == "随机") {
                            attribute = [random(0, 1), random(0, 2)];
                        } else {

                            // 查找 在 ranks_attribute 中的位置
                            attribute[0] = ranks_attribute.findIndex(row => row.includes(helper.矩阵循生队伍[0]));
                            attribute[1] = ranks_attribute[attribute[0]].indexOf(helper.矩阵循生队伍[0]);

                        }
                        //拼凑小图名称
                        ranks += ranks_attribute[0][attribute[1]] + ranks_attribute[1][attribute[1]];


                        tool.Floating_emit("面板", "位置", {
                            x: height / 4,
                            y: frcy(250)
                        });


                        ITimg.matchFeatures(ranks, {
                            action: attribute[0] ? 3 : 1,
                            timing: 1000,
                            area: 13,
                            threshold: 0.8,
                            saveSmallImg: true,
                            visualization: true,
                        })

                        let role_list = (ITimg.ocr("战斗参数", {
                            action: 6,
                            area: 13,
                        }) || ITimg.ocr("精通等级", {
                            action: 6,
                            area: 13,
                            refresh: false,
                        }));
                        if (role_list) {
                            /* if (random(0, 1)) {
                                 role_list.reverse();
                             }
                             */
                            ITimg.ocr("战斗参数", {
                                action: 1,
                                area: 1,
                                gather: role_list,
                            }) || ITimg.ocr("精通等级", {
                                action: 1,
                                area: 1,
                                gather: role_list,
                            })

                            sleep(500);
                        }

                        if (ITimg.ocr("编入", {
                                action: 1,
                                area: 4,
                                timing: 1500,
                            })) {
                            tool.Floating_emit("面板", "位置", {
                                x: frcx(150),
                                y: frcy(250)
                            });
                            this.recruiting_energy = recruit_limit.text.match(/(\d+)/)[0];
                            if (ITimg.ocr("出击", {
                                    action: 0,
                                    area: 4,
                                    timing: 1500,
                                    nods: 1000,
                                }) || ITimg.ocr("出击", {
                                    action: 0,
                                    area: 4,
                                    timing: 1500,
                                    nods: 100,
                                }) || ITimg.ocr("确定", {
                                    action: 0,
                                    area: 4,
                                    timing: 1500,
                                    nods: 1500,
                                    refresh: false,
                                })) {
                                break
                            }
                        }
                    }
                } else {
                    ITimg.ocr("出击", {
                        action: 0,
                        area: 4,
                        timing: 2500,
                    }) || ITimg.ocr("确定", {
                        action: 0,
                        area: 4,
                        timing: 1500,
                        refresh: false,
                    })
                }
            }
            tool.Floating_emit("展示文本", "状态", "状态：队伍出击");

            sleep(6000);
            fight_thread = threads.start(作战);
            //模块可获取但无法直接修改主程序的变量
            this.change(fight_thread);
            sleep(15000);
            while (true) {
                if (fight_thread && !fight_thread.isAlive()) {
                    toastLog("重启作战线程 " + fight_thread);
                    fight_thread = threads.start(作战);
                    this.change(fight_thread);
                }
                if (ITimg.ocr("领取奖励", {
                        action: 5,
                        area: 1,
                    }) || ITimg.ocr("离开", {
                        action: 5,
                        area: 4,
                        timing: 100,
                        nods: 1000,
                    })) {
                    fight_thread = false;
                    this.change(fight_thread);
                    break

                }
                if (ITimg.ocr("重启", {
                        action: 1,
                        timing: 1000,
                        refresh: false,
                    })) {
                    if (!ITimg.ocr("确认", {
                            action: 1,
                            area: 4,
                            timing: 1000,
                        })) {
                        this.give_up_max--;
                        if (!this.give_up_max) {
                            if (ITimg.ocr("放弃", {
                                    action: 1,
                                    area: 3,
                                    timing: 1000,
                                })) {
                                fight_thread = false;
                                this.change(fight_thread);
                                ITimg.ocr("放弃", {
                                    action: 1,
                                    area: 3,
                                    timing: 3000,
                                })
                                ITimg.ocr("放弃", {
                                    action: 1,
                                    area: 3,
                                    timing: 1000,
                                })
                                break
                            }
                        }
                    }

                }
            }

            // tool.pointerPositionDisplay(false);
            sleep(2000)
            return true;
        },
        //套装，藏品，离开
        领取奖励: function(reward_frequency) {
            console.verbose("---领取战斗奖励---")
            this.reward_frequency = reward_frequency || 2;

            let reward_list = ITimg.ocr("集合", {
                action: 6,
                area: 34,
            })
            if (!reward_list || !reward_list.length) {
                tips = "无法确认领取奖励？";
                console.warn(tips);
                tool.Floating_emit("展示文本", "状态", "状态：" + tips);

                return false;

            }
            tool.Floating_emit("展示文本", "状态", "状态：领取节点奖励");

            console.warn(reward_list)
            for (let reward of reward_list) {
                if (reward.text == "领取" || tool.nlpSimilarity("领取", reward.text) >= 0.8) {
                    click(reward.left, reward.top);
                    this.reward_frequency++;
                    console.warn("领取奖励，x：" + reward.left + "，y：" + reward.top);
                    sleep(1000);
                    if (this.选择装备()) {
                        sleep(1000);
                        continue;
                    } else if (this.领取藏品奖励()) {

                    } else if (ITimg.ocr("领取奖励", {
                            action: 1,
                            area: 5,
                            timing: 1000,
                        })) {
                        click(height / 2, width / 2);
                        sleep(1000);
                    }
                }
            }
            if (!ITimg.ocr("已领取所有奖励", {
                    area: 5,
                    action: 5,
                }) && this.reward_frequency < 5) {
                return this.领取奖励(this.reward_frequency);
            }
            while (true) {
                ITimg.ocr("离开", {
                    action: 1,
                    area: 4,
                    timing: 999,
                })

                if (this.确认在节点界面()) {
                    break;
                } else if (ITimg.ocr("确认", {
                        action: 5,
                        refresh: false,
                    }) && ITimg.ocr("取消", {
                        action: 1,
                        timing: 1000,
                        area: 3,
                    })) {
                    return this.领取奖励(this.reward_frequency);
                }
            }
            return true;

        },

        领取藏品奖励: function() {
            assembly_demand_list = ["算カ单元", "高速组件", "额外伤害", "必杀伤害", "攻击加成", "生命值-", "回复", "回球", "三消", "闪避", "真实伤害", "伤害加成", "攻击力", "组件"]

            console.verbose("---确认藏品---");
            if (ITimg.ocr("离开", {
                    action: 5,
                    area: 4,
                    saveSmallImg: "矩阵-离开",
                }) || !ITimg.ocr("领取奖励", {
                    action: 5,
                    area: [height / 4, 0, height / 2, parseInt(width / 4)],
                }) || !ITimg.ocr("领取奖励", {
                    action: 5,
                    refresh: false,
                }) || !ITimg.ocr("奖励", {
                    action: 5,
                    part: true,
                    refresh: false,
                })) {
                return false;
            }
            tool.Floating_emit("面板", "隐藏");
            tool.Floating_emit("展示文本", "状态", "状态：领取藏品奖励");
            sleep(500);
            let assembly_list = ITimg.contour({
                action: 5,
                canvas: "藏品",
                threshold: 220,
                size: 0,
                type: "BINARY",
                filter_w: frcx(250),
                filter_h: frcy(300),
            });
            if (!assembly_list || !assembly_list.length) {
                tips = "无法确认组件奖励？";
                console.warn(tips);
                tool.Floating_emit("展示文本", "状态", "状态：" + tips);

                return false;
            }
            for (let assembly of assembly_list) {
                if (assembly.circularity <= 0.20) {
                    continue;

                }
                let assembly_describe_list = ITimg.ocr("集合", {
                    action: 6,
                    area: [assembly.x, assembly.y, assembly.w, assembly.h],
                });
                if (!assembly_describe_list) {
                    continue;
                }
                let assembly_select = assembly_describe_list.some(assembly_describe => {
                    console.warn("组件描述：" + assembly_describe.text);
                    return assembly_demand_list.some(assembly_demand => {
                        if (assembly_describe.text.indexOf(assembly_demand) != -1) {
                            log("符合：" + assembly_demand);
                            return true;
                        }
                    })

                });
                //没写完
                if (assembly_select) {
                    click(assembly.x + assembly.w / 2, assembly.y + assembly.h / 2);
                    sleep(500);
                    if (ITimg.ocr("领取", {
                            action: 1,
                            area: [assembly.x, assembly.y, assembly.w, assembly.h],
                            timing: 1200,
                        }) && !ITimg.ocr("领取", {
                            action: 1,
                            area: [assembly.x, assembly.y, assembly.w, assembly.h],
                            timing: 1200,
                        })) {
                        break
                    }
                } else {
                    if (!this.assembly_select_frequency) {
                        this.assembly_select_frequency = 0;

                    }
                    this.assembly_select_frequency++;
                    if (this.assembly_select_frequency > 3) {
                        click(assembly.x + assembly.w / 2, assembly.y + assembly.h / 2);
                        sleep(500);
                        if (ITimg.ocr("领取", {
                                action: 1,
                                area: [assembly.x, assembly.y, assembly.w, assembly.h],
                                timing: 1200,
                            }) && !ITimg.ocr("领取", {
                                action: 1,
                                area: [assembly.x, assembly.y, assembly.w, assembly.h],
                                timing: 1200,
                            })) {
                            break
                        }
                    }
                }


            }
            tool.Floating_emit("面板", "展开");

            if (ITimg.ocr("获得奖励", {
                    action: 1,
                    area: 5,
                    timing: 1000,
                    nods: 1000,
                }) && !ITimg.ocr("获得奖励", {
                    action: 1,
                    area: 5,
                    timing: 1000,
                }) || ITimg.ocr("获得奖励", {
                    action: 1,
                    area: 5,
                    timing: 1000,
                }) && !ITimg.ocr("获得奖励", {
                    action: 1,
                    area: 5,
                    timing: 1000,
                })) {
                return true;
            } else {
                return this.领取藏品奖励();
            }
            return true;
        },

        选择装备: function() {

            sleep(1000);
            if (!ITimg.ocr("请选择装备", {
                    action: 5,
                    area: 1,
                    threshold: 0.85,
                }) && !ITimg.ocr("简略", {
                    action: 5,
                    area: 2,
                    refresh: false,
                    log_policy: "简短",
                    threshold: 0.85,
                }) && !ITimg.ocr("装备效果", {
                    action: 5,
                    refresh: false,
                    threshold: 0.85,
                    log_policy: "简短",
                })) {
                return false;
            }
            if (ITimg.ocr("进行重铸", {
                    action: 5,
                    refresh: false,
                    part: true,
                    area: 12,
                    log_policy: "简短",
                }) || ITimg.ocr("重铸次数", {
                    action: 5,
                    area: 1,
                    refresh: false,
                    part: true,
                })) {
                return this.装备调整(true);
            }
            tool.Floating_emit("展示文本", "状态", "状态：领取装备...");
            tool.Floating_emit("面板", "隐藏");
            sleep(1000);
            let equipment_list = ITimg.contour({
                action: 5,
                canvas: "装备",
                threshold: 230,
                size: 0,
                type: "BINARY",
                filter_w: frcx(250),
                filter_h: frcy(300),
            });
            tool.Floating_emit("面板", "展开");
            if (!equipment_list || !equipment_list.length) {
                return false;
            }
            while (true) {
                click(equipment_list[0].x + equipment_list[0].w / 2, equipment_list[0].y + equipment_list[0].h / 2);
                sleep(500);
                if (random(0, 1) && equipment_list[1]) {
                    click(equipment_list[1].x + equipment_list[1].w / 2, equipment_list[1].y + equipment_list[1].h / 2);
                    sleep(500);

                }
                ITimg.ocr("确定", {
                    action: 1,
                    area: 4,
                    timing: 1000,
                    saveSmallImg: "矩阵-确定",
                })
                ITimg.ocr("套装已激活", {
                    action: 1,
                    area: 5,
                    timing: 1000,
                })
                if (this.确认在节点界面() || ITimg.ocr("离开", {
                        action: 5,
                        area: 4,
                    }) || ITimg.ocr("结束购物", {
                        action: 5,
                        area: 4,
                    })) {
                    break
                }
            }
            return true;
        },

        鲨士多: function() {

            sleep(500);
            if (!ITimg.ocr("鲨士多", {
                    action: 5,
                    area: [height / 2, 0, height / 2, width / 4],
                    threshold: 0.75,
                    picture_failed_further: true,
                }) && !ITimg.ocr("这里只收", {
                    action: 5,
                    part: true,
                    refresh: false,
                    log_policy: "简短",
                }) && !ITimg.ocr("不收姜饼", {
                    action: 5,
                    part: true,
                    refresh: false,
                    log_policy: "简短",
                }) && !ITimg.ocr("碧士多", {
                    action: 5,
                    refresh: false,
                    log_policy: "简短",
                }) && !ITimg.ocr("收什么", {
                    action: 5,
                    part: true,
                    refresh: false,
                    log_policy: "简短",
                })) {
                log("无法确认鲨士多/碧士多");
                return false;
            }
            tool.Floating_emit("展示文本", "状态", "状态：检查购买商品");

            let unit_list = ITimg.ocr("集合", {
                action: 6,
                refresh: false,
                area: [height - height / 4, 0, height / 4, width / 4],

            })
            let unit;
            unit_list.sort((a, b) => a.top - b.top);
            console.trace(unit_list)
            unit_list.some(unit_ => {
                if (unit_.text.match(/(\d+)/)) {
                    unit = unit_.text.match(/(\d+)/)[0];
                    return true
                }
            })
            if (!unit || unit < 100) {
                tips = "算力单元：" + unit;
                console.warn(tips)
                tool.Floating_emit("展示文本", "状态", "状态：" + tips);
                while (true) {
                    ITimg.ocr("结束购物", {
                        action: 1,
                        area: 4,
                        timing: 1000,
                    })
                    ITimg.ocr("确认", {
                        action: 1,
                        area: 4,
                        timing: 1000,
                    })
                    if (this.确认在节点界面()) {
                        break
                    }
                }
                return true;
            }
            tool.Floating_emit("展示文本", "状态", "状态：购买商品..");

            let goods_list = ITimg.ocr("集合", {
                action: 6,
                area: [height / 2, parseInt(width / 5), height / 2, width - parseInt(width / 5)],

            })
            goods_list = this.group_commodity(goods_list);
            console.warn("商品列表：", goods_list)
            for (let goods of goods_list) {
                if (unit < goods[1].price) {
                    continue;
                }
                click(goods[0].right, goods[0].bottom);
                sleep(1000)
                if (ITimg.ocr("购买", {
                        action: 4,
                        area: 4,
                        timing: 1000,
                        nods: 500,
                        threshold: 0.85,
                        saveSmallImg: "矩阵-鲨士多-购买",
                    }) || ITimg.ocr("购买", {
                        action: 4,
                        area: 4,
                        timing: 1000,
                        part: true,
                        threshold: 0.85,
                        saveSmallImg: "矩阵-鲨士多-购买",
                    })) {
                    console.warn("购买物品：" + goods[1].name);
                    if (!ITimg.ocr("获得奖励", {
                            action: 1,
                            area: 5,
                            timing: 1000,
                        })) {
                        this.领取藏品奖励() || this.选择装备();
                    }
                    unit = unit - goods[1].price;
                }
            }
            while (true) {
                ITimg.ocr("结束购物", {
                    action: 1,
                    area: 4,
                    timing: 1000,
                })
                ITimg.ocr("确认", {
                    action: 1,
                    area: 4,
                    timing: 1000,
                })
                if (!this.确认在节点界面()) {


                    this.领取藏品奖励();
                    this.选择装备();
                } else {
                    break
                }
            }
            return true;

        },
        group_commodity: function(columns) {
            columns.sort((a, b) => a.left - b.left)

            let groups = [];
            columns.forEach(column => {
                let foundGroup = false;
                groups.forEach(group => {
                    if (column.text.indexOf("★") != -1 || column.text.indexOf("UP") != -1 || column.text == "SHGH" || column.text.indexOf("SH") != -1 || column.text == "结束购物" || column.text == "PPL") {
                        foundGroup = true;
                        return false;
                    }
                    if (!foundGroup && Math.abs(column.left - group[0].left) <= frcx(200) && Math.abs(column.top - group[0].top) <= frcy(300)) {
                        if (column.text.indexOf("进阶") != -1 || column.text.indexOf("顶级") != -1 || column.text.indexOf("奢华") != -1) {
                            group[1].discount = '5';
                        } else if (column.text.indexOf("精美") != -1 || column.text.indexOf("稀有") != -1) {
                            group[1].discount = '4';
                        } else if (column.text.indexOf("组件") != -1) {
                            group[1].discount = '3';
                        } else if (column.text.indexOf("折") != -1) {
                            group[1].discount = column.text.match(/(\d+)/)[0]
                        } else if (column.text.match(/(\d+)/)) {
                            column.text = column.text.match(/(\d+)/)[0];
                            if (column.text[0] == 9 && column.text.length == 4) {
                                column.text = column.text.replace("9", '')
                            }
                            group[1].price = column.text
                        } else {
                            group[1].name = column.text
                        }

                        foundGroup = true;
                    }
                });
                if (!foundGroup) {
                    groups.push([column, {
                        "name": column.text,
                        "discount": (column.text.indexOf("折") != -1) ? column.text.match(/(\d+)/)[0] : 0,
                    }]);
                }
            });
            groups.sort((a, b) => b[1].discount - a[1].discount);
            return groups;
        },

        确认在节点界面: function() {
            console.verbose("---确认在节点界面---")
            if (ITimg.ocr("编队", {
                    action: 5,
                    area: 4,
                }) || ITimg.ocr("藏品", {
                    action: 5,
                    area: 4,
                    refresh: false,
                    nods: 1000,
                    log_policy: "简短",
                }) || ITimg.ocr("编队", {
                    action: 5,
                    area: 4,
                    part: true,
                }) || ITimg.ocr("藏品", {
                    action: 5,
                    area: 4,
                    refresh: false,
                    part: true,
                    log_policy: "简短",
                })) {
                return true;
            }
            return false;
        },

        重置: function() {
            tool.Floating_emit("展示文本", "状态", "状态：重启运算");

            /*  ITimg.ocr("链路崩溃",{
                  action:1,
                  area:5,
              })
              */
            if (ITimg.ocr("下一页", {
                    area: 4,
                    action: 1,
                })) {
                while (true) {
                    if (ITimg.ocr("下一页", {
                            area: 4,
                            action: 1,
                            timing: 500,
                        })) {
                        continue;
                    }
                    if (ITimg.ocr("完成", {
                            action: 1,
                            area: 4,
                        }) || ITimg.ocr("启程", {
                            action: 5,
                            area: 4,
                            refresh: false,
                        })) {
                        break
                    }
                }
                return true;
            }
        },


    }



    module.exports = 矩阵循生;