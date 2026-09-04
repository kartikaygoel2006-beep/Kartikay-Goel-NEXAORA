"use client";

import { Button } from "@/components/ui/Button";

export function ConfirmSubmitButton({
  children,
  confirmMessage,
  variant = "danger",
}: {
  children: React.ReactNode;
  confirmMessage: string;
  variant?: "danger" | "outline" | "ghost";
}) {
  return (
    <Button
      type="submit"
      variant={variant}
      size="sm"
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </Button>
  );
}
