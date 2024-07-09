"ui";
//设置状态栏为透明
activity.getWindow().setStatusBarColor(android.graphics.Color.TRANSPARENT);
if (device.sdkInt >= 23) {
    activity.getWindow().getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
}
ui.layout(
    <frame>
        <vertical w="*" h="*" layout_gravity="center">
            <vertical h="*" gravity="center" >
                <img src="file://./res/icon.png" w="120" h="120" scaleType="fitXY" />
                <horizontal gravity="center" margin="0 25 0 5" >
                    <text id="loadingtext">加载中，请稍后</text>
                </horizontal>
                      <text gravity="center" id="lostext" text="" />
              
            </vertical>
        </vertical>
    </frame>
);

let cnt = 0;
setInterval(function() {
    cnt = (cnt + 1) % 5;
    ui.loadingtext.text('加载中，请稍后' + (new Array(cnt + 1)).join('.'));
}, 400);
let _proj_def_n = 'pgr-assistant';
let path = context.getExternalFilesDir(null).getAbsolutePath() + '/';
console.setGlobalLogConfig({
    "file": path + "/" + _proj_def_n + "_log.txt"
});

threads.start(function() {
    if (device.sdkInt < 24) {
        engines.execScriptFile("./activity/device_usage.js");
        setTimeout(function() {
            ui.finish();
        }, 1000);
        return
    }
    let packageName = context.packageName;
    if (false && packageName.match(/^org.autojs.autojs(pro)?$/)) {
        sleep(2000);
        // 在aj里面运行，表示为开发环境，运行路径为../dist/auto.js
        engines.execScriptFile(files.cwd() + '/../dist/auto.js', {
            path: files.cwd() + '/../'
        });
        setTimeout(function() {
            ui.finish();
        }, 1000);
    } else {

        if (!files.exists(path + _proj_def_n + '/')) {
            ui.lostext.setText("复制项目文件到Android/data/");
            let {
                filesx
            } = require('./modules/ext-files');

            filesx.copy(files.path('./'), path);
             ui.lostext.setText("重命名项目文件名");
           
            files.rename(path + 'project/', _proj_def_n);

        } else if(files.path("./").indexOf("storage") == -1&&files.path("./").indexOf("sdcard") == -1) {
             ui.lostext.setText("检验项目版本");
           
            let local_config = JSON.parse(files.read("./project.json"));
            let last_version_info = JSON.parse(files.read(path + _proj_def_n + '/project.json'));

            if (local_config["versionCode"] > last_version_info["versionCode"]||local_config["versionName"] > last_version_info["versionName"]) {
               // files.removeDir(path+_proj_def_n)
                let {
                    filesx
                } = require('./modules/ext-files');
                 ui.lostext.setText("复制项目文件到Android/data/");
           
                files.rename(files.path('./'), _proj_def_n);
                filesx.copy(files.path('../'+_proj_def_n), path);
                 ui.lostext.setText("重命名项目文件名");
           
                files.rename(files.path('../'+_proj_def_n), "project");

            }
        }
         ui.lostext.setText("运行项目");
           
        engines.execScriptFile(path + _proj_def_n + '/main.js', {
            path: path + _proj_def_n + '/'
        });
        setTimeout(function() {
            ui.finish();
        }, 1000);
    }
});