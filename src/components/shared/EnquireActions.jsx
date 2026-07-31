import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Mail, MessageCircle, Phone } from "lucide-react";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/config";
import { cn, gmailComposeUrl, openEmailCompose, telUrl, whatsappUrl } from "@/lib/utils";

const ALL_CHANNELS = ["whatsapp", "email", "call"];

/**
 * Open http(s) / tel: links. Email uses openEmailCompose (Gmail) separately.
 */
function openProtocolHref(href, { newTab = false } = {}) {
  if (!href) return;
  if (newTab) {
    window.open(href, "_blank", "noopener,noreferrer");
    return;
  }
  window.location.assign(href);
}

/**
 * One enquire CTA → menu with WhatsApp, Email, and Call.
 * - WhatsApp: https://wa.me/…?text=… (app or WhatsApp Web)
 * - Email: Gmail compose (website on desktop, app deep-link on mobile)
 * - Call: tel:+… (dialer / phone app)
 *
 * @param {object} props
 * @param {Array<'whatsapp'|'email'|'call'>} [props.channels]
 * @param {() => boolean} [props.onBeforeChannel] Return false to block navigation (e.g. form validation).
 */
export function EnquireActions({
  whatsappMessage,
  emailSubject = "Export Enquiry — MDF",
  emailBody,
  label = "Start Importing",
  density = "default",
  magnetic = false,
  className,
  whatsappClassName,
  whatsappVariant = "primary",
  size = "lg",
  tone = "light",
  interactive = true,
  channels = ALL_CHANNELS,
  onBeforeChannel,
}) {
  const emailOpts = {
    subject: emailSubject,
    body: emailBody ?? whatsappMessage,
  };
  const waHref = whatsappUrl(site.whatsapp, whatsappMessage);
  // href is always the Gmail web compose URL (works for middle-click / no-JS)
  const mailHref = gmailComposeUrl(site.email, emailOpts);
  const callHref = telUrl(site.phone);
  const active = new Set(channels?.length ? channels : ALL_CHANNELS);

  if (density === "fab") {
    return (
      <EnquireFab
        waHref={waHref}
        mailHref={mailHref}
        emailOpts={emailOpts}
        callHref={callHref}
        active={active}
        onBeforeChannel={onBeforeChannel}
        className={className}
      />
    );
  }

  const triggerSize = density === "compact" ? "md" : size;
  const fullWidth = density === "stack";
  const menuSide = density === "compact" ? "down" : "up";

  return (
    <EnquireMenu
      waHref={waHref}
      mailHref={mailHref}
      emailOpts={emailOpts}
      callHref={callHref}
      active={active}
      onBeforeChannel={onBeforeChannel}
      label={label}
      size={triggerSize}
      variant={whatsappVariant}
      magnetic={magnetic}
      fullWidth={fullWidth}
      className={className}
      triggerClassName={cn(fullWidth && "w-full", whatsappClassName)}
      tone={tone}
      interactive={interactive}
      menuSide={menuSide}
    />
  );
}

