import { Component } from '@angular/core';

export interface PeriodicElement {
    subject: string;
    predicate: number;
    object: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { subject: 'Hydrogen', predicate: 1.0079, object: 'H' },
    { subject: 'Helium', predicate: 4.0026, object: 'He' },
    { subject: 'Lithium', predicate: 6.941, object: 'Li' },
    { subject: 'Beryllium', predicate: 9.0122, object: 'Be' },
    { subject: 'Boron', predicate: 10.811, object: 'B' },
    { subject: 'Carbon', predicate: 12.0107, object: 'C' },
    { subject: 'Nitrogen', predicate: 14.0067, object: 'N' },
    { subject: 'Oxygen', predicate: 15.9994, object: 'O' },
    { subject: 'Fluorine', predicate: 18.9984, object: 'F' },
    { subject: 'Neon', predicate: 20.1797, object: 'Ne' },
];

@Component({
    selector: 'app-stacked-bareditor',
    templateUrl: './stackedbareditor.component.html',
    styleUrls: ['./stackedbareditor.component.css']
})
export class StackedBarEditorComponent {
    constructor() { }

    displayedColumns: string[] = ['subject', 'predicate', 'object'];
    dataSource = ELEMENT_DATA;

    ngOnInit(): void {

    }

    public backToDashboard(): void {
        console.log("back to dashboard");
        // go back to dashboard
        
    }
}