"ui";
try {
    ui.statusBarColor(theme.bar);
} catch (err) {
var theme = require("../theme.js");

}
importClass(android.content.Context);

ui.layout(
    <vertical>
        <appbar>
            <toolbar id="toolbar" bg="{{theme.bar}}" title="运行日志" />
        </appbar>
        <frame>
            <globalconsole id="globalconsole" margin="15 0 10 15" w="*" h="*"
            enabled="true" textIsSelectable="true" focusable="true" longClickable="true"/>
        </frame>
        
    </vertical>
);

ui.statusBarColor(theme.bar);
ui.globalconsole.setColor("V", "#bdbdbd");
ui.globalconsole.setColor("D", "#795548");
ui.globalconsole.setColor("I", "#1de9b6");
ui.globalconsole.setColor("W", "#673ab7");
ui.globalconsole.setColor("E", "#b71c1c");

//创建选项菜单(右上角)
ui.emitter.on("create_options_menu", menu => {
    menu.add("代码测试");
    menu.add("清空日志");
    menu.add("其他应用打开");
    menu.add("保存至下载目录");
    menu.add("导入日志(开发人员使用)")
});
var packageName = context.getPackageName();
//监听选项菜单点击
ui.emitter.on("options_item_selected", (e, item) => {
    switch (item.getTitle()) {
        case "代码测试":
            engines.execScriptFile("./activity/debug.js");
        break
        case "清空日志":
            console.clear();
            ui.globalconsole.clear();
            break;
        case "其他应用打开":
            app.viewFile("/data/data/"+packageName+"/files/logs/log.txt");
            break;
        case "保存至下载目录":
            let path = files.path("/sdcard/Download/战双辅助运行日志.txt");
            log("文件是否存在："+files.exists("/data/data/"+packageName+"/files/logs/log.txt"))
            if (files.copy("/data/data/"+packageName+"/files/logs/log.txt", path)){
                toastLog("成功保存至" + path);
            } else {
                toastLog("保存" + path + "失败")
             
            }
            break;
        case "导入日志(开发人员使用)":
            File_selector(".txt")
            break;
    }
    e.consumed = true;
});
activity.setSupportActionBar(ui.toolbar);
activity.getSupportActionBar().setDisplayHomeAsUpEnabled(true);
ui.toolbar.setNavigationOnClickListener({
    onClick: function() {
        ui.finish();
    }
});

function File_selector(mime_Type, fun) {

    toastLog("请选择后缀为.txt类型的文件");

    threads.start(function() {
        let FileChooserDialog = require("../utlis/file_chooser_dialog");
        FileChooserDialog.build({
            title: '请选择后缀为.txt的文件',
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
                    toastLog("未选择路径");
                    return
                }
                if (file.indexOf(".txt") == -1) {
                    toast("不是后缀为.txt的文件");
                    console.error("不是后缀为.txt的文件");
                    return
                }
                console.clear();
                ui.globalconsole.clear();
                log("清空旧日志")
                console.info("选择的文件路径：" + file);
                if (!files.copy(file, "/data/data/"+packageName+"/files/logs/log.txt")) {
                    //   if(!files.copy(file,"/storage/emulated/0/Android/data/org.autojs.autojspro/files/logs/log.txt")){
                    toast("导入日志" + file + "失败")
                    console.error("导入日志"+file+"失败"+random(0,9999))
                }
            }

        }).show()
    })
}