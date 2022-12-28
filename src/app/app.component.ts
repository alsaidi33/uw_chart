import { HttpClient } from '@angular/common/http';
import { computeMsgId } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'eurusd_chart';
  series: {date: number, value: number}[] = [];
  constructor(public http: HttpClient){}
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.http.get('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/usdeur.json', {responseType: 'text'}).subscribe(data => {
      
      this.series = this.convertDataToSeries(JSON.parse(data)); 
      console.log(this.series);
    });
  }

  convertDataToSeries(data: any[]) {
    return data.map((d: any[]) => {
      return {
        date: d[0],
        value: d[1]
      }
    });
  }
}
