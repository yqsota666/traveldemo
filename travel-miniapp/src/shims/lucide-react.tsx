/**
 * lucide-react 兼容层：在小程序端用 UnoCSS Tabler 图标替代 SVG 组件，保持 className 用法不变。
 */
import { View } from "@tarojs/components";
import type { CSSProperties } from "react";

export interface LucideProps {
  className?: string;
  strokeWidth?: number;
  style?: CSSProperties;
}

function icon(tabler: string) {
  return function LucideIcon({ className = "" }: LucideProps) {
    return <View className={`${tabler} inline-block align-middle ${className}`.trim()} />;
  };
}

export const Home = icon("i-tabler-home");
export const User = icon("i-tabler-user");
export const ChevronLeft = icon("i-tabler-chevron-left");
export const ChevronRight = icon("i-tabler-chevron-right");
export const Check = icon("i-tabler-check");
export const Info = icon("i-tabler-info-circle");
export const ShoppingBag = icon("i-tabler-shopping-bag");
export const Search = icon("i-tabler-search");
export const ArrowLeft = icon("i-tabler-arrow-left");
export const ArrowRight = icon("i-tabler-arrow-right");
export const Plus = icon("i-tabler-plus");
export const Calendar = icon("i-tabler-calendar");
export const MapPin = icon("i-tabler-map-pin");
export const UploadCloud = icon("i-tabler-cloud-upload");
export const Share = icon("i-tabler-share");
export const Star = icon("i-tabler-star");
export const HeadphonesIcon = icon("i-tabler-headphones");
export const MessageCircle = icon("i-tabler-message-circle");
export const CloudSun = icon("i-tabler-sun");
export const Shirt = icon("i-tabler-shirt");
export const AlertCircle = icon("i-tabler-alert-circle");
export const Map = icon("i-tabler-map");
export const BookOpen = icon("i-tabler-book");
export const Utensils = icon("i-tabler-tools-kitchen-2");
export const ClipboardList = icon("i-tabler-clipboard-list");
export const Clock = icon("i-tabler-clock");
export const Send = icon("i-tabler-send");
export const X = icon("i-tabler-x");
export const HeartHandshake = icon("i-tabler-heart-handshake");
export const CalendarHeart = icon("i-tabler-calendar-heart");
export const Tent = icon("i-tabler-tent");
export const Bell = icon("i-tabler-bell");
export const ChevronDown = icon("i-tabler-chevron-down");
export const ChevronUp = icon("i-tabler-chevron-up");
export const MoreHorizontal = icon("i-tabler-dots");
export const Circle = icon("i-tabler-circle");
export const GripVertical = icon("i-tabler-grip-vertical");
export const PanelLeft = icon("i-tabler-layout-sidebar");
export const Minus = icon("i-tabler-minus");
