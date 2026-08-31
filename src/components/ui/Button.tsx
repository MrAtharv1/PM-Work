import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-foreground text-white hover:bg-foreground/90": variant === "default",
            "border border-border bg-white hover:bg-gray-50 text-foreground": variant === "outline",
            "hover:bg-gray-100 hover:text-foreground": variant === "ghost",
            "bg-gray-100 text-foreground hover:bg-gray-200": variant === "secondary",
            "h-12 px-6 py-2": size === "default",
            "h-9 rounded-lg px-3 text-sm": size === "sm",
            "h-14 rounded-xl px-8 text-lg": size === "lg",
            "h-12 w-12": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
