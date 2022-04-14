
export interface WeatherData {
  base: string;
  clouds: {
    all: number;
  };
  cod: number;
  coord: {
    lat: number;
    lon: number;
  };
  dt: number;
  id: number;
  main: {
    feels_like: number;
    grnd_level: number;
    humidity: number;
    presure: number;
    sea_level: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  name: string;
  sys: {
    country: string;
    id: number;
    sunrise: number;
    sunset: number;
    type: number;
  };
  timezone: number;
  visibility: number;
  weather: [
    {
      description: string;
      icon: string;
      id: number;
      main: string;
    },
  ];
  wind: {
    deg: number;
    gust: number;
    speed: number;
  };
}

// {
//    "base":"stations",
//    "clouds":{
//       "all":100
//    },
//    "cod":200,
//    "coord":{
//       "lat":37.57,
//       "lon":126.98
//    },
//    "dt":1649931153,
//    "id":1835848,
//    "main":{
//       "feels_like":285.6,
//       "grnd_level":1013,
//       "humidity":50,
//       "pressure":1019,
//       "sea_level":1019,
//       "temp":286.87,
//       "temp_max":286.9,
//       "temp_min":286.87
//    },
//    "name":"Seoul",
//    "sys":{
//       "country":"KR",
//       "id":5509,
//       "sunrise":1649883549,
//       "sunset":1649930722,
//       "type":1
//    },
//    "timezone":32400,
//    "visibility":10000,
//    "weather":[
//       {
//          "description":"overcast clouds",
//          "icon":"04n",
//          "id":804,
//          "main":"Clouds"
//       }
//    ],
//    "wind":{
//       "deg":95,
//       "gust":4.5,
//       "speed":1.82
//    }
// }

