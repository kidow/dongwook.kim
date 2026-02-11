interface BrandIconProps {
  label: string
  bgColor: string
}

export default function BrandIcon({ label, bgColor }: BrandIconProps) {
  return (
    <span
      aria-hidden
      className="flex h-10 w-10 items-center justify-center rounded-[10px] border text-[11px] font-bold text-white"
      style={{ backgroundColor: bgColor }}
    >
      {label}
    </span>
  )
}
