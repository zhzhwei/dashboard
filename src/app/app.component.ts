import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VisGenDialogComponent } from './dialog/vis-gen-dialog/vis-gen-dialog.component';
import { ChartService } from './services/chart.service';
import { GridHTMLElement } from 'gridstack';

import { GridStackComponent } from './gridstack/gridstack.component';
import { GridStackService } from './services/gridstack.service';
import { DialogService } from './services/dialog.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    @ViewChild(GridStackComponent) gridStack: GridStackComponent;

    selectedId: string = '';

    constructor(public dialog: MatDialog, private chartService: ChartService, 
        private gridService: GridStackService, private dialogService: DialogService) { }
    
    ngOnInit() { }

    welcomeToApp() {
        // window.location.reload();
    }

    openVisGenDialog() {
        this.dialog.open(VisGenDialogComponent, {
            width: '1500px',
            height: '800px',
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true
        });
    }

    toggleShowCharts() {
        let minorGridEl= document.querySelector('#minor-grid') as GridHTMLElement;
        if (minorGridEl.style.display === 'none') {
            minorGridEl.style.display = 'block';
            this.gridService.minorGridEL.next(true);
        } else {
            minorGridEl.style.display = 'none';
            this.gridService.minorGridEL.next(false);
        }
    }

    loadChart() {
        // this.chartService.loadJsonFile();
    }

    removeAllCharts() {
        this.dialogService.openDeleteConfirmation('','','', 'Are you sure to delete all widgets?');
    }

    toggleSelected(id: string) {
        this.selectedId = this.selectedId === id ? '' : id;
    }

    isSelected(id: string) {
        return this.selectedId === id;
    }

}