function ChannelLinks({
  waHref,
  mailHref,
  emailOpts,
  callHref,
  active,
  dark,
  open,
  interactive,
  onPick,
  onBeforeChannel,
  compact,
}) {
  const itemTab = open && interactive ? 0 : -1;
  const itemCls = cn(
    compact
      ? "grid h-11 w-11 place-items-center rounded-full border shadow-soft transition-transform hover:scale-105"
      : "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
    !compact && (dark ? "hover:bg-white/10" : "hover:bg-surface-2"),
    compact && (dark ? "border-white/20 bg-white/10 text-white" : "border-border bg-surface/90 text-foreground glass")
  );

  const allow = () => {
    if (onBeforeChannel && onBeforeChannel() === false) return false;
    return true;
  };

  const handleHttpOrTel = (e, href, { newTab = false } = {}) => {
    if (!allow()) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    onPick?.();
    window.setTimeout(() => openProtocolHref(href, { newTab }), 0);
  };

  const handleEmail = (e) => {
    if (!allow()) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    onPick?.();
    // Defer so closing the menu cannot cancel the Gmail handoff
    window.setTimeout(() => openEmailCompose(site.email, emailOpts), 0);
  };

  return (
    <>
      {active.has("whatsapp") ? (
        <a
          role="menuitem"
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Enquire via WhatsApp"
          tabIndex={itemTab}
          onClick={(e) => handleHttpOrTel(e, waHref, { newTab: true })}
          className={cn(itemCls, compact && "border-transparent bg-success text-white")}
        >
          <MessageCircle
            className={cn(compact ? "h-[1.125rem] w-[1.125rem]" : "h-4 w-4 shrink-0 text-success")}
            aria-hidden="true"
          />
          {compact ? null : "WhatsApp"}
        </a>
      ) : null}
      {active.has("email") ? (
        <a
          role="menuitem"
          href={mailHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Email ${site.email} via Gmail`}
          tabIndex={itemTab}
          onClick={handleEmail}
          className={itemCls}
        >
          <Mail
            className={cn(
              compact ? "h-[1.125rem] w-[1.125rem]" : "h-4 w-4 shrink-0 text-brand-orange-bright"
            )}
            aria-hidden="true"
          />
          {compact ? null : "Email"}
        </a>
      ) : null}
      {active.has("call") ? (
        <a
          role="menuitem"
          href={callHref}
          aria-label={`Call ${site.phone}`}
          tabIndex={itemTab}
          onClick={(e) => handleHttpOrTel(e, callHref)}
          className={itemCls}
        >
          <Phone
            className={cn(compact ? "h-[1.125rem] w-[1.125rem]" : "h-4 w-4 shrink-0 text-brand-red")}
            aria-hidden="true"
          />
          {compact ? null : "Call"}
        </a>
      ) : null}
    </>
  );
}

function EnquireMenu({
  waHref,
  mailHref,
  emailOpts,
  callHref,
  active,
  onBeforeChannel,
  label,
  size,
  variant,
  magnetic,
  fullWidth,
  className,
  triggerClassName,
  tone,
  interactive,
  menuSide = "up",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const panelId = useId();
  const tabIndex = interactive ? undefined : -1;
  const dark = tone === "dark";

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const iconCls = size === "md" ? "h-4 w-4" : "h-5 w-5";
  const chevron = (
    <ChevronDown
      className={cn(
        "h-4 w-4 opacity-80 transition-transform duration-300 ease-premium",
        open && "rotate-180"
      )}
      aria-hidden="true"
    />
  );
  const triggerProps = {
    type: "button",
    variant,
    size,
    tabIndex,
    "aria-haspopup": "menu",
    "aria-expanded": open,
    "aria-controls": panelId,
    onClick: () => setOpen((v) => !v),
    className: cn(fullWidth && "w-full", triggerClassName),
  };

  return (
    <div
      ref={rootRef}
      className={cn("relative inline-flex flex-col", fullWidth && "w-full", className)}
    >
      {magnetic ? (
        <MagneticButton
          {...triggerProps}
          wrapperClassName={cn("inline-flex", fullWidth && "w-full")}
        >
          <MessageCircle className={iconCls} />
          {label}
          {chevron}
        </MagneticButton>
      ) : (
        <Button {...triggerProps}>
          <MessageCircle className={iconCls} />
          {label}
          {chevron}
        </Button>
      )}

      <div
        id={panelId}
        role="menu"
        aria-label="Contact options"
        className={cn(
          "absolute left-0 z-30 min-w-[13.5rem] overflow-hidden rounded-2xl border p-1.5 shadow-soft-lg transition-[opacity,transform] duration-200 ease-premium",
          menuSide === "down" ? "top-[calc(100%+0.4rem)]" : "bottom-[calc(100%+0.4rem)]",
          fullWidth && "right-0 w-full min-w-0",
          dark
            ? "border-white/15 bg-[#120e0b]/95 text-white backdrop-blur-md"
            : "border-border bg-surface/95 text-foreground glass",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : cn(
                "pointer-events-none opacity-0",
                menuSide === "down" ? "-translate-y-1" : "translate-y-1"
              )
        )}
      >
        <ChannelLinks
          waHref={waHref}
          mailHref={mailHref}
          emailOpts={emailOpts}
          callHref={callHref}
          active={active}
          dark={dark}
          open={open}
          interactive={interactive}
          onBeforeChannel={onBeforeChannel}
          onPick={() => setOpen(false)}
        />
      </div>
    </div>
  );
}

function EnquireFab({ waHref, mailHref, emailOpts, callHref, active, onBeforeChannel, className }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={cn("relative flex flex-col items-end gap-2", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        id={panelId}
        role="menu"
        aria-label="Contact options"
        className={cn(
          "flex flex-col items-end gap-2 transition-[opacity,transform] duration-300 ease-premium",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        )}
      >
        <ChannelLinks
          waHref={waHref}
          mailHref={mailHref}
          emailOpts={emailOpts}
          callHref={callHref}
          active={active}
          dark={false}
          open={open}
          interactive
          compact
          onBeforeChannel={onBeforeChannel}
          onPick={() => setOpen(false)}
        />
      </div>

      <button
        type="button"
        aria-label={open ? "Close contact options" : "Open contact options"}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-success text-white shadow-soft-lg transition-transform hover:scale-105"
      >
        <span
          className="absolute inset-0 animate-ping rounded-full bg-success/40 [animation-duration:2.5s] motion-reduce:animate-none"
          aria-hidden="true"
        />
        <MessageCircle className="relative h-6 w-6" />
      </button>
    </div>
  );
}
