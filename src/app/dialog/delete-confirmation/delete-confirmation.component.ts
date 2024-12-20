import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-delete-confirmation',
    templateUrl: 'delete-confirmation.component.html',
    styleUrls: ['./delete-confirmation.component.css']
})

export class DeleteConfirmationComponent implements OnInit {

    private message: string;
    private confirmButtonText: string;
    private cancelButtonText: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<DeleteConfirmationComponent>) {
        if (data) {
            this.message = data.message;
            if (data.buttonText) {
                this.confirmButtonText = data.buttonText.ok;
                this.cancelButtonText = data.buttonText.cancel;
            }
        }
    }

    ngOnInit(): void {

    }

    onConfirmClick(): void {
        this.dialogRef.close(true);
    }


}