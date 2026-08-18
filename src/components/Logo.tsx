export default function Logo({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const sizes = {
    sm: { container: "h-8", text: "text-xl", shop: "text-[10px]" },
    default: { container: "h-10", text: "text-3xl", shop: "text-xs" },
    lg: { container: "h-14", text: "text-5xl", shop: "text-sm" },
  };

  const s = sizes[size];

  return (
    <div className={`flex items-center ${s.container}`}>
      <span className={`${s.text} font-black tracking-tighter leading-none text-gray-900`}>
        GT
      </span>
      <div className="ml-1.5 flex items-center gap-1.5">
        <div className="w-[2px] h-4 bg-gray-900 rounded-full" />
        <span className={`${s.shop} font-bold text-gray-900 tracking-[0.25em] uppercase leading-none`}>
          Shop
        </span>
      </div>
    </div>
  );
}
