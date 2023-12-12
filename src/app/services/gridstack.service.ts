import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GridStackService {
    public majorEmpty = new BehaviorSubject<boolean>(false);
    currentMajorEmpty = this.majorEmpty.asObservable();

    public minorEmpty = new BehaviorSubject<boolean>(false);
    currentMinorEmpty = this.minorEmpty.asObservable();

    public minorGridEL = new BehaviorSubject<boolean>(false);
    currentMinorGridEl = this.minorGridEL.asObservable();

    public newTile = {
        w: 3, h: 3,
        minW: 3, minH: 3,
        autoPosition: true,
    };

    public majorInitImage = {
        w: 12, h: 6, minW: 12, minH: 6,
        content: '<div style="background-color: #5763cc; height: 100%; width: 100%; display: flex; align-items: center; justify-content: center;"><p style="color: white; font-size: 70px; text-align: center;">Welcome to Dashboard for <br> Semantic Data Visualization!</p></div>',
        noResize: true,
    };

    public minorInitImage = {
        w: 12, h: 3, minW: 12, minH: 3,
        content: '<ion-icon name="heart" style="color: white; background-color: rgb(115, 105, 148); height: 100%; width: 100%"></ion-icon>',
        noResize: true,
    };
}