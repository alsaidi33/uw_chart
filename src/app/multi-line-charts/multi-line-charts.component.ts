import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FlexAlignStyleBuilder } from '@angular/flex-layout';
import { Chart, registerables, UpdateModeEnum } from 'chart.js';
// import Zoom from 'chartjs-plugin-zoom';
// import zoomPlugin from 'chartjs-plugin-zoom';

import annotationPlugin from 'chartjs-plugin-annotation';

import * as dragerPlugin from './drager-plugin';
import { SeriesStats } from './series-stats';

import * as Utils from './utils';



@Component({
  selector: 'app-multi-line-charts',
  templateUrl: './multi-line-charts.component.html',
  styleUrls: ['./multi-line-charts.component.css']
})
export class MultiLineChartsComponent implements OnInit {

  @Input() title: string = 'Line chart';
  @Input() subtitle: string = 'Line chart description';
  @Input() lineChartWidgetID: string = 'DefaultID';

  public chart: any;

  seriesStats: SeriesStats[] = [];
  xAxisCenter: number = 0;
  constructor(private elementRef: ElementRef) {
    Chart.register(...registerables);
    // Chart.register(zoomPlugin);
    Chart.register(annotationPlugin);

  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.initializeLineChart();

    Utils.singleAnnotationEmitter.subscribe((x: number) => {
      this.updateSeriesStats(x);
    });
  }

  updateSeriesStats(x: number) {
    for (const stat of this.seriesStats) {
      for (const stat of this.seriesStats) {
        stat.value = stat.data[x];
      }
    }
  }

  resetSeriesStats() {
    for (const stat of this.seriesStats) {
      for (const stat of this.seriesStats) {
        stat.value = 0;
        stat.min = 0;
        stat.max = 0;
        stat.avg = 0;
      }
    }
  }

  initializeLineChart() {

    
    var gradientSeries1 = this.elementRef.nativeElement
      .querySelector(`#${this.lineChartWidgetID}`)
      .getContext('2d')
      .createLinearGradient(0, 0, 0, 400);
    gradientSeries1.addColorStop(0.1, 'rgba(29, 108, 180, 0.2)');
    gradientSeries1.addColorStop(0.5, 'rgba(29, 108, 180, 0)');

    var gradientSeries2 = this.elementRef.nativeElement
      .querySelector(`#${this.lineChartWidgetID}`)
      .getContext('2d')
      .createLinearGradient(0, 0, 0, 400);
    gradientSeries2.addColorStop(0.1, 'rgba(153, 202, 60, 0.2)');
    gradientSeries2.addColorStop(0.5, 'rgba(153, 202, 60, 0)');

    let datasets =[{
      label: 'Sales',
      data: [467, 576, 572, 79, 92, 574, 573, 576],
      borderColor: '#1D6CB4',
      fill: true,
      backgroundColor: gradientSeries1,
      borderWidth: 1.5,
      pointStyle: 'circle',
      pointBackgroundColor: '#fff',
      yAxisID: 'y'
    },
    {
      label: 'Profit',
      data: [542, 542, 536, 327, 17, 0.00, 538, 541],
      borderColor: '#99CA3C',
      fill: true,
      backgroundColor: gradientSeries2,
      borderWidth: 1.5,
      pointStyle: 'circle',
      pointBackgroundColor: '#fff',
      yAxisID: 'y1'
    }];

    this.seriesStats = datasets.map<SeriesStats>(d =>  {
      return {seriesName: d.label, data : d.data, color: d.borderColor, value: 0, min: 0, max: 0, avg: 0}
    });

    this.xAxisCenter = this.getXAxisCenter(this.seriesStats);

    this.chart = new Chart(
      this.elementRef.nativeElement.querySelector(`#${this.lineChartWidgetID}`),
      {
        type: 'line',
        plugins: [dragerPlugin.dragger],
        data: {
          labels: [
            '2022-05-10',
            '2022-05-11',
            '2022-05-12',
            '2022-05-13',
            '2022-05-14',
            '2022-05-15',
            '2022-05-16',
            '2022-05-17',
          ],
          datasets: datasets,
          
        },
        options: {
          events: ['mousedown', 'mouseup', 'mousemove', 'mouseout'],
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            annotation : {           
            
              enter(ctx) {
                // console.log('enter');
                Utils.anotationData.element = ctx.element;
              },
              leave(ctx, event) {
                // console.log(ctx.chart.config.data);
                
                // let x = Utils.anotationData.chart.scales['x'].getValueForPixel(event.x);

                // // let y = Utils.anotationData.chart.scaleses['y-axis-1'].getValueForPixel(event.y);
                // console.log(Utils.anotationData.chart.scales['x'].ticks[x].label);
                // if(event.x)
                // Utils.anotationData.element = undefined;
                // Utils.anotationData.lastEvent = undefined;
              },

              annotations: {

                line0: {
                  display: false,
                  type: 'line',
                  xMin: '2022-05-12',
                  xMax: '2022-05-12',
                  borderColor: 'rgb(0, 0, 0)',
                  borderWidth: 1,
                  label: {
                    display: true,
                    content: ['    '],
                    textAlign: 'center',
                    borderWidth: 1,
                    backgroundColor: 'rgba(255, 255,255,0)',
                    borderColor: 'rgb(0, 0, 0)',
                    borderRadius: 100,              
                  },                  
                },
                
                line1: {
                  display: false,
                  type: 'line',
                  xMin: '2022-05-12',
                  xMax: '2022-05-12',
                  borderColor: 'rgb(0, 0, 0)',
                  borderWidth: 1,
                  label: {
                    display: true,
                    content: ['    '],
                    textAlign: 'center',
                    borderWidth: 1,
                    backgroundColor: 'rgba(255, 255,255,0)',
                    borderColor: 'rgb(0, 0, 0)',
                    borderRadius: 100,              
                  },                  
                },
                line2: {
                  display: false,
                  type: 'line',
                  xMin: '2022-05-15',
                  xMax: '2022-05-15',
                  borderColor: 'rgb(0, 0, 0)',
                  borderWidth: 1,
                  label: {
                    display: true,
                    content: ['    '],
                    textAlign: 'center',
                    borderWidth: 1,
                    backgroundColor: 'rgba(255, 255,255,0)',
                    borderColor: 'rgb(0, 0, 0)',
                    borderRadius: 100,              
                  },                  
                }
              }
          },
        },
          elements: {
            point: {
              radius: 3,
            },
            line: {
              tension: 0.4,
            },
          },
          
          scales: {
            y: {
              ticks: {
                color: '#1D6CB4',
              },
              grid: {
                display: false,
                color: '#8898AA',
              },
            },
            y1: {
              ticks: {
                color: '#99CA3C',
              },
              grid: {
                color: '#8898AA',
                display: false,
                drawOnChartArea: false,
              },
              position: { x : 0}
            },
            x: {
              ticks: {
                color: '#8898AA',
              },
              grid: {
                display: false,
                color: '#8898AA',
              },
            },
          },
        },
      }
    );

