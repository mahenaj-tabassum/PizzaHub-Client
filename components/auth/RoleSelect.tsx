"use client";

import { UserRound, Store } from "lucide-react";

export type AccountRole = "customer" | "vendor";

interface RoleSelectProps {
  value: AccountRole;
  onChange: (role: AccountRole) => void;
}

export default function RoleSelect({ value, onChange }: RoleSelectProps) {
  const roles = [
    {
      id: "customer" as const,
      title: "Customer",
      description: "Browse menus and order pizza for delivery.",
      icon: UserRound,
    },
    {
      id: "vendor" as const,
      title: "Restaurant owner",
      description: "List your menu and manage customer orders.",
      icon: Store,
    },
  ];

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">
        I want to join as
      </label>

      <div className="grid grid-cols-2 gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const selected = value === role.id;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onChange(role.id)}
              aria-pressed={selected}
              className={`rounded-2xl border p-4 text-left transition ${
                selected
                  ? "border-brand bg-card ring-2 ring-brand/15"
                  : "border-border bg-muted hover:border-brand/50"
              }`}
            >
              <span
                className={`mb-2 flex size-10 items-center justify-center rounded-xl ${
                  selected
                    ? "bg-brand text-brand-foreground"
                    : "bg-secondary/30 text-brand"
                }`}
              >
                <Icon size={21} />
              </span>

              <span className="block text-sm font-semibold text-foreground">
                {role.title}
              </span>

              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                {role.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
