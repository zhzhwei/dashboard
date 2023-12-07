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

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    constructor(private dialog: MatDialog, private chartService: ChartService, private snackBar: MatSnackBar) { }

    openDeleteConfirmation(action: string, tileSerial, dataSource) {
        var dialogRef = this.dialog.open(DeleteConfirmationComponent, {
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true,
            data:{
                message: 'Are you sure to delete?',
                buttonText: {
                    ok: 'Yes',
                    cancel: 'Cancel'
                }
            }
        });
    
        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.chartService.chartAction.next({ action: action, serial: tileSerial });
                this.chartService.chartType.next('remove');
                this.chartService.dataSource.next(dataSource);
            }
        });
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

    openBarChartEditor(action: string, tileSerial: string, jobName: string, titleCount: number) {
        this.dialog.open(BarChartEditorComponent, {
            width: '1500px',
            height: '800px',
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true
        });
        this.chartService.chartAction.next({ action: action, serial: tileSerial, jobName: jobName, titleCount: titleCount });
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

    openPieChartEditor(action: string, tileSerial: string, jobName: string) {
        this.dialog.open(PieChartEditorComponent, {
            width: '1500px',
            height: '800px',
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true
        });
        this.chartService.chartAction.next({ action: action, serial: tileSerial, jobName: jobName });
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

    openLineChartEditor() {
        this.dialog.open(LineChartEditorComponent, {
            width: '1500px',
            height: '800px',
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true
        });
    }
}