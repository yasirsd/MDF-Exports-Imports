import { Component, Fragment } from "react";
import { cn } from "@/lib/utils";

function isChunkLoadError(error) {
  if (!error) return false;
  const name = error.name || "";
  const msg = String(error.message || error || "");
  return (
    name === "ChunkLoadError" ||
    /Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed/i.test(
      msg
    )
  );
}

/**
 * Isolates lazy / WebGL / GSAP section failures so one throw cannot blank the SPA.
 * Retry remounts children under a new key; chunk failures force a full reload
 * because React.lazy keeps the rejected promise.
 */
export class SectionErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, retryKey: 0 };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Always surface. Intermittent Story failures are otherwise invisible.
    // eslint-disable-next-line no-console
    console.error(`[SectionErrorBoundary:${this.props.name || "section"}]`, error, info);
    if (typeof window !== "undefined") {
      window.__LAST_SECTION_ERROR__ = {
        name: this.props.name || "section",
        message: String(error?.message || error),
        stack: error?.stack || null,
        componentStack: info?.componentStack || null,
      };
      // Drop orphaned Story ScrollTriggers (esp. legacy pin-spacers after HMR)
      // before the fallback UI replaces the tree.
      window.dispatchEvent(new CustomEvent("ut:release-story-scroll", { detail: { target: "*" } }));
    }
  }

  handleRetry = () => {
    const { error } = this.state;
    if (isChunkLoadError(error)) {
      window.location.reload();
      return;
    }
    this.setState((s) => ({ error: null, retryKey: s.retryKey + 1 }));
  };

  render() {
    if (this.state.error) {
      const { name = "This section", className, minH = "min-h-[50vh]" } = this.props;
      const chunkFail = isChunkLoadError(this.state.error);
      const detail = String(this.state.error?.message || this.state.error || "");
      return (
        <div
          role="alert"
          className={cn(
            "flex flex-col items-center justify-center gap-4 px-6 py-16 text-center",
            minH,
            className
          )}
        >
          <p className="max-w-md text-lg font-semibold text-foreground">
            {name} couldn’t load.
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {chunkFail
              ? "A script failed to download. Reload the page to fetch the latest version."
              : "You can keep browsing the rest of the site, or try loading this section again."}
          </p>
          {import.meta.env.DEV && detail ? (
            <pre className="max-w-xl overflow-auto rounded-lg border border-border bg-surface-2 p-3 text-left text-[0.7rem] text-muted-foreground">
              {detail}
            </pre>
          ) : null}
          <button
            type="button"
            onClick={this.handleRetry}
            className="rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {chunkFail ? "Reload page" : "Try again"}
          </button>
        </div>
      );
    }

    return <Fragment key={this.state.retryKey}>{this.props.children}</Fragment>;
  }
}
