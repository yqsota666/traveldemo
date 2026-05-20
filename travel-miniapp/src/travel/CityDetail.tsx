import { Input, ScrollView, Text, View } from "@tarojs/components";
import { useState } from "react";
import { ArrowLeftIcon, SearchIcon } from "./icons";

interface CityDetailProps {
  cityName: string;
  onBack: () => void;
}

const categories = ["名胜古迹", "雅集茶会", "特色车马", "游园向导", "居所推荐", "传统妆造"];

export default function CityDetail({ cityName, onBack }: CityDetailProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View className="h-screen flex flex-col bg-[#FDFCF8] text-[#1A1A1A]">
      <View className="flex items-center gap-3 px-4 py-3 border-b border-[#7BBF9E]/30 bg-[#FDFCF8] shadow-sm z-10 pt-12">
        <View className="p-2 rounded-full text-[#4A8C6F] bg-[#F5E6C8]/40" onClick={onBack}>
          <ArrowLeftIcon className="w-5 h-5" />
        </View>
        <Text className="text-xl font-bold text-[#4A8C6F]">{cityName}</Text>
      </View>

      <View className="flex-1 flex overflow-hidden min-h-0">
        <ScrollView scrollY className="w-28 border-r border-[#7BBF9E]/30 bg-[#F5E6C8]/10 h-full flex-shrink-0">
          {categories.map(category => (
            <View
              key={category}
              className={`w-full py-6 px-2 text-center border-b border-[#7BBF9E]/20 text-sm font-medium ${activeCategory === category ? "bg-[#4A8C6F] text-white" : "text-[#4A8C6F]"}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </View>
          ))}
        </ScrollView>

        <View className="flex-1 flex flex-col overflow-hidden min-w-0">
          <View className="p-4 border-b border-[#7BBF9E]/30 bg-[#FDFCF8] relative flex-shrink-0">
            <Input
              className="w-full px-4 py-3 pr-10 border border-[#7BBF9E]/40 rounded-sm bg-[#F5E6C8]/20 text-[#1A1A1A]"
              placeholder="寻觅佳处"
              value={searchQuery}
              onInput={e => setSearchQuery(e.detail.value)}
            />
            <SearchIcon className="absolute right-6 top-1/2 w-5 h-5 text-[#4A8C6F]/70" />
          </View>

          <ScrollView scrollY className="flex-1 p-4 bg-[#FDFCF8] h-0">
            {[1, 2, 3, 4].map(item => (
              <View
                key={item}
                className="relative h-48 border border-[#7BBF9E]/30 rounded-sm bg-[#F5E6C8]/20 flex items-center justify-center mb-4 overflow-hidden"
              >
                <Text className="text-[#4A8C6F] font-bold z-10">
                  雅集
                  {item}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
