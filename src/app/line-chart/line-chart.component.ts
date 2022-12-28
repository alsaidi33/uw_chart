import { Component,HostListener, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { createChart } from 'lightweight-charts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class LineChartComponent implements OnInit {

  @Input() series: { time: string, value: number }[] = [];
  @Input() height: number = 500;
  constructor() { }

  ngOnInit(): void {
    
  }

  chart : any;
  lineSeries : any;
  ngOnChanges(changes: SimpleChanges) {
    if(this.lineSeries) this.lineSeries.setData(this.series);
 }
  ngAfterViewInit() {
    const chartDiv = document.getElementById("chartDiv");

    if(!chartDiv){
      console.log('no div')
      return;
    };
   
    this.chart = createChart(chartDiv, { width:  chartDiv.offsetWidth, height: this.height ,  
      handleScale: {
          axisPressedMouseMove: {
        time: true,
        price: false,
      },
      },
  });
    
    // chart.applyOptions({width: 500, height: 500});
    this.lineSeries = this.chart.addLineSeries();
    // lineSeries.setData([
    //     { time: '2019-04-11', value: 80.01 },
    //     { time: '2019-04-12', value: 96.63 },
    //     { time: '2019-04-13', value: 76.64 },
    //     { time: '2019-04-14', value: 81.89 },
    //     { time: '2019-04-15', value: 74.43 },
    //     { time: '2019-04-16', value: 80.01 },
    //     { time: '2019-04-17', value: 96.63 },
    //     { time: '2019-04-18', value: 76.64 },
    //     { time: '2019-04-19', value: 81.89 },
    //     { time: '2019-04-20', value: 74.43 },
    // ]);
    // console.log(JSON.stringify(this.series));
    this.lineSeries.setData(this.series);

    // document.querySelector('#chartDiv table tr')!.querySelectorAll('td')[2].setAttribute('draggable', 'true');
    // var yaxis = document.querySelector('#chartDiv table tr')!.querySelectorAll('td')[2];
    // yaxis.style.left = "200px";
    this.dragElement();
  }

  zoomIn(){
    let barSpacing = this.chart.options().timeScale.barSpacing + 1;
    this.chart.timeScale().applyOptions({
      barSpacing: barSpacing, // default is 6
    })
  }

  zoomOut(){
    let barSpacing = this.chart.options().timeScale.barSpacing;

    if(barSpacing > 1){
      barSpacing = barSpacing - 1;
      this.chart.timeScale().applyOptions({
        barSpacing: barSpacing, // default is 6
      });
    } else {
      
    this.chart.timeScale().fitContent();
    }

 
    // this.dragElement();
   

  }

@HostListener('window:resize', ['$event'])
onResize(event: any) {
  this.chart.applyOptions({width: event.target.innerWidth});
}

showSeries = true;
toggleSeries(){
  this.showSeries = !this.showSeries;
  this.lineSeries.applyOptions({
    visible: this.showSeries,
  });
}

showYAxis = true;
toggleYAixs(){
  this.showYAxis = !this.showYAxis;
  var yaxis = document.querySelector('#chartDiv table tr')!.querySelectorAll('td')[2];
  if(this.showYAxis){
    yaxis.style.display = 'block';
  } else {
    yaxis.style.display = 'none';
  }
}

dragElement() {
  var yaxis = document.querySelector('#chartDiv table tr')!.querySelectorAll('td')[2];
  // yaxis.style.left = "0px";
  yaxis.onmousedown = dragMouseDown;
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  // if (document.getElementById(elmnt.id + "header")) {
  //   // if present, the header is where you move the DIV from:
  //   document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  // } else {
  //   // otherwise, move the DIV from anywhere inside the DIV:
  //   elmnt.onmousedown = dragMouseDown;
  // }

  function dragMouseDown(e:any) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e: any) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    // yaxis.style.top = (yaxis.offsetTop - pos2) + "px";
    if(yaxis.offsetLeft < 1){
      yaxis.style.left = "1px";
    } else if(yaxis.offsetLeft > (window.innerWidth - 67)){
      yaxis.style.left = (window.innerWidth - 67) + "px";
    } else {
      yaxis.style.left = (yaxis.offsetLeft - pos1) + "px";
    }
      
    //   > 0 && yaxis.offsetLeft <= (window.innerWidth - 62))
    //   yaxis.style.left = (yaxis.offsetLeft - pos1) + "px";
    // console.log(e.clientX);
    // console.log(window.innerWidth);

  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

}
