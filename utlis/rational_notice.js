importClass(android.content.ComponentName);
importClass(android.app.PendingIntent);
importClass(android.content.Context);
importClass(android.graphics.Bitmap);
importClass(android.graphics.drawable.Icon);
importClass(android.app.NotificationChannel);
importClass(android.app.NotificationManager);
importClass(android.app.Notification);
/* -------------------------------------------------------------------------- */
let icon;

events.on("exit", function () {
    try {
        icon.large.recycle();
    } catch (e) { }
});


let tool;
if (files.exists("./utlis/app_tool.js")) {
    tool = require("./utlis/app_tool.js");
} else {
    tool = require("./app_tool.js");
}
let notes = tool.readJSON("notes")
if (notes != undefined && notes.血清数 != false) {
    function testing() {
        notes = tool.readJSON("notes")
        if (!notes.通知) {
            exit()
        }
        icon = getIcon();
        var ms = new Date(new Date()).getTime() - new Date(notes.血清时间).getTime()
        let hflz = Math.floor(ms / 60 / 1000);
        if (hflz == -1) {
            return
        }


        hflz = Math.floor(hflz / 6) + Number(notes.当前血清
            );
        if (hflz >= Number(notes.血清数.split("/")[1])) {
            hflz = Number(notes.血清数.split("/")[1])
        }

        let sylz = Number(notes.血清数.split("/")[1]) - hflz;
        if (sylz == 0) {
            notice("血清：" + hflz + " / " + notes.血清数.split("/")[1] + sense_tips(hflz))
            return
        }
        if (sylz <= 3) {
            notice("血清：" + hflz + " / " + notes.血清数.split("/")[1] + "\n ——即将溢出，" + sense_tips(hflz))
            return
        }
        notice("血清：" + hflz + " / " + notes.血清数.split("/")[1] + "\n ——" + sense_tips(hflz))


        function sense_tips(hflz) {
            let lizhishu = notes.血清数.split("/");
            lizhishu[0] = hflz;
            lizhishu[1] = Number(lizhishu[1]);
            lizhishu[2] = Number(notes.当前血清);
            if ((lizhishu[1] - lizhishu[0]) <= 0) {
                return "\n ——血清已溢出，指挥······在哪里？";
            }

            lizhishu = lizhishu[1] - lizhishu[2];
            lizhishu = lizhishu * 6;

            let time = new Date(notes.血清时间);
            time = new Date(time.setMinutes(time.getMinutes() + lizhishu))
            return "将在" + ((time.getDate() == new Date().getDate() && time.getMonth() == new Date().getMonth()) ? "今天 " : "明天 ") +
                time.getHours() + ":" + time.getMinutes() + "分左右完全恢复";
        }

    }

    testing()
    setInterval(testing, 1000 * 60 * 3);
}

/* -------------------------------------------------------------------------- */
function notice(text) {
    var manager = context.getSystemService(android.app.Service.NOTIFICATION_SERVICE);
    var channel = new NotificationChannel("id", "name", NotificationManager.IMPORTANCE_HIGH);
    channel.setShowBadge(false); // 显示徽章, 桌面app图标右上角有小红点
    manager.createNotificationChannel(channel);
    notification = new Notification.Builder(context, "id")
        //标题
        .setContentTitle("实时便笺")
        //右下角描述
        .setSubText("莺尾花")
        //内容
        .setContentText(text)
        //图标
        .setSmallIcon(icon.small)
        //时间
        .setShowWhen(true)
        //常驻
        .setOngoing(true)
        // .setLargeIcon(icon.large)
        .setTicker("this is ticker")
        .setAutoCancel(true)
        //设置意图
        .setContentIntent(
            PendingIntent.getActivity(
                context,
                0,
                new Intent().setComponent(
                    new ComponentName(context.getPackageName(), "com.stardust.autojs.inrt.SplashActivity")
                ),
                PendingIntent.FLAG_UPDATE_CURRENT
            )
        )
        .build();
    manager.notify(0, notification);
}

function getIcon() {
    let bitmap = createBitmap();
    return {
        small: Icon.createWithBitmap(bitmap),
    };
}

function createBitmap() {
    // 24dp
    let size = 36;
    let width = dp2px(size);
    let paint = new Paint();
    paint.setStyle(Paint.Style.FILL);
    paint.setAntiAlias(true);
    let bitmap = Bitmap.createBitmap(width, width, Bitmap.Config.ARGB_8888);
    let colorList = ["#dd7694", "#c3d94e", "#535164", "#779649"];
    let canvas = new Canvas(bitmap);
    paint.setColor(colors.parseColor(colorList[0]));
    canvas.drawRect(0, 0, width / 2, width / 2, paint);
    paint.setColor(colors.parseColor(colorList[1]));
    canvas.drawRect(width / 2, 0, width, width / 2, paint);
    paint.setColor(colors.parseColor(colorList[2]));
    canvas.drawRect(0, width / 2, (width / 2) * 1, width, paint);
    paint.setColor(colors.parseColor(colorList[3]));
    canvas.drawRect(width / 2, width / 2, width, width, paint);
    return bitmap;
}

function dp2px(dp) {
    const scale = context.getResources().getDisplayMetrics().density;
    return Math.floor(dp * scale + 0.5);
}