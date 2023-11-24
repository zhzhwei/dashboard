import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChartService {
    public newItem = new BehaviorSubject<boolean>(false);
    currentNewItem = this.newItem.asObservable();

    public chartType = new BehaviorSubject<string>('');
    currentChartType = this.chartType.asObservable();

    public dataSource = new BehaviorSubject<any[]>([]);
    currentDataSource = this.dataSource.asObservable();

    public jobName = new BehaviorSubject<string>('');
    currentJobName = this.jobName.asObservable();

    public titleCount = new BehaviorSubject<number>(0);
    currentTitleCount = this.titleCount.asObservable();

    public barRemove = new BehaviorSubject<boolean>(false);
    currentBarRemove = this.barRemove.asObservable();

    public pieLabel = new BehaviorSubject<string>('');
    currentPieLabel = this.pieLabel.asObservable();

    public pieRemove = new BehaviorSubject<boolean>(false);
    currentPieRemove = this.pieRemove.asObservable();

    public saveJsonFile(chartType: string, jobName: string, dataSource: any[], parameter: any) {
        let exportObj = {
            chartType: chartType,
            jobName: jobName,
            dataSource: dataSource
        };
        if (chartType === 'Bar Chart') {
            exportObj['titleCount'] = parameter;
        }
        else if (chartType === 'Pie Chart') {
            exportObj['pieLabel'] = parameter;
        }
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", chartType + ".json");
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
                if (exportObj.chartType === 'Bar Chart') {
                    this.titleCount.next(exportObj.titleCount);
                }
                else if (exportObj.chartType === 'Pie Chart') {
                    this.pieLabel.next(exportObj.pieLabel);
                };
            };
            reader.readAsText(event.target.files[0]);
        };
        input.click();
    }

    public savePersistence(chartType: string, jobName: string, dataSource: any[], parameter: any) {
        const chartData = {
            chartType: chartType,
            jobName: jobName,
            dataSource: dataSource
        };
        if (chartType === 'Bar Chart') {
            chartData['titleCount'] = parameter;
            localStorage.setItem('barChartData', JSON.stringify(chartData));
        }
        else if (chartType === 'Pie Chart') {
            chartData['pieLabel'] = parameter;
            localStorage.setItem('pieChartData', JSON.stringify(chartData));
        }
    }

    public loadPersistence() {
        if (!localStorage.getItem('barChartData') && !localStorage.getItem('pieChartData')) {
            console.log('No chart data in local storage.');
            return;
        }
        else {
            if (localStorage.getItem('barChartData')) {
                const barChartData = JSON.parse(localStorage.getItem('barChartData'));
                this.chartType.next(barChartData.chartType);
                this.jobName.next(barChartData.jobName);
                this.dataSource.next(barChartData.dataSource);
                this.titleCount.next(barChartData.titleCount);
            }
            if (localStorage.getItem('pieChartData')) {
                const pieChartData = JSON.parse(localStorage.getItem('pieChartData'));
                this.chartType.next(pieChartData.chartType);
                this.jobName.next(pieChartData.jobName);
                this.dataSource.next(pieChartData.dataSource);
                this.pieLabel.next(pieChartData.pieLabel);
            }
        }
    }
}