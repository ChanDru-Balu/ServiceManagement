import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-popover-modal',
  templateUrl: './popover-modal.component.html',
  styleUrls: ['./popover-modal.component.css']
})
export class PopoverModalComponent {
  columns : any = [];
//   columns = [
//     {
//         "display_name": "Work Order Number",
//         "data_key": "work_order_number",
//         "data_type": "string",
//         "is_sortable": true,
//         "checked": true
//     },
//     {
//         "display_name": "Job Title",
//         "data_key": "job_title",
//         "data_type": "string",
//         "is_sortable": true,
//         "checked": true,
//         "combine_column": "{{prefix}} {{job_title}}",
//         "display_type": "title"
//     },
//     {
//         "display_name": "Customer",
//         "data_key": "customer",
//         "data_type": "string",
//         "is_sortable": true,
//         "checked": true,
//         "combine_column": "{{customer.customer_first_name}} {{customer.customer_last_name}}",
//         "display_type": "customer"
//     },
//     {
//         "display_name": "Employees Assigned",
//         "data_key": "assigned_to",
//         "data_type": "string",
//         "display_type": "assignment",
//         "is_sortable": false,
//         "checked": true
//     },        
//     {
//         "display_name": "Scheduled Date",
//         "data_key": "scheduled_start_time",
//         "data_type": "datetime",
//         "display_type": "scheduledDatetime",
//         "is_sortable": true,
//         "checked": true
//     },
//     {
//         "display_name": "Category",
//         "data_key": "job_category.category_name",
//         "data_type": "string",
//         "is_sortable": false,
//         "checked": true,
//         "display_type": "string"
//     },
//     {
//         "display_name": "Status",
//         "data_key": "current_job_status.status_type",
//         "data_type": "boolean",
//         "is_sortable": false,
//         "checked": true,
//         "display_type": "badge"
//     },
//     {
//         "display_name": "Priority",
//         "data_key": "job_priority",
//         "data_type": "string",
//         "display_type": "priority",
//         "is_sortable": true,
//         "checked": true
//     }
// ]
//   checkedItems: boolean[] = Array(this.columns.length).fill(false);

  constructor(public dialogRef: MatDialogRef<PopoverModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any){
    console.log({data})
    this.columns = data.columns;
    console.log("Columns:",this.columns)
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    // moveItemInArray(this.checkedItems, event.previousIndex, event.currentIndex);
  }

  onSubmit() {
    // Close the dialog and pass the result (e.g., selected items)
    this.dialogRef.close({ result: 'submit', selectedItems: this.columns });
  }

  onCancel() {
    // Close the dialog without passing any result
    this.dialogRef.close({ result: 'cancel' });
  }
}
