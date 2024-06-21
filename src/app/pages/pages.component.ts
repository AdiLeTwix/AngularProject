import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather-service/weather.service';
import { GeocodingService } from '../services/geocoding-service/geocoding.service';
import { HttpClientModule } from '@angular/common/http';
import { SearchInputComponent } from '../molecules/molecules.component';
import {NgForOf, NgIf} from '@angular/common';
import { HourlyData, WeatherData, GroupedDailyData } from '../../utils/utils';
import { SelectForm } from '../molecules/select.component';

@Component({
  selector: 'app-weather',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css'],
  standalone: true,
  providers: [GeocodingService, WeatherService, SearchInputComponent],
  imports: [HttpClientModule, SearchInputComponent, NgIf, SelectForm, NgForOf]
})

export class WeatherComponent implements OnInit {
  weatherData: WeatherData | null = null;
  location: string = 'Paris';
  city: string = 'Paris';
  temperature: number = 0;
  weatherIcon: string = 'sun.png';
  date: string = 'No date available';
  errorMessage: string = '';
  filter: string = 'daily'; // daily or weekly
  meanTemperature: number = 0;
  meanHumidity: number = 0;
  meanPreciationProbability: number = 0;
  meanRain: number = 0;
  meanSnowfall: number = 0;
  meanCloudCover: number = 0;
  descriptionWeather: string = 'No description available';

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
          if (this.weatherData && this.weatherData.dailyGrouped.length > 0) {
            this.city = this.location;
            this.temperature = this.weatherData.currentTemperature;
            this.weatherIcon = this.getWeatherIcon(this.weatherData.weather_code);
            console.log(this.weatherData.dailyGrouped);
          }
        },
        error => {
          this.errorMessage = 'Could not fetch weather data.';
        }
    );
  }

  processWeatherData(response: any): WeatherData {
    const hourlyData = {
      time: response.hourly.time.map((t: string) => new Date(t)),
      temperature2m: response.hourly.temperature_2m,
      relativeHumidity2m: response.hourly.relative_humidity_2m,
      cloudCover: response.hourly.cloud_cover,
      precipitation: response.hourly.precipitation,
      snowfall: response.hourly.snowfall,
      precipitationProbability: response.hourly.precipitation_probability,
      rain: response.hourly.rain,
      isDay: response.hourly.is_day,
    };

    const dataProcessed: GroupedDailyData[] = [];
    const hoursInDay = 24;
    const days = 7;

    for (let i = 0; i < days * hoursInDay; i += hoursInDay) {
      const groupedData: HourlyData = {
        time: hourlyData.time.slice(i, i + hoursInDay),
        temperature2m: this.getMean(hourlyData.temperature2m.slice(i, i + hoursInDay)),
        relativeHumidity2m: this.getMean(hourlyData.relativeHumidity2m.slice(i, i + hoursInDay)),
        cloudCover: this.getMean(hourlyData.cloudCover.slice(i, i + hoursInDay)),
        precipitation: this.getMean(hourlyData.precipitation.slice(i, i + hoursInDay)),
        snowfall: this.getMean(hourlyData.snowfall.slice(i, i + hoursInDay)),
        precipitationProbability: this.getMean(hourlyData.precipitationProbability.slice(i, i + hoursInDay)),
        rain: this.getMean(hourlyData.rain.slice(i, i + hoursInDay)),
        isDay: hourlyData.isDay
      };

      dataProcessed.push({
        date: hourlyData.time[i],
        hourlyData: groupedData,
      });
    }

    const currDate = new Date();
    const currentHour = currDate.getHours();
    const currentTemperature = hourlyData.temperature2m[currentHour];

    const weatherData: WeatherData = {
      dailyGrouped: dataProcessed,
      daily: {
        weatherCode: response.daily.weather_code.map((code: number) => this.weatherService.getWMOCodeDescription(code)),
      },
      weather_code: response.daily.weather_code[0],
      currentTemperature: currentTemperature
    };

    this.errorMessage = '';
    this.date = currDate.toString();
    this.meanHumidity = dataProcessed[0].hourlyData.precipitationProbability;
    this.meanTemperature = dataProcessed[0].hourlyData.temperature2m;
    this.meanRain = dataProcessed[0].hourlyData.rain;
    this.meanPreciationProbability = dataProcessed[0].hourlyData.precipitationProbability;
    this.meanCloudCover = dataProcessed[0].hourlyData.cloudCover;
    this.meanSnowfall = dataProcessed[0].hourlyData.snowfall;
    this.descriptionWeather = weatherData.daily.weatherCode[0];
    return weatherData;
  }

  getWeatherIcon(weather_code: number): string {
    // TODO : Need to add more filters on the choice : example -> thunderstorm moderate
    console.log('Weather code : ' + weather_code);
    switch (weather_code) {
      case 0:
      case 1:
        return 'sun.png';
      case 2:
      case 3:
        return 'cloudy.png';
      case 45:
      case 48:
        return 'fog.png';
      case 51:
      case 53:
      case 55:
      case 56:
      case 57:
      case 61:
      case 63:
      case 65:
        return 'rain.png';
      case 66:
      case 67:
        return 'freezing-rain.png';
      case 71:
      case 73:
      case 75:
      case 85:
      case 86:
        return 'snow.png';
      case 80:
      case 81:
      case 82:
        return 'rain.png';
      case 95:
      case 96:
      case 99:
        return 'storm.png';
      default:
        return 'cloudy.png';
    }
  }

  getMean(array: number[]): number {
    const sum = array.reduce((a, b) => a + b, 0);
    return Math.round(sum / array.length);
  }

  onCountryChange(newCity: string): void {
    this.location = newCity;
    this.searchWeather();
  }

  onFilterChange(newFilter: string): void {
    this.filter = newFilter;
    this.searchWeather();
  }
}