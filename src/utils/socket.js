import { Server, SocketIO } from 'mock-socket';
import createSocket from 'dva-socket.io';
import { push_system_message } from '../services/socket';
import { playAudio } from './utils';

export function dvaSocket(url, option) {
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    const mockServer = new Server(url);
    mockServer.on('connection', async server => {
      // const res = await push_system_message();
      // mockServer.emit('test', res);
    });

    mockServer.on('pull_system_message', async server => {
      // const res = await push_system_message();
      // mockServer.emit('push_system_message', res);
    });

    mockServer.on('post_quick_message', async server => {
      // const res = await push_system_message();
      // mockServer.emit('test', res);
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
        post_quick_message: (data, dispatch, getState) => {
          console.log(data);
        },
        push_system_message: (data, dispatch, getState) => {
          const { data: msg } = data;
          const { oldNotices } = getState().global;

          oldNotices.unshift(msg);
          const rs = { data: { items: oldNotices } };
          dispatch({
            type: 'global/saveNotices',
            payload: rs,
          });
          playAudio();
        },
      },
      emit: {
        post_quick_message: {
          evaluate: (action, dispatch, getState) => action.type === 'post_quick_message',
          data: ({ payload }) => {
            console.log('ppp', payload);
            return payload;
          },
        },
        hi: {
          evaluate: (action, dispatch, getState) => action.type === 'send-message2',
          data: action => 'client send a message',
        },
        pull_system_message: {
          evaluate: (action, dispatch, getState) => action.type === 'push_system_message',
          data: ({ payload }) => {
            return payload;
          },
        },
      },
    },
    isDev ? SocketIO : null
  );
}
