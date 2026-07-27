import { Component } from "react";
import { cn } from "@/lib/utils";

/**
 * Isolates lazy / WebGL / GSAP section failures so one throw cannot blank the SPA.
 */
export class SectionErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.error(`[SectionErrorBoundary:${this.props.name || "section"}]`, error, info);
    }
  }

  handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      const { name = "This section", className, minH = "min-h-[50vh]" } = this.props;
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
            You can keep browsing the rest of the site, or try loading this section again.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
