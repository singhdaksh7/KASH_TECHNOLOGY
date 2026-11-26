import React from "react";
import Link from "next/link";
import { ChevronRight, Loader2, AlertCircle } from "lucide-react";

/* =========================================================================
   1. PAGE HEADER & CONTAINER
   ========================================================================= */

interface AdminPageProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "default" | "full" | "narrow";
}

export function AdminPage({
  children,
  className = "",
  maxWidth = "default",
}: AdminPageProps) {
  const maxW =
    maxWidth === "full"
      ? "max-w-none"
      : maxWidth === "narrow"
      ? "max-w-4xl"
      : "max-w-7xl";

  return (
    <div className={`p-4 sm:p-6 lg:p-8 w-full ${maxW} mx-auto space-y-6 ${className}`}>
      {children}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  badge,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
      <div className="space-y-1 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={b.label}>
                {b.href ? (
                  <Link href={b.href} className="hover:text-stone-900 transition-colors">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-stone-700 font-medium">{b.label}</span>
                )}
                {i < breadcrumbs.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-[#0B0B0F]">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-sm text-stone-600 leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   2. CARDS & SECTIONS
   ========================================================================= */

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({
  children,
  className = "",
  onClick,
  hoverable = false,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-stone-200/80 shadow-xs ${
        hoverable ? "hover:border-stone-300 hover:shadow-sm cursor-pointer transition-all" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  actions,
  className = "",
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-5 border-b border-stone-100 flex items-center justify-between gap-4 ${className}`}>
      <div>
        <h3 className="text-base font-medium text-[#0B0B0F]">{title}</h3>
        {description && (
          <p className="text-xs text-stone-500 mt-0.5">{description}</p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}

export function CardContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

/* =========================================================================
   3. STAT CARDS
   ========================================================================= */

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  onClick?: () => void;
}

export function StatCard({
  label,
  value,
  subtext,
  icon,
  onClick,
}: StatCardProps) {
  return (
    <Card
      onClick={onClick}
      hoverable={!!onClick}
      className="p-5 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-stone-500">{label}</span>
        {icon && <span className="text-stone-400">{icon}</span>}
      </div>
      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#0B0B0F]">
          {value}
        </div>
        {subtext && (
          <p className="text-xs text-stone-500 mt-1 font-normal">{subtext}</p>
        )}
      </div>
    </Card>
  );
}

/* =========================================================================
   4. STATUS BADGES
   ========================================================================= */

export type StatusVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: StatusVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

const BADGE_VARIANTS: Record<StatusVariant, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  warning: "bg-amber-50 text-amber-700 border-amber-200/80",
  danger: "bg-red-50 text-red-700 border-red-200/80",
  info: "bg-sky-50 text-sky-700 border-sky-200/80",
  neutral: "bg-stone-50 text-stone-700 border-stone-200/80",
};

const DOT_VARIANTS: Record<StatusVariant, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-sky-500",
  neutral: "bg-stone-400",
};

export function StatusBadge({
  children,
  variant = "neutral",
  size = "md",
  dot = true,
}: StatusBadgeProps) {
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${BADGE_VARIANTS[variant]} ${sizeClasses}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT_VARIANTS[variant]}`} />}
      {children}
    </span>
  );
}

/* =========================================================================
   5. BUTTONS
   ========================================================================= */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = "secondary",
  size = "md",
  loading = false,
  icon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/20";

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs gap-1.5 h-8",
    md: "px-3.5 py-2 text-xs sm:text-sm gap-2 h-9 sm:h-9.5",
    lg: "px-4 py-2.5 text-sm sm:text-base gap-2.5 h-11",
  }[size];

  const variantClasses = {
    primary:
      "bg-[#FF5A00] text-white hover:bg-[#E04F00] active:bg-[#CC4700] shadow-xs",
    secondary:
      "bg-white text-stone-800 border border-stone-200 hover:bg-stone-50 hover:border-stone-300 shadow-xs",
    outline:
      "border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-stone-300",
    ghost: "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-xs",
  }[variant];

  return (
    <button
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}

/* =========================================================================
   6. EMPTY & ERROR STATES
   ========================================================================= */

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-xl border border-stone-200/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center">
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-center text-stone-500 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-stone-900">{title}</h3>
      <p className="text-xs sm:text-sm text-stone-500 max-w-sm mt-1 mb-5 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  retry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an error while loading this content.",
  retry,
}: ErrorStateProps) {
  return (
    <div className="bg-white rounded-xl border border-red-200/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200/60 flex items-center justify-center text-red-600 mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-stone-900">{title}</h3>
      <p className="text-xs sm:text-sm text-stone-500 max-w-md mt-1 mb-5">
        {message}
      </p>
      {retry && (
        <Button variant="outline" size="sm" onClick={retry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

/* =========================================================================
   7. SKELETON LOADERS
   ========================================================================= */

export function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return <div className={`animate-pulse bg-stone-200/70 rounded-md ${className}`} />;
}

export function TableSkeleton({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200/80 overflow-hidden p-4 space-y-4">
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-6 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 pt-3 border-t border-stone-100">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/* =========================================================================
   8. TABS COMPONENT
   ========================================================================= */

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  className = "",
}: {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={`border-b border-stone-200 flex gap-6 overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`pb-3 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              isActive
                ? "text-[#FF5A00] font-semibold"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-[#FF5A00]/10 text-[#FF5A00]"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {tab.badge}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5A00]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================================
   9. MODALS & DRAWERS
   ========================================================================= */

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "max-w-lg",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`bg-white rounded-2xl border border-stone-200 shadow-xl w-full ${maxWidth} overflow-hidden`}
      >
        <div className="p-6 border-b border-stone-100 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[#0B0B0F]">{title}</h3>
            {description && (
              <p className="text-xs sm:text-sm text-stone-500 mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  actions,
  width = "max-w-xl",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  width?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs">
      <div
        className={`bg-white h-full w-full ${width} shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-200`}
      >
        <div className="p-5 border-b border-stone-200/80 flex items-center justify-between gap-4 bg-stone-50/50">
          <div>
            <h3 className="text-base font-semibold text-[#0B0B0F]">{title}</h3>
            {subtitle && (
              <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
