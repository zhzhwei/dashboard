import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VisGenDialogComponent } from './dialog/vis-gen-dialog/vis-gen-dialog.component';
import { ChartService } from './services/chart.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    private showDiagrams: boolean = false;
    constructor(public dialog: MatDialog, private chartService: ChartService) { }
    
    ngOnInit() {

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

    toggleShowDiagrams() {
        this.showDiagrams = !this.showDiagrams;
        this.chartService.showDiagrams.next(this.showDiagrams);
    }

    loadDiagram() {
        this.chartService.loadJsonFile();
    }

}