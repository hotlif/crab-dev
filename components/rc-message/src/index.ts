import Message from './message.js';
import useMessage from './hooks/useMessage.js';

export type { MessageProps, MessageType, MessageInstance, MessageOpenParam, MessageHandle } from './types.js';
export { useMessage };
export default Message;
export { vars as TokenVars } from './token.js';
