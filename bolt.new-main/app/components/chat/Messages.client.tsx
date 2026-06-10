import type { Message } from 'ai';
import React from 'react';
import { classNames } from '~/utils/classNames';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';

interface MessagesProps {
  id?: string;
  className?: string;
  isStreaming?: boolean;
  messages?: Message[];
}

export const Messages = React.forwardRef<HTMLDivElement, MessagesProps>((props: MessagesProps, ref) => {
  const { id, isStreaming = false, messages = [] } = props;

  return (
    <div id={id} ref={ref} className={props.className}>
      {messages.length > 0
        ? messages.map((message, index) => {
            const { role, content } = message;
            const isUserMessage = role === 'user';
            const isFirst = index === 0;
            const isLast = index === messages.length - 1;

            return (
              <div
                key={index}
                className={classNames('flex gap-4 p-6 w-full rounded-2xl border border-white/5 transition-all duration-300 shadow-xl backdrop-blur-md', {
                  'bg-zinc-900/20 hover:bg-zinc-900/30 hover:border-white/10': isUserMessage,
                  'bg-zinc-950/20 hover:bg-zinc-950/30 hover:border-white/10':
                    !isUserMessage && (!isStreaming || (isStreaming && !isLast)),
                  'bg-gradient-to-b from-zinc-950/25 from-30% to-transparent':
                    isStreaming && isLast,
                  'mt-5': !isFirst,
                })}
              >
                {isUserMessage && (
                  <div className="flex items-center justify-center w-[36px] h-[36px] overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-200 border border-white/10 rounded-full shrink-0 self-start shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-200">
                    <div className="i-ph:user-fill text-lg"></div>
                  </div>
                )}
                <div className="grid grid-col-1 w-full">
                  {isUserMessage ? <UserMessage content={content} /> : <AssistantMessage content={content} />}
                </div>
              </div>
            );
          })
        : null}
      {isStreaming && (
        <div className="text-center w-full text-bolt-elements-textSecondary i-svg-spinners:3-dots-fade text-4xl mt-4"></div>
      )}
    </div>
  );
});
