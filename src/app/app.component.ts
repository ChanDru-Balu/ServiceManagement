import { Component } from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';
import { JobsService } from 'src/app/services/jobs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'latest';
  isCollapsed = true; // Initially collapsed

  constructor(private jobService: JobsService) {
   
  }





}
