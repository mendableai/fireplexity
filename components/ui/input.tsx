import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-gray-500 dark:placeholder:text-gray-400 selection:bg-primary selection:text-primary-foreground dark:bg-zinc-800 bg-white text-gray-900 dark:text-gray-100",
        "focus-visible:border-orange-400 focus-visible:ring-orange-400/20 focus-visible:ring-2",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
