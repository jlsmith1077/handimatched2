import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, _closeDialogVia } from '@angular/material/dialog';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}, private dialogRef:MatDialogRef<ErrorComponent>) {}
  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
