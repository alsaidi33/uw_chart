import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FlexAlignStyleBuilder } from '@angular/flex-layout';
import { Chart, registerables, UpdateModeEnum } from 'chart.js';
// import Zoom from 'chartjs-plugin-zoom';
// import zoomPlugin from 'chartjs-plugin-zoom';

import annotationPlugin from 'chartjs-plugin-annotation';

import * as dragerPlugin from './drager-plugin';

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
  constructor(private elementRef: ElementRef) {
    Chart.register(...registerables);
    // Chart.register(zoomPlugin);
    Chart.register(annotationPlugin);

  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.initializeLineChart();
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
          datasets: [
            {
              label: 'Sales',
              data: ['467', '576', '572', '79', '92', '574', '573', '576'],
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
              data: ['542', '542', '536', '327', '17', '0.00', '538', '541'],
              borderColor: '#99CA3C',
              fill: true,
              backgroundColor: gradientSeries2,
              borderWidth: 1.5,
              pointStyle: 'circle',
              pointBackgroundColor: '#fff',
              yAxisID: 'y1'
            },
          ],
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
                
                line1: {
                  
                  type: 'line',
                  xMin: '2022-05-12',
                  xMax: '2022-05-12',
                  borderColor: 'rgb(255, 99, 132)',
                  borderWidth: 20,
                  label: {
                    display: true,
                    content: [' '],
                    textAlign: 'center'
                  },

                  
                },
                line2: {
                  
                  type: 'line',
                  xMin: '2022-05-14',
                  xMax: '2022-05-14',
                  borderColor: 'rgb(255, 99, 132)',
                  borderWidth: 2,
                  label: {
                    display: true,
                    content: [' '],
                    textAlign: 'center'
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
                color: '#8898AA',
              },
            },
            y1: {
              ticks: {
                color: '#99CA3C',
              },
              grid: {
                color: '#8898AA',
                drawOnChartArea: false,
              },
              position: { x : 0}
            },
            x: {
              ticks: {
                color: '#8898AA',
              },
              grid: {
                color: '#8898AA',
              },
            },
          },
        },
      }
    );

    Utils.anotationData.chart = this.chart;
    
  }

  onZoomInButtonClick() {
    this.chart.zoom(1.3);
  }

  onZoomOutButtonClick() {
    this.chart.zoom(0.9);
  }
}
