import {SelectionModel} from '@angular/cdk/collections';
import {AfterViewInit, Component,ViewChild, ViewEncapsulation} from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';
import { JobsService } from '../../services/jobs.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort';

import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { PopoverModalComponent } from '../../popover-modal/popover-modal.component';
import { ActivatedRoute } from '@angular/router';



/**
 * @title Table with selection
 */

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements AfterViewInit {
  
  columns = [
    {
        "display_name": "Work Order Number",
        "data_key": "work_order_number",
        "data_type": "string",
        "is_sortable": true,
        "checked": true
    }
]

jobs =   [
  {
      "job_uid": "23a49af0-773b-11ee-af24-7515efe796bc",
      "customer": {
          "customer_last_name": "V",
          "customer_email": "hello@sample.co",
          "customer_first_name": "Charles",
          "customer_uid": "b5554b00-0593-11ec-adaf-cbc38b630fba"
      },
      "prefix": "Q3_0001",
      "assigned_to": [
          {
              "user": {
                  "user_uid": "fea19530-406f-11e8-b99a-59f39b812a88",
                  "first_name": "Henry",
                  "last_name": "Jones",
                  "profile_picture": "https://s3.ap-south-1.amazonaws.com/staging.in.pro.zuper/attachments/6c287db0-ff7c-11e7-b3a8-29b417a4f3fa/80894390-2125-11ee-9dcd-affe7f3e9b1d.jpg"
              },
              "team": {
                  "team_uid": "beeb0c3c-bb1b-4e5d-90c1-b465f1a1ceb9",
                  "team_name": "Team Android"
              }
          }
      ],
      "job_title": "Visit for 123 V33",
      "job_category": {
          "category_name": "Installation",
          "category_uid": "c506e890-015e-11eb-99a8-e7fcc50f879e"
      },
      "job_priority": "LOW",
      "scheduled_start_time": "2023-10-30T14:09:00.000Z",
      "scheduled_end_time": "2023-10-30T22:09:00.000Z",
      "current_job_status": {
          "status_uid": "79d1d7ad-30e5-4deb-bbd2-61d7fec4507d",
          "status_name": "Sent to Service Provider"
      },
      "customer_address": {
          "city": "New York",
          "street": "Google, 8th Avenue",
          "zip_code": "10011",
          "first_name": "First",
          "last_name": "Address",
          "email": "hello@sample.co"
      },
      "customer_billing_address": {
          "landmark": "",
          "city": "Salem",
          "state": "Tamil Nadu",
          "street": "Seelanaickenpatti",
          "zip_code": "636201",
          "first_name": "",
          "last_name": "",
          "phone_number": "",
          "email": ""
      },
      "work_order_number": 13619
  },
  {
      "job_uid": "0a762890-7732-11ee-af24-7515efe796bc",
      "customer": {
          "customer_last_name": "V",
          "customer_first_name": "Charles",
          "customer_uid": "b5554b00-0593-11ec-adaf-cbc38b630fba"
      },
      "prefix": "Q3_0001",
      "assigned_to": [
          {
              "user": {
                  "user_uid": "fea19530-406f-11e8-b99a-59f39b812a88",
                  "first_name": "Henry",
                  "last_name": "Jones",
                  "profile_picture": "https://s3.ap-south-1.amazonaws.com/staging.in.pro.zuper/attachments/6c287db0-ff7c-11e7-b3a8-29b417a4f3fa/80894390-2125-11ee-9dcd-affe7f3e9b1d.jpg"
              },
              "team": {
                  "team_uid": "beeb0c3c-bb1b-4e5d-90c1-b465f1a1ceb9",
                  "team_name": "Team Android"
              }
          }
      ],
      "job_title": "Visit for 123 V33",
      "job_category": {
          "category_name": "Home Cleaning",
          "category_uid": "3fee25f0-74a1-11ea-8ca5-df1d176880cb"
      },
      "job_priority": "LOW",
      "scheduled_start_time": "2023-10-30T13:04:00.000Z",
      "scheduled_end_time": "2023-10-30T14:09:00.000Z",
      "current_job_status": {
          "status_uid": "cc47f5b9-862f-400a-a13f-40c63ca65e2b",
          "status_name": "New"
      },
      "customer_address": {
          "city": "New York",
          "street": "Google, 8th Avenue",
          "zip_code": "10011",
          "first_name": "First",
          "last_name": "Address",
          "email": "hello@sample.co"
      },
      "customer_billing_address": {
          "landmark": "",
          "city": "Salem",
          "state": "Tamil Nadu",
          "street": "Seelanaickenpatti",
          "zip_code": "636201",
          "first_name": "",
          "last_name": "",
          "phone_number": "",
          "email": ""
      },
      "work_order_number": 13618
  }
]

jobsData : any ;
jobsArray : any[] = [];
metaArray : any[] = [];
  // @ViewChild(MatPaginator) paginator: MatPaginator | any;
     // Extract the displayed column names
     displayedColumns: string[] = ['select']; // Initialize with select column
//   dataSource = new MatTableDataSource<any>(this.jobs);
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  total: any = 10;
  page_index: any = 0;
  per_page: any = 10;
  page_no: any = this.page_index+1;
  jumpToPage?: any;
  selected = 'all';
  filterText: any ;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  

  checkedItems: boolean[] = Array(this.columns.length).fill(false);
  currentRoutePath: string = '';

  constructor(
    private matIconRegistry: MatIconRegistry, 
    private domSanitizer: DomSanitizer,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private jobService: JobsService
    ){
    this.matIconRegistry.addSvgIcon('custom_icon', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/funnel.svg'))
    console.log("Displayed Columns:",this.displayedColumns)
    console.log("Data:",this.columns)
    console.log("Jobs:",this.jobs)
    this.currentRoutePath = this.getCurrentRoutePath();
    // alert(this.currentRoutePath)

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
        // this.dataSource = new MatTableDataSource<any>(this.jobsArray);
        this.updateDataSource()
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
        this.metaArray = metaData.data
        this.updateDataSource()
      },
      (subscribeError) => {
        // Handle subscription error if needed
        console.error('Subscription error:', subscribeError);
      }
    );
  }

  openPopoverModal() {
    const dialogRef = this.dialog.open(PopoverModalComponent, {
      width: '400px', // Adjust the width as per your design
      height: '400px', // Adjust the height as per your design
      data: {
        columns : this.metaArray, // Pass your data here
      }
    },);
  
    // Subscribe to the afterClosed event if you want to handle anything when the modal is closed.
    dialogRef.afterClosed().subscribe(result => {
      this.metaArray = result.selectedItems
      console.log("Changed Meta Array:",this.metaArray)
      this.updateDataSource()
    });
  }

      // Method to set the data source with new jobs and columns
      updateDataSource() {
        console.log("Meta Array:",this.metaArray)
        console.log("Columns:",this.columns)
        this.displayedColumns = ['select', ...this.metaArray.map(column => column.data_key)];
        this.dataSource = new MatTableDataSource<any>(this.jobsArray);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    moveItemInArray(this.checkedItems, event.previousIndex, event.currentIndex);
  }

 ngOnInit() {

    this.getJobs('online')
    this.getJobsMeta('online')

    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    // this.dataSource = this.jobsArray;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

         // Customize the paginator label
         this.paginator._intl.itemsPerPageLabel = 'Page';
         this.paginator._intl.getRangeLabel = this.customRangeLabel.bind(this);
  }

  checkValue(job: any,column: any,i:number): any {

    // console.log({job,i,column});

    if(column.display_type == "customer"){
      // console.log(column.combine_column)
      if(column.combine_column){
        return job['customer'] ? job['customer'].customer_first_name +' '+ job['customer'].customer_last_name : null
      }
    }
    if(column.display_type == "title"){
      // console.log(column.combine_column)
      if(column.combine_column){
        return (job.prefix ? job.prefix : '' )  +' '+ job.job_title
      }
    }


    if(column.display_type == "string"){
      // console.log(column.combine_column)
        return job.job_category.category_name
    }

    if(column.display_type == "badge"){
      // console.log(job.current_job_status.status_name)
        return job.current_job_status.status_name
    }

  }

  loadPageData() {
    const pageIndex = this.paginator.pageIndex;
    console.log({pageIndex})
    const pageSize = this.paginator.pageSize;
    console.log({pageSize})

      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;
      setTimeout(() => {
        const dataSlice: any[] = this.jobs!.slice();

        this.dataSource.data = dataSlice;
        console.log("Data loaded for page", pageIndex + 1);
      });

    // });
  }

  applyFilter(ev:any){
    // console.log({ev})
    const filterValue = (ev.target as HTMLInputElement).value;
    console.log({filterValue})
    console.log(filterValue.trim().toLowerCase())
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log("DataSource:",this.dataSource)
  }

  clearFilter(){
    this.filterText="";
    this.updateDataSource()
  }

  onChangedPageSize(ev:any){
    console.log({ev})
  }

   // Function to handle jump to page
   jumpTo() {
    console.log('JumpTo')
    console.log(this.paginator)
    console.log(this.jumpToPage && this.jumpToPage > 0 && this.jumpToPage <= this.paginator.getNumberOfPages())
    if (this.jumpToPage && this.jumpToPage > 0 && this.jumpToPage <= this.paginator.getNumberOfPages()) {
      this.paginator.pageIndex = this.jumpToPage - 1;
      this.loadPageData()
      // this.jumpToPage = null; // Reset the jumpToPage variable
      // this.paginator.pageIndex = this.page_index, // number of the page you want to jump.
      // this.paginator.page.next({      
      //      pageIndex: this.page_index,
      //      pageSize: this.paginator.pageSize,
      //      length: this.paginator.length
      //    });
    }
  }

  getCurrentRoutePath(): string {
    let route = this.route;
    
    // Traverse the route hierarchy to get the complete route path
    while (route.firstChild) {
      route = route.firstChild;
    }

    // Access the activated route snapshot to get the URL segments
    const segments = route.snapshot.url.map(segment => segment.path);

    // Join the URL segments to get the complete route path
    const path = segments.join('/');

    return `${path}`; // Assuming you want to start with a leading slash
  }

  


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  logSelection() {
    this.selection.selected.forEach(s => console.log(s.name));
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

  
}

