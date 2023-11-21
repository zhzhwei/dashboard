import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChartService {
    public chartType = new BehaviorSubject<string>('');
    currentChartType = this.chartType.asObservable();
    
    public titleCount = new BehaviorSubject<number>(0);
    currentTitleCount = this.titleCount.asObservable();
    
    public dataSource = new BehaviorSubject<any[]>([]);
    currentDataSource = this.dataSource.asObservable();

    public saveChart(chartType: string, titleCount: number, dataSource: any[]) {
        let exportObj = {
            chartType: chartType,
            titleCount: titleCount,
            dataSource: dataSource
        };
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "barChart" + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    public loadChart() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (event: any) => {
            var reader = new FileReader();
            reader.onload = (event: any) => {
                var exportObj = JSON.parse(event.target.result);
                this.chartType.next(exportObj.chartType);
                this.titleCount.next(exportObj.titleCount);
                this.dataSource.next(exportObj.dataSource);
            };
            reader.readAsText(event.target.files[0]);
        };
        input.click();
    }
}
