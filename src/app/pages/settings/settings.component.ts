import {SelectionModel} from '@angular/cdk/collections';
import {AfterViewInit, Component,ViewChild, ViewEncapsulation} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort';

import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

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
  
  
  // @ViewChild(MatPaginator) paginator: MatPaginator | any;
  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
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
  movies = [
    'Episode I - The Phantom Menace',
    'Episode II - Attack of the Clones',
    'Episode III - Revenge of the Sith',
    'Episode IV - A New Hope',
    'Episode V - The Empire Strikes Back',
    'Episode VI - Return of the Jedi',
    'Episode VII - The Force Awakens',
    'Episode VIII - The Last Jedi',
    'Episode IX - The Rise of Skywalker',
  ];
  checkedItems: boolean[] = Array(this.movies.length).fill(false);

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer){
    this.matIconRegistry.addSvgIcon('custom_icon', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/funnel.svg'))
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
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

  loadPageData() {
    const pageIndex = this.paginator.pageIndex;
    console.log({pageIndex})
    const pageSize = this.paginator.pageSize;
    console.log({pageSize})

      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;
      setTimeout(() => {
        const dataSlice: PeriodicElement[] = this.ELEMENT_DATA!.slice();
    
        this.dataSource.data = dataSlice;
        console.log("Data loaded for page", pageIndex + 1);
      });
      
    // });
  }

  applyFilter(ev:any){
    console.log({ev})
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

