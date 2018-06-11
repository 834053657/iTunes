import { Server, SocketIO } from 'mock-socket';
import createSocket from 'dva-socket.io';
import { push_system_message, enter_chat_room, leave_chat_room, receive_message } from '../services/socket';
import { playAudio } from './utils';

export function dvaSocket(url, option) {
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    const mockServer = new Server(url);
    mockServer.on('connection', async server => {
      console.log('mock-socket connected......');
      // const res = await push_system_message();
      // mockServer.emit('test', res);
    });

    mockServer.on('pull_system_message', async server => {
      const res = await push_system_message();
      mockServer.emit('push_system_message', res);
    });

    mockServer.on('enter_chat_room', async server => {
      const res = await enter_chat_room();
      mockServer.emit('enter_room', res);
    });

    mockServer.on('leave_chat_room', async server => {
      const res = await leave_chat_room();
      mockServer.emit('leave_room', res);
    });

    mockServer.on('send_message', async server => {
      const res = await receive_message();
      mockServer.emit('receive_message', res);
    });
  }
  return createSocket(
    url,
    option,
    {
      on: {
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
        enter_room: (data, dispatch, getState) => {
          console.log(data);
        },
        leave_room: (data, dispatch, getState) => {
          console.log(data);
        },
        receive_message: (data, dispatch, getState) => {
          const { data: msg } = data;
          const { appeal } = getState().card;
          const { data : { appeal_info } } = appeal;

          // appeal_info.unshift(msg);
          // console.log(555, appeal);
          dispatch({
            type: 'card/GET_APPEAL_INFO',
            payload: appeal,
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
        test: {
          evaluate: (action, dispatch, getState) => action.type === 'send-message2',
          data: action => 'client send a message',
        },
        pull_system_message: {
          evaluate: (action, dispatch, getState) => action.type === 'push_system_message',
          data: ({ payload }) => {
            return payload;
          },
        },
        enter_chat_room: {
          evaluate: (action, dispatch, getState) => action.type === 'enter_chat_room',
          data: ({ payload }) => {
            return payload;
          },
        },
        leave_chat_room: {
          evaluate: (action, dispatch, getState) => action.type === 'leave_chat_room',
          data: ({ payload }) => {
            return payload;
          },
        },
        send_message: {
          evaluate: (action, dispatch, getState) => action.type === 'send_message',
          data: ({ payload }) => {
            return payload;
          },
        },
      },
    },
    isDev ? SocketIO : null
  );
}
