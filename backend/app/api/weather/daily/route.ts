import { NextResponse } from "next/server";
import { fetchWeatherApi } from 'openmeteo';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const temperatureUnit = searchParams.get("temperatureUnit") || "celsius";
    const windSpeedUnit = searchParams.get("windSpeedUnit") || "kmh";
    const precipitationUnit = searchParams.get("precipitationUnit") || "mm";
    const forecastDays = searchParams.get("forecastDays") || "7";
    
    const url = "https://api.open-meteo.com/v1/forecast";

    if (!lat || !lon) {
        return new Response("Missing lat or lon", { status: 400 });
    }

    const params = {
        latitude: Number(lat),
        longitude: Number(lon),
        daily: [
            'weather_code',
            'temperature_2m_max',
            'temperature_2m_min',
            'apparent_temperature_max',
            'apparent_temperature_min',
            'sunrise',
            'sunset',
            'daylight_duration',
            'sunshine_duration',
            'uv_index_max',
            'precipitation_sum',
            'rain_sum',
            'showers_sum',
            'snowfall_sum',
            'precipitation_hours',
            'precipitation_probability_max',
            'wind_speed_10m_max',
            'wind_gusts_10m_max',
            'wind_direction_10m_dominant'
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

        const daily = response.daily()!;
        const sunrise = daily.variables(5)!;
        const sunset = daily.variables(6)!;

        const dailyWeather = {
            time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
                (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
            ),
            weatherCode: daily.variables(0)!.valuesArray()!,
            temperature2mMax: daily.variables(1)!.valuesArray()!,
            temperature2mMin: daily.variables(2)!.valuesArray()!,
            apparentTemperatureMax: daily.variables(3)!.valuesArray()!,
            apparentTemperatureMin: daily.variables(4)!.valuesArray()!,
            sunrise: [...Array(sunrise.valuesInt64Length())].map(
                (_, i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
            ),
            sunset: [...Array(sunset.valuesInt64Length())].map(
                (_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
            ),
            daylightDuration: daily.variables(7)!.valuesArray()!,
            sunshineDuration: daily.variables(8)!.valuesArray()!,
            uvIndexMax: daily.variables(9)!.valuesArray()!,
            precipitationSum: daily.variables(10)!.valuesArray()!,
            rainSum: daily.variables(11)!.valuesArray()!,
            showersSum: daily.variables(12)!.valuesArray()!,
            snowfallSum: daily.variables(13)!.valuesArray()!,
            precipitationHours: daily.variables(14)!.valuesArray()!,
            precipitationProbabilityMax: daily.variables(15)!.valuesArray()!,
            windSpeed10mMax: daily.variables(16)!.valuesArray()!,
            windGusts10mMax: daily.variables(17)!.valuesArray()!,
            windDirection10mDominant: daily.variables(18)!.valuesArray()!
        };

        return NextResponse.json({
            utcOffsetSeconds,
            timezone,
            timezoneAbbreviation,
            latitude,
            longitude,
            daily: dailyWeather
        });
    } catch (error) {
        console.error('Daily weather API error:', error);
        return new Response("Failed to fetch daily weather", { status: 500 });
    }
} 