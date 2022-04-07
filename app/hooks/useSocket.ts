import {useCallback} from 'react';
import {io, Socket} from 'socket.io-client';
import Config from 'react-native-config';

let socket: Socket | undefined;

const useSocket = (): [typeof socket, () => void] => {
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket = undefined;
    }
  }, []);
  if (!socket) {
    //socket이 없을 때만 연결
    socket = io(Config.API_URL, {
      transports: ['websocket'],
      // path: '/socket-io', //백에서 넘겨주는 주소
    });
  }
  return [socket, disconnect];
};

export default useSocket;
