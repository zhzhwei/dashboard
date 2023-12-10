import { Injectable } from '@angular/core';
import { color } from 'highcharts';
import { BehaviorSubject } from 'rxjs';

interface ChartAction {
    action: string;
    serial: string;
    jobName?: string;
    titleCount?: number;
    pieLabel?: string;
    color?: string;
}

interface ChartFavorite {
    type: string;
    serial: string;
    favorite: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ChartService {
    public chartType = new BehaviorSubject<string>('');
    currentChartType = this.chartType.asObservable();

    public dataSource = new BehaviorSubject<any[]>([]);
    currentDataSource = this.dataSource.asObservable();

    public chartAction = new BehaviorSubject<ChartAction>({ action: '', serial: '', color: '' });
    currentChartAction = this.chartAction.asObservable();

    public chartFavorite = new BehaviorSubject<ChartFavorite>({type: '', serial: '', favorite: false});
    currentChartFavorite = this.chartFavorite.asObservable();

    public pieLabel = new BehaviorSubject<string>('');
    currentPieLabel = this.pieLabel.asObservable();

    public saveJsonFile(chartType: string, dataSource: any[], jobName: string, parameter: any) {
        let exportObj = {
            chartType: chartType,
            dataSource: dataSource,
            action: '',
            serial: '',
            jobName: jobName
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
                if (exportObj.chartType === 'Bar Chart') {
                    this.chartAction.next({
                        action: 'create',
                        serial: '',
                        jobName: exportObj.jobName,
                        titleCount: exportObj.titleCount
                    });
                }
                else if (exportObj.chartType === 'Pie Chart') {
                    this.chartAction.next({
                        action: 'create',
                        serial: '',
                        jobName: exportObj.jobName,
                        pieLabel: exportObj.pieLabel
                    });
                };
                this.chartType.next(exportObj.chartType);
                this.dataSource.next(exportObj.dataSource);
            };
            reader.readAsText(event.target.files[0]);
        };
        input.click();
    }

    public savePersistence(chartType: string, tileSerial: string, dataSource: any[], jobName: string, parameter: any, color: string) {
        var chartData = {
            chartType: chartType,
            dataSource: dataSource,
            action: '',
            tileSerial: tileSerial,
            jobName: jobName,
            color: color
        };
        if (chartType === 'Bar Chart') {
            chartData['titleCount'] = parameter;
        }
        else if (chartType === 'Pie Chart') {
            chartData['pieLabel'] = parameter;
        }
        // console.log('Saving data:', chartData);
        localStorage.setItem(tileSerial, JSON.stringify(chartData));
    }

    public removePersistence(tileSerial: string) {
        localStorage.removeItem(tileSerial);
    }

    public clearPersistence() {
        localStorage.clear();
    }

    public loadPersistence() {
        if (localStorage.length > 0 && localStorage.length < 10) {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                var chartType = key.includes('dash-bar') ? 'dash-bar' : 'dash-pie';
                if (chartType === 'dash-bar') {
                    var chartData = JSON.parse(localStorage.getItem(key));
                    // console.log('Loaded data:', key, chartData);
                    this.chartAction.next({
                        action: 'load',
                        serial: chartData.tileSerial,
                        jobName: chartData.jobName,
                        titleCount: chartData.titleCount,
                        color: chartData.color
                    });
                    this.chartType.next(chartData.chartType);
                    this.dataSource.next(chartData.dataSource);
                } else if (chartType === 'dash-pie') {
                    var chartData = JSON.parse(localStorage.getItem(key));
                    // console.log('Loaded data:', chartData);
                    this.chartAction.next({
                        action: 'load',
                        serial: chartData.tileSerial,
                        jobName: chartData.jobName,
                        pieLabel: chartData.pieLabel,
                        color: chartData.color
                    });
                    this.chartType.next(chartData.chartType);
                    this.dataSource.next(chartData.dataSource);
                }
            }
        }
    }
}