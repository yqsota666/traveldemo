import { View } from "@tarojs/components";

interface IconProps {
  className?: string;
}

function Icon({ icon, className = "" }: IconProps & { icon: string }) {
  return <View className={`${icon} ${className}`.trim()} />;
}

export function HomeIcon({ className }: IconProps) {
  return <Icon icon="i-tabler-home" className={className} />;
}

export function UserIcon({ className }: IconProps) {
  return <Icon icon="i-tabler-user" className={className} />;
}

export function ShoppingBagIcon({ className }: IconProps) {
  return <Icon icon="i-tabler-shopping-bag" className={className} />;
}

export function InfoIcon({ className }: IconProps) {
  return <Icon icon="i-tabler-info-circle" className={className} />;
}

export function ChevronLeftIcon({ className }: IconProps) {
  return <Icon icon="i-tabler-chevron-left" className={className} />;
}

export function ChevronRightIcon({ className }: IconProps) {
  return <Icon icon="i-tabler-chevron-right" className={className} />;
}

export function MessageCircleIcon({ className }: IconProps) {
  return <Icon icon="i-tabler-message-circle" className={className} />;
}

export function CheckIcon({ className }: IconProps) {
  return <Icon icon="i-tabler-check" className={className} />;
}

export function SearchIcon({ className }: IconProps) {
  return <Icon icon="i-tabler-search" className={className} />;
}

export function ArrowLeftIcon({ className }: IconProps) {
  return <Icon icon="i-tabler-arrow-left" className={className} />;
}
