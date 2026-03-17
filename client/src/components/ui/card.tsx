import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`.trim()}
      {...props}
    />
  )
);
Card.displayName = "Card";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={`p-6 pb-0 ${className}`.trim()} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={`p-6 ${className}`.trim()} {...props} />
  )
);
CardContent.displayName = "CardContent";

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={`p-6 pt-0 ${className}`.trim()} {...props} />
  )
);
CardFooter.displayName = "CardFooter";
