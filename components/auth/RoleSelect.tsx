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
      <label className="mb-2 block text-sm font-medium text-[#39231e]">
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
                  ? "border-[#981e24] bg-white ring-2 ring-[#981e24]/15"
                  : "border-[#e5cfb2] bg-[#fbf5eb] hover:border-[#b77b62]"
              }`}
            >
              <span
                className={`mb-2 flex size-10 items-center justify-center rounded-xl ${
                  selected
                    ? "bg-[#981e24] text-white"
                    : "bg-[#f4e3c9] text-[#981e24]"
                }`}
              >
                <Icon size={21} />
              </span>

              <span className="block text-sm font-semibold text-[#301c17]">
                {role.title}
              </span>

              <span className="mt-1 block text-xs leading-5 text-[#795b50]">
                {role.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
