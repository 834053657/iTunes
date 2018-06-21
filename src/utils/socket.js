import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { Server, SocketIO } from 'mock-socket';
import createSocket from 'dva-socket.io';
import {
  push_system_message,
  enter_chat_room,
  leave_chat_room,
  receive_message,
} from '../services/socket';
import { playAudio } from './utils';

export function dvaSocket(url, option) {
  // 如需调试线上socket 请吧isDev 设置成false
  const isDev = false;
  // const isDev = process.env.NODE_ENV === 'development';
  console.log('socket-url', url);
  if (isDev) {
    const mockServer = new Server(url);
    mockServer.on('connection', async server => {
      console.log('*************8mock-socket connected......');
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
      console.log('mockServer send_message...');
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
          const { data: msg } = JSON.parse(data);
          const { oldNotices } = getState().global;

          oldNotices.unshift(msg);
          const rs = { data: { items: oldNotices } };
          dispatch({
            type: 'global/saveNotices',
            payload: rs,
          });
          playAudio();
        },
        disconnection: (data, dispatch, getState) => {
          console.log('disconection', data);
        },
        enter_room: (data, dispatch, getState) => {
          console.log(data);
        },
        leave_room: (data, dispatch, getState) => {
          console.log(data);
        },
        receive_message: (data, dispatch, getState) => {
          console.log('receive_message', data);
          // const { data: msg } = JSON.parse(data); // order msg type 快捷短语/申述聊天
          const { data: msg } = data;

          console.log(data);
          console.log(msg);
          if (msg && msg.order_msg_type === 1) {
            // 快捷短语
            const { quickMsgList } = getState().card;

            quickMsgList.unshift(msg);
            // console.log(555, appeal);
            dispatch({
              type: 'card/setQuickMsgList',
              payload: { data: quickMsgList },
            });
            playAudio();
          } else if (msg && msg.order_msg_type === 2) {
            // 申述聊天
            const { chatMsgList } = getState().card;

            chatMsgList.unshift(msg);
            // console.log(555, appeal);
            dispatch({
              type: 'card/setChatMsgList',
              payload: { data: chatMsgList },
            });
            playAudio();
          }
          // else {
          //   dispatch({
          //     type: 'card/fetchOrderDetail',
          //     payload: { id: msg.content && msg.content.order_id},
          //   });
          // }
        },
      },
      emit: {
        set_user_id: {
          evaluate: (action, dispatch, getState) => action.type === 'set_socket_token',
          data: ({ payload }) => {
            console.log('ppp', JSON.stringify(payload));
            return JSON.stringify(payload);
          },
        },
        post_quick_message: {
          evaluate: (action, dispatch, getState) => action.type === 'post_quick_message',
          data: ({ payload }) => {
            console.log('ppp', payload);
            return payload;
          },
        },
        pull_system_message: {
          evaluate: (action, dispatch, getState) => action.type === 'push_system_message',
          data: ({ payload }) => {
            console.log('socket - push_system_messag');
            return JSON.stringify(payload);
          },
        },
        enter_chat_room: {
          evaluate: (action, dispatch, getState) => action.type === 'enter_chat_room',
          data: ({ payload }) => {
            console.log('enter_chat_room', payload);
            return JSON.stringify(payload);
          },
        },
        leave_chat_room: {
          evaluate: (action, dispatch, getState) => action.type === 'leave_chat_room',
          data: ({ payload }) => {
            return JSON.stringify(payload);
          },
        },
        send_message: {
          evaluate: (action, dispatch, getState) => action.type === 'send_message',
          data: ({ payload }) => {
            console.log('send_message', payload);
            return JSON.stringify(payload);
          },
        },
      },
    },
    isDev ? SocketIO : null
  );
}
