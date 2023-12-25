import {SelectionModel} from '@angular/cdk/collections';
import {AfterViewInit, Component,ViewChild, ViewEncapsulation} from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';
import { JobsService } from 'src/app/services/jobs.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort';

import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { PopoverModalComponent } from 'src/app/popover-modal/popover-modal.component';
import { ActivatedRoute } from '@angular/router';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 12, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 13, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 14, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 15, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 16, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 17, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 18, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 19, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 20, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 21, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 22, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 23, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 24, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 25, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 26, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 27, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 28, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

/**
 * @title Table with selection
 */

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements AfterViewInit {
  
  columns = [
    {
        "display_name": "Work Order Number",
        "data_key": "work_order_number",
        "data_type": "string",
        "is_sortable": true,
        "checked": true
    },
    {
        "display_name": "Job Title",
        "data_key": "job_title",
        "data_type": "string",
        "is_sortable": true,
        "checked": true,
        "combine_column": "{{prefix}} {{job_title}}",
        "display_type": "title"
    },
    {
        "display_name": "Customer",
        "data_key": "customer",
        "data_type": "string",
        "is_sortable": true,
        "checked": true,
        "combine_column": "{{customer.customer_first_name}} {{customer.customer_last_name}}",
        "display_type": "customer"
    },
    {
        "display_name": "Employees Assigned",
        "data_key": "assigned_to",
        "data_type": "string",
        "display_type": "assignment",
        "is_sortable": false,
        "checked": true
    },        
    {
        "display_name": "Scheduled Date",
        "data_key": "scheduled_start_time",
        "data_type": "datetime",
        "display_type": "scheduledDatetime",
        "is_sortable": true,
        "checked": true
    },
    {
        "display_name": "Category",
        "data_key": "job_category.category_name",
        "data_type": "string",
        "is_sortable": false,
        "checked": true,
        "display_type": "string"
    },
    {
        "display_name": "Status",
        "data_key": "current_job_status.status_type",
        "data_type": "boolean",
        "is_sortable": false,
        "checked": true,
        "display_type": "badge"
    },
    {
        "display_name": "Priority",
        "data_key": "job_priority",
        "data_type": "string",
        "display_type": "priority",
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
  },
  {
      "job_uid": "18ccec90-7731-11ee-af24-7515efe796bc",
      "customer": null,
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
      "job_title": "Visit for Org ",
      "job_category": {
          "category_name": "Installation",
          "category_uid": "c506e890-015e-11eb-99a8-e7fcc50f879e"
      },
      "job_priority": "LOW",
      "scheduled_start_time": "2023-10-30T12:58:00.000Z",
      "scheduled_end_time": "2023-10-30T20:58:00.000Z",
      "current_job_status": {
          "status_uid": "79d1d7ad-30e5-4deb-bbd2-61d7fec4507d",
          "status_name": "Sent to Service Provider"
      },
      "customer_address": {
          "landmark": "",
          "city": "Chennai",
          "state": "Tamil Nadu",
          "street": "Chennai International Airport (MAA), Airport Road, Meenambakkam",
          "zip_code": "600027"
      },
      "customer_billing_address": {
          "landmark": "",
          "city": "Chennai",
          "state": "Tamil Nadu",
          "street": "Turyaa Chennai, Old Mahabalipuram Road, Elango Nagar, Perungudi",
          "zip_code": "600041",
          "first_name": "Amika ",
          "last_name": "Tower",
          "phone_number": "1231231231",
          "email": "Amika@gmail.com"
      },
      "work_order_number": 13617
  },
  {
      "job_uid": "381ba190-7709-11ee-af24-7515efe796bc",
      "customer": {
          "customer_uid": "fb684bf0-6da2-11ee-ad52-fb5442a7fc06",
          "customer_first_name": "arunkumar",
          "customer_last_name": "101"
      },
      "prefix": "Q3_0001",
      "assigned_to": [
          {
              "user": {
                  "user_uid": "b495daea-d3d7-496c-bf0b-3327190ae1a5",
                  "first_name": "Arun",
                  "last_name": "kumar",
                  "profile_picture": "https://s3.ap-south-1.amazonaws.com/prod.app.zuperpro/assets/profile_picture.jpg"
              },
              "team": {
                  "team_uid": "335c25ef-c54a-43d3-9c88-7c62921e4da4",
                  "team_name": "Maintanence"
              }
          }
      ],
      "job_title": "fan repair",
      "job_category": {
          "category_uid": "f5328700-9559-11ec-aba4-4d513227a15a",
          "category_name": "Equipment Repair"
      },
      "job_priority": "MEDIUM",
      "scheduled_start_time": "2023-10-31T09:45:18.000Z",
      "scheduled_end_time": "2023-10-31T11:45:18.000Z",
      "current_job_status": {
          "status_uid": "a299a154-2525-4890-a2e9-1f9d9025115d",
          "status_name": "New"
      },
      "customer_address": {
          "landmark": "",
          "city": "Chennai",
          "state": "Tamil Nadu",
          "street": "WorkEZ Urban Square OMR - Managed Offices and Coworking Spaces, Elango Nagar, Perungudi",
          "country": "",
          "zip_code": "",
          "first_name": "arunkumar",
          "last_name": "101",
          "phone_number": "9876554321",
          "email": "arunkumar.r@zuper.co"
      },
      "customer_billing_address": {
          "landmark": "",
          "city": "Chennai",
          "state": "Tamil Nadu",
          "street": "WorkEZ Urban Square OMR - Managed Offices and Coworking Spaces, Elango Nagar, Perungudi",
          "country": "",
          "zip_code": "600041",
          "first_name": "Acme Inc.",
          "last_name": "",
          "phone_number": "",
          "email": ""
      },
      "work_order_number": 13616
  },
  {
      "job_uid": "0b7b3920-7709-11ee-af24-7515efe796bc",
      "customer": {
          "customer_uid": "fb684bf0-6da2-11ee-ad52-fb5442a7fc06",
          "customer_first_name": "arunkumar",
          "customer_last_name": "101"
      },
      "assigned_to": [
          {
              "user": {
                  "user_uid": "b495daea-d3d7-496c-bf0b-3327190ae1a5",
                  "first_name": "Arun",
                  "last_name": "kumar",
                  "profile_picture": "https://s3.ap-south-1.amazonaws.com/prod.app.zuperpro/assets/profile_picture.jpg"
              },
              "team": {
                  "team_uid": "335c25ef-c54a-43d3-9c88-7c62921e4da4",
                  "team_name": "Maintanence"
              }
          }
      ],
      "job_title": "fan repair",
      "job_category": {
          "category_uid": "f5328700-9559-11ec-aba4-4d513227a15a",
          "category_name": "Equipment Repair"
      },
      "job_priority": "MEDIUM",
      "scheduled_start_time": "2023-10-31T09:45:18.000Z",
      "scheduled_end_time": "2023-10-31T11:45:18.000Z",
      "current_job_status": {
          "status_uid": "a299a154-2525-4890-a2e9-1f9d9025115d",
          "status_name": "New"
      },
      "customer_address": {
          "landmark": "",
          "city": "Chennai",
          "state": "Tamil Nadu",
          "street": "WorkEZ Urban Square OMR - Managed Offices and Coworking Spaces, Elango Nagar, Perungudi",
          "country": "",
          "zip_code": "",
          "first_name": "arunkumar",
          "last_name": "101",
          "phone_number": "9876554321",
          "email": "arunkumar.r@zuper.co"
      },
      "customer_billing_address": {
          "landmark": "",
          "city": "Chennai",
          "state": "Tamil Nadu",
          "street": "WorkEZ Urban Square OMR - Managed Offices and Coworking Spaces, Elango Nagar, Perungudi",
          "country": "",
          "zip_code": "600041",
          "first_name": "Acme Inc.",
          "last_name": "",
          "phone_number": "",
          "email": ""
      },
      "work_order_number": 13615
  },
  {
      "job_uid": "23a49af0-773b-11ee-af24-7515efe796bc",
      "customer": {
          "customer_last_name": "V",
          "customer_email": "hello@sample.co",
          "customer_first_name": "David",
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
          "customer_first_name": "Henry",
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
  },
  {
      "job_uid": "18ccec90-7731-11ee-af24-7515efe796bc",
      "customer": null,
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
      "job_title": "Visit for Org ",
      "job_category": {
          "category_name": "Installation",
          "category_uid": "c506e890-015e-11eb-99a8-e7fcc50f879e"
      },
      "job_priority": "LOW",
      "scheduled_start_time": "2023-10-30T12:58:00.000Z",
      "scheduled_end_time": "2023-10-30T20:58:00.000Z",
      "current_job_status": {
          "status_uid": "79d1d7ad-30e5-4deb-bbd2-61d7fec4507d",
          "status_name": "Sent to Service Provider"
      },
      "work_order_number": 13617
  },
  {
      "job_uid": "381ba190-7709-11ee-af24-7515efe796bc",
      "customer": {
          "customer_uid": "fb684bf0-6da2-11ee-ad52-fb5442a7fc06",
          "customer_first_name": "arunkumar",
          "customer_last_name": "101"
      },
      "prefix": "Q3_0001",
      "assigned_to": [
          {
              "user": {
                  "user_uid": "b495daea-d3d7-496c-bf0b-3327190ae1a5",
                  "first_name": "Arun",
                  "last_name": "kumar",
                  "profile_picture": "https://s3.ap-south-1.amazonaws.com/prod.app.zuperpro/assets/profile_picture.jpg"
              },
              "team": {
                  "team_uid": "335c25ef-c54a-43d3-9c88-7c62921e4da4",
                  "team_name": "Maintanence"
              }
          }
      ],
      "job_title": "fan repair",
      "job_category": {
          "category_uid": "f5328700-9559-11ec-aba4-4d513227a15a",
          "category_name": "Equipment Repair"
      },
      "job_priority": "MEDIUM",
      "scheduled_start_time": "2023-10-31T09:45:18.000Z",
      "scheduled_end_time": "2023-10-31T11:45:18.000Z",
      "current_job_status": {
          "status_uid": "a299a154-2525-4890-a2e9-1f9d9025115d",
          "status_name": "New"
      },
      "customer_address": {
          "landmark": "",
          "city": "Chennai",
          "state": "Tamil Nadu",
          "street": "WorkEZ Urban Square OMR - Managed Offices and Coworking Spaces, Elango Nagar, Perungudi",
          "country": "",
          "zip_code": "",
          "first_name": "arunkumar",
          "last_name": "101",
          "phone_number": "9876554321",
          "email": "arunkumar.r@zuper.co"
      },
      "customer_billing_address": {
          "landmark": "",
          "city": "Chennai",
          "state": "Tamil Nadu",
          "street": "WorkEZ Urban Square OMR - Managed Offices and Coworking Spaces, Elango Nagar, Perungudi",
          "country": "",
          "zip_code": "600041",
          "first_name": "Acme Inc.",
          "last_name": "",
          "phone_number": "",
          "email": ""
      },
      "work_order_number": 13616
  },
  {
      "job_uid": "0b7b3920-7709-11ee-af24-7515efe796bc",
      "customer": {
          "customer_uid": "fb684bf0-6da2-11ee-ad52-fb5442a7fc06",
          "customer_first_name": "arunkumar",
          "customer_last_name": "101"
      },
      "assigned_to": [
          {
              "user": {
                  "user_uid": "b495daea-d3d7-496c-bf0b-3327190ae1a5",
                  "first_name": "Arun",
                  "last_name": "kumar",
                  "profile_picture": "https://s3.ap-south-1.amazonaws.com/prod.app.zuperpro/assets/profile_picture.jpg"
              },
              "team": {
                  "team_uid": "335c25ef-c54a-43d3-9c88-7c62921e4da4",
                  "team_name": "Maintanence"
              }
          }
      ],
      "job_title": "fan repair",
      "job_category": {
          "category_uid": "f5328700-9559-11ec-aba4-4d513227a15a",
          "category_name": "Equipment Repair"
      },
      "job_priority": "MEDIUM",
      "scheduled_start_time": "2023-10-31T09:45:18.000Z",
      "scheduled_end_time": "2023-10-31T11:45:18.000Z",
      "current_job_status": {
          "status_uid": "a299a154-2525-4890-a2e9-1f9d9025115d",
          "status_name": "New"
      },
      "customer_address": {
          "landmark": "",
          "city": "Chennai",
          "state": "Tamil Nadu",
          "street": "WorkEZ Urban Square OMR - Managed Offices and Coworking Spaces, Elango Nagar, Perungudi",
          "country": "",
          "zip_code": "",
          "first_name": "arunkumar",
          "last_name": "101",
          "phone_number": "9876554321",
          "email": "arunkumar.r@zuper.co"
      },
      "customer_billing_address": {
          "landmark": "",
          "city": "Chennai",
          "state": "Tamil Nadu",
          "street": "WorkEZ Urban Square OMR - Managed Offices and Coworking Spaces, Elango Nagar, Perungudi",
          "country": "",
          "zip_code": "600041",
          "first_name": "Acme Inc.",
          "last_name": "",
          "phone_number": "",
          "email": ""
      },
      "work_order_number": 13615
  }
]
  
  // @ViewChild(MatPaginator) paginator: MatPaginator | any;
     // Extract the displayed column names
  displayedColumns = ['select', ...this.columns.map(column => column.data_key)];
  dataSource = new MatTableDataSource<any>(this.jobs);
  selection = new SelectionModel<PeriodicElement>(true, []);
  total: any = 10;
  page_index: any = 0;
  per_page: any = 10;
  page_no: any = this.page_index+1;
  jumpToPage?: any;
  selected = 'all';
  filterText: any ;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ELEMENT_DATA: PeriodicElement[] | undefined = ELEMENT_DATA;
  

  checkedItems: boolean[] = Array(this.columns.length).fill(false);
  currentRoutePath: string = '';
  jobsData : any ;
  jobsArray : any[] = [];
  metaArray : any[] = [];
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

  openPopoverModal() {
    const dialogRef = this.dialog.open(PopoverModalComponent, {
      width: '400px', // Adjust the width as per your design
      height: '400px', // Adjust the height as per your design
      data: {
        columns : this.columns, // Pass your data here
      }
    },);
  
    // Subscribe to the afterClosed event if you want to handle anything when the modal is closed.
    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal closed with result:', result);
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    moveItemInArray(this.checkedItems, event.previousIndex, event.currentIndex);
  }

 ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngAfterViewInit() {
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

