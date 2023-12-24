import { AfterViewInit, Component , OnInit, ViewChild } from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';
import { JobsService } from 'src/app/services/jobs.service';

import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit , AfterViewInit {

  data : any = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'dvsvds', email: 'raj@example.com' },
    { id: 3, name: 'bgbdf', email: 'adca@example.com' },
    { id: 4, name: 'bndfbd', email: 'aliacdcdce@example.com' },
    { id: 5, name: 'dvsxvx', email: 'sdsdv@example.com' },
    { id: 6, name: 'rtnrtn', email: 'resdv@example.com' },
    { id: 7, name: 'nfgbfd', email: 'vdsv@example.com' },
    { id: 8, name: 'yrdbfbfd', email: 'svdsv@example.com' },
    { id: 9, name: 'dbfd', email: 'ewfcas@example.com' },
    { id: 10, name: 'dbdfb', email: 'svsdv@example.com' },
    { id: 11, name: 'dbfdb', email: 'ewdsczx@example.com' },
    { id: 12, name: 'cxvbxc', email: 'dcwdesd@example.com' },
  ];

  displayedColumns: string[] = ['id', 'name', 'email'];
  dataSource = new MatTableDataSource<any>(this.data);
  selection = new SelectionModel<any>(true, this.data.filter((t:any)=> t.id));

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

 
  goToPage : any = null;
  jobsData : any ;
  jobsArray : any[] = [];
  metaArray : any[] = [];
 
  constructor(private jobService: JobsService){
// Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngOnInit(): void {
    this.getJobs('local');
    this.getJobsMeta('local');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

      // Customize the paginator label
      this.paginator._intl.itemsPerPageLabel = 'Page';
      this.paginator._intl.getRangeLabel = this.customRangeLabel.bind(this);

  }

    // Custom range label function
    customRangeLabel(page: number, pageSize: number, length: number): string {
      if (length === 0 || pageSize === 0) {
        return `Page 1 of 1`;
      }
  
      length = Math.max(length, 0);
  
      const startIndex = page * pageSize;
      const endIndex = startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
  
      return `Page ${page + 1} of ${Math.ceil(length / pageSize)}`;
    }

  
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }

      /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
      if (!row) {
        return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

  updateGoToPage() {

    this.paginator.pageIndex = this.goToPage - 1;
  }

  getJobs(type:any){
    this.jobService
    .getJobs(type)
    .pipe(
      catchError((error) => {
        console.error('API error:', error); // Log full error details
        // Attempt to parse and handle syntax errors here
        console.log(error.status);
        if (error.status == 200) {
          //if this condition is working , which means the API is fine but the problem in Response
          // console.log(error.error.text)
          // we need to validate the response is a proper json
          try {
            const parsedData = JSON.parse(error.error.text);
            // If parsing succeeded, handle parsed data
            return parsedData;
          } catch (parseError) {
            // Handle parsing failure

            return this.jobService.validateJson(error.error.text);
          }
        }
        if(error.status == 429 ){
          console.log("The Limit is Reached!")
          this.getJobs('local')
        }
        throw error; // Re-throw to display default error message if needed
      }),
      switchMap((data) => {
        // Handle successful response or validated JSON
        // console.log({ data });
        return of(data); // This line is optional, return data as needed
      })
    )
    .subscribe(
      (jobsData:any) => {
        // This block handles the final data after successful response or validated JSON
        console.log({ jobsData });
        this.jobsData = jobsData;
        this.jobsArray = jobsData['data']
      },
      (subscribeError) => {
        // Handle subscription error if needed
        console.error('Subscription error:', subscribeError);
      }
    );
  }

  getJobsMeta(type:any){
    this.jobService
    .getJobsMeta(type)
    .pipe(
      catchError((error) => {
        console.error('API error:', error); // Log full error details
        // Attempt to parse and handle syntax errors here
        console.log(error.status);
        if (error.status == 200) {
          //if this condition is working , which means the API is fine but the problem in Response
          // console.log(error.error.text)
          // we need to validate the response is a proper json
          try {
            const parsedData = JSON.parse(error.error.text);
            // If parsing succeeded, handle parsed data
            return parsedData;
          } catch (parseError) {
            // Handle parsing failure

            return this.jobService.validateJson(error.error.text);
          }
        }
        if(error.status == 429 ){
          //If the limit is reached , we can use local json file - which is in asset directory
          console.log("The Limit is Reached!")
          this.getJobsMeta('local')
        }
        throw error; // Re-throw to display default error message if needed
      }),
      switchMap((data) => {
        // Handle successful response or validated JSON
        console.log({ data });
        return of(data); // This line is optional, return data as needed
      })
    )
    .subscribe(
      (metaData:any) => {
        // This block handles the final data after successful response or validated JSON
        console.log({ metaData });
        this.metaArray = metaData
      },
      (subscribeError) => {
        // Handle subscription error if needed
        console.error('Subscription error:', subscribeError);
      }
    );
  }

   
  



}


// data = [
//   { id: 1, name: 'Alice', email: 'alice@example.com' },
//   { id: 1, name: 'Alice', email: 'alice@example.com' },
//   { id: 1, name: 'Alice', email: 'alice@example.com' },
//   { id: 1, name: 'Alice', email: 'alice@example.com' },
//   { id: 1, name: 'Alice', email: 'alice@example.com' },
//   { id: 1, name: 'Alice', email: 'alice@example.com' },
//   { id: 1, name: 'Alice', email: 'alice@example.com' },
//   { id: 1, name: 'Alice', email: 'alice@example.com' },
//   { id: 1, name: 'Alice', email: 'alice@example.com' },
//   { id: 1, name: 'Alice', email: 'alice@example.com' },
//   { id: 1, name: 'Alice', email: 'alice@example.com' },
//   { id: 1, name: 'Alice', email: 'alice@example.com' },
//   // ...
// ];
// pagedData: any[] = this.data;
// columns: string[] = ['id', 'name','email']; // Add your column names
// currentPage = 1;
// itemsPerPage = 4;
// totalPages: any;
// selectAll = false;

// toggleSelectAll() {
//   console.log('SelectAll')
//   // for (const item of this.items) {
//   //   item.selected = this.selectAll;
//   // }
// }
// // ngOnInit() {
// //   // Initialize your data here
// //   // Fetch data from a service or API
// //   this.loadData();
// // }

// sortBy(column: string) {
//   // Implement sorting logic here
//   // Update this.pagedData accordingly
// }

// prevPage() {
//   if (this.currentPage > 1) {
//     this.currentPage--;
//     this.updatePagedData();
//   }
// }

// nextPage() {
//   if (this.currentPage < this.totalPages) {
//     this.currentPage++;
//     this.updatePagedData();
//   }
// }

// updatePagedData() {
//   // Update this.pagedData based on the current page and itemsPerPage
// }

// loadData() {
//   // Fetch your data here
//   // Update this.data with your actual data
//   // Initialize this.pagedData based on this.data, currentPage, and itemsPerPage
// }

// // Add filtering logic if needed


