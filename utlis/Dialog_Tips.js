function Dialog_Tips(title, text, src) {
    src = src || "@drawable/ic_info_outline_black_48dp";
    let view = ui.inflate(
        <vertical bg="#ffffff">
            <linear orientation="horizontal" align="left" margin="0" paddingTop="0">
                <img src="@drawable/ic_info_outline_black_48dp" id="src" w="25" h="25" margin="18 0 2 0" tint="#000000" gravity="left"/>
                <text text="" id="title"textSize="15sp" textStyle="bold"
                layout_gravity="center" margin="0 0 0 0" textColor="#000000"/>
            </linear>
            <text id="tip" textSize="12sp" margin="20 5 20 10" textColor="#000000" autoLink="all"/>
        </vertical>, null, false);
    view.title.setText(title);
    view.tip.setText(text);
    view.src.attr("src", src);
    dialogs.build({
        type: "foreground-or-overlay",
        customView: view,
        wrapInScrollView: false,
        autoDismiss: false
    }).show();
}

module.exports = Dialog_Tips;