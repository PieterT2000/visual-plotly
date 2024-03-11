import { cn } from "src/utils";

export function TypographyH3({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("scroll-m-20 text-2xl font-semibold", className)}>
      {children}
    </h3>
  );
}
