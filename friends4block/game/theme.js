export default {
    name: "chart.theme.classic",
    extend: null,
    component: function () {
        var themeColors = [
            "#7977C2",
            "#7BBAE7",
            "#FFC000",
            "#FF7800",
            "#87BB66",
            "#1DA8A0",
            "#929292",
            "#555D69",
            "#0298D5",
            "#FA5559",
            "#F5A397",
            "#06D9B6",
            "#C6A9D9",
            "#6E6AFC",
            "#E3E766",
            "#C57BC3",
            "#DF328B",
            "#96D7EB",
            "#839CB5",
            "#9228E4"
        ];

        return {
            fontFamily : "arial,Tahoma,verdana",
            backgroundColor : "#dcdcdc",
            colors : themeColors,

            // Axis styles
            axisBackgroundColor : "#fff",
            axisBackgroundOpacity : 0,
            axisBorderColor : "#fff",
            axisBorderWidth : 0,
            axisBorderRadius : 0,

            // Grid styles
            gridXFontSize : 11,
            gridYFontSize : 11,
            gridZFontSize : 10,
            gridCFontSize : 11,
            gridXFontColor : "#333",
            gridYFontColor : "#333",
            gridZFontColor : "#333",
            gridCFontColor : "#333",
            gridXFontWeight : "normal",
            gridYFontWeight : "normal",
            gridZFontWeight : "normal",
            gridCFontWeight : "normal",
            gridXAxisBorderColor : "#bfbfbf",
            gridYAxisBorderColor : "#bfbfbf",
            gridZAxisBorderColor : "#bfbfbf",
            gridXAxisBorderWidth : 0,
            gridYAxisBorderWidth : 0,
            gridZAxisBorderWidth : 0,

            gridActiveFontColor : "#ff7800",
            gridActiveBorderColor : "#ff7800",
            gridActiveBorderWidth : 1,
            gridPatternColor : "#ababab",
            gridPatternOpacity : 0.1,
            gridBorderColor : "#ebebeb",
            gridBorderWidth : 1,
            gridBorderDashArray : "none",
            gridBorderOpacity : 1,
            gridTickBorderSize : 3,
            gridTickBorderWidth : 1.5,
            gridTickPadding : 5
        }
    }
}