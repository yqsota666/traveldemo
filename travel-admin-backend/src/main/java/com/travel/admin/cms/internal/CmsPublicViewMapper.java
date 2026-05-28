package com.travel.admin.cms.internal;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public final class CmsPublicViewMapper {

    private CmsPublicViewMapper() {
    }

    public static Map<String, Object> toPublicView(Map<String, Object> row) {
        if (row == null) {
            return new LinkedHashMap<>();
        }
        Map<String, Object> out = new LinkedHashMap<>();
        put(out, row, "id");
        put(out, row, "city_id", "cityId");
        put(out, row, "city_name", "cityName");
        put(out, row, "name");
        put(out, row, "title");
        put(out, row, "display_no", "displayNo");
        put(out, row, "summary");
        put(out, row, "cover_image", "coverImage");
        put(out, row, "image_url", "imageUrl");
        put(out, row, "logo_url", "logoUrl");
        put(out, row, "gallery_images", "galleryImages");
        put(out, row, "tags");
        put(out, row, "address");
        put(out, row, "price_label", "priceLabel");
        put(out, row, "price");
        put(out, row, "external_link", "externalLink");
        put(out, row, "notice");
        put(out, row, "home_recommended", "homeRecommended");
        put(out, row, "sort_order", "sortOrder");
        put(out, row, "case_type", "caseType");
        put(out, row, "weather_hint", "weatherHint");
        put(out, row, "content");
        put(out, row, "avatar_url", "avatarUrl");
        put(out, row, "years_experience", "yearsExperience");
        put(out, row, "intro");
        put(out, row, "quote_text", "quoteText");
        put(out, row, "long_text", "longText");
        put(out, row, "contact_phone", "contactPhone");
        put(out, row, "button_text", "buttonText");
        put(out, row, "qrcode_image_url", "qrcodeImageUrl");
        put(out, row, "enabled");
        return out;
    }

    public static List<Map<String, Object>> toPublicViews(List<Map<String, Object>> rows) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Map<String, Object> row : rows) {
            list.add(toPublicView(row));
        }
        return list;
    }

    private static void put(Map<String, Object> out, Map<String, Object> row, String snakeKey) {
        put(out, row, snakeKey, snakeKey);
    }

    private static void put(Map<String, Object> out, Map<String, Object> row, String snakeKey, String camelKey) {
        if (row.containsKey(snakeKey) && row.get(snakeKey) != null) {
            Object val = row.get(snakeKey);
            if ("home_recommended".equals(snakeKey) || "enabled".equals(snakeKey)) {
                val = toBool(val);
            }
            out.put(camelKey, val);
        }
    }

    private static boolean toBool(Object val) {
        if (val instanceof Boolean) {
            return (Boolean) val;
        }
        if (val instanceof Number) {
            return ((Number) val).intValue() != 0;
        }
        return Boolean.parseBoolean(String.valueOf(val));
    }
}
