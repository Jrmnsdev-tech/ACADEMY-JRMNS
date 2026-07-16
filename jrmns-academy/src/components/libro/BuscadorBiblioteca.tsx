"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

export default function BuscadorBiblioteca({
  placeholder,
  basePath,
}: {
  placeholder: string;
  basePath: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [valor, setValor] = useState(params.get("q") || "");

  function buscar(v: string) {
    setValor(v);
    const url = v ? `${basePath}?q=${encodeURIComponent(v)}` : basePath;
    router.push(url);
  }

  return (
    <div className="relative max-w-md">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
      <input
        value={valor}
        onChange={(e) => buscar(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 rounded-full border border-line bg-white text-sm outline-none focus:ring-2 focus:ring-electric/30 focus:border-electric transition-colors"
      />
    </div>
  );
}
