import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface DiagramRemovedType {
    type: string;
    serial: string;
    removed: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ChartService {
    public drivenBy = new BehaviorSubject<string>('');
    currentDrivenBy = this.drivenBy.asObservable();

    public tileSerial = new BehaviorSubject<string>('');
    currentTileSerial = this.tileSerial.asObservable();
    
    public showDiagrams = new BehaviorSubject<boolean>(false);
    currentShowDiagrams = this.showDiagrams.asObservable();

    public chartType = new BehaviorSubject<string>('');
    currentChartType = this.chartType.asObservable();

    public dataSource = new BehaviorSubject<any[]>([]);
    currentDataSource = this.dataSource.asObservable();

    public jobName = new BehaviorSubject<string>('');
    currentJobName = this.jobName.asObservable();

    public titleCount = new BehaviorSubject<number>(0);
    currentTitleCount = this.titleCount.asObservable();

    public diagramRemoved = new BehaviorSubject<DiagramRemovedType>({type: '', serial: '', removed: false});
    currentDiagramRemoved = this.diagramRemoved.asObservable();

    public barFavorite = new BehaviorSubject<boolean>(false);
    currentBarFavorite = this.barFavorite.asObservable();

    public pieLabel = new BehaviorSubject<string>('');
    currentPieLabel = this.pieLabel.asObservable();

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

    public savePersistence(chartType: string, tileSerial: string, jobName: string, dataSource: any[], parameter: any) {
        const chartData = {
            chartType: chartType,
            tileSerial: tileSerial,
            jobName: jobName,
            dataSource: dataSource
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
        if (localStorage.length > 0) {
            const chartActions = {
                'dash-bar': {
                    nextActions: {
                        titleCount: this.titleCount
                    }
                },
                'dash-pie': {
                    nextActions: {
                        pieLabel: this.pieLabel
                    }
                }
            };
    
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const chartType = key.includes('dash-bar') ? 'dash-bar' : 'dash-pie';
                if (chartActions[chartType]) {
                    const chartData = JSON.parse(localStorage.getItem(key));
                    this.drivenBy.next('Create');
                    this.chartType.next(chartData.chartType);
                    this.tileSerial.next(chartData.tileSerial);
                    this.jobName.next(chartData.jobName);
                    this.dataSource.next(chartData.dataSource);
                    for (const action in chartActions[chartType].nextActions) {
                        chartActions[chartType].nextActions[action].next(chartData[action]);
                    }
                }
            }
        }
    }
}