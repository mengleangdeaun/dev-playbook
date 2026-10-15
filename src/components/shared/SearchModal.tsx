import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, X, FileText, BookOpen, Palette, Sparkles, ArrowRight } from "lucide-react";

export interface SearchItem {
  title: string;
  description?: string;
  url: string;
  section: "Docs" | "Brand" | "Blog" | "Showcase";
  category?: string;
}

interface SearchModalProps {
  items: SearchItem[];
}

export function SearchModal({ items }: SearchModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return items.slice(0, 8);
    }
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q)
    );
  }, [query, items]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      window.location.href = filteredItems[selectedIndex].url;
    }
  };

  const getSectionIcon = (section: SearchItem["section"]) => {
    switch (section) {
      case "Docs":
        return <BookOpen className="w-4 h-4 text-primary" />;
      case "Brand":
        return <Palette className="w-4 h-4 text-amber-500" />;
      case "Blog":
        return <FileText className="w-4 h-4 text-sky-500" />;
      case "Showcase":
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground bg-muted/60 hover:bg-muted border border-border/80  transition-colors group cursor-pointer"
        aria-label="Search playbook"
      >
        <Search className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
        <span className="hidden sm:inline">Search playbook...</span>
        <span className="sm:hidden">Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-background  border border-border">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {isOpen && mounted && typeof document !== "undefined" && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search standards, guides, code examples..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 border border-border bg-muted/50">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-2 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No documents found matching "{query}"
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <a
                      key={item.url}
                      href={item.url}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-start gap-3 p-3 text-left transition-colors ${
                        isSelected
                          ? "bg-primary/10 border border-primary/20 text-foreground"
                          : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0 p-1 bg-background border border-border">
                        {getSectionIcon(item.section)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-foreground truncate">
                            {item.title}
                          </span>
                          <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 bg-muted text-muted-foreground shrink-0">
                            {item.section}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <ArrowRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isSelected
                            ? "opacity-100 translate-x-0.5 text-primary"
                            : "opacity-0"
                        }`}
                      />
                    </a>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Navigate: <kbd className="font-mono">↑</kbd> <kbd className="font-mono">↓</kbd></span>
                <span>Select: <kbd className="font-mono">↵</kbd></span>
              </div>
              <span>Dev Playbook Quick Search</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
