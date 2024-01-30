import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ChartAction {
    title: string;
    action: string;
    serial: string;
    pieLabel?: string;
    heartColor?: string;
    barColor?: string;
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

    public chartAction = new BehaviorSubject<ChartAction>({ action: '', serial: '', title: '' });
    currentChartAction = this.chartAction.asObservable();

    public chartFavorite = new BehaviorSubject<ChartFavorite>({ type: '', serial: '', favorite: false });
    currentChartFavorite = this.chartFavorite.asObservable();

    public pieLabel = new BehaviorSubject<string>('');
    currentPieLabel = this.pieLabel.asObservable();

    public saveJsonFile(chartType: string, dataSource: any[], tileConfig: any, title: string, barColor: string) {
        let exportObj = {
            chartType: chartType,
            dataSource: dataSource,
            action: '',
            serial: '',
            title: title,
            barColor: barColor,
            tileConfig: tileConfig
        };
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
                localStorage.setItem("temp", JSON.stringify(exportObj.tileConfig));
                if (exportObj.chartType === 'bar_chart') {
                    this.chartAction.next({
                        action: 'create',
                        serial: '',
                        title: exportObj.title,
                        barColor: exportObj.barColor
                    });
                }
                else if (exportObj.chartType === 'line_chart') {
                    this.chartAction.next({
                        action: 'create',
                        serial: '',
                        title: exportObj.title,
                        barColor: exportObj.barColor
                    });
                };
                this.chartType.next(exportObj.chartType);
                this.dataSource.next(exportObj.dataSource);
            };
            reader.readAsText(event.target.files[0]);
        };
        input.click();
    }

    public savePersistence(chartType: string, tileSerial: string, dataSource: any[], title: string, parameter: any=undefined, heartColor: string, barColor: string) {
        var chartData = {
            chartType: chartType,
            dataSource: dataSource,
            action: '',
            tileSerial: tileSerial,
            title: title,
            heartColor: heartColor,
            barColor: barColor
        };
        if (chartType === 'pie_chart') {
            chartData['pieLabel'] = parameter;
        }
        // console.log('Saving data:', chartData);
        localStorage.setItem(tileSerial, JSON.stringify(chartData));
    }

    public removePersistence(tileSerial: string) {
        localStorage.removeItem(tileSerial);
        localStorage.removeItem(tileSerial + "-config");
    }

    public clearPersistence(gridType: string) {
        // localStorage.clear();
        let keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.includes(gridType)) {
                localStorage.removeItem(key);
                localStorage.removeItem(key + "-config");
            }
        });
    }

    public loadPersistence(gridType: string) {
        if (localStorage.length > 0 && localStorage.length < 100) {
            let keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.includes(gridType) && !key.includes("-config")) {
                    var chartType = key.includes('dash-bar') ? 'dash-bar' : 'dash-line';
                    var chartData = JSON.parse(localStorage.getItem(key));
                    this.loadChart(chartType, chartData);
                }
            });
        }
    }
    
    private loadChart(chartType: string, chartData: any) {
        let actionData: any = {
            action: 'load',
            serial: chartData.tileSerial,
            title: chartData.title,
            heartColor: chartData.heartColor,
            barColor: chartData.barColor
        };
    
        this.chartAction.next(actionData);
        this.chartType.next(chartData.chartType);
        this.dataSource.next(chartData.dataSource);
    }
}