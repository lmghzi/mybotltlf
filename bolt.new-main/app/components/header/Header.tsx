import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import React, { useState } from 'react';

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <a
      href={href}
      className="group relative inline-block px-4 py-2 text-sm text-zinc-300 transition-all duration-300 hover:text-white"
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute bottom-1 left-1/2 h-[2px] w-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-90 shadow-[0_0_8px_rgba(129,140,248,0.6)] transition-all duration-300 group-hover:left-[10%] group-hover:w-[80%] rounded-full"></span>
    </a>
  );
};

export function Header() {
  const chat = useStore(chatStore);
  const [isOpen, setIsOpen] = useState(false);

  const logoElement = (
    <div className="relative w-5 h-5 flex items-center justify-center">
      <span className="absolute w-1.5 h-1.5 rounded-full bg-zinc-200 top-0 left-1/2 transform -translate-x-1/2 opacity-90 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-zinc-200 left-0 top-1/2 transform -translate-y-1/2 opacity-90 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-zinc-200 right-0 top-1/2 transform -translate-y-1/2 opacity-90 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-zinc-200 bottom-0 left-1/2 transform -translate-x-1/2 opacity-90 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
    </div>
  );

  return (
    <header className="absolute top-0 left-0 right-0 w-full z-50 flex justify-center pt-6 px-4 bg-transparent">
      <div
        className={classNames(
          "w-full max-w-5xl border border-white/5 bg-zinc-950/70 backdrop-blur-3xl transition-all duration-300 px-6 py-3.5 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:border-white/15 hover:bg-zinc-950/80 hover:shadow-[0_12px_48px_rgba(0,0,0,0.8),0_0_24px_rgba(255,255,255,0.01)]",
          isOpen ? "rounded-3xl" : "rounded-full"
        )}
      >
        {/* Brand & Logo on Left */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="transition-transform duration-500 ease-out group-hover:rotate-180">
              {logoElement}
            </div>
            <span className="text-white text-md font-bold tracking-tight select-none pt-0.5 group-hover:text-zinc-200 transition-colors">
              bolt.new
            </span>
          </a>
        </div>

        {/* Dynamic Center Section */}
        <div className="hidden md:flex items-center gap-2">
          {chat.started ? (
            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-zinc-900 text-sm max-w-md truncate text-zinc-300">
              <ClientOnly>{() => <ChatDescription />}</ClientOnly>
            </div>
          ) : (
            <div className="flex items-center">
              <AnimatedNavLink href="#manifesto">Manifesto</AnimatedNavLink>
              <AnimatedNavLink href="#careers">Careers</AnimatedNavLink>
              <AnimatedNavLink href="#discover">Discover</AnimatedNavLink>
            </div>
          )}
        </div>

        {/* Right Section / Controls */}
        <div className="flex items-center gap-3">
          {chat.started ? (
            <ClientOnly>
              {() => (
                <div className="flex items-center gap-2">
                  <HeaderActionButtons />
                </div>
              )}
            </ClientOnly>
          ) : (
            <div className="flex items-center gap-1.5">
              <a
                href="#login"
                className="text-xs text-zinc-400 hover:text-white px-3.5 py-2 font-medium transition-colors"
              >
                Log In
              </a>
              <a
                href="#signup"
                className="text-xs font-semibold bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-full shadow-[0_4px_16px_rgba(255,255,255,0.1)] transition-all transform hover:scale-105 active:scale-95"
              >
                Sign Up
              </a>
            </div>
          )}

          {/* Quick toggle menu for narrow layouts */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1 rounded-full hover:bg-white/5 transition-colors"
          >
            <span className={classNames("w-4 h-0.5 bg-white transition-all", isOpen ? "rotate-45 translate-y-[3px]" : "")} />
            <span className={classNames("w-4 h-0.5 bg-white transition-all", isOpen ? "-rotate-45 -translate-y-[3px]" : "")} />
          </button>
        </div>
      </div>

      {/* Expanded menu on mobile */}
      {isOpen && !chat.started && (
        <div className="absolute top-[84px] left-4 right-4 bg-black/95 backdrop-blur-3xl border border-zinc-900 rounded-2xl p-4 flex flex-col gap-3 md:hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-250 z-40">
          <a
            href="#manifesto"
            onClick={() => setIsOpen(false)}
            className="text-zinc-300 hover:text-white py-2 text-sm px-3 rounded-lg hover:bg-white/5 transition-colors"
          >
            Manifesto
          </a>
          <a
            href="#careers"
            onClick={() => setIsOpen(false)}
            className="text-zinc-300 hover:text-white py-2 text-sm px-3 rounded-lg hover:bg-white/5 transition-colors"
          >
            Careers
          </a>
          <a
            href="#discover"
            onClick={() => setIsOpen(false)}
            className="text-zinc-300 hover:text-white py-2 text-sm px-3 rounded-lg hover:bg-white/5 transition-colors"
          >
            Discover
          </a>
          <div className="h-px bg-zinc-900 my-1" />
          <div className="flex gap-2">
            <a
              href="#login"
              onClick={() => setIsOpen(false)}
              className="flex-1 text-center py-2 text-xs font-medium border border-zinc-800 text-zinc-300 rounded-full hover:bg-white/5"
            >
              Log In
            </a>
            <a
              href="#signup"
              onClick={() => setIsOpen(false)}
              className="flex-1 text-center py-2 text-xs font-semibold bg-white text-black rounded-full"
            >
              Sign Up
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

