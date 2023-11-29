import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
    constructor(private dialog: MatDialog, private chartService: ChartService) { }

    openDeleteConfirmation(chartType, tileSerial) {
        const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
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
                // console.log('Delete confirmed');
                this.chartService.diagramRemoved.next({ type: chartType, serial: tileSerial, removed: true });
            }
        });
    }

    openBarChartEditor(drivenBy: string) {
        this.dialog.open(BarChartEditorComponent, {
            width: '1500px',
            height: '800px',
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true
        });
        this.chartService.drivenBy.next(drivenBy);
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

    openPieChartEditor(drivenBy: string) {
        this.dialog.open(PieChartEditorComponent, {
            width: '1500px',
            height: '800px',
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true
        });
        this.chartService.drivenBy.next(drivenBy);
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