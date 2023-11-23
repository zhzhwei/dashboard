import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChartService {
    public chartType = new BehaviorSubject<string>('');
    currentChartType = this.chartType.asObservable();

    public jobName = new BehaviorSubject<string>('');
    currentJobName = this.jobName.asObservable();
    
    public dataSource = new BehaviorSubject<any[]>([]);
    currentDataSource = this.dataSource.asObservable();

    public titleCount = new BehaviorSubject<number>(0);
    currentTitleCount = this.titleCount.asObservable();

    public saveJsonFile(chartType: string, jobName: string, dataSource: any[], titleCount: number) {
        let exportObj = {
            chartType: chartType,
            jobName: jobName,
            dataSource: dataSource,
            titleCount: titleCount
        };
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "barChart" + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    public loadJsonFile() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (event: any) => {
            var reader = new FileReader();
            reader.onload = (event: any) => {
                var exportObj = JSON.parse(event.target.result);
                this.chartType.next(exportObj.chartType);
                this.jobName.next(exportObj.jobName);
                this.dataSource.next(exportObj.dataSource);
                this.titleCount.next(exportObj.titleCount);
            };
            reader.readAsText(event.target.files[0]);
        };
        input.click();
    }

    public savePersistence(chartType: string, jobName: string, dataSource: any[], titleCount: number) {
        const chartData = {
            chartType: chartType,
            jobName: jobName,
            dataSource: dataSource,
            titleCount: titleCount
        };
        localStorage.setItem('chartData', JSON.stringify(chartData));
    }

    public loadPersistence() {
        if (!localStorage.getItem('chartData')) {
            console.log('No chart data in local storage.');
            return;
        }
        else {
            const chartData = JSON.parse(localStorage.getItem('chartData'));
            this.chartType.next(chartData.chartType);
            this.jobName.next(chartData.jobName);
            this.dataSource.next(chartData.dataSource);
            this.titleCount.next(chartData.titleCount);
        }
    }
}