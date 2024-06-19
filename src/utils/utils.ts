export interface HourlyData {
    time: Date[];
    temperature2m: number;
    relativeHumidity2m: number;
    cloudCover: number;
    precipitation: number;
    snowfall: number;
    precipitationProbability: number;
    rain: number;
    isDay: boolean;
}

export interface GroupedDailyData {
    date: Date;
    hourlyData: HourlyData;
}

export interface WeatherData {
    dailyGrouped: GroupedDailyData[];
    daily: DailyData;
    weather_code : number;
    currentTemperature: number;
}

export interface DailyData {
    weatherCode: string[];
}