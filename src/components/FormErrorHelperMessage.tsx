import React from "react";
import { cn } from "@/src/lib/utils";

interface ErrorMessageProps extends React.HTMLProps<HTMLDivElement> {
  message: string;
}

export const FormErrorHelperMessage: React.FC<ErrorMessageProps> = ({
  message,
  className,
  ...rest
}) => {
  if (!message) {
    return null;
  }

  return (
    <div className={cn("mt-1 text-sm text-red-800", className)} {...rest}>
      {message}
    </div>
  );
};
