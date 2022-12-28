import { Component, Inject, Input, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {
  @Input() series: { date: number, value: number }[] = [];
  private root!: am5.Root;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) { }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(() => {
      let root = am5.Root.new("chartdiv");

      root.setThemes([am5themes_Animated.new(root)]);

      let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: "zoomX",
          // layout: root.verticalLayout
        })
      );

      let overlay = root.container.children.push(am5.Container.new(root, {
        width: am5.p100,
        height: am5.p100,
        layer: 100,
        visible: false
      }));
                                                 
      let curtain = overlay.children.push(am5.Rectangle.new(root, {
        width: am5.p100,
        height: am5.p100,
        fill: am5.color(0x000000),
        fillOpacity: 0.3
      }));
      
      
      let message = overlay.children.push(am5.Label.new(root, {
        text: "Use CTRL + Scroll to zoom",
        fontSize: 30,
        x: am5.p50,
        y: am5.p50,
        centerX: am5.p50,
        centerY: am5.p50
      }));
      
      chart.plotContainer.events.on("wheel", function(ev) {
        // Show overlay when wheel is used over chart
        if (ev.originalEvent.ctrlKey) {
          ev.originalEvent.preventDefault();
          chart.set("wheelX", "panX");
          chart.set("wheelY", "zoomX");
        }
        else {
          chart.set("wheelX", "none");
          chart.set("wheelY", "none");
          overlay.show();
          overlay.setTimeout(function() {
            overlay.hide()
          }, 800);
        }
      });

      // Create Y-axis
      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {         
          renderer: am5xy.AxisRendererY.new(root, {
            pan: "zoom"
          })
        })
      );

      // Create X-Axis
      let xAxis = chart.xAxes.push(
        am5xy.DateAxis.new(root, {
          baseInterval: { timeUnit: "day", count: 1 },
          // gridIntervals: [
          //   // { timeUnit: "hour", count: 1 },
          //   { timeUnit: "day", count: 1 }
          // ],
          maxDeviation: 0.0,
          renderer: am5xy.AxisRendererX.new(root, {})
        })
      );
      xAxis.data.setAll(this.series);

      let series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: "Series",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          valueXField: "date"
        })
      );
      series.data.setAll(this.series);

      // Scrollbar X
// var scrollbarX = am5.Scrollbar.new(root, {
//   orientation: "horizontal"
// });
let scrollbarX = am5xy.XYChartScrollbar.new(root, {
  orientation: "horizontal",
  height: 50
});

var sbxAxis = scrollbarX.chart.xAxes.push(
  am5xy.DateAxis.new(root, {
    groupData: true,
    // groupIntervals: [{ timeUnit: "year", count: 1 }],
    baseInterval: { timeUnit: "day", count: 1 },
    renderer: am5xy.AxisRendererX.new(root, {
      opposite: false,
      strokeOpacity: 0
    })
  })
);

var sbyAxis = scrollbarX.chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {})
  })
);

var sbseries = scrollbarX.chart.series.push(
  am5xy.LineSeries.new(root, {
    xAxis: sbxAxis,
    yAxis: sbyAxis,
    valueYField: "value",
    valueXField: "date"
  })
);
sbseries.data.setAll(this.series);

chart.set("scrollbarX", scrollbarX);
chart.bottomAxesContainer.children.push(scrollbarX);

   
      // Add legend
      // let legend = chart.children.push(am5.Legend.new(root, {
      //   centerY: am5.p50,
      // }));
      // legend.data.setAll(chart.series.values);
      
      // // Add cursor
      // chart.set("cursor", am5xy.XYCursor.new(root, {}));

      let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
cursor.lineX.set("forceHidden", true);
cursor.lineY.set("forceHidden", true);



      // chart.set("scrollbarX", am5.Scrollbar.new(root, {
      //   orientation: "horizontal"
      // }));
      let rangeDate = new Date();
      am5.time.add(rangeDate, "day", Math.round(series.dataItems.length / 2));
      let rangeTime = rangeDate.getTime();
      
      // add series range
      let seriesRangeDataItem = xAxis.makeDataItem({});
      let seriesRange = series.createAxisRange(seriesRangeDataItem);
      seriesRange.fills?.template.setAll({
        visible: true,
        opacity: 0.3
      });
      
      seriesRange.fills?.template.set("fillPattern", am5.LinePattern.new(root, {
        color: am5.color(0xff0000),
        rotation: 45,
        strokeWidth: 2,
        width: 2000,
        height: 2000,
        fill:am5.color(0xffffff)
      }));
      
      seriesRange.strokes?.template.set("stroke", am5.color(0xff0000));
      
      xAxis.onPrivate("max", function (value) {
        seriesRangeDataItem.set("endValue", value);
        seriesRangeDataItem.set("value", rangeTime);
      });
      
      // add axis range
      let range = xAxis.createAxisRange(xAxis.makeDataItem({}));
      let color = root.interfaceColors.get("primaryButton");
      
      range.set("value", rangeDate.getTime());
      range.get("grid")?.setAll({
        strokeOpacity: 1,
        stroke: color
      });
      
      let resizeButton = am5.Button.new(root, {
        themeTags: ["resize", "horizontal"],
        icon: am5.Graphics.new(root, {
          themeTags: ["icon"]
        })
      });
      
      // restrict from being dragged vertically
      resizeButton.adapters.add("y", function () {
        return 0;
      });
      
      // restrict from being dragged outside of plot
      resizeButton.adapters.add("x", function (x: any) {
        return Math.max(0, Math.min(chart.plotContainer.width(), x));
      });
      
      // change range when x changes
      resizeButton.events.on("dragged", function () {
        let x = resizeButton.x();
        let position = xAxis.toAxisPosition(x / chart.plotContainer.width());
      
        let value = xAxis.positionToValue(position);
      
        range.set("value", value);
      
        seriesRangeDataItem.set("value", value);
        seriesRangeDataItem.set("endValue", xAxis.getPrivate("max"));
      });
      
      // set bullet for the range
      range.set("bullet", am5xy.AxisBullet.new(root, {
        sprite: resizeButton
      }));
      












      

      this.root = root;
    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }

}
