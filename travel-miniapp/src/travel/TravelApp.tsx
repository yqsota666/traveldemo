import { Image, ScrollView, Text, View } from "@tarojs/components";
import Taro, { useReady } from "@tarojs/taro";
import { useState } from "react";
import CityDetail from "./CityDetail";
import { BANNER_IMG, HOTEL_IMG } from "./constants";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  InfoIcon,
  MessageCircleIcon,
  ShoppingBagIcon,
  UserIcon,
} from "./icons";
import Products from "./Products";
import Profile from "./Profile";

type TabKey = "home" | "products" | "about" | "profile";

export default function TravelApp() {
  const [currentBanner, setCurrentBanner] = useState(2);
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [scrollHeight, setScrollHeight] = useState(560);

  useReady(() => {
    const sys = Taro.getSystemInfoSync();
    const safeBottom = sys.safeArea ? sys.screenHeight - sys.safeArea.bottom : 0;
    setScrollHeight(Math.floor(sys.windowHeight - sys.statusBarHeight - 100 - 56 - safeBottom));
  });

  const nextBanner = () => setCurrentBanner(prev => (prev === 2 ? 0 : prev + 1));
  const prevBanner = () => setCurrentBanner(prev => (prev === 0 ? 2 : prev + 1));

  if (selectedCity) {
    return <CityDetail cityName={selectedCity} onBack={() => setSelectedCity(null)} />;
  }

  const renderBottomNav = () => (
    <View className="fixed bottom-0 left-0 right-0 bg-[#FDFCF8]/95 border-t border-[#7BBF9E]/20 shadow-[0_-4px_20px_rgba(74,140,111,0.08)] grid grid-cols-4 z-30 pb-safe">
      {([
        { key: "home" as const, label: "Home", Icon: HomeIcon },
        { key: "products" as const, label: "Products", Icon: ShoppingBagIcon },
        { key: "about" as const, label: "About Us", Icon: InfoIcon },
        { key: "profile" as const, label: "My", Icon: UserIcon },
      ]).map(({ key, label, Icon }) => (
        <View
          key={key}
          className={`flex flex-col items-center py-3 px-2 relative ${activeTab === key ? "text-[#4A8C6F]" : "text-[#7BBF9E]"}`}
          onClick={() => setActiveTab(key)}
        >
          {activeTab === key && (
            <View className="absolute top-0 left-1/2 w-8 h-1 bg-gradient-to-r from-[#7BBF9E] to-[#4A8C6F] rounded-b-md -translate-x-1/2" />
          )}
          <View className={`p-1 rounded-xl ${activeTab === key ? "bg-[#E8F2ED]" : ""}`}>
            <Icon className="w-6 h-6 mb-1" />
          </View>
          <Text className={`text-[10px] ${activeTab === key ? "font-bold" : "font-medium"}`}>{label}</Text>
        </View>
      ))}
    </View>
  );

  if (activeTab === "profile") {
    return (
      <View className="h-screen flex flex-col bg-[#FDFCF8] max-w-[560px] mx-auto relative text-[#1A1A1A]">
        <Profile />
        {renderBottomNav()}
      </View>
    );
  }

  if (activeTab === "products") {
    return (
      <View className="h-screen flex flex-col bg-[#FDFCF8] max-w-[560px] mx-auto relative text-[#1A1A1A]">
        <Products />
        {renderBottomNav()}
      </View>
    );
  }

  if (activeTab === "about") {
    return (
      <View className="h-screen flex flex-col bg-[#FDFCF8] max-w-[560px] mx-auto relative text-[#1A1A1A]">
        <View className="flex-1 flex items-center justify-center">
          <Text className="font-bold text-xl text-[#4A8C6F]">About Us (开发中)</Text>
        </View>
        {renderBottomNav()}
      </View>
    );
  }

  return (
    <View className="h-screen flex flex-col bg-[#FDFCF8] text-[#1A1A1A] relative overflow-hidden">
      <View className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
        <View className="absolute top--10% left--20% w-80% h-50% rounded-full bg-[#7BBF9E]/20 blur-[100px]" />
        <View className="absolute top-20% right--30% w-70% h-60% rounded-full bg-[#F5E6C8]/40 blur-[120px]" />
        <View className="absolute bottom-10% left--10% w-90% h-50% rounded-full bg-[#F7C7CF]/15 blur-[90px]" />
      </View>

      <View className="relative flex items-center justify-between px-5 py-2.5 text-sm text-[#4A8C6F] font-medium z-10 pt-10">
        <Text>9:41</Text>
      </View>

      <View className="relative flex items-center justify-center px-4 py-4 z-10 border-b border-[#7BBF9E]/10 bg-[#FDFCF8]/60">
        <Text className="text-xl font-extrabold text-[#4A8C6F] tracking-wider">Home</Text>
      </View>

      <ScrollView scrollY className="relative z-10 w-full" style={{ height: `${scrollHeight}px` }}>
        <View className="relative h-[300px] flex items-center justify-center overflow-hidden mb-2">
          <Image className="absolute inset-0 w-full h-full" src={BANNER_IMG} mode="aspectFill" />
          <View className="absolute inset-0 bg-gradient-to-t from-[#FDFCF8] via-transparent to-black/10" />
          <View className="absolute inset-0 bg-[#7BBF9E]/10" />

          <View className="absolute left-4 p-2.5 bg-white/40 border border-white/60 rounded-full z-10" onClick={prevBanner}>
            <ChevronLeftIcon className="w-5 h-5" />
          </View>

          <View className="px-8 py-3 bg-white/60 border border-white/50 rounded-lg z-10">
            <Text className="text-[#1A1A1A] font-bold">
              Banner
              {currentBanner + 1}
            </Text>
          </View>

          <View className="absolute right-4 p-2.5 bg-white/40 border border-white/60 rounded-full z-10" onClick={nextBanner}>
            <ChevronRightIcon className="w-5 h-5" />
          </View>

          <View className="absolute bottom-6 left-0 right-0 flex justify-center gap-2.5 z-10">
            {[0, 1, 2].map(index => (
              <View
                key={index}
                className={`h-2.5 rounded-full ${currentBanner === index ? "bg-white w-6" : "bg-white/50 w-2.5 border border-white/80"}`}
              />
            ))}
          </View>
        </View>

        <View className="px-4 py-4">
          <View className="rounded-2xl bg-gradient-to-br from-white to-[#F5E6C8]/40 border border-white p-4 flex items-center shadow-[0_8px_24px_rgba(200,150,62,0.12)]">
            <View className="bg-gradient-to-r from-[#4A8C6F] to-[#7BBF9E] text-white px-3 py-1.5 text-xs font-bold mr-4 rounded-lg shrink-0">
              Reminder
            </View>
            <View className="flex flex-col">
              <View className="flex items-center gap-3 mb-1">
                <Text className="font-extrabold text-base">Beijing</Text>
                <Text className="text-sm font-medium text-[#4A8C6F]">Sunny 25°C</Text>
              </View>
              <Text className="text-[#1A1A1A]/60 text-xs">Don&apos;t forget to pack your passport!</Text>
            </View>
          </View>
        </View>

        <View className="px-5 py-6">
          <View className="flex items-center gap-3 mb-5">
            <View className="w-1.5 h-6 bg-gradient-to-b from-[#4A8C6F] to-[#7BBF9E] rounded-full" />
            <Text className="text-xl font-extrabold">Hot Cities</Text>
          </View>
          <View className="grid grid-cols-3 gap-3">
            {["Beijing", "Xi'an", "Shanghai"].map(city => (
              <View
                key={city}
                className="rounded-xl bg-white border border-white shadow-[0_4px_16px_rgba(123,191,158,0.1)] h-16 flex items-center justify-center"
                onClick={() => setSelectedCity(city)}
              >
                <Text className="font-bold">{city}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="px-5 py-2">
          <View className="flex items-center gap-3 mb-5">
            <View className="w-1.5 h-6 bg-gradient-to-b from-[#C8963E] to-[#F5E6C8] rounded-full" />
            <Text className="text-xl font-extrabold">Recommended Hotels</Text>
          </View>
          <View className="relative h-48 rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(200,150,62,0.15)]">
            <Image className="w-full h-full" src={HOTEL_IMG} mode="aspectFill" />
            <View className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent" />
            <View className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
              <View>
                <Text className="text-white/80 text-xs font-bold block mb-1">FEATURED</Text>
                <Text className="text-white font-extrabold text-lg">Explore Top Stays</Text>
              </View>
              <View className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">›</View>
            </View>
          </View>
        </View>

        <View className="px-5 py-8 pb-32">
          <View className="flex items-center gap-3 mb-5">
            <View className="w-1.5 h-6 bg-gradient-to-b from-[#F7C7CF] to-white rounded-full" />
            <Text className="text-xl font-extrabold">Popular Destinations</Text>
          </View>
          <View className="grid grid-cols-2 gap-4">
            {[1, 2].map(item => (
              <View key={item} className="relative h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-[#7BBF9E]/20 to-[#F5E6C8]/30 border border-white p-4 flex flex-col justify-between">
                <Text className="font-bold text-sm text-[#4A8C6F]">
                  0
                  {item}
                </Text>
                <Text className="font-extrabold text-lg">Destination {item}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View
        className="fixed bottom-24 right-5 flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-[#4A8C6F] to-[#7BBF9E] text-white rounded-full font-bold z-40"
        onClick={() => Taro.showToast({ title: "Consultation", icon: "none" })}
      >
        <MessageCircleIcon className="w-5 h-5" />
        <Text>Consultation</Text>
      </View>

      <View className="fixed top-20 left-1/2 flex items-center gap-2 px-5 py-2.5 bg-white/90 text-[#4A8C6F] border border-white rounded-full z-50 font-bold -translate-x-1/2">
        <View className="w-5 h-5 rounded-full bg-[#4A8C6F] text-white flex items-center justify-center">
          <CheckIcon className="w-3 h-3" />
        </View>
        <Text className="text-sm">Refreshing...</Text>
      </View>

      {renderBottomNav()}
    </View>
  );
}
