import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteConfirmationComponent } from '../dialog/delete-confirmation/delete-confirmation.component';
import { BarChartEditorComponent } from '../dialog/bar-chart-editor/bar-chart-editor.component';
import { StackedBarEditorComponent } from '../dialog/stacked-bar-editor/stacked-bar-editor.component';
import { PieChartEditorComponent } from '../dialog/pie-chart-editor/pie-chart-editor.component';
import { DoughnutEditorComponent } from '../dialog/doughnut-editor/doughnut-editor.component';
import { StarPlotEditorComponent } from '../dialog/star-plot-editor/star-plot-editor.component';
import { LineChartEditorComponent } from '../dialog/line-chart-editor/line-chart-editor.component';
import { ChartService } from './chart.service';
import { GridStackService } from './gridstack.service';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    constructor(private dialog: MatDialog, private chartService: ChartService, private snackBar: MatSnackBar, private gridService: GridStackService) {}

    openDeleteConfirmation(action: string, tileSerial, dataSource, message: string) {
        var dialogRef = this.dialog.open(DeleteConfirmationComponent, {
            width: '350px',
            height: '150px',
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true,
            data:{
                message: message,
                buttonText: {
                    ok: 'Yes',
                    cancel: 'Cancel'
                }
            }
        });

        if (message === 'Are you sure to delete this widget?') {
            dialogRef.afterClosed().subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.chartService.chartAction.next({
                        action: action, serial: tileSerial,
                        title: ''
                    });
                    this.chartService.chartType.next('remove');
                    this.chartService.dataSource.next(dataSource);
                }
            });
        } else if (message === 'Are you sure to delete all widgets?') {
            dialogRef.afterClosed().subscribe((confirmed: boolean) => {
                if (confirmed) {
                    let keys = Object.keys(localStorage);
                    keys.forEach(key => {
                        if (key.includes('major')) {
                            localStorage.removeItem(key);
                            localStorage.removeItem(key + "-config");
                        }
                    });
                    localStorage.removeItem("temp");
                    this.gridService.majorEmpty.next(true);
                }
            });
        }
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

    openBarChartEditor(action: string, tileSerial: string, title: string, heartColor: any, barColor: any) {
        this.dialog.open(BarChartEditorComponent, {
            width: '1600px',
            height: '850px',
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true,
        });
        this.chartService.chartAction.next({ action: action, serial: tileSerial, title: title, heartColor: heartColor, barColor: barColor });
    }

    openStackedBarChartEditor() {
        this.dialog.open(StackedBarEditorComponent, {
            width: '1600px',
            height: '850px',
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true
        });
    }

    openPieChartEditor(action: string, tileSerial: string, title: string) {
        this.dialog.open(PieChartEditorComponent, {
            width: '1600px',
            height: '850px',
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true
        });
        this.chartService.chartAction.next({ action: action, serial: tileSerial, title: title });
    }

    openDoughnutChartEditor() {
        this.dialog.open(DoughnutEditorComponent, {
            width: '1600px',
            height: '850px',
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true
        });
    }

    openStarPlotEditor() {
        this.dialog.open(StarPlotEditorComponent, {
            width: '1600px',
            height: '850px',
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true
        });
    }

    openLineChartEditor(action: string, tileSerial: string, title: string, heartColor: any, barColor: any) {
        this.dialog.open(LineChartEditorComponent, {
            width: "1600px",
            height: "850px",
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true,
        });
        this.chartService.chartAction.next({ action: action, serial: tileSerial, title: title, heartColor: heartColor, barColor: barColor });
    }
}