import { AfterViewInit, Component , OnInit, ViewChild } from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';
import { JobsService } from 'src/app/services/jobs.service';

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
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 1, name: 'Alice', email: 'alice@example.com' },
  ];
  
  displayedColumns: string[] = ['id', 'name', 'email'];
  dataSource = new MatTableDataSource<any>(this.data);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

 

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


