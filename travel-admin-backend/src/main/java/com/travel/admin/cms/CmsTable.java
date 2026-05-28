package com.travel.admin.cms;

public enum CmsTable {
    CITY("cms_city", "CITY", true),
    BANNER("cms_banner", "BANNER", true),
    SCENIC("cms_scenic", "SCENIC", true),
    HOTEL("cms_hotel", "HOTEL", true),
    CAR_RENTAL("cms_car_rental", "CAR_RENTAL", true),
    PRODUCT("cms_product", "PRODUCT", true),
    GUIDE("cms_guide", "GUIDE", true),
    MEDIA_CASE("cms_media_case", "MEDIA_CASE", true),
    TRIP_REMINDER("cms_trip_reminder", "TRIP_REMINDER", true),
    ABOUT_COMPANY("cms_about_company", "ABOUT_COMPANY", false),
    CONSULTATION("cms_consultation_config", "CONSULTATION", false);

    private final String tableName;
    private final String contentType;
    private final boolean listable;

    CmsTable(String tableName, String contentType, boolean listable) {
        this.tableName = tableName;
        this.contentType = contentType;
        this.listable = listable;
    }

    public String getTableName() {
        return tableName;
    }

    public String getContentType() {
        return contentType;
    }

    public boolean isListable() {
        return listable;
    }

    public static CmsTable fromPath(String path) {
        return CmsTable.valueOf(path.toUpperCase().replace('-', '_'));
    }
}
