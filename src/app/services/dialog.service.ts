import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BarChartEditorComponent } from '../dialog/bar-chart-editor/bar-chart-editor.component';
import { StackedBarEditorComponent } from '../dialog/stacked-bar-editor/stacked-bar-editor.component';
import { PieChartEditorComponent } from '../dialog/pie-chart-editor/pie-chart-editor.component';
import { DoughnutEditorComponent } from '../dialog/doughnut-editor/doughnut-editor.component';
import { StarPlotEditorComponent } from '../dialog/star-plot-editor/star-plot-editor.component';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    constructor(private dialog: MatDialog) { }

    openBarChartEditor() {
        this.dialog.open(BarChartEditorComponent, {
            width: '1500px',
            height: '800px',
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true
        });
    }

    openStackedBarChartEditor() {
        this.dialog.open(StackedBarEditorComponent, {
            width: '1500px',
            height: '800px',
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true
        });
    }

    openPieChartEditor() {
        this.dialog.open(PieChartEditorComponent, {
            width: '1500px',
            height: '800px',
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true
        });
    }

    openDoughnutChartEditor() {
        this.dialog.open(DoughnutEditorComponent, {
            width: '1500px',
            height: '800px',
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true
        });
    }

    openStarPlotEditor() {
        this.dialog.open(StarPlotEditorComponent, {
            width: '1500px',
            height: '800px',
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true
        });
    }
}