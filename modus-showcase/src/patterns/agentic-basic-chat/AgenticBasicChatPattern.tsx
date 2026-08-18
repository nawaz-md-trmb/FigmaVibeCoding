// @ts-nocheck
import './agentic-basic-chat.css';
import { InteractiveAgenticBasicChat } from "./InteractiveAgenticBasicChat";

/** Narrow column: middle scrolls, composer stays pinned (flex-1 min-h-0 overflow-y-auto + footer). */
export function AgenticBasicChat() {
  return <InteractiveAgenticBasicChat />;
}

export default AgenticBasicChat;
