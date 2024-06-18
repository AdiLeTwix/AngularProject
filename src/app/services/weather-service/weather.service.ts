import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// Params used :
/*
* temperature_2m -> Air temperature at 2 meters above ground
* relative_humidity_2m -> Relative humidity at 2 meters above ground
* precipitation_probability -> Probability of precipitation with more than 0.1 mm of the preceding hour
* precipitation ->
* rain -> Rain from large scale weather systems of the preceding hour in millimeter
* snowfall -> Snowfall amount of the preceding hour in centimeters. For the water equivalent in millimeter, divide by 7. E.g. 7 cm snow = 10 mm precipitation water equivalent
* weather_code -> Weather condition as a numeric code. Follow WMO weather interpretation codes. See table below for details.
* cloud_cover -> Total cloud cover as an area fraction
* */
export class WeatherService {
  private apiUrl = 'https://api.open-meteo.com/v1/forecast';
  constructor(private http: HttpClient) { }

  fetchWeather(latitude: number, longitude: number): Observable<any> {
    const params = new HttpParams()
        .set('latitude', latitude.toString())
        .set('longitude', longitude.toString())
        .set('hourly', 'temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,rain,snowfall,weather_code,cloud_cover')
        .set('daily', 'weather_code');

    return this.http.get(this.apiUrl, { params });
  }

  getWMOCodeDescription(code: number): string {
    const wmoCodes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Freezing drizzle, light',
      57: 'Freezing drizzle, dense',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Freezing rain, light',
      67: 'Freezing rain, heavy',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm, slight or moderate',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    return wmoCodes[code] || 'Unknown weather condition';
  }
}
