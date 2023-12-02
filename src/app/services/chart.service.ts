import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ChartAction {
    action: string;
    serial: string;
    jobName: string;
    titleCount?: number;
    pieLabel?: string;
}

interface DiagramRemove {
    type: string;
    serial: string;
    removed: boolean;
}

interface DiagramFavorite {
    type: string;
    serial: string;
    favorite: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ChartService {
    public tileSerial = new BehaviorSubject<string>('');
    currentTileSerial = this.tileSerial.asObservable();

    public chartType = new BehaviorSubject<string>('');
    currentChartType = this.chartType.asObservable();

    public dataSource = new BehaviorSubject<any[]>([]);
    currentDataSource = this.dataSource.asObservable();

    public chartAction = new BehaviorSubject<ChartAction>({ action: '', serial: '', jobName: '' });
    currentChartAction = this.chartAction.asObservable();

    public diagramFavorite = new BehaviorSubject<DiagramFavorite>({type: '', serial: '', favorite: false});
    currentDiagramFavorite = this.diagramFavorite.asObservable();

    public diagramRemoved = new BehaviorSubject<DiagramRemove>({type: '', serial: '', removed: false});
    currentDiagramRemoved = this.diagramRemoved.asObservable();

    public barFavorite = new BehaviorSubject<boolean>(false);
    currentBarFavorite = this.barFavorite.asObservable();

    public pieLabel = new BehaviorSubject<string>('');
    currentPieLabel = this.pieLabel.asObservable();

    public saveJsonFile(chartType: string, dataSource: any[], jobName: string, parameter: any) {
        let exportObj = {
            chartType: chartType,
            dataSource: dataSource,
            action: 'Create',
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
                        action: exportObj.action,
                        serial: '',
                        jobName: exportObj.jobName,
                        titleCount: exportObj.titleCount
                    });
                }
                else if (exportObj.chartType === 'Pie Chart') {
                    this.chartAction.next({
                        action: exportObj.action,
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

    public savePersistence(chartType: string, tileSerial: string, dataSource: any[], jobName: string, parameter: any) {
        const chartData = {
            chartType: chartType,
            dataSource: dataSource,
            action: 'Create',
            tileSerial: tileSerial,
            jobName: jobName
        };
        if (chartType === 'Bar Chart') {
            chartData['titleCount'] = parameter;
        }
        else if (chartType === 'Pie Chart') {
            chartData['pieLabel'] = parameter;
        }
        localStorage.setItem(tileSerial, JSON.stringify(chartData));
    }

    public removePersistence(tileSerial: string) {
        localStorage.removeItem(tileSerial);
    }

    public loadPersistence() {
        if (localStorage.length > 0 && localStorage.length < 10) {
            for (let i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                var chartType = key.includes('dash-bar') ? 'dash-bar' : 'dash-pie';
                if (chartType === 'dash-bar') {
                    var chartData = JSON.parse(localStorage.getItem(key));
                    this.chartAction.next({
                        action: chartData.action,
                        serial: chartData.tileSerial,
                        jobName: chartData.jobName,
                        titleCount: chartData.titleCount
                    });
                    this.chartType.next(chartData.chartType);
                    this.dataSource.next(chartData.dataSource);
                }
                else if (chartType === 'dash-pie') {
                    var chartData = JSON.parse(localStorage.getItem(key));
                    this.chartAction.next({
                        action: chartData.action,
                        serial: chartData.tileSerial,
                        jobName: chartData.jobName,
                        pieLabel: chartData.pieLabel
                    });
                    this.chartType.next(chartData.chartType);
                    this.dataSource.next(chartData.dataSource);
                }
            }
        }
    }
}