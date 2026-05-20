import { Image, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AVATAR_IMG, MAP_IMG } from "./constants";
import { ArrowLeftIcon } from "./icons";

export default function TravelMap() {
  return (
    <View className="h-screen flex flex-col bg-[#FDFCF8] overflow-hidden text-[#1A1A1A]">
      <View className="flex items-center px-4 py-3 border-b border-[#7BBF9E]/30 bg-[#FDFCF8] z-20 pt-12">
        <View className="p-2 rounded-full text-[#4A8C6F] bg-[#F5E6C8]/40" onClick={() => Taro.navigateBack()}>
          <ArrowLeftIcon className="w-5 h-5" />
        </View>
      </View>

      <View className="flex-1 relative bg-[#F5E6C8]/10 overflow-hidden border-b border-[#7BBF9E]/30">
        <Image className="absolute inset-0 w-full h-full opacity-15" src={MAP_IMG} mode="aspectFill" />
        <View className="absolute top-4 right-4 bg-[#FDFCF8]/90 border border-[#7BBF9E]/40 px-4 py-1.5 text-sm text-[#4A8C6F] font-bold rounded-sm z-10">
          神州全景
        </View>
        <View className="absolute z-10" style={{ top: "380rpx", left: "500rpx" }}>
          <View className="bg-[#FDFCF8] border border-[#C8963E]/40 px-3 py-1 text-xs text-[#C8963E] font-bold rounded-sm">
            沪上
          </View>
        </View>
      </View>

      <View className="bg-[#FDFCF8] px-4 py-6 z-20 flex items-center gap-4">
        <Image className="w-16 h-16 rounded-full border-2 border-[#4A8C6F]/30" src={AVATAR_IMG} mode="aspectFill" />
        <View>
          <Text className="text-xl font-bold text-[#1A1A1A] block mb-1">游园雅客</Text>
          <Text className="text-sm text-[#4A8C6F]/80">足迹遍布 1 国 2 城</Text>
        </View>
      </View>
    </View>
  );
}
