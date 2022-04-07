import {useEffect} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

// permissions flow 에 대한 것!
// 1. 권한을 기기에 쓸 수 있는가 ?
//    NO : 2-1. UNAVAILABLE
// 2. 권한이 있다면 요청할 수 있나 ?
//    NO : 2-1. 사용자 임의 권한 차단시 : BLOCKED / LIMITED
//         2-2. 사용자 이미 허용했을 시 : GRANTED
//    YES : 권한에 대한 어떠한 세팅이 안되어있는 상태 -> DENIED => request 보내면 됨
// 3. 권한을 허용하겠는가 ?
//    NO : BLOCKED -> 메세지 요청 또는 Linking API로 설정창 전환
//    YES : GRANTED

//*Linking API 에 대한 것!
// Linking.openURL(url: 'http://~ ') : 브라우저 연결
// Linking.openURL(url: 'tel://01098888888'); 전화걸도록 이동
// Linking.openURL(url: 'sms://01098888888'); 문자보내도록 이동\
// 다른 앱으로도 넘어갈 수 있숨

const usePermissions = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then(result => {
          console.log('check location', result);
          if (result === RESULTS.DENIED) {
            return request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
          } else if (result === RESULTS.BLOCKED) {
            Alert.alert(
              '이 앱은 위치 권한 허용이 필요합니다.',
              '앱 설정 화면을 열어서 항상 허용으로 바꿔주세요.',
              [
                {
                  text: '네',
                  onPress: () => Linking.openSettings(),
                },
                {
                  text: '아니오',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
              ],
            );
          }
        })
        .catch(console.error);
    } else if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.LOCATION_ALWAYS)
        .then(result => {
          if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
            Alert.alert(
              '이 앱은 백그라운드 위치 권한 허용이 필요합니다.',
              '앱 설정 화면을 열어서 항상 허용으로 바꿔주세요.',
              [
                {
                  text: '네',
                  onPress: () => Linking.openSettings(),
                },
                {
                  text: '아니오',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
              ],
            );
          }
        })
        .catch(console.error);
    }
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.CAMERA)
        .then(result => {
          if (result === RESULTS.DENIED || result === RESULTS.GRANTED) {
            return request(PERMISSIONS.ANDROID.CAMERA);
          } else {
            console.log(result);
            throw new Error('카메라 지원 안 함');
          }
        })
        .catch(console.error);
    } else if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.CAMERA)
        .then(result => {
          if (
            result === RESULTS.DENIED ||
            result === RESULTS.LIMITED ||
            result === RESULTS.GRANTED
          ) {
            return request(PERMISSIONS.IOS.CAMERA);
          } else {
            console.log(result);
            throw new Error('카메라 지원 안 함');
          }
        })
        .catch(console.error);
    }
  }, []);
};

export default usePermissions;
