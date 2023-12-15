import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GridStackService {
    public majorChartTypeNum = {
        'Line Chart': 0,
        'Stacked Line Chart': 0,
        'Bar Chart': 0,
        'Stacked Bar Chart': 0,
        'Pie Chart': 0,
        'Doughnut': 0,
        'Star Plot': 0,
        'Star Plots': 0
    };

    public minorChartTypeNum = {
        'Line Chart': 0,
        'Stacked Line Chart': 0,
        'Bar Chart': 0,
        'Stacked Bar Chart': 0,
        'Pie Chart': 0,
        'Doughnut': 0,
        'Star Plot': 0,
        'Star Plots': 0
    };

    public majorEmpty = new BehaviorSubject<boolean>(false);
    currentMajorEmpty = this.majorEmpty.asObservable();

    public minorEmpty = new BehaviorSubject<boolean>(false);
    currentMinorEmpty = this.minorEmpty.asObservable();

    public minorGridEL = new BehaviorSubject<boolean>(false);
    currentMinorGridEl = this.minorGridEL.asObservable();

    public infoPosition = new Map();

    public newTile = {
        w: 3, h: 3,
        minW: 3, minH: 3,
        autoPosition: true,
    };

    public majorInitContent = {
        w: 12, h: 6, minW: 12, minH: 6,
        content: '<div style="background-color: #5763cc; height: 100%; width: 100%; display: flex; align-items: center; justify-content: center;"><p style="color: white; font-size: 70px; text-align: center;">Welcome to Dashboard for <br> Semantic Data Visualization!</p></div>',
        noResize: true,
    };

    public minorInitContent = {
        w: 12, h: 3, minW: 12, minH: 3,
        content: '<ion-icon name="heart" style="color: white; background-color: rgb(115, 105, 148); height: 100%; width: 100%"></ion-icon>',
        noResize: true,
    };

    public getMinorTileSerial(chartType: string, tileSerial: string) {
        tileSerial = tileSerial.replace('major', 'minor');
        this.minorChartTypeNum[chartType]++;
        this.majorChartTypeNum[chartType] = this.minorChartTypeNum[chartType];
        var serialNum = Number(tileSerial.split('-')[3]);
        tileSerial = tileSerial.replace('' + serialNum, '' + this.minorChartTypeNum[chartType]);
        return tileSerial;
    }

    public saveInfoPosition(tileSerial: string) {
        var contEL = document.getElementById(tileSerial);
        var itemEL = contEL.closest('.grid-stack-item');
        var position = {
            x: itemEL.getAttribute('gs-x'),
            y: itemEL.getAttribute('gs-y'),
            w: itemEL.getAttribute('gs-w'),
            h: itemEL.getAttribute('gs-h')
        };
        this.infoPosition.set(tileSerial, position);
    }
}