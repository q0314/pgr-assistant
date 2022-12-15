"ui";

var settingStorage = storages.create("themes");
var themes = {
    day: {
        bar: "#926e6d",
        bg: "#eff0f4",
        track: "#000666",
        icon: "#898989",
        icons: "#d3d3d3",
        //  layout: "#FFFFFF",
        text: "#212121",
        //  text2: "#666666",
        text3: "#999999"
    },
    night: {
        bar: "#1e1e1e",
        bg: "#252525",
        //     card:"#1e1e1e",
        //权限
        track: "#000FFF",
        //  layout: "#424242",
        icon: "#f5f5f5",
        icons: "#a9a9a9",
        text: "#DDDDDD",
        // text2: "#999999",
        text3: "#666666",
    }
};

try {
    themes.day.bar = settingStorage.get("theme").bar
    // settingStorage.clear()
} catch (e) {}

var theme = {};
if (theme.bar == undefined) {
    updateTheme();
}


function setTheme(theme_name) {
    let current_theme = themes[theme_name];
    for (let i in current_theme)
        theme[i] = current_theme[i];

    if (theme_name == "day") {
        theme_name = "day";
    } else {
        theme_name = "night";
    }
    theme.current = theme_name;
    settingStorage.put("theme", theme);
}

function setspecify(id, text) {
    theme[id] = text;
    settingStorage.put("theme", theme);

}

function updateTheme() {
    setTheme("day");
}

theme.setTheme = setTheme;
theme.updateTheme = updateTheme;
theme.setspecify = setspecify;

module.exports = theme;