import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather-service/weather.service';
import { GeocodingService } from '../services/geocoding-service/geocoding.service';
import { HttpClientModule } from "@angular/common/http";
import { SearchInputComponent } from '../molecules/molecules.component';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-weather',
  templateUrl: './pages.component.html',
  standalone: true,
  styleUrls: ['./pages.component.css'],
  providers: [GeocodingService, WeatherService, SearchInputComponent],
  imports: [HttpClientModule, SearchInputComponent, NgIf]
})

export class WeatherComponent implements OnInit {
  weatherData: any;
  location: string = 'Paris';
  city: string = 'Paris';
  cityVal: string = 'Paris';
  temperature: number = 0;
  weatherIcon: string = 'sun.png';
  errorMessage: string = '';

  constructor(
      private weatherService: WeatherService,
      private geocodingService: GeocodingService
  ) {}

  ngOnInit(): void {
    this.searchWeather();
  }

  searchWeather(): void {
    this.geocodingService.getCoords(this.location).subscribe(
        response => {
          if (response && response.results && response.results.length > 0) {
            const latitude = response.results[0].latitude;
            const longitude = response.results[0].longitude;
            console.log(this.location);
            console.log(latitude);
            console.log(longitude);
            this.fetchWeatherData(latitude, longitude);
          } else {
            this.errorMessage = 'Could not fetch coordinates for the location.';
          }
        },
        error => {
          this.errorMessage = 'Could not fetch coordinates for the location.';
        }
    );
  }

  fetchWeatherData(latitude: number, longitude: number): void {
    this.weatherService.fetchWeather(latitude, longitude).subscribe(
        data => {
          this.weatherData = this.processWeatherData(data);
          if (this.weatherData && this.weatherData.city) {
            this.city = this.weatherData.city;
            this.temperature = this.weatherData.temperature;
            this.weatherIcon = this.weatherData.weatherIcon;
          }
        },
        error => {
          this.errorMessage = 'Could not fetch weather data.';
        }
    );
  }

  processWeatherData(response: any) {
    const weatherData = {
      hourly: {
        time: response.hourly.time.map((t: string) => new Date(t)),
        temperature2m: response.hourly.temperature_2m,
        relativeHumidity2m: response.hourly.relative_humidity_2m,
        cloudCover: response.hourly.cloud_cover,
        precipitation: response.hourly.precipitation,
        snowfall: response.hourly.snowfall,
        precipitationProbability: response.hourly.precipitation_probability,
        rain: response.hourly.rain,
        isDay: response.hourly.is_day,
      },
      daily: {
        weatherCode: response.daily.weather_code.map((code: number) => this.weatherService.getWMOCodeDescription(code)),
      }
    };
    console.log('Debug');
    console.log('Time');
    console.log(weatherData.hourly.time);
    console.log('Temperature');
    console.log(weatherData.hourly.temperature2m);
    console.log('Humidity');
    console.log(weatherData.hourly.relativeHumidity2m);
    console.log('Precipitation');
    console.log(weatherData.hourly.precipitation);
    console.log('Snowfall');
    console.log(weatherData.hourly.snowfall);
    console.log('Proba precipitation');
    console.log(weatherData.hourly.precipitationProbability);
    console.log('Rain');
    console.log(weatherData.hourly.rain);
    console.log('isDay');
    console.log(weatherData.hourly.isDay);
    console.log('Weather Code');
    console.log(weatherData.daily.weatherCode);
    return weatherData;
  }

  onCountryChange(newCity: string): void {
    this.location = newCity;
    console.log('LOCATION');
    console.log(newCity);
    this.searchWeather();
  }
}
