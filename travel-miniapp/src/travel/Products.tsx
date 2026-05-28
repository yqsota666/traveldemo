import { Image, Input, ScrollView, Text, View } from "@tarojs/components";
import { useState } from "react";
import { SearchIcon } from "./icons";

const CITIES = ["北京", "西安", "上海", "广州", "成都", "杭州"];

const PRODUCTS: Record<string, Array<{ id: number; name: string; desc: string; price: string; img: string }>> = {
  北京: [
    { id: 1, name: "故宫猫咪冰箱贴", desc: "精巧可爱，把故宫记忆带回家", price: "¥39", img: "https://images.unsplash.com/photo-1599813876020-0082ea5743fb?q=80&w=400&auto=format&fit=crop" },
    { id: 2, name: "长城帆布袋", desc: "以简洁线条勾勒长城风貌", price: "¥59", img: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=400&auto=format&fit=crop" },
    { id: 3, name: "京剧纹样书签", desc: "传统文化纹样，镂空工艺", price: "¥25", img: "https://images.unsplash.com/photo-1580665355088-75051a24911f?q=80&w=400&auto=format&fit=crop" },
  ],
  西安: [
    { id: 4, name: "兵马俑摆件", desc: "手工打磨，再现秦风气象", price: "¥89", img: "https://images.unsplash.com/photo-1563804812328-8686d420fec7?q=80&w=400&auto=format&fit=crop" },
    { id: 5, name: "大雁塔明信片", desc: "长安古韵，纸上留念", price: "¥35", img: "https://images.unsplash.com/photo-1584680238861-1250325d7c86?q=80&w=400&auto=format&fit=crop" },
  ],
};

export default function Products() {
  const [activeCity, setActiveCity] = useState(CITIES[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const currentProducts = PRODUCTS[activeCity] || [
    { id: 99, name: `${activeCity}限定帆布袋`, desc: "城市主题，简洁百搭", price: "¥49", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400&auto=format&fit=crop" },
    { id: 100, name: `${activeCity}纪念徽章`, desc: "金属材质，纪念设计", price: "¥29", img: "https://images.unsplash.com/photo-1618306917637-293693e50cd8?q=80&w=400&auto=format&fit=crop" },
  ];

  return (
    <View className="h-full flex flex-col bg-[#FDFCF8] overflow-hidden pb-20 text-[#1A1A1A] relative z-0">
      <View className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
        <View className="absolute top--10% right--10% w-60% h-40% rounded-full bg-[#7BBF9E]/20 blur-[90px]" />
        <View className="absolute bottom-10% left--20% w-80% h-60% rounded-full bg-[#F5E6C8]/30 blur-[100px]" />
      </View>

      <View className="p-4 border-b border-[#7BBF9E]/10 z-10 bg-white/60 relative flex-shrink-0">
        <View className="flex items-center border border-white rounded-2xl px-4 py-2.5 bg-white/80">
          <SearchIcon className="w-5 h-5 text-[#4A8C6F] mr-3 shrink-0" />
          <Input
            className="flex-1 bg-transparent text-[#1A1A1A] font-medium min-w-0"
            placeholder="搜索文创产品..."
            value={searchQuery}
            onInput={e => setSearchQuery(e.detail.value)}
          />
        </View>
      </View>

      <View className="flex flex-1 overflow-hidden relative z-10 min-h-0">
        <ScrollView scrollY className="w-[168rpx] flex-shrink-0 border-r border-[#7BBF9E]/10 bg-white/40 h-full">
          {CITIES.map(city => (
            <View
              key={city}
              className={`py-4 relative text-center ${activeCity === city ? "text-[#4A8C6F] font-extrabold bg-gradient-to-r from-transparent to-[#7BBF9E]/10" : "text-[#1A1A1A]/60 font-bold"}`}
              onClick={() => setActiveCity(city)}
            >
              {activeCity === city && (
                <View className="absolute left-0 top-1/4 bottom-1/4 w-1.5 bg-gradient-to-b from-[#4A8C6F] to-[#7BBF9E] rounded-r-md" />
              )}
              <Text className="text-xs px-1">{city}</Text>
            </View>
          ))}
        </ScrollView>

        <ScrollView scrollY className="flex-1 min-w-0 h-full">
          <View className="p-4 space-y-4 pb-24">
            <Text className="font-extrabold text-xl text-[#4A8C6F] block mb-4">
              {activeCity}
              {" "}
              推荐文创
            </Text>
            {currentProducts.map(product => (
              <View key={product.id} className="rounded-2xl bg-white border border-white shadow-[0_8px_20px_rgba(74,140,111,0.06)] overflow-hidden">
                <Image className="w-full h-[280rpx]" src={product.img} mode="aspectFill" />
                <View className="p-4">
                  <Text className="font-extrabold text-[15px] text-[#1A1A1A] block truncate">{product.name}</Text>
                  <Text className="text-[13px] text-[#1A1A1A]/60 line-clamp-2 mt-1">{product.desc}</Text>
                  <View className="flex items-center justify-between mt-3">
                    <Text className="font-black text-xl text-[#C8963E]">{product.price}</Text>
                    <View className="bg-gradient-to-r from-[#4A8C6F] to-[#7BBF9E] text-white px-4 py-1.5 text-xs font-extrabold rounded-full">
                      购买
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
