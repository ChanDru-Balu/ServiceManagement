import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  URL: string | undefined = environment.URL;

  constructor(private http: HttpClient) {}

  getJobs(type: any) {
    if(type == 'online'){
     return this.http.get(`https://zuper.free.beeceptor.com/jobs`);
    }
    else{ 
      return this.http.get(`assets/json/jobs.json`);
    }
  }

  getJobsMeta(type: any) {
    if(type == 'online'){
      return this.http.get(`https://zuper.free.beeceptor.com/jobs/meta`);
     }
     else{ 
       return this.http.get(`assets/json/meta.json`);
     }
    
  }

  validateJson(data: any) {
    // Remove trailing commas after } or ]
    data = data.replace(/,\s*([\]}])/g, '$1');

    try {
      const jsonData = JSON.parse(data);
      // console.log('Parsed JSON:', jsonData);
      return of(jsonData);
    } catch (error: any) {
      console.error('Invalid JSON:', error.message);
      return error
    }
  }
}
