import type { Message } from 'ai';
import React, { type RefCallback, useState, useRef } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { Menu } from '~/components/sidebar/Menu.client';
import { IconButton } from '~/components/ui/IconButton';
import { Workbench } from '~/components/workbench/Workbench.client';
import { classNames } from '~/utils/classNames';
import { Messages } from './Messages.client';
import { SendButton } from './SendButton.client';
import { NeuralNoise } from '~/components/ui/NeuralNoise';
import { ArrowRight, Check, ChevronDown, Paperclip, Image, Mic, Globe, Sparkles } from 'lucide-react';

import styles from './BaseChat.module.scss';

interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined;
  messageRef?: RefCallback<HTMLDivElement> | undefined;
  scrollRef?: RefCallback<HTMLDivElement> | undefined;
  showChat?: boolean;
  chatStarted?: boolean;
  isStreaming?: boolean;
  messages?: Message[];
  enhancingPrompt?: boolean;
  promptEnhanced?: boolean;
  input?: string;
  handleStop?: () => void;
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  enhancePrompt?: () => void;
}

const EXAMPLE_PROMPTS = [
  { text: 'Build a todo app in React using Tailwind' },
  { text: 'Build a simple blog using Astro' },
  { text: 'Create a cookie consent form using Material UI' },
  { text: 'Make a space invaders game' },
  { text: 'How do I center a div?' },
];

const TEXTAREA_MIN_HEIGHT = 76;

