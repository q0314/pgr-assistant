  importClass(android.content.DialogInterface);
  importClass(android.graphics.drawable.GradientDrawable);
  importClass(com.google.android.material.bottomsheet.BottomSheetDialog);
  importClass(com.google.android.material.bottomsheet.BottomSheetBehavior);

  function lzview(callback) {
      let ui_add = ui.inflate(
          <vertical padding="10 0" >
              <text id="add_text" text="矫正血清" margin="15 20" textSize="20sp"/>
              <horizontal>
                  <com.google.android.material.textfield.TextInputLayout
                  id="edit_serum" margin="10 0"
                  layout_weight="1"
                  layout_height="wrap_content">
                  <EditText layout_width="match_parent" layout_height="wrap_content" textSize="16sp"
                  singleLine="true" inputType="number"/>
              </com.google.android.material.textfield.TextInputLayout>
            </horizontal>
          <text margin="10 0" text="由于战双并未提供可查询实时血清的API功能，所以需要手动修正血清数量，或程序自动识别" />
          </vertical>, null, false)
      var d_add = dialogs.build({
          type: 'app',
          customView: ui_add,
          positive: "确定",
          positiveColor: "#424242",
          negative: "取消",
          negativeColor: "#cc423232",
          wrapInScrollView: false
      }).on("positive", (dialog) => {
          let serum = ui_add.edit_serum.getEditText().getText()
        
         
          if (serum == "" ) {
              toastLog("当前剩余血清不可为空")
              dialog.show()
              return
          }
          
          if (Number(serum) > 160) {
              toastLog("剩余血清过高...不建议使用")
          }
          callback("当前血清",serum);
          callback("血清数", serum + "/160");
      }).on("negative", (dialog) => {
          d_add.dismiss()
      }).on("show", (dialog) => {

          ui_add.edit_serum.setHint("输入剩余血清")
         setBackgroundRoundRounded(dialog.getWindow());
      }).show()

  }

  function ssbjview(callback) {
      let ssbjview = ui.inflate(
          <vertical padding="20 10" >
              <horizontal padding="10 4" id="zdsb">
                  <vertical  layout_weight="1" >
                      <text text="(OCR)自动识别" textColor="#000000" textSize="16sp" textStyle="bold" />
                      <text text="每次脚本进入主页时，自动识别剩余血清数量" textColor="#95000000" textSize="10sp" marginTop="2" />
                  </vertical>
                  <Switch id="zdsbs"  checked="false" layout_gravity="center" />
              </horizontal>
              <View bg="#666666" h="1" w="*"/>

            
              <horizontal padding="10 4" id="lztz" >
                  <vertical  layout_weight="1" >
                      <text text="实时便笺通知栏常驻" textColor="#000000" textSize="16sp" textStyle="bold" />
                      <text text="开启此项即开启 实时便笺 功能的通知栏常驻，同时也会开启血清提醒功能。间隔刷新时间：3分钟" textColor="#95000000" textSize="10sp" marginTop="2" />
                  </vertical>
                  <Switch id="lztzs" checked="false"   layout_gravity="center"/>
              </horizontal> 
              <View bg="#666666" h="1" w="*"/>
                  <horizontal padding="10 4" id="dcyh" >
                <vertical layout_weight="1" >
                    <text text="关闭对该应用的电池优化" textColor="#000000" textSize="16sp" textStyle="bold" />
                    <text text="“实时便笺通知栏常驻”需要应用在后台运行，点击进入电池优化界面，选择无限制，并且在多任务界面锁定本软件。" textColor="#95000000" textSize="10sp" marginTop="2" />
                </vertical>
                <Switch id="dcyhs" checked="{{$power_manager.isIgnoringBatteryOptimizations()}}" layout_gravity="center" />
            </horizontal>
            <View bg="#666666" h="1" w="*" />
            
          </vertical>, null, false);
      //设置对话框

      var shezhi = dialogs.build({
          type: "app-or-overlay",
          customView: ssbjview,
          title: "实时便笺设置",
          titleColor: "#cc000000",
          wrapInScrollView: false,
          autoDismiss: false
      }).on("show", (dialog) => {

          setBackgroundRoundRounded(dialog.getWindow());
      }).show()
      try {
          ssbjview.zdsbs.checked = callback("自动识别", "get")
          ssbjview.lztzs.checked = callback("通知", "get");
      } catch (e) {

      }
      ssbjview.zdsbs.click((view) => {

          if (callback("自动识别", view.checked) == false) {
              view.checked = false;
          }
      });
      ssbjview.zdsb.click((view) => {
          ssbjview.zdsbs.performClick();
      })


      ssbjview.lztz.click((view) => {
          ssbjview.lztzs.performClick();
      });

      ssbjview.lztzs.click((view) => {
          callback("通知", view.checked);
      });

      ssbjview.dcyh.click(() => ssbjview.dcyhs.performClick())
    ssbjview.dcyhs.click((view) => {
        $power_manager.requestIgnoreBatteryOptimizations()
    })
  }
  //设置弹窗圆角和背景
  function setBackgroundRoundRounded(view, radius) {
      radius = radius || 30
      let gradientDrawable = new GradientDrawable();

      gradientDrawable.setShape(GradientDrawable.RECTANGLE);

      gradientDrawable.setColor(colors.parseColor("#eff0f4"));

      gradientDrawable.setCornerRadius(radius);

      view.setBackgroundDrawable(gradientDrawable);

  }

  try {
      exports.ssbjview = ssbjview;
      exports.lzview = lzview;
  } catch (e) {
      ssbjview()
  }