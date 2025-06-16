import { NextResponse } from "next/server";
import { fetchWeatherApi } from 'openmeteo';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const temperatureUnit = searchParams.get("temperatureUnit") || "celsius";
    const windSpeedUnit = searchParams.get("windSpeedUnit") || "kmh";
    const precipitationUnit = searchParams.get("precipitationUnit") || "mm";
    
    const url = "https://api.open-meteo.com/v1/forecast";

    if (!lat || !lon) {
        return new Response("Missing lat or lon", { status: 400 });
    }

    const params = {
        latitude: Number(lat),
        longitude: Number(lon),
        current: [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'precipitation',
            'rain',
            'showers',
            'snowfall',
            'weather_code',
            'cloud_cover',
            'pressure_msl',
            'wind_speed_10m',
            'wind_direction_10m',
            'wind_gusts_10m'
        ],
        timezone: 'auto',
        temperature_unit: temperatureUnit,
        wind_speed_unit: windSpeedUnit,
        precipitation_unit: precipitationUnit,
    };

    try {
        const responses = await fetchWeatherApi(url, params);
        const response = responses[0];

        const utcOffsetSeconds = response.utcOffsetSeconds();
        const timezone = response.timezone();
        const timezoneAbbreviation = response.timezoneAbbreviation();
        const latitude = response.latitude();
        const longitude = response.longitude();

        const current = response.current()!;

        const currentWeather = {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature2m: current.variables(0)!.value(),
            relativeHumidity2m: current.variables(1)!.value(),
            apparentTemperature: current.variables(2)!.value(),
            precipitation: current.variables(3)!.value(),
            rain: current.variables(4)!.value(),
            showers: current.variables(5)!.value(),
            snowfall: current.variables(6)!.value(),
            weatherCode: current.variables(7)!.value(),
            cloudCover: current.variables(8)!.value(),
            pressureMsl: current.variables(9)!.value(),
            windSpeed10m: current.variables(10)!.value(),
            windDirection10m: current.variables(11)!.value(),
            windGusts10m: current.variables(12)!.value()
        };

        return NextResponse.json({
            utcOffsetSeconds,
            timezone,
            timezoneAbbreviation,
            latitude,
            longitude,
            current: currentWeather
        });
    } catch (error) {
        console.error('Current weather API error:', error);
        return new Response("Failed to fetch current weather", { status: 500 });
    }
} 