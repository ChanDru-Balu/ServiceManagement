import { Component } from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';
import { JobsService } from 'src/app/services/jobs.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent {

  data = [
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
    // ...
  ];
  pagedData: any[] = this.data;
  columns: string[] = ['id', 'name','email']; // Add your column names
  currentPage = 1;
  itemsPerPage = 4;
  totalPages: any;

  // ngOnInit() {
  //   // Initialize your data here
  //   // Fetch data from a service or API
  //   this.loadData();
  // }

  sortBy(column: string) {
    // Implement sorting logic here
    // Update this.pagedData accordingly
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedData();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedData();
    }
  }

  updatePagedData() {
    // Update this.pagedData based on the current page and itemsPerPage
  }

  loadData() {
    // Fetch your data here
    // Update this.data with your actual data
    // Initialize this.pagedData based on this.data, currentPage, and itemsPerPage
  }

  // Add filtering logic if needed

  
  

  constructor(private jobService: JobsService){

  }

  ngOnInit(){
    this.getJobs();
    this.getJobsMeta();
  }

  getJobs(){
    this.jobService
    .getJobs()
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
        throw error; // Re-throw to display default error message if needed
      }),
      switchMap((data) => {
        // Handle successful response or validated JSON
        // console.log({ data });
        return of(data); // This line is optional, return data as needed
      })
    )
    .subscribe(
      (jobsData) => {
        // This block handles the final data after successful response or validated JSON
        console.log({ jobsData });
      },
      (subscribeError) => {
        // Handle subscription error if needed
        console.error('Subscription error:', subscribeError);
      }
    );
  }

  getJobsMeta(){
    this.jobService
    .getJobsMeta()
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
        throw error; // Re-throw to display default error message if needed
      }),
      switchMap((data) => {
        // Handle successful response or validated JSON
        console.log({ data });
        return of(data); // This line is optional, return data as needed
      })
    )
    .subscribe(
      (metaData) => {
        // This block handles the final data after successful response or validated JSON
        console.log({ metaData });
      },
      (subscribeError) => {
        // Handle subscription error if needed
        console.error('Subscription error:', subscribeError);
      }
    );
  }

}
