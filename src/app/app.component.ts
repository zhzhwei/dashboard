import { Component } from '@angular/core';
import { RdfDataService } from './services/rdf-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialog } from './confirmation-dialog.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public triples: any[];

    constructor(private rdfDataService: RdfDataService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

    ngOnInit() {
        var results = this.rdfDataService.queryData()
            .then(data => this.triples = data.results.bindings)
            .catch(error => console.error(error));
        console.log(results);
    }

    openDialog() {
        const dialogRef = this.dialog.open(ConfirmationDialog, {
            width: '20%',
            height: '20%',
            data: {
                message: 'Are you sure to open?',
                buttonText: {
                    ok: 'Yes',
                    cancel: 'No'
                }
            }
        });

        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.snackBar.open('Closing snack bar in 2 seconds', 'close', {
                    duration: 2000,
                });
            }
        });
    }
}