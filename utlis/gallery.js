importClass(android.graphics.drawable.GradientDrawable);
importClass(android.view.ViewGroup);
var fun,
    tukuui,
    tukuds,
    progressDialog,
    width = device.width,
    height = device.height;
    
var dwadlink = storages.create("Doolu_download");

function copy(p1, p2) {
    p1 = files.path(p1);
    p2 = files.path(p2);
    try {
        $zip.unzip(p1, p2);
    } catch (ezip) {
        if (!files.exists(p1)) {
            toastLog("解压缩异常，该路径文件不存在，\n错误报告:" + ezip)
        } else {
            toastLog("解压缩异常" + ezip)
        }
        return false;
    }
    return true;
}

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


function Dialog_prompt(title_, content_) {
    dialogs.build({
        title: title_,
        type: "app",
        content: content_,
        contentColor: "#F44336",
        positive: "好的",
        canceledOnTouchOutside: false
    }).show();

}

function gallery_view(tukuss, fun_, direction) {
    try {
        if (tukuss[0] == undefined) {
            let err = "无法拉取云端图库,请确认已是最新版本";
            toast(err)
            console.error(err)
            return
        }
    } catch (err) {
        err = "无法拉取云端图库.请确认已是最新版本";
        toast(err)
        console.error(err)
        return
    }
    tukuui = ui.inflate(
        <vertical >
            <vertical w="*" h="*">
                <card gravity="center_vertical" cardElevation="0dp" margin="0" cardBackgroundColor="#eff0f4">
                    <img src="file://res/icon.png" w="50" h="30" margin="0" layout_gravity="center|left"/>
                    <text text="图库列表" gravity="center|left" textColor="#000000" marginLeft="50"/>
                    
                    <linear gravity="center||right" marginLeft="5" >
                        <text id="wenn" textColor="#03a9f4"  text="使用帮助" padding="10" w="auto" h="auto" foreground="?attr/selectableItemBackground" clickable="true"/>
                        <img id="Exit" marginRight="8" src="@drawable/ic_clear_black_48dp" w="35" h="35" tint="#000000" foreground="?attr/selectableItemBackground" clickable="true"/>
                        
                    </linear>
                    
                </card>
            </vertical>
            
            <ScrollView  >
                <vertical w="*" h="*" >
                    
                    <View bg="#f5f5f5" w="*" h="2" />
                    <text id="wxts" autoLink="web" text="温馨" typeface="sans" margin="15 10" visibility="gone" textColor="#000000" textSize="15sp" layout_gravity="center" />
                    
                    <vertical id="parent_" visibility="gone">
                        
                        <text  text="显示X说明该功能所需的图片不全，点击展开详细图片内容。可查看缺少那些小图片。tips:小图片显示 √ 并不代表此小图片在你的设备上可用，因为分辨率不同可能导致小图片在截图上匹配失败" typeface="sans" textColor="#ff7f27" textSize="12sp"  margin="20 0" />
                        
                        <ScrollView h="{{1000}}px" id="scrollView" >
                            
                            <vertical id="content" padding="5" h="auto">
                                
                                
                            </vertical>
                        </ScrollView >
                        
                    </vertical>
                    
                    <vertical id="car" >
                        <text id="Device_resolution" text="加载中" padding="20 0"/>
                        <text id="dwh" text="加载中" padding="20 0"/>
                        <text id="Tips" bg="#FF69B4" margin="16 0" textStyle="bold" textColor="#ffffff" text="请更换与设备分辨率较为接近的图库" w="auto"/>
                        <Switch
                        id="full_resolution" padding="16 5"
                        text="全分辨率兼容模式(任意图库)_beta"
                        textSize="18sp"/>
                        
                        <list id="tukulb" visibility="visible" padding="20 0">
                            <card w="*" h="30" cardCornerRadius="3dp"
                            cardElevation="0dp" id="tucolos" cardBackgroundColor="{{this.color}}" foreground="?selectableItemBackground">
                            <text id= "tui" text="{{this.tuku}}" textColor="#222222" textSize="13" margin="5" gravity="center|left"/>
                            <text id="tutext" text="{{this.state}}" margin="10 0 10 0" textColor="#000000" textSize="15" gravity="center|right" />
                            <text text="{{this.name}}" visibility="gone" textSize="15"/>
                        </card>
                    </list>
                </vertical>
                <linear>
                    <button id="tuku_jy" h="auto" margin="0 -5 0 0" textSize="15"  layout_weight="1" text="检查图库" style="Widget.AppCompat.Button.Borderless.Colored"/>
                    
                    <button id="tuku_choice" h="auto" margin="0 -5 0 0" textSize="15" layout_weight="1" text="导入自定义图库" style="Widget.AppCompat.Button.Borderless.Colored"/>
                </linear>
            </vertical>
        </ScrollView>
        </vertical>, null, true);

    tukuds = dialogs.build({
        type: 'app',
        customView: tukuui,
        wrapInScrollView: false
    })
    fun = fun_;
    if (fun != undefined) {
        tukuui.full_resolution.checked = fun("full_resolution", "get_") ? true : false;
        tukuui.full_resolution.setTextColor(colors.parseColor(theme.text));
        setBackgroundRoundRounded(tukuds.getWindow(), 0)

    }
    tukuds.getWindow().setLayout(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
    tukuds.show();


    //tukuds.getWindow.setAttributes(params);
    tukuui.full_resolution.on("click", (view) => {
        if (view.checked) {
            let re = /\d+/;
            let ac_hy;
            let av_wx;
            let tuku_de = files.read("./mrfz/tuku/分辨率.txt")
            tuku_de = tuku_de.split("×");
            if (tuku_de.length == 1) {
                tuku_de = tuku_de.split("x");
                console.error(tuku_de)
            }
            tuku_de[0] = tuku_de[0].replace(/[^\d]/g, "")
            tuku_de[1] = tuku_de[1].replace(/[^\d]/g, "")
            ac_hy = height - tuku_de[0];
            av_wx = width - tuku_de[1];

            if (re.exec(ac_hy)[0] < 230 && re.exec(av_wx)[0] < 170) {
                Dialog_prompt("警告", "你的设备分辨率与图库分辨率相近，我们并不建议你打开此功能，可能会适得其反")
            }
        }
        fun("full_resolution", view.checked)
    })
    tukuui.wxts.setText(" 1. 没有适合你的图库？\n参考以下教程动手制作 https://kdocs.cn/l/cqg2It4zMrQL。 同时欢迎把图库上传到云端，分享给其他人使用(关于应用-联系作者)。 或使用虚拟机、模拟器等自调适合的分辨率，左边高度×右边宽度，DPI随意" +
        "\n 2. 模拟器如何使用？\n雷电、夜神、逍遥等，分辨率需调为手机版分辨率，分辨率反的说明你设置的是平板版，选择相反分辨率的图库即可，内存请设置4G+，否则明日计划在后台时容易被杀" +
        "\n 3. 关于图库 \n图库非常重要，由一堆小图片组成，这些在明日计划里是被拿来在大图(屏幕截图)上匹配小图片以便确认按钮位置，所以图库与设备的兼容性决定了某些功能是否能用。\n目前，图库与设备分辨率宽度一致，而高度误差不超过230左右，或高度一致，而宽度误差不超过170左右，基本上是可以使用的，但不排除某些小图片在你的设备上无法匹配，导致某功能失效。")
    tukuui.Exit.on("click", function() {
        if (tukuui.parent_.getVisibility() == 0) {
            tukuui.parent_.setVisibility(8)
            tukuui.car.setVisibility(0);
            return
        }
        tukuds.dismiss()
    })
    tukuui.wenn.on('click', function() {
        if (tukuui.wxts.getHint() == "true") {
            tukuui.wxts.setVisibility(8)
            tukuui.wxts.setHint("false");
            if (tukuui.parent_.getVisibility() == 8) {

                tukuui.car.setVisibility(0)
            }
            tukuui.wenn.setTextColor(colors.parseColor("#03a9f4"))
        } else {
            tukuui.wxts.setVisibility(0)
            tukuui.wxts.setHint("true");
            tukuui.car.setVisibility(8);

            tukuui.wenn.setTextColor(colors.parseColor("#f4a406"))
        }
    })

    tukuui.tuku_jy.on('click', function() {
        if (fun == undefined) {
            return
        }
        progressDialog = dialogs.build({
            type: "app",
            progress: {
                max: -1,
                //  showMinMax: true
            },
            content: "正在获取校验列表中...",
            //    customView: dowui,
            positive:"取消",
            cancelable: false,
            canceledOnTouchOutside: false
        }).on("dismiss", () => {
            progressDialog = false;
        }).on("positive",()=>{
           图库列表 = null;
           progressDialog.dismiss();
        }).show()
        for (let i = tukuui.content.getChildCount() - 1; i >= 0; i--) {
            tukuui.content.removeViewAt(i)
        }
        
        let url = fun("检验")
        let 图库列表 = url;
        threads.start(function() {
            url = http.get(url + "tulili/图库列表.json");
            if (url.statusCode == 200) {
                图库列表 = JSON.parse(url.body.string());
                url = true;

            } else {
                !progressDialog && progressDialog.dismiss();

                toastLog("图库校验列表请求失败!");
                图库列表 = null;
            }
        })
        threads.start(function() {
            while (true) {
                if (图库列表 == null || url == true) {
                    break
                }
                sleep(200)
            }
            if (图库列表 == null) {
                return
            }


            function jiance(tukuwj) {
                var nofiles = []
                for (var i = 0; i < tukuwj.length; i++) {
                    if (!files.exists(files.path("./mrfz/tuku/") + tukuwj[i])) {
                        nofiles.push(tukuwj[i])
                    }
                }
                return nofiles;
            }
            if (progressDialog) {
                progressDialog.setContent("正在校验图库文件中...")
            }
            ui.run(()=> {
                tukuui.parent_.setVisibility(0)
                tukuui.car.setVisibility(8);

                for (let i = 0; i < 图库列表.length; i++) {
                    let on_file = jiance(图库列表[i].图片);
                    let AddText = ui.inflate(
                        <vertical w="*" h="auto"  margin="20 0 0 0">
                                                    <linear id="功能">
                                                        <text id="name"
                                                        margin="0 0"
                                                        textSize="15sp"
                                                        textColor="#1E90FF"
                                                        layout_gravity="center"
                                                        w="auto" />
                                                        
                                                        <img id="files_ok" visibility="visible" src="@drawable/ic_check_black_48dp" tint="green" w="25" h="25" margin="5 0" />
                                                        <img id="files_on" visibility="gone" src="@drawable/ic_clear_black_48dp" tint="red" w="25" h="25" margin="5 0" />
                                                        
                                                    </linear>
                                                    <list id="on_file" h="*" w="auto" visibility="gone">
                                                        <linear  margin="15 0" h="{{65}}px" w="auto">
                                                            <text text="{{this.图片}}" textSize="15"/>
                                                            <img id="file_ok" visibility="{{this.状态 ? 'visible' : 'gone' }}" src="@drawable/ic_check_black_48dp" tint="green" w="auto" h="auto" margin="5 0" />
                                                            <img id="file_on" visibility="{{this.状态 ? 'gone' : 'visible' }}" src="@drawable/ic_clear_black_48dp" tint="red" w="auto" h="auto" margin="5 0" />
                                                            
                                                        </linear>
                                                    </list>
                                                </vertical>,
                        tukuui.content
                    );
                    ui.run(() => {
                        AddText.name.setText("◆功能：" + 图库列表[i].功能);
                        let on_file_s = []
                        for (let j = 0; j < 图库列表[i].图片.length; j++) {
                            let 状态 = true;

                            //图片在列表存在
                            if (on_file.indexOf(图库列表[i].图片[j]) > -1) {
                                状态 = false;
                                if (AddText.files_on.getVisibility() == 8) {
                                    AddText.files_on.setVisibility(0);
                                    AddText.files_ok.setVisibility(8);
                                }

                            }
                            on_file_s.push({
                                图片: 图库列表[i].图片[j],
                                状态: 状态,
                            })

                        }
                        AddText.on_file.setDataSource(on_file_s)
                        tukuui.content.addView(AddText);
                        var ChildCount = tukuui.content.getChildCount();

                        for (let i = 0; i < ChildCount; i++) {
                            let ui_ = tukuui.content.getChildAt(i);
                            ui_.getChildAt(0).removeAllListeners();
                            ui_.getChildAt(0).click(function(e) {
                                if (e.getChildAt(0).getText().toString().indexOf("◆") > -1) {
                                    ui_.getChildAt(1).setVisibility(0)
                                    let text = e.getChildAt(0).getText().toString().replace("◆", "◇");
                                    e.getChildAt(0).setText(text)
                                } else {
                                    ui_.getChildAt(1).setVisibility(8)
                                    let text = e.getChildAt(0).getText().toString().replace("◇", "◆");
                                    e.getChildAt(0).setText(text)

                                }
                            });

                        }

                    })

                }
                if (progressDialog) {
                    progressDialog.dismiss()
                }
            })
        })
    })

    tukuui.Device_resolution.setText("当前设备分辨率{" + device.height + "×" + device.width + "}")
    tukuui.Device_resolution.setVisibility(8);
    tukuui.dwh.setVisibility(8);
    tukuui.Tips.setText(" 正在努力获取云端配置，请稍候... ");
    if (files.exists("./mrfz/tuku/分辨率.txt")) {
        tukuui.dwh.setText("当前使用图库：" + files.read("./mrfz/tuku/分辨率.txt"));
    } else {
        tukuui.dwh.setText("当前使用图库：空");
    }

    try {
        for (let jmg = 0; jmg < tukuss.length; jmg++) {
            if (files.exists("./mrfz/tukucf/" + tukuss[jmg].name + ".zip")) {
                tukuss[jmg].state = "使用";
                tukuss[jmg].color = "#ffffff";
            } else {
                tukuss[jmg].state = "下载";
                tukuss[jmg].color = "#ffffff";
            }

        }
        tukuui.Device_resolution.setVisibility(0);
        tukuui.dwh.setVisibility(0);
        tukuui.Tips.setText(" 请更换与设备分辨率较为接近的图库\n 例：设备分辨率2160x1080可用2340x1080图库 ");

        tukuui.tukulb.setDataSource(tukuss);
    } catch (e) {
        console.error(e)
        //tukuds.dismiss()
        //return
    }
    tukuui.tuku_choice.on("click", () => {
        toast("导入的图库内图片名称需符合官方的，尽量不少一张图片！！！\n待用文件夹的除外")
        startChooseFile(".zip", fun);

    })

    tukuui.tukulb.on("item_bind", function(itemView, itemHolder) {
        itemView.tucolos.on("click", function() {
            removeByVal(tukuss, "使用中", "修改");
            let item = itemHolder.item;
            let current;
            for (let j = 0; j < tukuss.length; j++) {
                if (itemView.tui.text() == tukuss[j].tuku) {
                    if (itemView.tutext.text() == "使用" || itemView.tutext.text() == "更换失败") {
                        if (更换图库(tukuss[j].name, fun)) {
                            item.state = "使用中";
                        } else {
                            item.state = "更换失败";
                        }
                        item.color = "#00bfff";
                        $ui.post(() => {
                            tukuui.tukulb.setDataSource(tukuss);
                        }, 30);
                        break
                    } else if (itemView.tutext.text() == "下载") {
                        //  current = tukuss[j].链接;
                        if (!progressDialog) {
                            图库下载(tukuss[j].链接, tukuss[j].name, item, fun);
                            progressDialog = dialogs.build({
                                type: "app",
                                progress: {
                                    max: 100,
                                    //  showMinMax: true
                                },
                                content: "正在下载中...",
                                //    customView: dowui,
                                cancelable: false,
                                canceledOnTouchOutside: false
                            }).show()
                        } else {
                            toast("你的操作太快啦");
                        }
                        break;
                    }
                }
            }
            return true;
        });
    })

    tukuui.tukulb.on("item_long_click", function(e, item, i, itemView, listView) {
        if (itemView.tutext.text() == "下载失败" || itemView.tutext.text() == "使用" || itemView.tutext.text() == "更换失败") {
            dialogs.build({
                type: "app",
                title: "确定要删除" + item.tuku + "分辨率图库吗？",
                positive: "确定",
                negative: "取消"
            }).on("positive", () => {
                files.remove("./mrfz/tukucf/" + item.name + ".zip");
                item.state = "下载";
                itemView.tutext.setText("下载");
            }).show()
        }
        e.consumed = true;
    });

}

function 选择图库(tukuss, fun) {
    let re = /\d+/;
    let ac_hy;
    let av_wx;
    
    for (var i = 0; i < tukuss.length; i++) {
        ac_hy = height - tukuss[i].高;
        av_wx = width - tukuss[i].宽;
    /*
        if (device.product == "cancro_x86_64") {
            switch (true) {
                case height == 720:
                case width == 1280:
                    console.info("mumu");
                    ac_hy = height - tukuss[i].宽;
                    av_wx = width - tukuss[i].高;
                    break
                case height == 1080:
                case width == 1920:
                    console.info("mumu");
                    ac_hy = height - tukuss[i].宽;
                    av_wx = width - tukuss[i].高;
                    break
            }
        }
        */
        if (re.exec(ac_hy)[0] < 230 && re.exec(av_wx)[0] < 170) {
            ac_hy = tukuss[i].name;
            if (files.exists("./mrfz/tukucf/" + ac_hy + ".zip")) {
                if (!copy("./mrfz/tukucf/" + ac_hy + ".zip", "./mrfz")) {
                    Dialog_prompt("请确认", "首次运行复制图库失败！可能不支持你手机的分辨率！请点击左上角头像-更换图库，手动更换")

                    return false
                } else {
                    Dialog_prompt("请知晓", "已为您当前设备分辨率{" + device.height + "×" + device.width + "}\n智能选择" + files.read("./mrfz/tuku/分辨率.txt") + "图库\n如不合适请点击左上角头像-更换图库")
                    return true
                }
            } else {

                图库下载(tukuss[i].链接, tukuss[i].name, undefined, fun);
                return
            }
        } else if (i + 1 == tukuss.length) {

            let dialog = dialogs.build({
                title: "警告⚠",
                titleColor: "#F44336",
                type: "app",
                content: "程序选择图库失败！当前没有适合你手机分辨率的图库！\n\n你的设备将无法正常使用明日计划\n\n请点击左上角头像加入QQ群获取教程制作图库，或使用虚拟机/模拟器改与图库相合适的手机版分辨率即可",
                contentColor: "#F44336",
                positive: "我已知晓",
                positiveColor: "#000000",
                canceledOnTouchOutside: false
            })
            if (device.product.indexOf("cancro") != -1) {
               if (device.release != 9 && width != 1280 && height != 720 && width != 1920 && height != 1080) {
                    dialog.setContent("你的设备环境貌似是mumu模拟器，\n当前安卓版本：" + device.release + "，非兼容版本，请更换为安卓9的版本。\n当前分辨率：" + width + "x" + height + "，明日计划图库貌似还没有适合的，请在mumu设置中心-界面设置，更换为宽1280x高720或宽1920x高1080");
                    dialog.show();
                    return
                }
                if (width != 1280 && height != 720 && width != 1920 && height != 1080) {
                    dialog.setContent("你的设备环境貌似是mumu模拟器，\n当前分辨率：" + width + "x" + height + "，明日计划图库貌似还没有适合的，请在mumu设置中心-界面设置，更换为宽1280x高720或宽1920x高1080");
                    dialog.show();
                    return
                }
                switch (true) {
                    case device.release != 9:
                        dialog.setContent("你的设备环境貌似是mumu模拟器，当前安卓版本：" + device.release + "，非兼容版本，请更换为安卓9的版本");
                        dialog.show();
                        return
                }
                
            }else if (device.width > device.height) {
                   dialog.setContent("检测到你的设备分辨率貌似是平板版分辨率，而且图库列表没有可兼容的，\n请点击左上角头像-更换图库，将模拟器更换与图库分辨率相反的分辨率，再打开设置——兼容模拟器平板版即可\n当前分辨率：" + width + "x" + height);
                    dialog.show();
                    return
                
            }

            dialog.show();
        }
    }
}

function 图库下载(link, name, item, fun) {
    datali = {}
    //link = "https://qiao0314.coding.net/p/ceshixiazai/d/q0314/git/raw/master/tulili/"+link;
    datali.link = link;
    datali.id = "图库";
    datali.prohibit = true;
    datali.myPath = files.path("./mrfz/tukucf/");
    datali.fileName = name + ".zip";
    dwadlink.put("data", datali);
    files.createWithDirs("./mrfz/tukucf/")
    engines.execScriptFile("./lib/download.js");
    //监听脚本间广播'download'事件
    if (item != undefined) {
        item.color = "#00bfff";
    }
    events.broadcast.on("download" + datali.id, function(X) {
        if (X.name == "进度") {
            if (progressDialog) {
                ui.run(() => {
                    progressDialog.setProgress(X.data);
                })
            }
        } else if (X.name == "结果") {
            if (X.data == "下载完成") {
                let event_ = events.broadcast.listeners("download" + datali.id)[0];
                events.broadcast.removeListener("download" + datali.id, event_);
                removeByVal(tukuss, "使用中", "修改");
                if (item != undefined) {
                    setTimeout(function() {

                        if (更换图库(name, fun)) {
                            item.state = "使用中";
                        } else {
                            item.state = "更换失败"
                        }
                    }, 200);
                    $ui.post(() => {
                        if (progressDialog) {
                            progressDialog.dismiss()
                            progressDialog = false
                        }
                        name = null;
                        if (tukuui) {
                            tukuui.tukulb.setDataSource(tukuss);
                        }
                    }, 350);

                } else {
                    if (progressDialog) {
                        progressDialog.dismiss()
                        progressDialog = false
                    }
                    if (更换图库(name, fun)) {
                        Dialog_prompt("请知晓", "已为您当前设备分辨率{" + device.height + "×" + device.width + "}\n智能选择" + files.read("./mrfz/tuku/分辨率.txt") + "图库\n如不合适请点击左上角头像-更换图库\n游戏内的异形屏UI适配尽量设置为0。")
                        /* dialogs.build({
                             title: "请知晓",
                             type: "app",
                             content: "已为您当前设备分辨率{" + height + "×" + width + "}\n智能选择" + files.read("./mrfz/tuku/分辨率.txt") + "图库，如不合适请手动在左上角进行更换\n游戏内的异形屏UI适配尽量设置为0。",
                             contentColor: "#F44336",
                             positive: "好的",
                             canceledOnTouchOutside: false
                         }).show();*/
                    } else {
                        Dialog_prompt("请确认", "首次运行复制图库失败！可能不支持你手机的分辨率！请打开左上角头像-更换图库手动更换相近分辨率，或使用虚拟机/模拟器更改为手机版分辨率即可")
                        /*  dialogs.build({
                              title: "请确认",
                              type: "app",
                              content: "首次运行复制图库失败！可能不支持你手机的分辨率！请打开右上角抽屉手动更换相近分辨率，或使用虚拟机/模拟器更改分辨率即可",
                              positive: "好的",
                              canceledOnTouchOutside: false
                          }).show();
                          */
                    }
                    name = null;
                }

                return
            }
        } else if (X.name == "关闭") {
            let event_  = events.broadcast.listeners("download" + datali.id)[0];
            events.broadcast.removeListener("download" + datali.id, event_ );
            if (progressDialog) {
                progressDialog.dismiss();
                progressDialog = false;
            }
            if (item != undefined) {
                item.color = "#ffffff";
                toastLog("这都下载不了？进群下全图库包");
                item.state = "下载失败";
                $ui.post(() => {
                    if (tukuui) {
                        tukuui.tukulb.setDataSource(tukuss);
                    }
                    $app.startActivity({
                        data: "mqqapi://card/show_pslcard?card_type=group&uin=" + jlink_mian.群号,
                    })

                }, 800)
            }

            return
        }

    });
}

function 更换图库(fbl, fun) {
    files.removeDir("./mrfz/tuku");
    if (copy("./mrfz/tukucf/" + fbl + ".zip", "./mrfz/")) {
        if (tukuui) {
            tukuui.dwh.setText("当前使用图库：" + files.read("./mrfz/tuku/分辨率.txt"));
        }

        if (fbl.indexOf("日") > -1 || fbl.indexOf("美") > -1) {
            toastLog("日服&美服不能使用自启动方舟、上次作战、定时任务等");
            fun("检测", "外服")
        } else {
            if (fbl.indexOf("平板版") > -1) {
                toastLog("平板版图库，请前往设置，打开修复模拟器竖屏。否则悬浮窗大小可能异常")
            }
            fun("检测", "国服")
        }
        return true;
    } else {
        if (tukuui) {

            tukuui.dwh.text("当前使用图库：空，复制新图库失败！\n请尝试长按图库删除掉重新下载");
        }
        return false
    }

}

function startChooseFile(mime_Type, fun) {
    let FileChooserDialog = require("./prototype/file_chooser_dialog");
    FileChooserDialog.build({
        title: '请选择后缀为.zip的压缩文件',
        type: 'app-or-overlay',
        // 初始文件夹路径
        dir: "/sdcard/",
        // 可选择的类型，file为文件，dir为文件夹
        canChoose: ["file"],
        mimeType: mime_Type,
        wrapInScrollView: true,
        // 选择文件后的回调
        fileCallback: (file) => {
            console.info("选择的文件路径" + file);
            if (file == null) {
                toastLog("未选择路径");
                return
            }
            if (file.indexOf(".zip") == -1) {
                toast("不是zip压缩文件");
                console.error("不是zip压缩文件");
                return
            }
            files.removeDir("./mrfz/tuku");

            try {
                if (copy(file, "./mrfz/")) {
                    if (!files.exists("./mrfz/tuku/分辨率.txt")) {
                        toastLog("失败，缺少必要的分辨率.txt文件\n如确认分辨率.txt存在，请检查zip编码\n尽量使用手机上的文件管理器进行压缩");
                    } else {
                        tukuui.dwh.setText("当前使用图库：" + files.read("./mrfz/tuku/分辨率.txt"));
                        toast("导入" + files.read("./mrfz/tuku/分辨率.txt") + "图库成功")
                    };
                } else {
                    toast("失败，解压缩异常，请参考现有的分辨率图库zip文件");
                    console.error("失败，解压缩异常")
                }
            } catch (er) {
                toast("失败，未知异常，请参考现有的分辨率图库zip文件" + er);
                console.error("失败，未知异常，请参考现有的分辨率图库zip文件" + er)
            }
        }
    }).show();

}
var gallery = {}
gallery.gallery_view = gallery_view;
gallery.选择图库 = 选择图库;
try {
    module.exports = gallery;
} catch (err) {
    gallery_view();
}