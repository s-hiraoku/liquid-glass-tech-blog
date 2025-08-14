import React from 'react';
import { vi } from 'vitest';

/**
 * Enhanced Mock implementations for shadcn/ui components
 * Provides comprehensive mock components for testing with proper prop interfaces
 * and event handling to support liquid glass technology blog testing.
 */

// Enhanced Card component mock with proper prop interfaces
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

// Enhanced Button component mock
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

export const MockCard: React.FC<CardProps> = vi.fn(({ children, className, ...props }) => (
  <div className={`mock-card ${className || ''}`} data-testid="mock-card" {...props}>
    {children}
  </div>
));

export const MockButton: React.FC<ButtonProps> = vi.fn(({ children, className, variant, size, onClick, ...props }) => (
  <button 
    className={`mock-button ${className || ''}`} 
    data-testid="mock-button"
    data-variant={variant}
    data-size={size}
    onClick={(e) => {
      onClick?.(e);
      // Trigger custom event for interaction testing
      e.currentTarget.dispatchEvent(new CustomEvent('buttonInteraction', { detail: { variant, size } }));
    }}
    {...props}
  >
    {children}
  </button>
));

// Enhanced Input component mock
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const MockInput: React.FC<InputProps> = vi.fn(({ className, type, onChange, ...props }) => (
  <input 
    className={`mock-input ${className || ''}`}
    data-testid="mock-input"
    type={type || 'text'}
    onChange={(e) => {
      onChange?.(e);
      // Trigger validation event for testing
      e.currentTarget.dispatchEvent(new CustomEvent('inputValidation', { detail: { value: e.target.value } }));
    }}
    {...props}
  />
));

// Enhanced Dialog component mock
interface DialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

export const MockDialog: React.FC<DialogProps> = vi.fn(({ children, open, onOpenChange, modal = true, ...props }) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && onOpenChange) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      if (modal) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange, modal]);

  if (!open) return null;

  return (
    <div 
      className="mock-dialog-overlay" 
      data-testid="mock-dialog"
      data-open={open}
      onClick={(e) => {
        if (e.target === e.currentTarget && onOpenChange) {
          onOpenChange(false);
        }
      }}
      {...props}
    >
      <div className="mock-dialog-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
});

// Enhanced Toast component mock
interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
  onClose?: () => void;
}

export const MockToast: React.FC<ToastProps> = vi.fn(({ title, description, variant, duration = 5000, onClose, ...props }) => {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div 
      className="mock-toast" 
      data-testid="mock-toast"
      data-variant={variant}
      role="alert"
      aria-live="polite"
      {...props}
    >
      {title && <div className="mock-toast-title">{title}</div>}
      {description && <div className="mock-toast-description">{description}</div>}
      <button 
        className="mock-toast-close" 
        onClick={onClose}
        aria-label="Close toast"
        data-testid="mock-toast-close"
      >
        ×
      </button>
    </div>
  );
});

// Enhanced Select component mock
interface SelectProps {
  children?: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MockSelect: React.FC<SelectProps> = vi.fn(({ children, value, onValueChange, placeholder, disabled, ...props }) => (
  <div className="mock-select-wrapper" data-testid="mock-select">
    <select 
      className="mock-select" 
      value={value || ''}
      onChange={(e) => {
        onValueChange?.(e.target.value);
        // Trigger selection event for testing
        e.currentTarget.dispatchEvent(new CustomEvent('selectChange', { detail: { value: e.target.value } }));
      }}
      disabled={disabled}
      {...props}
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {children}
    </select>
  </div>
));

// Enhanced Slider component mock
interface SliderProps {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export const MockSlider: React.FC<SliderProps> = vi.fn(({ 
  value = [0], 
  onValueChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  disabled = false,
  orientation = 'horizontal',
  ...props 
}) => (
  <div className="mock-slider-wrapper" data-orientation={orientation}>
    <input 
      type="range"
      className="mock-slider" 
      data-testid="mock-slider"
      value={value[0] || 0}
      onChange={(e) => {
        const newValue = [parseInt(e.target.value)];
        onValueChange?.(newValue);
        // Trigger value change event for testing
        e.currentTarget.dispatchEvent(new CustomEvent('sliderChange', { detail: { value: newValue } }));
      }}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      {...props}
    />
    <span className="mock-slider-value" data-testid="mock-slider-value">
      {value[0]}
    </span>
  </div>
));

// Additional shadcn/ui components for comprehensive testing
export const MockBadge: React.FC<{ variant?: 'default' | 'secondary' | 'destructive' | 'outline'; children?: React.ReactNode }> = vi.fn(({ 
  variant = 'default', 
  children,
  ...props 
}) => (
  <span className="mock-badge" data-testid="mock-badge" data-variant={variant} {...props}>
    {children}
  </span>
));

export const MockProgress: React.FC<{ value?: number; className?: string }> = vi.fn(({ value = 0, className, ...props }) => (
  <div className={`mock-progress ${className || ''}`} data-testid="mock-progress" {...props}>
    <div 
      className="mock-progress-indicator" 
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      data-value={value}
    />
  </div>
));

export const MockSwitch: React.FC<{ 
  checked?: boolean; 
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}> = vi.fn(({ checked = false, onCheckedChange, disabled = false, ...props }) => (
  <button
    role="switch"
    aria-checked={checked}
    className="mock-switch"
    data-testid="mock-switch"
    data-state={checked ? 'checked' : 'unchecked'}
    onClick={() => {
      if (!disabled) {
        onCheckedChange?.(!checked);
      }
    }}
    disabled={disabled}
    {...props}
  >
    <span className="mock-switch-thumb" />
  </button>
));

// Theme provider mock for shadcn/ui theming
export const MockThemeProvider: React.FC<{
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}> = vi.fn(({ children, defaultTheme = 'system', storageKey = 'ui-theme' }) => {
  const [theme, setTheme] = React.useState(defaultTheme);

  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setTheme(stored);
    }
  }, [storageKey]);

  const value = {
    theme,
    setTheme: (newTheme: string) => {
      setTheme(newTheme);
      localStorage.setItem(storageKey, newTheme);
    },
  };

  return (
    <div data-theme={theme} data-testid="mock-theme-provider">
      {children}
    </div>
  );
});

export default {
  MockCard,
  MockButton,
  MockInput,
  MockDialog,
  MockToast,
  MockSelect,
  MockSlider,
  MockBadge,
  MockProgress,
  MockSwitch,
  MockThemeProvider,
};