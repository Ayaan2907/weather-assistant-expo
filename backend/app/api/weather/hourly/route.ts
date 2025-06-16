import { NextResponse } from "next/server";
import { fetchWeatherApi } from 'openmeteo';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const temperatureUnit = searchParams.get("temperatureUnit") || "celsius";
    const windSpeedUnit = searchParams.get("windSpeedUnit") || "kmh";
    const precipitationUnit = searchParams.get("precipitationUnit") || "mm";
    const forecastDays = searchParams.get("forecastDays") || "3";
    
    const url = "https://api.open-meteo.com/v1/forecast";

    if (!lat || !lon) {
        return new Response("Missing lat or lon", { status: 400 });
    }

    const params = {
        latitude: Number(lat),
        longitude: Number(lon),
        hourly: [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'precipitation_probability',
            'precipitation',
            'rain',
            'showers',
            'snowfall',
            'snow_depth',
            'weather_code',
            'pressure_msl',
            'cloud_cover',
            'visibility',
            'wind_speed_10m',
            'wind_direction_10m',
            'wind_gusts_10m',
            'uv_index'
        ],
        timezone: 'auto',
        temperature_unit: temperatureUnit,
        wind_speed_unit: windSpeedUnit,
        precipitation_unit: precipitationUnit,
        forecast_days: Number(forecastDays),
    };

    try {
        const responses = await fetchWeatherApi(url, params);
        const response = responses[0];

        const utcOffsetSeconds = response.utcOffsetSeconds();
        const timezone = response.timezone();
        const timezoneAbbreviation = response.timezoneAbbreviation();
        const latitude = response.latitude();
        const longitude = response.longitude();

        const hourly = response.hourly()!;

        const hourlyWeather = {
            time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
                (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
            ),
            temperature2m: hourly.variables(0)!.valuesArray()!,
            relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
            apparentTemperature: hourly.variables(2)!.valuesArray()!,
            precipitationProbability: hourly.variables(3)!.valuesArray()!,
            precipitation: hourly.variables(4)!.valuesArray()!,
            rain: hourly.variables(5)!.valuesArray()!,
            showers: hourly.variables(6)!.valuesArray()!,
            snowfall: hourly.variables(7)!.valuesArray()!,
            snowDepth: hourly.variables(8)!.valuesArray()!,
            weatherCode: hourly.variables(9)!.valuesArray()!,
            pressureMsl: hourly.variables(10)!.valuesArray()!,
            cloudCover: hourly.variables(11)!.valuesArray()!,
            visibility: hourly.variables(12)!.valuesArray()!,
            windSpeed10m: hourly.variables(13)!.valuesArray()!,
            windDirection10m: hourly.variables(14)!.valuesArray()!,
            windGusts10m: hourly.variables(15)!.valuesArray()!,
            uvIndex: hourly.variables(16)!.valuesArray()!
        };

        return NextResponse.json({
            utcOffsetSeconds,
            timezone,
            timezoneAbbreviation,
            latitude,
            longitude,
            hourly: hourlyWeather
        });
    } catch (error) {
        console.error('Hourly weather API error:', error);
        return new Response("Failed to fetch hourly weather", { status: 500 });
    }
} 