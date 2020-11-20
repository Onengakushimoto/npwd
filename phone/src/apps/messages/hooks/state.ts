import { atom } from 'recoil';

export const messageState = {
  messageGroups: atom({
    key: 'messageGroups',
    default: null
  }),
  messages: atom({
    key: 'messages',
    default: null
  }),
  activeMessageGroup: atom({
    key: 'activeMessageGroup',
    default: null
  }),
  showNewMessageGroup: atom({
    key: 'showNewMessageGroup',
    default: false
  }),
}