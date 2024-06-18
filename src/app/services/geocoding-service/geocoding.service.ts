import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class GeocodingService {
  private apiURL = "https://geocoding-api.open-meteo.com/v1/search";

  constructor(private http: HttpClient) { }

  getCoords(location : string) : Observable<any> {
    const params = new HttpParams()
        .set('name', location)
        .set('count', '1')
        .set('language', 'en')
        .set('format', 'json');

    return this.http.get(this.apiURL, { params });
  }
}
