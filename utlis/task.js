

function removeByVal(arrylist, val, 操作) {
    switch (操作) {
        case "删除":
            for (var i = 0; i < arrylist.length; i++) {
                if (arrylist[i] == val) {
                    arrylist.splice(i, 1);
                    break;
                }
            }
            break;
        case "删除2":
            for (var i = 0; i < arrylist.length; i++) {
                if (arrylist[i].名称.search(val) != -1) {
                    arrylist.splice(i, 1);
                } else {
                    return arrylist
                }
            }
            break;
        case "修改":
            for (var i = 0; i < arrylist.length; i++) {
                if (arrylist[i].state == val) {
                    arrylist[i].state = "使用";
                    arrylist[i].color = "#ffffff";
                    return true;
                }
            }
            break;
    }
}

function ischeck(id) {
    for (let i = 0; i < id.getChildCount(); i++) {
        let rb = id.getChildAt(i);
        if (rb.isChecked()) {
            return [rb.getText(),i]
        }
    }
}

/*
var storage = storages.create("time");
var timed_tasks_list = storage.get("items", []);*/
var task = {
    create_task: function (timed_tasks_list) {
        // engines.execScript("time_ui","require('./lib/timers.js');");
        let uii = ui.inflate(
            <vertical id="parent">
                <frame>
                    <ScrollView>
                        <vertical>
                            <card gravity="center_vertical" cardElevation="0dp" margin="0" cardBackgroundColor="#00000000">
                                <img src="file://res/icon.png" w="50" h="30" margin="0" layout_gravity="center|left" />
                                <text text="{{language['timed_tasks']}}" gravity="center|left" textColor="#000000" marginLeft="50" />

                                <linear gravity="center||right" marginLeft="5" >
                                    <text id="timed_tasks_help" textColor="#03a9f4" text="{{language['timed_tasks_help']}}" padding="10" w="auto" h="auto" foreground="?attr/selectableItemBackground" clickable="true" />
                                </linear>

                            </card>
                            <linear gravity="center" margin="0 -2">
                                <text text="{{language['channel_text']}}" id="channel" textSize="8" marginLeft="5" />
                                <View bg="#f5f5f5" w="*" h="2" />
                            </linear>
                            <text id="task_tips" text="" typeface="sans" padding="5" visibility="gone" textColor="#000000" textSize="15sp" layout_gravity="center" />

                            <card id="car" w="*" h="auto" margin="5 0 5 0" cardCornerRadius="2dp"
                                cardElevation="1dp" foreground="?selectableItemBackground" cardBackgroundColor="#eff0f4">
                                <radiogroup mariginTop="0" w="*">

                                    <radiogroup id="channel_server_lsit" orientation="horizontal">
                                        <radio id="fu0" text="{{language['server_name'][0].name}}" checked="true" />
                                        <radio id="fu1" text="{{language['server_name'][1].name}}"   />
                                        <radio id="fu2" text="{{language['server_name'][2].name}}"  />
                                        <radio id="fu3" text="{{language['server_name'][3].name}}"  marginLeft="-190" marginTop="32"/>
                                        <radio id="fu4" text="{{language['server_name'][4].name}}"   marginTop="32"/>
                                  
                                    </radiogroup>

                                    <vertical id="run_configure">
                                        <linear gravity="center" margin="0 -2">
                                            <text text="{{language['run_configure_text']}}" textSize="8" />
                                            <View bg="#f5f5f5" w="*" h="2" />
                                        </linear>
                                        <horizontal gravity="center" marginLeft="5" w="*">
                                            <text id="mr1" text="{{language['run_configure_challenge']}}" textSize="15" textColor="#212121" />
                                           <input id="challenge" inputType="number" hint="{{helper.挑战次数}}" layout_weight="1" paddingLeft="6" w="auto" />
                                            <text id="mr2" text="{{language['run_configure_serum']}}" textSize="15" textColor="#212121" />
                                            <input id="serum" inputType="number" hint="{{helper.注射血清}}" layout_weight="1" w="auto" />
                                        </horizontal>
                                    </vertical>

                                    <linear gravity="center" margin="0 -2">
                                        <text text="{{language['elapsed_time_text']}}" textSize="8" />
                                        <View bg="#f5f5f5" w="*" h="2" />
                                    </linear>
                                    <radiogroup id="elapsed_time_list" orientation="horizontal" h="auto">
                                        <radio id="elapsed_time_list1" text="{{language['elapsed_time'][0]}}" checked="true" w="*" />
                                        <radio id="elapsed_time_list2" text="{{language['elapsed_time'][1]}}" w="*" />
                                        <radio id="elapsed_time_list3" text="{{language['elapsed_time'][2]}}" w="*" h="auto" />
                                    </radiogroup>

                                       {/**24小时 */}
                                       <timepicker id="timePickerMode" margin="0 -20" timePickerMode="spinner" layout_gravity="center"   />
                                    {/**日期 */}
                                    <datepicker id="datepicker" margin="0 -40 0 -30" datePickerMode="spinner" layout_gravity="center" />
                                   {/*周*/}
                                    <vertical id="week_list" padding="0 0 0 0" w="*" layout_gravity="center" visibility="gone">
                                        <horizontal weightSum='4' margin="10 0 0 0" gravity="center">
                                            <checkbox id='z1' text="{{language['week'][1]}}" h='*' w='0dp' layout_weight='1'>
                                            </checkbox>
                                            <checkbox id='z2' text="{{language['week'][2]}}" h='*' w='0dp' layout_weight='1'>
                                            </checkbox>
                                            <checkbox id='z3' text="{{language['week'][3]}}" h='*' w='0dp' layout_weight='1'>
                                            </checkbox>
                                        </horizontal>
                                        <horizontal margin="0 0 0 0" weightSum='4' gravity="center_horizontal">
                                            <checkbox id='z4' text="{{language['week'][4]}}" h='*' w='0dp' layout_weight='1'>
                                            </checkbox>
                                            <checkbox id='z5' text="{{language['week'][5]}}" h='*' w='0dp' layout_weight='1'>
                                            </checkbox>
                                            <checkbox id='z6' text="{{language['week'][6]}}" h='*' w='0dp' layout_weight='1'>
                                            </checkbox>
                                            <checkbox id='z0' text="{{language['week'][0]}}" h='*' w='0dp' layout_weight='1'>
                                            </checkbox>
                                        </horizontal>

                                    </vertical>
                                    <linear gravity="center" margin="0 -2">
                                        <text text=" {{language['senior_function_text']}}" textSize="8" />
                                        <View bg="#f5f5f5" w="*" h="2" />
                                    </linear>
                                    <vertical w="*">
                                     <widget-switch-se7en id="mute_run" text="{{language['mute_run']}}" checked="false" padding="0 5 10 5" textSize="18sp"
                                            margin="10 0" thumbSize='24' gravity="center_vertical" w="*"
                                            radius='24' />
                                      <widget-switch-se7en id="auto_unlock" text="{{language['auto_unlock']}}" checked="false" padding="0 5 10 5" textSize="18sp"
                                            margin="10 0" thumbSize='24' gravity="center_vertical" w="*"
                                            radius='24' />

                                    </vertical>
                                </radiogroup>
                               
                            </card>
                            <horizontal w="*" padding="-3" gravity="center_vertical">
                                <button text="{{language['no']}}" id="exit" textColor="#F4A460" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
                                <button text="{{language['yes']}}" id="ok" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
                            </horizontal>
                        </vertical>
                    </ScrollView>
                </frame>
            </vertical>);

        var res = dialogs.build({
            type: "app",
            customView: uii,
            wrapInScrollView: false
        })
      tool.setBackgroundRoundRounded(res.getWindow(), { bg: use.theme.bg ,radius:0})
        res.show();
        uii.task_tips.setText(language.task_tips)

        uii.timed_tasks_help.on('click', function () {
            if (uii.task_tips.getHint() == "true") {
                uii.task_tips.setVisibility(8)
                uii.task_tips.setHint("false");
                uii.car.setVisibility(0)
                uii.channel.setText(language.channel_text)
                uii.timed_tasks_help.setTextColor(colors.parseColor("#03a9f4"))
            } else {
                uii.task_tips.setVisibility(0)
                uii.task_tips.setHint("true");
                uii.car.setVisibility(8);
                uii.channel.setText(language.timed_tasks_help)
                uii.timed_tasks_help.setTextColor(colors.parseColor("#f4a406"))
            }
        })
        for(let i=0;i<language.server_name.length;i++){
         
        }
    


        var time, timk;
        var week_arr = []

        //滑动时间选择
        uii.timePickerMode.setIs24HourView(true); //设置当前时间控件为24小时制
        uii.timePickerMode.setOnTimeChangedListener({
            onTimeChanged: function (v, h, m) {
                //h 获取的值 为24小时格式
                time = h + ":" + m;
            }
        });

        uii.z1.on("check", (checked) => {
            if (checked) {
                week_arr.splice(0, 0, '一');
            } else {
                removeByVal(week_arr, '一', "删除");
            }
        });
        uii.z2.on("check", (checked) => {
            if (checked) {
                week_arr.splice(1, 0, '二');
            } else {
                removeByVal(week_arr, '二', "删除");
            }
        });
        uii.z3.on("check", (checked) => {
            if (checked) {
                week_arr.splice(2, 0, '三');
            } else {
                removeByVal(week_arr, '三', "删除");
            }
        });
        uii.z4.on("check", (checked) => {
            if (checked) {
                week_arr.splice(3, 0, '四');
            } else {
                removeByVal(week_arr, '四', "删除");
            }
        });
        uii.z5.on("check", (checked) => {
            if (checked) {
                week_arr.splice(4, 0, '五');
            } else {
                removeByVal(week_arr, '五', "删除");
            }
        });
        uii.z6.on("check", (checked) => {
            if (checked) {
                week_arr.splice(5, 0, '六');
            } else {
                removeByVal(week_arr, '六', "删除");
            }
        });
        uii.z0.on("check", (checked) => {
            if (checked) {
                week_arr.splice(6, 0, '日');
            } else {
                removeByVal(week_arr, '日', "删除");
            }
        });
        uii.exit.on("click", function () {
            res.dismiss();
        })
        var data = new Date()
        var y = data.getFullYear()
        var m = data.getMonth()
        var d = data.getDate()

        let now_date = y + "-" + (m + 1) + "-" + d;
        uii.datepicker.init(y, m, d, function (v, y, m, d) {
            //月值计算是从0开始的 要手动加1
            now_date = y + "-" + (m + 1) + "-" + d;
        });
       var password = tool.readJSON("password",false);

        uii.auto_unlock.on("click", function (view) {
            if (view.checked) {
                let entry_ui = ui.inflate(
                    <vertical id="parent">
                        <frame>
                            <ScrollView>
                                <vertical>
                                    <card gravity="center_vertical" cardElevation="0dp" margin="0" cardBackgroundColor="#00000000">
                                        <img src="file://res/icon.png" w="50" h="30" margin="0" layout_gravity="center|left" />
                                        <text text="{{language['password_management']}}" gravity="center|left" textColor="#000000" marginLeft="50" />

                                        <linear gravity="center||right" marginLeft="5" >
                                            <text id="entry_unlocking" textColor="#f4a406" text="{{language['record_unlock_action']}}" padding="10" w="auto" h="auto" foreground="?attr/selectableItemBackground" clickable="true" />
                                        </linear>

                                    </card>
                                    <input id="password" text="" hint="{{language['password_input_tips']+language['record_unlock_action']}}" singleLine="2" margin="20 0" />

                                    <horizontal w="*" padding="-3" gravity="right|center_vertical" margin="5 0" >
                                        <button text="{{language['yes']}}" id="ok" style="Widget.AppCompat.Button.Borderless.Colored" />
                                    </horizontal>
                                </vertical>
                            </ScrollView>
                        </frame>
                    </vertical>);

                var entry = dialogs.build({
                    type: "app",
                    customView: entry_ui,
                    wrapInScrollView: false
                }).show()
                if (password != false && password != undefined) {
                    if (files.exists(password)) {
                        entry_ui.password.setHint(password)
                    } else {
                        let text = "";
                        for (let i in password) {
                            text += "*"
                        }
                        entry_ui.password.setHint(text)
                    }
                }
                entry_ui.entry_unlocking.on("click", () => {
                    engines.execScriptFile("./activity/entry_unlocking.js");
                    entry.dismiss();
                })
                entry_ui.ok.on("click", () => {
                    if (entry_ui.password.getText().toString().length >= 4) {
                        toastLog(files.exists(entry_ui.password.getText().toString()) ? language.task_tips5 : language.task_tips4)
                      tool.writeJSON("password", entry_ui.password.getText().toString(),"password")
                       tool.writeJSON("自动解锁", true);
                        entry.dismiss();
                    }
                })

            }
            tool.writeJSON("自动解锁", view.checked);

        })
        if (helper.自动解锁) {
            uii.auto_unlock.checked = true;
            if (password == null || password == undefined) {
                tool.writeJSON("自动解锁", false);
                uii.auto_unlock.checked = false
            } else {
                if (password.length < 4) {
                    tool.writeJSON("password", null,"password");
                    tool.writeJSON("自动解锁", false);
                    uii.auto_unlock.checked = false
                }
            }
        }

        if(helper.静音){
            uii.mute_run.setVisibility(8);
        }



        uii.ok.on("click", function () {
            if (time == null) {
                snakebar(language.task_tips2);
                return
            }
            var jsPath = "./timers.js";
            var frequency = false;
            var serum = false;
            let re = /\d+/,
                text;
            text = re.exec(uii.challenge.getText());
            if (uii.challenge.getText().toString().length != 0) {
                frequency = text[0];
            }

            text = re.exec(uii.serum.getText());
            if (uii.serum.getText().toString().length != 0) {
                serum = text[0];
            }


            switch (ischeck(uii.elapsed_time_list)[0]) {
                //仅运行一次
                case language.elapsed_time[0]:
                    timk = $timers.addDisposableTask({
                        path: jsPath,
                        date: now_date + "T" + time,
                    })
                    break;
                    //按星期运行
                case language.elapsed_time[1]:
                        if (week_arr == false) {
                            snakebar(language.task_tips3)
                            return
                        };
                        timk = $timers.addWeeklyTask({
                            path: jsPath,
                            // 时间戳为Mon Jun 21 2021 13:14:00 GMT+0800 (中国标准时间)，事实上只有13:14:00的参数起作用
                            time: time,
                            daysOfWeek: week_arr,
                            delay: 0,
                            loopTimes: 1,
                            interval: 0
                        });
                        break;
                case language.elapsed_time[2]:
                    timk = $timers.addDailyTask({
                        path: jsPath,
                        time: time,
                    });
                    break;
               
            }

            //获取配置信息
         
            jsPath = ischeck(uii.channel_server_lsit)[0]
            
            let shijian = language.challenge + (frequency ? frequency : helper.挑战次数) + "/" + language.serum + (serum ? serum : helper.注射血清);
            if (week_arr == false) {
                toastLog(language.task_add_tips+timk.id+language.task_add_tips2+time);
                if (uii.datepicker.getVisibility() == 0) {
                    shijian = language.elapsed_time_abbreviation[0] + now_date + " " + time + shijian;
                } else {
                    shijian = language.elapsed_time_abbreviation[2] + time + shijian;
                }

            } else {
                shijian = language.elapsed_time_abbreviation[1] + week_arr + "," + time + shijian;
                toastLog(language.task_add_tips + timk.id + language.task_add_tips3 + week_arr + ","+language.task_add_tips2 + time)
          
            }
           
           
            timed_tasks_list.push({
                id: timk.id,
                app: jsPath,
                app_package:language.server_name[ischeck(uii.channel_server_lsit)[1]].package_name,
                frequency: frequency,
                serum: serum,
                volume:uii.mute_run.checked,
              //  screen: uii.xpyx.checked,
                //The_server: ischeck(uii.channel_server_lsit)[0],
                shijian: shijian,
            });
            
            jsPath = null;
            if (!$power_manager.isIgnoringBatteryOptimizations()) {
                console.log("未开启忽略电池优化");
                $power_manager.requestIgnoreBatteryOptimizations();
            }
            res.dismiss();

            return true;
        })

        uii.elapsed_time_list1.on("check", (checked) => {
            if (checked) {
                uii.week_list.setVisibility(8);
                uii.datepicker.setVisibility(0)
            }
        })

        uii.elapsed_time_list2.on("check", (checked) => {
            if (checked) {
                uii.datepicker.setVisibility(8);
                uii.week_list.setVisibility(0)
            }
        })

        uii.elapsed_time_list3.on("check", (checked) => {
            if (checked) {
                uii.week_list.setVisibility(8);
                uii.datepicker.setVisibility(8)
            }
        })

        function snakebar(text) {
            com.google.android.material.snackbar.Snackbar.make(uii.timed_tasks_help, text, 1000).show();
        }
    },

}
try {
    module.exports = task;
} catch (err) {
    task.create_task()
}