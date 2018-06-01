import { Server, SocketIO } from 'mock-socket';
import createSocket from 'dva-socket.io';
import { push_system_message } from '../src/services/socket';

export function dvaSocket(url, option) {
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    const mockServer = new Server(url);
    mockServer.on('connection', async server => {
      const res = await push_system_message();
      mockServer.emit('test', res);
    });
  }
  return createSocket(
    url,
    option,
    {
      on: {
        test: (data, dispatch, getState) => {
          console.log(data);
        },
      },
      emit: {
        hi: {
          evaluate: (action, dispatch, getState) => action.type === 'send-message',
          data: action => 'client send a message',
        },
      },
    },
    isDev ? SocketIO : null
  );
}
