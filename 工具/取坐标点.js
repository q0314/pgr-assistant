getPosInteractive("目标中心位置")
function getPosInteractive(promptText) {
    let gotPos = false;
    let pos = [];
    let fingerReleased = false;
    let confirmed = false;
    //提示和确认按钮的框
    let confirmWindow = floaty.rawWindow(
        <frame gravity="left|top">
            <vertical bg="#7fffff7f">
                <text id="promptText" text="" textSize="14sp" />
                <button id="confirmBtn"  style="Widget.AppCompat.Button.Colored" text="确定"  />
                <button id="cancelBtn"  style="Widget.AppCompat.Button.Colored" text="取消" />
            </vertical>
        </frame>
    );
    confirmWindow.setPosition(device.height/3.5, 0);
    confirmWindow.setTouchable(true);

    let fullScreenWindow = floaty.rawWindow(<frame id="fullScreen" bg="#00000000" />);
    fullScreenWindow.setTouchable(true);
    fullScreenWindow.setSize(-1,-1);
    fullScreenWindow.fullScreen.setOnTouchListener(function(v, evt){
        if (evt.getAction() == evt.ACTION_DOWN || evt.getAction() == evt.ACTION_MOVE) {
            gotPos = true;
            pos = [parseInt(evt.getRawX().toFixed(0)) , parseInt(evt.getRawY().toFixed(0))];
        }    
        if (evt.getAction() == evt.ACTION_UP) {
            fingerReleased = true;
        }
        return true;
    });

    ui.run(()=>{
        confirmWindow.promptText.setText("请点击" + promptText);
        confirmWindow.confirmBtn.click(()=>{
            confirmed = true;
        });
        confirmWindow.cancelBtn.click(()=>{
            fingerReleased = false;
            gotPos = false;
            fullScreenWindow.setTouchable(true);
        }); 
    });

    while(!confirmed){ 
        sleep(100);
        if(fingerReleased){
            fullScreenWindow.setTouchable(false);
        }

        ui.run(function(){
            if (!gotPos) {
                confirmWindow.promptText.setText("请点击" + promptText);
            }else if(!fingerReleased){
                confirmWindow.promptText.setText("当前坐标:" + pos.toString());
            }else{
                confirmWindow.promptText.setText("当前坐标:" + pos.toString() + "\n点击'确定'结束, 点击'取消'重新获取");
            }
        });
    }

    fullScreenWindow.close();
    confirmWindow.close();
  toastLog("x："+pos[0]+",y："+pos[1])
    return {
        "x" : pos[0],
        "y" : pos[1]
    }
}