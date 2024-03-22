"ui";
try {
    ui.statusBarColor(theme.bar);
} catch (err) {
    var theme = require("../theme.js");
    var language = theme.language.initialize;
}

(() => {

    importClass(android.content.Context);

    ui.layout(
        <vertical>
                <appbar>
                    <toolbar id="toolbar" bg="{{theme.bar}}" title="{{language['toolbar']}}" />
                </appbar>
                <ScrollView>
                    
                    <vertical >
                        <text text="{{language['tips']}}" margin="10 0" />
                        <text id="adaption" textColor="#03a9f4" text="{{language['adaption']}}" layout_gravity="center"  padding="10 8" w="auto" h="auto" foreground="?attr/selectableItemBackground" clickable="true" />
                        
                        <linear w="*" gravity="center">
                            
                            <text id="preset" textColor="#03a9f4" text="{{language['preset']}}"  padding="10 8" w="auto" h="auto" foreground="?attr/selectableItemBackground" clickable="true" />
                            <text id="export" textColor="#03a9f4" text="{{language['export']}}"  padding="10 8" w="auto" h="auto" foreground="?attr/selectableItemBackground" clickable="true" />
                        </linear>
                        
                        <vertical id="interface" >
                            <linear gravity="center" margin="0 -2">
                                <text text="{{language['hint1']}}" textSize="15" marginLeft="5" />
                                <View bg="#f5f5f5" w="*" h="2" />
                            </linear>
                            <horizontal id="返回">
                                <text text="{{language['return']}}" margin="10 0" textColor="{{theme.text}}" />
                                <text text="x:" />
                                <input id="x" layout_weight="3" inputType="number" hint="x" />
                                <text text="y:" />
                                <input id="y" layout_weight="3" inputType="number" hint="y" />
                                
                            </horizontal>
                            
                            <horizontal id="主页面">
                                <text text="{{language['mainpage']}}" margin="10 0" textColor="{{theme.text}}" />
                                <text text="x:" />
                                <input id="x" layout_weight="3" inputType="number" hint="x" />
                                <text text="y:" />
                                <input id="y" layout_weight="3" inputType="number" hint="y" />
                                
                            </horizontal>
                            
                            <horizontal id="主页展开">
                                <text text="{{language['unfold']}}" margin="10 0" textColor="{{theme.text}}" />
                                <text text="x:" />
                                <input id="x" layout_weight="3" inputType="number" hint="x" />
                                <text text="y:" />
                                <input id="y" layout_weight="3" inputType="number" hint="y" />
                                
                            </horizontal>
                            
                            <horizontal id="手册图标位置">
                                <text text="{{language['manualicon']}}" margin="10 0" textColor="{{theme.text}}" />
                                <text text="x:" />
                                <input id="x" layout_weight="3" inputType="number" hint="x" />
                                <text text="y:" />
                                <input id="y" layout_weight="3" inputType="number" hint="y" />
                                
                            </horizontal>
                            
                            <linear gravity="center" margin="0 -2">
                                <text text="{{language['hint2']}}" textSize="15" marginLeft="5" />
                                <View bg="#f5f5f5" w="*" h="2" />
                            </linear>
                            <horizontal>
                                <text text="{{language['hint3']}}" margin="10 0" textColor="{{theme.text}}" />
                                <checkbox id="房间初始化" text="{{language['roominitialization']}}" textColor="{{theme.text}}" />
                                
                            </horizontal>
                            <list id="宿舍6房间位置" h="250">
                                <horizontal margin="10 -3">
                                    <text text="name:" />
                                    <input id="name" layout_weight="3" inputType="textPersonName" hint="{{this.name}}" text="{{this.name ? this.name : ''}}" />
                                    <text text="x:" />
                                    <input id="x" w="100" inputType="number" hint="x" text="{{this.x ? this.x : ''}}" />
                                    <text text="y:" />
                                    <input id="y" w="100" inputType="number" hint="y" text="{{this.y ? this.y : ''}}" />
                                    
                                </horizontal>
                            </list>
                            
                            <text text="{{language['hint4']}}" margin="10 0" textColor="{{theme.text}}" />
                            
                            <list id="快捷头像位置">
                                <horizontal margin="10 0">
                                    <text text="name:" />
                                    <input id="name" layout_weight="3" inputType="textPersonName" hint="{{this.name}}" text="{{this.name ? this.name : ''}}" />
                                    <text text="x:" />
                                    <input id="x" w="100" inputType="number" hint="x" text="{{this.x ? this.x : ''}}" />
                                    <text text="y:" />
                                    <input id="y" w="100" inputType="number" hint="y" text="{{this.y ? this.y : ''}}" />
                                    
                                </horizontal>
                            </list>
                            <linear gravity="center" margin="0 -2">
                                <text text="{{language['hint5']}}" textSize="15" marginLeft="5" />
                                <View bg="#f5f5f5" w="*" h="2" />
                            </linear>
                            
                            <horizontal id="攻击键">
                                <text text="{{language['attackkey']}}" margin="10 0" textColor="{{theme.text}}" />
                                <text text="x:" />
                                <input id="x" layout_weight="3" inputType="number" hint="x" />
                                <text text="y:" />
                                <input id="y" layout_weight="3" inputType="number" hint="y" />
                                
                            </horizontal>
                            
                            <horizontal id="信号球1">
                                <text text="{{language['signalball1']}}" margin="10 0" textColor="{{theme.text}}" />
                                <text text="x:" />
                                <input id="x" layout_weight="3" inputType="number" hint="x" />
                                <text text="y:" />
                                <input id="y" layout_weight="3" inputType="number" hint="y" />
                                
                            </horizontal>
                            
                            <horizontal id="信号球2">
                                <text text="{{language['signalball2']}}" margin="10 0" textColor="{{theme.text}}" />
                                <text text="x:" />
                                <input id="x" layout_weight="3" inputType="number" hint="x" />
                                <text text="y:" />
                                <input id="y" layout_weight="3" inputType="number" hint="y" />
                                
                            </horizontal>
                            <vertical marginBottom='50'>
                            </vertical>
                        </vertical>
                    </vertical>
                    
                </ScrollView>
                
            </vertical>
    );

    ui.statusBarColor(theme.bar);

    var height = device.height,
        width = device.width;

    var 宿舍6房间位置 = [{
        "name": "宿舍1",

    }, {
        "name": "宿舍2",

    }, {
        "name": "宿舍3",

    }, {
        "name": "宿舍4",

    }, {
        "name": "宿舍5",

    }, {
        "name": "宿舍6",

    }];
    var 快捷头像位置 = [{
        "name": "小伙伴1",

    }, {
        "name": "小伙伴2",

    }, {
        "name": "小伙伴3",

    }]
    if (!files.exists("../library/coordinate.json")) {

        ui.宿舍6房间位置.setDataSource(宿舍6房间位置)



        ui.快捷头像位置.setDataSource(快捷头像位置);
    } else {
        var coord = JSON.parse(files.read("../library/coordinate.json"));
        update(coord)

    }

    function update(coord) {
        ui.run(() => {
            if (coord.coordinate.返回 && coord.coordinate.返回.x) {
                ui.返回.getChildAt(2).setText(coord.coordinate.返回.x.toString());
                ui.返回.getChildAt(4).setText(coord.coordinate.返回.y.toString());
            }
            if (coord.coordinate.主页面 && coord.coordinate.主页面.x) {
                ui.主页面.getChildAt(2).setText(coord.coordinate.主页面.x.toString());
                ui.主页面.getChildAt(4).setText(coord.coordinate.主页面.y.toString());
            }

            ui.主页展开.getChildAt(2).setText(coord.coordinate.主页展开.x.toString());
            ui.主页展开.getChildAt(4).setText(coord.coordinate.主页展开.y.toString());
            ui.手册图标位置.getChildAt(2).setText(coord.coordinate.手册图标位置.x.toString());
            ui.手册图标位置.getChildAt(4).setText(coord.coordinate.手册图标位置.y.toString());
            if (coord.宿舍.宿舍房间位置.length != 0) {
                ui.宿舍6房间位置.setDataSource(coord.宿舍.宿舍房间位置);
            } else {
                ui.宿舍6房间位置.setDataSource(宿舍6房间位置);
                ui.房间初始化.checked = true;
                ui.宿舍6房间位置.setVisibility(8);
            }
            ui.快捷头像位置.setDataSource(coord.宿舍.快捷头像位置);

            ui.攻击键.getChildAt(2).setText(coord.combat.攻击键.x.toString());
            ui.攻击键.getChildAt(4).setText(coord.combat.攻击键.y.toString());
            ui.信号球1.getChildAt(2).setText(coord.combat.信号球1.x.toString());
            ui.信号球1.getChildAt(4).setText(coord.combat.信号球1.y.toString());
            ui.信号球2.getChildAt(2).setText(coord.combat.信号球2.x.toString());
            ui.信号球2.getChildAt(4).setText(coord.combat.信号球2.y.toString());
        })
    }

    //创建选项菜单(右上角)
    ui.emitter.on("create_options_menu", menu => {
        menu.add(language.create_options_menu1);
    });
    //监听选项菜单点击
    ui.emitter.on("options_item_selected", (e, item) => {
        switch (item.getTitle()) {
            case language.create_options_menu1:
                engines.execScriptFile("../工具/图色助手/main.js");
                break
        }
        e.consumed = true;
    });


    activity.setSupportActionBar(ui.toolbar);
    activity.getSupportActionBar().setDisplayHomeAsUpEnabled(true);
    ui.toolbar.setNavigationOnClickListener({
        onClick: function() {
            if (stockpile()) {
                return
            }
            ui.finish();
        }
    });

    ui.adaption.click(() => {
        self_adaption();

    })
    ui.preset.on("click", () => {
        var dir = "../library/coordinate/";
        var jsFiles = files.listDir(dir, function(name) {
            return name.endsWith(".json") && files.isFile(files.join(dir, name));
        });

        coord_ui = ui.inflate(
            <vertical bg="{{theme.bg}}">
                            <vertical w="*" h="*">
                                <card gravity="center_vertical" cardElevation="0dp" margin="0" cardBackgroundColor="#eff0f4">
                                    <img src="file://res/icon.png" w="50" h="30" margin="0" layout_gravity="center|left" />
                                    <text text="{{language['coord_ui_preset_list']}}" gravity="center|left" textColor="#000000" marginLeft="50" />
                                    
                                    <linear gravity="center||right" marginLeft="5" >
                                        <img id="Exit" marginRight="8" src="@drawable/ic_clear_black_48dp" w="35" h="35" tint="#000000" foreground="?attr/selectableItemBackground" clickable="true" />
                                        
                                    </linear>
                                    
                                </card>
                            </vertical>
                            
                            <ScrollView  >
                                <vertical w="*" h="*" >
                                    
                                    <View bg="#f5f5f5" w="*" h="2" />
                                    
                                    
                                    <vertical id="car" marginBottom='20'>
                                        <text id="Device_resolution" text="加载中" padding="20 0" />
                                        <text id="Tips" bg="#FF69B4" margin="16 0" textStyle="bold" textColor="#ffffff" text="{{language['coord_ui_Tips']}}" w="auto" />
                                        
                                        <list id="coord_jsfile" visibility="visible" padding="20 0">
                                            <card w="*" h="30" cardCornerRadius="3dp" cardBackgroundColor="#ffffff"
                                            cardElevation="0dp" id="tucolos" foreground="?selectableItemBackground">
                                            <text id="coord_jsname" text="{{this.name}}" textColor="#222222" textSize="15" margin="5" gravity="center|left" />
                                        </card>
                                    </list>
                                </vertical>
                                <linear w="*" gravity="center">
                                    <text id="import" textColor="#03a9f4" text="{{language['import']}}" w="auto" padding="10 8"  foreground="?attr/selectableItemBackground" clickable="true" />
                                </linear>
                            </vertical>
                        </ScrollView>
                        </vertical>, null, true);

        coord_dialog = dialogs.build({
            type: 'app',
            customView: coord_ui,
            wrapInScrollView: false
        }).show();
        coord_ui.Device_resolution.setText(language['coord_ui_Device_resolution'] + device.width + "x" + device.height)

        if (jsFiles.length != 0) {
            let jsFiles_ = []
            for (let i = 0; i < jsFiles.length; i++) {
                jsFiles_.push({
                    name: language['coord_jsname'] + [i + 1] + ": " + jsFiles[i].toString().replace('.json', ''),
                    path: files.join(dir, jsFiles[i]),
                    i: i
                })
            }

            coord_ui.coord_jsfile.setDataSource(jsFiles_);
        }
        coord_ui.Exit.on("click", function() {

            coord_dialog.dismiss();
        })

        coord_ui.coord_jsfile.on("item_bind", function(itemView, itemHolder) {
            itemView.tucolos.on("click", function() {
                let item = itemHolder.item;
                coord_dialog.dismiss();
                let coord = JSON.parse(files.read(item.path));
                try {
                    update(coord);
                } catch (e) {
                    toastLog(language.fill_tips + e)
                }
            })
        });

        coord_ui.import.on("click", (view) => {
            coord_dialog.dismiss();
            File_selector(".json");
        })

    })
    ui.export.on("click", (view) => {
        if (stockpile(true) == false) {
            let path = files.path("/sdcard/Download/" + width + "x" + height + ".json");
            log("文件是否存在：" + files.exists("../library/coordinate.json"))
            if (files.copy("../library/coordinate.json", path)) {
                toastLog("成功保存至下载目录,\n路径:" + path);
            } else {
                toastLog("保存" + path + "失败")

            }
        }
    })

    ui.房间初始化.on("check", (checked) => {
        checked ? ui.宿舍6房间位置.setVisibility(8) : ui.宿舍6房间位置.setVisibility(0);

    });

    //当离开本界面时保存data
    ui.emitter.on("back_pressed", (e) => {
        if (stockpile()) {
            e.consumed = true;
            return
        }
    });

    function self_adaption() {
        let coord = JSON.parse(files.read("../library/coordinate/1080x2160.json"));
        update(coord)
        //获取ui.interface下的所有输入框
        ui.post(() => {
            for (let i = 0; i < ui.interface.getChildCount(); i++) {
                let view_aggregate = ui.interface.getChildAt(i)
                //不知道咋判断视图类型
                if (view_aggregate.toString().indexOf("JsListView") > 0) {
                    for (let j = 0; j < view_aggregate.getChildCount(); j++) {
                        let list_horizontal = view_aggregate.getChildAt(j)
                        for (let l = 0; l < list_horizontal.getChildCount(); l++) {
                            let list_horizontal_aggregate = list_horizontal.getChildAt(l);
                            if (list_horizontal_aggregate.toString().indexOf("JsEditText") > 0 && list_horizontal_aggregate.getInputType() == 2) {

                                console.info(list_horizontal_aggregate.getText())
                                ui.run(() => {
                                    list_horizontal_aggregate.setText(adaption(list_horizontal_aggregate.getText(), list_horizontal_aggregate.getHint() == "x" ? true : false).toString())
                                })
                            }
                        }

                    }

                } else if (view_aggregate.toString().indexOf("JsLinearLayout") > 0) {
                    for (let k = 0; k < view_aggregate.getChildCount(); k++) {
                        let son_view = view_aggregate.getChildAt(k);
                        if (son_view.toString().indexOf("JsEditText") > 0 && son_view.getInputType() == 2) {

                            console.info(son_view.getText())
                            ui.run(() => {
                                son_view.setText(adaption(son_view.getText(), son_view.getHint() == "x" ? true : false).toString());
                            })
                        }
                    }

                }

            }
            toastLog("换算完成");
        }, 1000)


        function adaption(value, type) {

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

            value = Number(value);
            return type ? frcx(value) : frcy(value)

        }

    }

    function stockpile(value) {
        let message = [];
        var 返回 = [Number(ui.返回.getChildAt(2).getText()), Number(ui.返回.getChildAt(4).getText())];
        var 主页面 = [Number(ui.主页面.getChildAt(2).getText()), Number(ui.主页面.getChildAt(4).getText())];
        var 主页展开 = [Number(ui.主页展开.getChildAt(2).getText()), Number(ui.主页展开.getChildAt(4).getText())];

        var 手册图标位置 = [Number(ui.手册图标位置.getChildAt(2).getText()), Number(ui.手册图标位置.getChildAt(4).getText())];


        if (返回[0] == '' || 返回[1] == '') {
            // message.push(language.return)
        }
        if (主页面[0] == '' || 主页面[1] == '') {
            // message.push(language.mainpage)
        }
        if (主页展开[0] == '' || 主页展开[1] == '') {
            message.push(language.unfold)
        }
        if (手册图标位置[0] == '' || 手册图标位置[1] == '') {
            message.push(language.manualicon)
        }

        if (ui.房间初始化.checked) {
            宿舍6房间位置 = [];

        } else {
            for (let i = 0; i < ui.宿舍6房间位置.getChildCount(); i++) {
                if (ui.宿舍6房间位置.getChildAt(i).getChildAt(1).getText() != '') {
                    宿舍6房间位置[i]['name'] = ui.宿舍6房间位置.getChildAt(i).getChildAt(1).getText().toString();
                };
                if ((宿舍6房间位置[i]['x'] = Number(ui.宿舍6房间位置.getChildAt(i).getChildAt(3).getText())) == '') {
                    message.push('宿舍' + [i + 1] + '位置');
                    break
                };
                if ((宿舍6房间位置[i]['y'] = Number(ui.宿舍6房间位置.getChildAt(i).getChildAt(5).getText())) == '') {
                    message.push('宿舍' + [i + 1] + ' 位置');
                };
            }
        }

        for (let i = 0; i < ui.快捷头像位置.getChildCount(); i++) {

            if (ui.快捷头像位置.getChildAt(i).getChildAt(1).getText() != '') {
                快捷头像位置[i]['name'] = ui.快捷头像位置.getChildAt(i).getChildAt(1).getText().toString();
            };
            if ((快捷头像位置[i]['x'] = Number(ui.快捷头像位置.getChildAt(i).getChildAt(3).getText())) == '') {
                message.push('小伙伴' + [i + 1] + '位置');
                break
            };
            if ((快捷头像位置[i]['y'] = Number(ui.快捷头像位置.getChildAt(i).getChildAt(5).getText())) == '') {
                message.push('小伙伴' + [i + 1] + '位置');
            };

        }


        var 攻击键 = [Number(ui.攻击键.getChildAt(2).getText()), Number(ui.攻击键.getChildAt(4).getText())];

        var 信号球1 = [Number(ui.信号球1.getChildAt(2).getText()), Number(ui.信号球1.getChildAt(4).getText())];
        var 信号球2 = [Number(ui.信号球2.getChildAt(2).getText()), Number(ui.信号球2.getChildAt(4).getText())];

        if (攻击键[0] == '' || 攻击键[1] == '') {
            message.push(language.attackkey)
        }
        if (信号球1[0] == '' || 信号球1[1] == '') {
            message.push(language.signalball1)
        }
        if (信号球2[0] == '' || 信号球2[1] == '') {
            message.push(language.signalball2);
        }

        if (message.length != 0) {
            let con_ = message + (value ? language['import_tips'] : language['leave_tips'])
            let view = dialogs.build({
                type: "app",
                title: language['leave_title'],
                titleColor: "#000000",
                contentColor: "#F44336",
                content: con_,
                positive: language['leave_positive'],
                negative: value ? null : language['leave_negative'],
                cancelable: false,
                canceledOnTouchOutside: false,
                // view高度超过对话框时是否可滑动
                wrapInScrollView: false,
                // 按下按钮时是否自动结束对话框
                autoDismiss: true
            }).on("negative", () => {
                exit();
            }).show()
            return true
        }
        var coordinate = {
            "name": width + "x" + height,
            "w": width,
            "h": height,
            "coordinate": {
                "返回": {
                    "x": 返回[0],
                    "y": 返回[1]
                },
                "主页面": {
                    "x": 主页面[0],
                    "y": 主页面[1]
                },
                "主页展开": {
                    "x": 主页展开[0],
                    "y": 主页展开[1]
                },
                "手册图标位置": {
                    "x": 手册图标位置[0],
                    "y": 手册图标位置[1]
                }
            },
            "宿舍": {
                "宿舍房间位置": 宿舍6房间位置,
                "快捷头像位置": 快捷头像位置,


            },

            "combat": {
                "攻击键": {
                    "x": 攻击键[0],
                    "y": 攻击键[1]
                },
                "信号球1": {
                    "x": 信号球1[0],
                    "y": 信号球1[1]
                },
                "信号球2": {
                    "x": 信号球2[0],
                    "y": 信号球2[1]
                }
            }

        }
        log(JSON.stringify(coordinate))
        files.write(
            "../library/coordinate.json",
            JSON.stringify(coordinate),
            (encoding = "utf-8")
        )
        toastLog(language['toast_save'])
        return false;
    }

    function File_selector(mime_Type, fun) {

        toastLog(language["import_prompt"]);

        threads.start(function() {
            let FileChooserDialog = require("../utlis/file_chooser_dialog.js");
            FileChooserDialog.build({
                title: language["import_prompt"],
                type: "app-or-overlay",
                // 初始文件夹路径
                dir: "/sdcard/",
                // 可选择的类型，file为文件，dir为文件夹
                canChoose: ["file"],
                mimeType: mime_Type,
                wrapInScrollView: true,
                // 选择文件后的回调
                fileCallback: (file) => {
                    if (file == null) {
                        toastLog(language["null_file"]);
                        return
                    }
                    if (file.indexOf(".json") == -1) {
                        toast(language["import_error"]);
                        console.error(language["import_error"]);
                        return
                    }

                    let coord = JSON.parse(files.read(file));
                    update(coord);
                }

            }).show()
        })
    }
})();