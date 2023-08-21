"ui";
importClass(android.graphics.Color);
importClass(android.graphics.drawable.GradientDrawable);

var tool = require('./utlis/app_tool.js');
var helper = tool.readJSON("helper")
var theme = require("./theme.js");
var language = theme.language.about;
var interface = tool.readJSON("interface");
var gather_link;

threads.start(function () {
    try {

        gather_link = JSON.parse(http.get(interface.server + "about_link.json").body.string())
    } catch (err) {
        toast("似乎无法连接服务器，错误类型:" + err)
        console.error("似乎无法连接服务器，错误类型:" + err)
        engines.stopAll()
    };
})

ui.statusBarColor(theme.bar);
ui.layout(
    <frame id="frame" bg="#ffffff">
        <vertical fitsSystemWindows="true">
            <appbar>
                <toolbar id="toolbar" title="关于应用" bg="{{theme.bar}}" />
            </appbar>
            <frame>
                <card layout_gravity="center|top" marginBottom="5" w="*" marginLeft="0" marginRight="0" h="auto" cardCornerRadius="0dp" bg="#00000000" foreground="?android:attr/selectableItemBackgroundBorderless">
                    <ScrollView>
                        <vertical >
                            <card w="*" id="ai" margin="10" h="*" cardCornerRadius="10dp"
                                cardElevation="5dp" gravity="center_vertical" foreground="?android:attr/selectableItemBackgroundBorderless">
                                <vertical paddingBottom="15" bg="#f8ebe6">
                                    <img src="file://./res/icon.png" margin="0 25 0 10" borderWidth="0dp" w="90" h="90"
                                        layout_gravity="center_horizontal" circle="true" />
                                    <text id="name" textColor="#000000" textStyle="bold" textSize="18sp"
                                        text="{{language['name']}}" gravity="center" />
                                    <text id="apply_version" text="{{language['apply_version']}}v1.0.6" margin="0" gravity="center" >
                                    </text>
                                    <text id="engine_version" text="{{language['engine_version']+app.versionName+(app.autojs.versionCode > 8082200 ? '(64位)':'(32位)')}}" margin="0" gravity="center" >
                                    </text>

                                </vertical>
                            </card>
                            <card w="*" id="indx2" margin="10 3 10 3" h="auto" cardCornerRadius="10"
                                cardElevation="5dp" gravity="center_vertical"  >
                                <vertical>

                                    <horizontal id="author" foreground="?android:attr/selectableItemBackgroundBorderless" w="*" >
                                        <text textSize="15" text="{{language['author']}}" textColor="#080808" margin="25 10 0 10" gravity="center_vertical" layout_weight="1" />
                                    </horizontal>
                                    <horizontal id="qq" foreground="?android:attr/selectableItemBackgroundBorderless" w="*" >
                                        <text textSize="15" text="QQ:3465344901" textColor="#080808" margin="25 10 0 10" gravity="center_vertical" layout_weight="1" />
                                    </horizontal>

                                    <horizontal id="open_source" foreground="?android:attr/selectableItemBackgroundBorderless" w="*" >
                                        <text textSize="15" text="{{language['open_source']}}https://github.com/qiao34653/pgr-assistant" textColor="#080808" margin="25 10 0 10" gravity="center_vertical" layout_weight="1" />
                                    </horizontal>

                                </vertical>
                            </card>

                            <card w="*" id="indx2" margin="10 3 10 3" h="*" cardCornerRadius="10"
                                cardElevation="5dp" gravity="center_vertical"  >
                                <vertical>


                                    <horizontal id="donation" gravity="center_vertical" foreground="?android:attr/selectableItemBackgroundBorderless">
                                        <text textSize="15" text="{{language['donation']}}" textColor="#080808" margin="25 10" gravity="center_vertical" />
                                        <text layout_weight="1" />
                                    </horizontal>

                                    <horizontal id="update_log" gravity="center_vertical" foreground="?android:attr/selectableItemBackgroundBorderless">
                                        <text textSize="15" text="{{language['update_log']}}" textColor="#080808" margin="25 10" gravity="center_vertical" />
                                        <text layout_weight="1" />
                                    </horizontal>

                                    <horizontal id="examine_update" gravity="center_vertical" foreground="?android:attr/selectableItemBackgroundBorderless">
                                        <text textSize="15" text="{{language['examine_update']}}" textColor="#080808" margin="25 10" gravity="center_vertical" />
                                        <text layout_weight="1" />
                                    </horizontal>


                                </vertical>
                            </card>


                            <vertical padding="0 15">
                            </vertical>
                        </vertical>

                    </ScrollView>
                </card>
            </frame>
        </vertical>
    </frame>
)
activity.setSupportActionBar(ui.toolbar);
activity.getSupportActionBar().setDisplayHomeAsUpEnabled(true);

ui.toolbar.setNavigationOnClickListener({
    onClick: function () {
        ui.finish();
    },
});


ui.ai.on("click", () => toast("你喜欢我吗"));

//ui.版本.setText("版本："+ toupdate.version(context.getPackageName()) + (app.autojs.versionCode > 8082200 ? "(64位)":"(32位)"));


ui.qq.click(() => {
    try {
        app.startActivity({
            action: "android.intent.action.VIEW",
            data: "mqqapi://card/show_pslcard?card_group&uin=" + "3465344901",
            packageName: "com.tencent.mobileqq",
        });
    } catch (err) {
        toastLog(language.qq_tips)
    }

})
ui.open_source.click(() => {
    app.openUrl("https://github.com/qiao34653/pgr-assistant");
})


//更新日志
ui.update_log.on("click", () => threads.start(Historicalupdate));

//
ui.donation.on("click", () => {
    var donationkey = require('./utlis/applaud.js')
    donationkey.donation("iVBORw0KGgoAAAANSUhEUgAA")
});

ui.examine_update.click(() => {
    require("update.js").update(true)
})


function Historicalupdate() {
    var dialog;
    try {
        dialog = dialogs.build({
            type: "app",
            content: "正在拉取云端数据",
            positive: "关闭",
            canceledOnTouchOutside: false
        })
            .show();
        let resn = http.get(interface.server + "history_update_info.txt");
        if (resn.statusCode == 200) {
            dialog.setContent("版本历史更新日志\n\n" + resn.body.string());
            dialog.setCancelable(true);
            return
        } else {
            dialog.setContent("超时，请检查你的网络!")
            return
        };
    } catch (eu) {

        dialog.setContent("拉取更新日志失败，请稍候再试\n" + eu);
        return
    }
};

function new_ui(url) {
    //  console.error(web_set)
    ui.finish()
    // exit();
}