    this.chart.options.plugins.annotation.annotations.line0.xMin = this.chart.config.data.labels[this.xAxisCenter];
    this.chart.options.plugins.annotation.annotations.line0.xMax = this.chart.config.data.labels[this.xAxisCenter];
    this.chart.update();
    Utils.anotationData.chart = this.chart;
    
  }


  getXAxisCenter(seriesStats: SeriesStats[]){
    var maxLenth = 0;
    for(var i = 0; i < seriesStats.length; i++){
      if(seriesStats[i].data.length > maxLenth){
        maxLenth = seriesStats[i].data.length;
      }
    }
    return Math.floor(maxLenth / 2);    
  }

  toggleSingleAnnotation() {
    this.chart.options.plugins.annotation.annotations.line0.xMin = this.chart.config.data.labels[this.xAxisCenter];
    this.chart.options.plugins.annotation.annotations.line0.xMax = this.chart.config.data.labels[this.xAxisCenter];
    
    this.chart.options.plugins.annotation.annotations.line0.display = !this.chart.options.plugins.annotation.annotations.line0.display;
    this.chart.options.plugins.annotation.annotations.line1.display = false;
    this.chart.options.plugins.annotation.annotations.line2.display = false;
   
    this.chart.update();
    if(this.chart.options.plugins.annotation.annotations.line0.display){
      this.updateSeriesStats(this.xAxisCenter)
    } else {
      this.resetSeriesStats();
    }
  }


  toggleDoubleAnnotation() {
    this.chart.options.plugins.annotation.annotations.line0.display = false
    this.chart.options.plugins.annotation.annotations.line1.display = !this.chart.options.plugins.annotation.annotations.line1.display ;
    this.chart.options.plugins.annotation.annotations.line2.display = !this.chart.options.plugins.annotation.annotations.line2.display ;
    this.chart.update();
  }

  onZoomInButtonClick() {
    this.chart.zoom(1.3);
  }

  onZoomOutButtonClick() {
    this.chart.zoom(0.9);
  }

}
