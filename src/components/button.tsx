import { cx } from "class-variance-authority";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}

export function Button({ onClick, children, className, ...props }: ButtonProps) {
  return (
    <button
      className={`w-auto self-center rounded-lg border-1 p-1 content-center ${className}`}
      type="button"
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
