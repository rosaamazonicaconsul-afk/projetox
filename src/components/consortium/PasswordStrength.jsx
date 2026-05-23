import React from "react";

/**
 * @param {object} props
 * @param {string} props.password
 */
export default function PasswordStrength({ password }) {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const labels = ["", "Fraca", "Razoável", "Boa", "Forte"];
  const colors = ["", "bg-red-500", "bg-[#D97706]", "bg-blue-500", "bg-[#059669]"];

  if (!password) return null;

  return (
    <div className="space-y-1.5 mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength] : "bg-border"
              }`}
          />
        ))}
      </div>
      <p
        className={`text-xs font-medium transition-colors ${strength <= 1
            ? "text-red-500"
            : strength === 2
              ? "text-[#D97706]"
              : strength === 3
                ? "text-blue-500"
                : "text-[#059669]"
          }`}
      >
        Senha: {labels[strength]}
      </p>
    </div>
  );
}