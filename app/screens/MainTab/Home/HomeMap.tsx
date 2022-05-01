import React, {useEffect, useState} from 'react';
import NaverMapView, {Circle, Marker} from 'react-native-nmap';
import styled from 'styled-components/native';
import Geolocation from '@react-native-community/geolocation';
import {ActivityIndicator, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store/reducers';
import Config from 'react-native-config';
import weatherClient from '../../../apis/weatherClient';
import IonIcon from 'react-native-vector-icons/Ionicons';
import UserModal from '../../../components/UserModal';
import unsplashClient from '../../../apis/unsplashClient';
import {WeatherData} from '../../../apis/sampleData/WeatherData';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ChatStackParamList, MainTabParamList} from '../../../navigations/Types';

const Container = styled.View`
  flex: 1;
`;

const HeaderView = styled.View`
  position: absolute;
  margin-top: 44px;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  height: 96px;
  /* background-color: lightblue; */
`;

const WeatherView = styled.View`
  width: 80px;
  background-color: white;
  border-radius: 16px;
  border-width: 1px;
  border-color: lightgray;
  opacity: 0.8;
  align-items: center;
  margin-left: 6px;
  margin-right: 4px;
`;

const NextWeatherView = styled.View`
  flex: 1;
  flex-direction: column;
  border-radius: 16px;
  border-width: 1px;
  border-color: lightgray;
  background-color: white;
  opacity: 0.8;
  margin-right: 6px;
`;

const HeadText = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: black;
  margin: 12px;
`;

const WeatherText = styled.Text`
  font-size: 12px;
  font-weight: 400;
  margin-top: 2px;
  color: black;
`;

const distance = 0.1; // 1km -> 0.01

type HomeMapProp = CompositeNavigationProp<
  NativeStackNavigationProp<ChatStackParamList>,
  NativeStackNavigationProp<MainTabParamList>
>;

const HomeMap = () => {
  const navigation = useNavigation();
  //User Control
  const orders = useSelector((state: RootState) => state.order.orders);
  const [myPosition, setMyPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  //User -> Modal
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<string>('');
  const [userLoca, setUserLoca] = useState<string>('');
  const [userImage, setUserImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  //Weather Control
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [myWeather, setMyWeather] = useState<string>('');
  const [iconName, setIconName] = useState<string>('');
  // const [areaWeather, setAreaWeather] = useState<Array<string>>();
  // const [areaIconName, setAreaIconName] = useState<Array<string>>();
  // const Angle = [0, 45, 90, 135, 180, 225];

  useEffect(() => {
    Geolocation.getCurrentPosition(
      info => {
        setMyPosition({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
      },
      console.error,
      {
        enableHighAccuracy: true,
        timeout: 20000,
        distanceFilter: 400,
      },
    );
    const getWeather = async () => {
      try {
        const response = await weatherClient.get(
          `/weather?lat=${myPosition?.latitude}&lon=${myPosition?.longitude}&appid=${Config.WEATHER_APIKEY}`,
        );
        setWeatherData(response.data);
        setMyWeather(response.data.weather[0].main);
        if (myWeather === 'Clouds') {
          setIconName('cloudy-outline');
        } else if (myWeather === 'Mist') {
          setIconName('filter');
        } else if (myWeather === 'Rain') {
          setIconName('rainy-outline');
        } else if (myWeather === 'Clear') {
          setIconName('sunny-outline');
        }
        // else {
        //   // <ActivityIndicator />;
        // }
        // getAreaWeather();
      } catch (e) {
        console.log('Weather API error : ', e);
      }
    };
    getWeather();
  }, [myPosition?.latitude, myPosition?.longitude, myWeather]);

  if (!myPosition || !myPosition.latitude) {
    return (
      <Container style={{justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color="black" />
      </Container>
    );
  }

  const getRandomImage = async () => {
    try {
      setLoading(true);
      const response = await unsplashClient.get('/photos/random', {
        params: {
          count: 1,
          client_id: '3eVYYY9UEOTwk4CcDUgHt9uSSP_MJiAO3E1hcna-i1Q',
        },
      });
      setUserImage(response.data[0].links.download);
      setUserInfo(response.data[0].user.last_name);
      setUserLoca(response.data[0].user.location);
      // console.log('SUCCED!! : ', response.data[0].links.download);
    } catch (e) {
      console.log('UNSPLASH FAILED : ', e);
    } finally {
      setLoading(false);
    }
  };

  const markerTapped = () => {
    setShowModal(true);
    getRandomImage();
  };

  const gotoProfile = () => {
    console.log('test');
    setShowModal(false);
    navigation.navigate('UserProfile');
  };

  //rainy-outline,cloudy-outline,md-cloudy-night-outline(night)
  //partly-sunny-outline(구름 가린 햇빛),sunny-outline(태양), snow-outline(눈)
  return (
    <Container>
      <NaverMapView
        style={{width: '100%', height: '100%'}}
        zoomControl={false}
        center={{
          zoom: 10, //13
          latitude: myPosition.latitude,
          longitude: myPosition.longitude,
        }}
        nightMode={true}>
        <Marker
          coordinate={{
            latitude: myPosition.latitude,
            longitude: myPosition.longitude,
          }}
          pinColor="black"
          width={30}
          height={40}
        />
        <Circle //사용자 중심 반경 1km 지역
          coordinate={{
            latitude: myPosition.latitude,
            longitude: myPosition.longitude,
          }}
          radius={distance * 100000}
          color={'rgba(255,150,0,0.15)'}
        />
        {orders.map(orderPosition => (
          <>
            <Marker
              coordinate={{
                latitude: orderPosition.start.latitude,
                longitude: orderPosition.start.longitude,
              }}
              pinColor="red"
              width={30}
              height={40}
              onClick={() => markerTapped()}
            />
          </>
        ))}
      </NaverMapView>
      {loading ? (
        <ActivityIndicator color="black" size="large" />
      ) : (
        <UserModal
          showModal={showModal}
          setShowModal={setShowModal}
          userInfo={userInfo}
          userLocation={userLoca}
          userProfile={userImage}
          gotoProfile={gotoProfile}
        />
      )}
      <HeaderView>
        <WeatherView>
          <HeadText>현재날씨</HeadText>
          {!myWeather ? (
            <ActivityIndicator style={{marginTop: 10}} />
          ) : (
            <IonIcon name={iconName} size={30} />
          )}
          <WeatherText>{myWeather}</WeatherText>
        </WeatherView>
        <NextWeatherView>
          <HeadText style={{alignSelf: 'center'}}>
            반경 1km 우천 예정지역
          </HeadText>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              flex: 1,
            }}>
            {/* {Angle.map(() => (
              <AreaWeatherCell>
                {!areaWeather ? (
                  <ActivityIndicator />
                ) : (
                  <IonIcon name={areaIconName} size={30} />
                )}
                <WeatherText>{areaWeather}</WeatherText>
              </AreaWeatherCell>
            ))} */}
          </View>
        </NextWeatherView>
      </HeaderView>
    </Container>
  );
};

export default HomeMap;
