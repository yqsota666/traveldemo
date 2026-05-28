import { Image, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AVATAR_IMG } from "./constants";

export default function Profile() {
  return (
    <View className="h-full flex flex-col bg-[#FDFCF8] p-5 pb-32 relative text-[#1A1A1A] overflow-hidden z-0">
      <View className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
        <View className="absolute top--10% right--20% w-80% h-50% rounded-full bg-[#4A8C6F]/10 blur-[100px]" />
        <View className="absolute bottom-20% left--30% w-70% h-60% rounded-full bg-[#C8963E]/15 blur-[120px]" />
      </View>

      <View className="bg-gradient-to-br from-[#7BBF9E]/20 to-[#F5E6C8]/30 border border-white p-5 flex justify-between items-center mb-8 h-32 rounded-2xl shadow-[0_8px_32px_rgba(74,140,111,0.12)] relative z-10">
        <View className="flex flex-col z-10">
          <Text className="text-[#4A8C6F] font-bold text-sm mb-1">我的积分</Text>
          <Text className="text-3xl font-black text-[#C8963E]">2,450</Text>
        </View>
        <Image className="w-20 h-20 rounded-full border-3 border-white shadow-[0_8px_16px_rgba(74,140,111,0.2)]" src={AVATAR_IMG} mode="aspectFill" />
      </View>

      <View className="flex flex-col gap-4 flex-1 z-10">
        <View className="bg-white/80 border border-white py-6 px-6 flex items-center justify-between font-bold text-lg rounded-2xl shadow-[0_4px_12px_rgba(74,140,111,0.06)]">
          <Text>我的收藏</Text>
          <View className="w-10 h-10 rounded-full bg-[#F5E6C8]/50 flex items-center justify-center text-[#C8963E]">›</View>
        </View>
        <View
          className="bg-white/80 border border-white py-6 px-6 flex items-center justify-between font-bold text-lg rounded-2xl shadow-[0_4px_12px_rgba(74,140,111,0.06)]"
          onClick={() => Taro.navigateTo({ url: "/pages/travel-map/index" })}
        >
          <Text>旅行地图</Text>
          <View className="w-10 h-10 rounded-full bg-[#7BBF9E]/20 flex items-center justify-center text-[#4A8C6F]">›</View>
        </View>
        <View className="bg-white/80 border border-white py-6 px-6 flex items-center justify-between font-bold text-lg rounded-2xl shadow-[0_4px_12px_rgba(74,140,111,0.06)]">
          <Text>我的订单</Text>
          <View className="w-10 h-10 rounded-full bg-[#F7C7CF]/30 flex items-center justify-center text-[#e88796]">›</View>
        </View>
      </View>

      <View className="flex justify-center mt-12 mb-8 z-10">
        <View className="bg-white text-[#1A1A1A] px-12 py-3.5 rounded-full font-bold border border-[#F7C7CF]/50">退出登录</View>
      </View>
    </View>
  );
}
