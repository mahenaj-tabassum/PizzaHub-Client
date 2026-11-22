import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const passwordRules = [
  {
    id: "length",
    label: "At least 6 characters",
    required: true,
    test: (p: string) => p.length >= 6,
  },
  {
    id: "upper",
    label: "One uppercase letter",
    required: true,
    test: (p: string) => /[A-Z]/.test(p),
  },
  {
    id: "lower",
    label: "One lowercase letter",
    required: true,
    test: (p: string) => /[a-z]/.test(p),
  },
  {
    id: "number",
    label: "A number (stronger)",
    required: false,
    test: (p: string) => /\d/.test(p),
  },
  {
    id: "special",
    label: "A special character (stronger)",
    required: false,
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
  {
    id: "long",
    label: "10+ characters (stronger)",
    required: false,
    test: (p: string) => p.length >= 10,
  },
];

export function isPasswordValid(password: string) {
  return passwordRules.filter((r) => r.required).every((r) => r.test(password));
}

const LEVELS = [
  { label: "Weak", bar: "bg-destructive", text: "text-destructive" },
  {
    label: "Fair",
    bar: "bg-chart-2",
    text: "text-[#a8741f] dark:text-chart-2",
  },
  {
    label: "Good",
    bar: "bg-[#8a9a3f]",
    text: "text-[#66742a] dark:text-[#a3b455]",
  },
  { label: "Strong", bar: "bg-chart-3", text: "text-chart-3" },
];

// Returns 0-3 (index into LEVELS)
function getLevel(password: string) {
  if (!isPasswordValid(password)) return 0;
  const bonus = passwordRules.filter(
    (r) => !r.required && r.test(password),
  ).length;
  if (bonus === 0) return 1;
  if (bonus === 1) return 2;
  return 3;
}

export default function PasswordStrength({ password }: { password: string }) {
  if (!password) {
    return (
      <p className="mt-2 text-xs text-muted-foreground">
        At least 6 characters, with one uppercase and one lowercase letter.
      </p>
    );
  }

  const level = getLevel(password);
  const current = LEVELS[level];

  return (
    <div className="mt-3 space-y-3" aria-live="polite">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1.5">
          {LEVELS.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                i <= level ? current.bar : "bg-muted",
              )}
            />
          ))}
        </div>
        <span
          className={cn("w-14 text-right text-xs font-semibold", current.text)}
        >
          {current.label}
        </span>
      </div>

      <ul className="grid gap-1.5 sm:grid-cols-2">
        {passwordRules.map((rule) => {
          const ok = rule.test(password);
          return (
            <li
              key={rule.id}
              className={cn(
                "flex items-center gap-2 text-xs transition-colors",
                ok ? "text-chart-3" : "text-muted-foreground",
              )}
            >
              {ok ? (
                <Check className="size-3.5 shrink-0" />
              ) : (
                <X
                  className={cn(
                    "size-3.5 shrink-0",
                    rule.required && "text-destructive",
                  )}
                />
              )}
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
