import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Header({ darkMode, onToggleDarkMode }: HeaderProps) {
  const navigate = useNavigate();
  const [searchFocus, setSearchFocus] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className={`flex items-center rounded-lg border transition ${
            searchFocus
              ? "border-blue-500 dark:border-blue-600"
              : "border-slate-200/80 dark:border-slate-700/80"
          }`}>
            <svg className="ml-3 h-5 w-5 flex-shrink-0 text-slate-900 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search or type command..."
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              className="flex-1 bg-transparent px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none dark:placeholder-slate-400 dark:text-white"
            />
            <span className="flex items-center gap-1 px-4 text-xs font-medium text-slate-900 dark:text-slate-500">⌘ K</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200/80 text-slate-900 transition hover:bg-slate-50 dark:border-slate-700/80 dark:text-white dark:hover:bg-slate-800"
          >
            {darkMode ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.12-2.12a1 1 0 00-1.414 1.414l2.12 2.12a1 1 0 001.414-1.414zM2.05 6.464a1 1 0 00-1.414 1.414l2.12 2.12a1 1 0 001.414-1.414L2.05 6.464zM17.5 10a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM1 10a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm14.657-5.657a1 1 0 00-1.414-1.414l-2.12 2.12a1 1 0 001.414 1.414l2.12-2.12zM2.05 13.536a1 1 0 001.414 1.414l2.12-2.12a1 1 0 00-1.414-1.414l-2.12 2.12z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/notifications/inbox")}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200/80 text-slate-900 transition hover:bg-slate-50 dark:border-slate-700/80 dark:text-white dark:hover:bg-slate-800"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-orange-500"></span>
          </button>

          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white px-2 py-1.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0"></div>
              <span className="hidden sm:inline">Musharof</span>
              <svg className={`h-4 w-4 transition-transform ${showUserMenu ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200/80 bg-white shadow-lg dark:border-slate-700/80 dark:bg-slate-900">
                <div className="border-b border-slate-200/80 px-4 py-4 dark:border-slate-700/80">
                  <p className="font-semibold text-slate-900 dark:text-white">Musharof Chowdhury</p>
                  <p className="text-sm text-slate-900 dark:text-slate-300">randomuser@pimjo.com</p>
                </div>
                <div className="space-y-1 p-2">
                  <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-900 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit profile
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-900 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Account settings
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-900 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Support
                  </button>
                </div>
                <div className="border-t border-slate-200/80 p-2 dark:border-slate-700/80">
                  <button
                    onClick={() => navigate("/logout")}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