export const BaseChat = React.forwardRef<HTMLDivElement, BaseChatProps>(
  (
    {
      textareaRef,
      messageRef,
      scrollRef,
      showChat = true,
      chatStarted = false,
      isStreaming = false,
      enhancingPrompt = false,
      promptEnhanced = false,
      messages,
      input = '',
      sendMessage,
      handleInputChange,
      enhancePrompt,
      handleStop,
    },
    ref,
  ) => {
    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;

    const [selectedModel, setSelectedModel] = useState("Gemini 2.5 Flash");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [voiceActive, setVoiceActive] = useState(false);
    const [imageAttached, setImageAttached] = useState(false);
    const [fileAttached, setFileAttached] = useState(false);

    const AI_MODELS = [
      "o3-mini",
      "Gemini 2.5 Flash",
      "Claude 3.5 Sonnet",
      "GPT-4-1 Mini",
      "GPT-4-1"
    ];

    const OPENAI_ICON = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 256 260"
        className="w-3.5 h-3.5 fill-current text-white"
      >
        <path d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" />
      </svg>
    );

    const CLAUDE_ICON = (
      <svg
        fill="currentColor"
        fillRule="evenodd"
        className="w-3.5 h-3.5 text-white"
        viewBox="0 0 24 24"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
      </svg>
    );

    const GEMINI_ICON = (
      <svg
        className="w-3.5 h-3.5"
        viewBox="0 0 24 24"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gemini-grad-base" x1="0%" x2="68.73%" y1="100%" y2="30.395%">
            <stop offset="0%" stopColor="#1C7DFF" />
            <stop offset="52.021%" stopColor="#1C69FF" />
            <stop offset="100%" stopColor="#F0DCD6" />
          </linearGradient>
        </defs>
        <path
          d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
          fill="url(#gemini-grad-base)"
          fillRule="nonzero"
        />
      </svg>
    );

    return (
      <div
        ref={ref}
        className={classNames(
          styles.BaseChat,
          'relative flex h-full w-full overflow-hidden bg-zinc-950 bg-gradient-to-tr from-black via-zinc-900/15 to-black text-white transition-all duration-300',
        )}
        data-chat-visible={showChat}
      >
        {/* WebGL NeuralNoise interactive fluid flow background */}
        {!chatStarted && <NeuralNoise opacity={0.45} color={[0.15, 0.18, 0.3]} />}

        <ClientOnly>{() => <Menu />}</ClientOnly>
        <div ref={scrollRef} className="flex overflow-y-auto w-full h-full z-1">
          <div className={classNames(styles.Chat, 'flex flex-col flex-grow min-w-[var(--chat-min-width)] h-full')}>
            {!chatStarted && (
              <div id="intro" className="mt-[26vh] max-w-chat mx-auto">
                <h1 className="text-5xl text-center font-bold text-white mb-2 tracking-tight">
                  Where ideas begin
                </h1>
                <p className="mb-4 text-center text-zinc-400">
                  Bring ideas to life in seconds or get help on existing projects.
                </p>
              </div>
            )}
            <div
              className={classNames('px-6', {
                'h-full flex flex-col pt-[100px]': chatStarted,
                'pt-6': !chatStarted
              })}
            >
              <ClientOnly>
                {() => {
                  return chatStarted ? (
                    <Messages
                      ref={messageRef}
                      className="flex flex-col w-full flex-1 max-w-chat px-4 pb-6 mx-auto z-1"
                      messages={messages}
                      isStreaming={isStreaming}
                    />
                  ) : null;
                }}
              </ClientOnly>
              <div
                className={classNames('relative w-full max-w-chat mx-auto z-prompt pb-1', {
                  'sticky bottom-0': chatStarted,
                })}
              >
                {/* Visual Glass Wrapper */}
                <div
                  className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.85),0_0_40px_rgba(255,255,255,0.015)] p-3 transition-all duration-300 hover:border-white/18 hover:bg-white/[0.06] hover:shadow-[0_32px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(255,255,255,0.02)]"
                >
                  <textarea
                    ref={textareaRef}
                    className="w-full px-4 pt-3 pb-2 focus:outline-none resize-none text-md text-white placeholder-zinc-400 bg-transparent min-h-[76px]"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        if (event.shiftKey) {
                          return;
                        }

                        event.preventDefault();

                        sendMessage?.(event);
                      }
                    }}
                    value={input}
                    onChange={(event) => {
                      handleInputChange?.(event);
                    }}
                    style={{
                      minHeight: TEXTAREA_MIN_HEIGHT,
                      maxHeight: TEXTAREA_MAX_HEIGHT,
                    }}
                    placeholder="How can Bolt help you today?"
                    translate="no"
                  />
                  
                  {/* Glassy action bar */}
                  <div className="flex items-center justify-between px-3 py-2 border-t border-white/5 mt-1">
                    <div className="flex items-center gap-1.5 relative select-none">
                      {/* Model Selector Dropup */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="flex items-center gap-1.5 h-8 px-2.5 text-xs rounded-lg text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
                        >
                          {selectedModel === "o3-mini" && OPENAI_ICON}
                          {selectedModel === "Gemini 2.5 Flash" && GEMINI_ICON}
                          {selectedModel === "Claude 3.5 Sonnet" && CLAUDE_ICON}
                          {selectedModel === "GPT-4-1 Mini" && OPENAI_ICON}
                          {selectedModel === "GPT-4-1" && OPENAI_ICON}
                          <span className="font-medium">{selectedModel}</span>
                          <ChevronDown className="w-3" size="12" />
                        </button>

                        {isDropdownOpen && (
                          <div className="absolute bottom-10 left-0 z-50 min-w-[12rem] bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800 p-1.5 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150">
                            {AI_MODELS.map((model) => (
                              <button
                                key={model}
                                type="button"
                                onClick={() => {
                                  setSelectedModel(model);
                                  setIsDropdownOpen(false);
                                }}
                                className="flex items-center justify-between w-full px-2.5 py-2 text-xs rounded-lg text-zinc-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                              >
                                <div className="flex items-center gap-2">
                                  {model === "o3-mini" && OPENAI_ICON}
                                  {model === "Gemini 2.5 Flash" && GEMINI_ICON}
                                  {model === "Claude 3.5 Sonnet" && CLAUDE_ICON}
                                  {model === "GPT-4-1 Mini" && OPENAI_ICON}
                                  {model === "GPT-4-1" && OPENAI_ICON}
                                  <span>{model}</span>
                                </div>
                                {selectedModel === model && <Check className="w-3.5 h-3.5 text-blue-500" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="h-4 w-px bg-zinc-800 mx-1" />

                      {/* Attachment Input */}
                      <label
                        className={classNames(
                          "flex items-center gap-1.5 h-8 px-2.5 text-xs rounded-lg cursor-pointer transition-all border",
                          fileAttached 
                            ? "text-blue-400 border-blue-500/30 bg-blue-500/10" 
                            : "text-zinc-300 border-white/5 bg-white/5 hover:bg-white/10 hover:text-white"
                        )}
                        title="رفع ملف"
                      >
                        <input
                          type="file"
                          className="hidden"
                          onChange={() => setFileAttached(true)}
                        />
                        <Paperclip size="13" />
                        <span className="font-medium hidden sm:inline">رفع ملف</span>
                      </label>

                      {/* Image Upload Input */}
                      <label
                        className={classNames(
                          "flex items-center gap-1.5 h-8 px-2.5 text-xs rounded-lg cursor-pointer transition-all border",
                          imageAttached 
                            ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" 
                            : "text-zinc-300 border-white/5 bg-white/5 hover:bg-white/10 hover:text-white"
                        )}
                        title="رفع صورة"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={() => setImageAttached(true)}
                        />
                        <Image size="13" />
                        <span className="font-medium hidden sm:inline">رفع صورة</span>
                      </label>

                      {/* Audio / Mic Button */}
                      <button
                        type="button"
                        onClick={() => setVoiceActive(!voiceActive)}
                        className={classNames(
                          "rounded-lg p-2 bg-transparent transition-all hover:bg-white/5 hover:text-white border border-transparent",
                          voiceActive ? "text-purple-400 border-purple-500/30 bg-purple-500/10" : "text-zinc-400"
                        )}
                        title="Voice interaction"
                      >
                        <Mic size="16" />
                      </button>

                      {/* Search Toggle */}
                      <button
                        type="button"
                        onClick={() => setSearchActive(!searchActive)}
                        className={classNames(
                          "rounded-lg p-2 bg-transparent transition-all hover:bg-white/5 hover:text-white border border-transparent",
                          searchActive ? "text-sky-400 border-sky-500/30 bg-sky-500/10" : "text-zinc-400"
                        )}
                        title="Search web"
                      >
                        <Globe size="16" />
                      </button>

                      {/* Enhance prompt built-in */}
                      <button
                        type="button"
                        disabled={input.length === 0 || enhancingPrompt}
                        onClick={() => enhancePrompt?.()}
                        className={classNames(
                          "rounded-lg p-2 bg-transparent transition-all border border-transparent hover:bg-white/5",
                          enhancingPrompt ? "text-purple-400" : input.length === 0 ? "text-zinc-600 cursor-not-allowed" : "text-amber-400 hover:text-amber-300"
                        )}
                        title="Enhance prompt"
                      >
                        {enhancingPrompt ? (
                          <div className="i-svg-spinners:90-ring-with-bg w-4 h-4 text-purple-400"></div>
                        ) : (
                          <Sparkles size="16" />
                        )}
                      </button>
                    </div>

                    {/* Fancy Send Button with glow */}
                    <button
                      type="button"
                      disabled={!input.trim() && !isStreaming}
                      onClick={(event) => {
                        if (isStreaming) {
                          handleStop?.();
                        } else {
                          sendMessage?.(event);
                        }
                      }}
                      className={classNames(
                        "rounded-full p-2.5 transition-all duration-300 relative border",
                        isStreaming
                          ? "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                          : input.trim()
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-transparent shadow-[0_0_20px_rgba(129,140,248,0.5)] hover:scale-105 hover:shadow-[0_0_25px_rgba(129,140,248,0.7)]"
                          : "bg-white/5 border-white/5 text-zinc-600 cursor-not-allowed"
                      )}
                      title={isStreaming ? "Stop generation" : "إرسال بسهم"}
                    >
                      {isStreaming ? (
                        <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ArrowRight size="16" className="stroke-[2.5]" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="bg-transparent pb-6">{/* Ghost Element */}</div>
              </div>
            </div>
            {!chatStarted && (
              <div id="examples" className="relative w-full max-w-xl mx-auto mt-8 flex justify-center">
                <div className="flex flex-col space-y-2 [mask-image:linear-gradient(to_bottom,black_0%,transparent_180%)] hover:[mask-image:none]">
                  {EXAMPLE_PROMPTS.map((examplePrompt, index) => {
                    return (
                      <button
                        key={index}
                        onClick={(event) => {
                          sendMessage?.(event, examplePrompt.text);
                        }}
                        className="group flex items-center w-full gap-2 justify-center bg-transparent text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary transition-theme"
                      >
                        {examplePrompt.text}
                        <div className="i-ph:arrow-bend-down-left" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <ClientOnly>{() => <Workbench chatStarted={chatStarted} isStreaming={isStreaming} />}</ClientOnly>
        </div>
      </div>
    );
  },
);
