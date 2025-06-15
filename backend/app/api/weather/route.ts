import { NextResponse } from "next/server";
import { fetchWeatherApi } from 'openmeteo';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const pastDays = searchParams.get("pastDays");
    const temperatureUnit = searchParams.get("temperatureUnit");
    const url = "https://api.open-meteo.com/v1/forecast";

    if (!lat || !lon) {
        return new Response("Missing lat or lon", { status: 400 });
    }

    const params = {
        latitude: Number(lat),
        longitude: Number(lon),
        daily: [
            'weather_code',
            'sunrise',
            'sunset',
            'temperature_2m_max',
            'temperature_2m_min'
        ],
        hourly: [
            'temperature_2m',
            'relative_humidity_2m',
            'wind_speed_10m',
            'precipitation',
            'precipitation_probability',
            'showers',
            'rain',
            'snowfall',
            'snow_depth',
            'visibility',
            'uv_index',
            'sunshine_duration'
        ],
        models: 'best_match',
        current: [
            'temperature_2m',
            'precipitation',
            'rain',
            'showers',
            'snowfall',
            'weather_code'
        ],
        minutely_15: [
            'rain',
            'snowfall',
            'temperature_2m',
            'wind_gusts_10m'
        ],
        timezone: 'auto',
        temperature_unit: temperatureUnit,
        past_days: pastDays ? Number(pastDays) : 3,
    };

    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();

    const current = response.current()!;
    const minutely15 = response.minutely15()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;

    const sunrise = daily.variables(1)!;
    const sunset = daily.variables(2)!;

    const weatherData = {
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature2m: current.variables(0)!.value(),
            precipitation: current.variables(1)!.value(),
            rain: current.variables(2)!.value(),
            showers: current.variables(3)!.value(),
            snowfall: current.variables(4)!.value(),
            weatherCode: current.variables(5)!.value()
        },
        minutely15: {
            time: [...Array((Number(minutely15.timeEnd()) - Number(minutely15.time())) / minutely15.interval())].map(
                (_, i) => new Date((Number(minutely15.time()) + i * minutely15.interval() + utcOffsetSeconds) * 1000)
            ),
            rain: minutely15.variables(0)!.valuesArray()!,
            snowfall: minutely15.variables(1)!.valuesArray()!,
            temperature2m: minutely15.variables(2)!.valuesArray()!,
            windGusts10m: minutely15.variables(3)!.valuesArray()!
        },
        hourly: {
            time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
                (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
            ),
            temperature2m: hourly.variables(0)!.valuesArray()!,
            relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
            windSpeed10m: hourly.variables(2)!.valuesArray()!,
            precipitation: hourly.variables(3)!.valuesArray()!,
            precipitationProbability: hourly.variables(4)!.valuesArray()!,
            showers: hourly.variables(5)!.valuesArray()!,
            rain: hourly.variables(6)!.valuesArray()!,
            snowfall: hourly.variables(7)!.valuesArray()!,
            snowDepth: hourly.variables(8)!.valuesArray()!,
            visibility: hourly.variables(9)!.valuesArray()!,
            uvIndex: hourly.variables(10)!.valuesArray()!,
            sunshineDuration: hourly.variables(11)!.valuesArray()!
        },
        daily: {
            time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
                (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
            ),
            weatherCode: daily.variables(0)!.valuesArray()!,
            sunrise: [...Array(sunrise.valuesInt64Length())].map(
                (_, i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
            ),
            sunset: [...Array(sunset.valuesInt64Length())].map(
                (_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
            ),
            temperature2mMax: daily.variables(3)!.valuesArray()!,
            temperature2mMin: daily.variables(4)!.valuesArray()!
        }
    };

    return NextResponse.json({
        utcOffsetSeconds,
        timezone,
        timezoneAbbreviation,
        latitude,
        longitude,
        weatherData
    });
}