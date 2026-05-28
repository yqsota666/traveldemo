package com.travel.admin.cms.internal;

import com.travel.admin.cms.CmsConstants;
import com.travel.admin.cms.CmsRepository;
import com.travel.admin.cms.CmsTable;
import com.travel.admin.common.BusinessException;
import com.travel.admin.common.PageResult;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CmsInternalReadService {

    private final CmsRepository cmsRepository;
    private final JdbcTemplate jdbcTemplate;

    public CmsInternalReadService(CmsRepository cmsRepository, JdbcTemplate jdbcTemplate) {
        this.cmsRepository = cmsRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public PageResult<Map<String, Object>> list(CmsTable table, int page, int pageSize,
                                                Long cityId, String keyword, Boolean recommended,
                                                String caseType) {
        int offset = (page - 1) * pageSize;
        long total = countPublished(table, cityId, keyword, recommended, caseType);
        List<Map<String, Object>> rows = listPublished(table, cityId, keyword, recommended, caseType, offset, pageSize);
        return new PageResult<>(CmsPublicViewMapper.toPublicViews(rows), total, page, pageSize);
    }

    public Map<String, Object> detail(CmsTable table, Long id) {
        Map<String, Object> row = cmsRepository.findById(table, id)
                .orElseThrow(() -> new BusinessException(404, "内容不存在"));
        if (!CmsConstants.STATUS_PUBLISHED.equals(String.valueOf(row.get("publish_status")))) {
            throw new BusinessException(404, "内容未发布");
        }
        return CmsPublicViewMapper.toPublicView(row);
    }

    public Map<String, Object> aboutCompany() {
        Map<String, Object> row = cmsRepository.getSingleton(CmsTable.ABOUT_COMPANY);
        if (!CmsConstants.STATUS_PUBLISHED.equals(String.valueOf(row.get("publish_status")))) {
            return new java.util.LinkedHashMap<>();
        }
        return CmsPublicViewMapper.toPublicView(row);
    }

    public Map<String, Object> consultation() {
        Map<String, Object> row = cmsRepository.getSingleton(CmsTable.CONSULTATION);
        if (!CmsConstants.STATUS_PUBLISHED.equals(String.valueOf(row.get("publish_status")))) {
            return new java.util.LinkedHashMap<>();
        }
        return CmsPublicViewMapper.toPublicView(row);
    }

    public Optional<Map<String, Object>> findCityByName(String name) {
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT * FROM cms_city WHERE deleted_flag = 0 AND publish_status = ? AND name = ? LIMIT 1",
                CmsConstants.STATUS_PUBLISHED, name
        );
        return rows.isEmpty() ? Optional.empty() : Optional.of(CmsPublicViewMapper.toPublicView(rows.get(0)));
    }

    private long countPublished(CmsTable table, Long cityId, String keyword, Boolean recommended, String caseType) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM ").append(table.getTableName())
                .append(" t WHERE t.deleted_flag = 0 AND t.publish_status = ?");
        List<Object> params = new java.util.ArrayList<>();
        params.add(CmsConstants.STATUS_PUBLISHED);
        appendExtraFilters(sql, params, table, cityId, keyword, recommended, caseType);
        Long c = jdbcTemplate.queryForObject(sql.toString(), Long.class, params.toArray());
        return c == null ? 0 : c;
    }

    private List<Map<String, Object>> listPublished(CmsTable table, Long cityId, String keyword,
                                                    Boolean recommended, String caseType,
                                                    int offset, int limit) {
        StringBuilder sql = new StringBuilder("SELECT t.*");
        if (hasCityJoin(table)) {
            sql.append(", c.name AS city_name");
        }
        sql.append(" FROM ").append(table.getTableName()).append(" t ");
        if (hasCityJoin(table)) {
            sql.append("LEFT JOIN cms_city c ON c.id = t.city_id ");
        }
        sql.append("WHERE t.deleted_flag = 0 AND t.publish_status = ?");
        List<Object> params = new java.util.ArrayList<>();
        params.add(CmsConstants.STATUS_PUBLISHED);
        appendExtraFilters(sql, params, table, cityId, keyword, recommended, caseType);
        sql.append(" ORDER BY t.sort_order ASC, t.id DESC LIMIT ? OFFSET ?");
        params.add(limit);
        params.add(offset);
        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

    private void appendExtraFilters(StringBuilder sql, List<Object> params, CmsTable table,
                                    Long cityId, String keyword, Boolean recommended, String caseType) {
        if (cityId != null && hasCityJoin(table)) {
            sql.append(" AND t.city_id = ?");
            params.add(cityId);
        }
        if (keyword != null && !keyword.isBlank()) {
            String like = "%" + keyword.trim() + "%";
            if (table == CmsTable.GUIDE || table == CmsTable.CITY) {
                sql.append(" AND t.name LIKE ?");
            } else {
                sql.append(" AND t.title LIKE ?");
            }
            params.add(like);
        }
        if (Boolean.TRUE.equals(recommended) && (table == CmsTable.SCENIC || table == CmsTable.PRODUCT)) {
            sql.append(" AND t.home_recommended = 1");
        }
        if (caseType != null && !caseType.isBlank() && table == CmsTable.MEDIA_CASE) {
            sql.append(" AND t.case_type = ?");
            params.add(caseType.trim());
        }
    }

    private boolean hasCityJoin(CmsTable table) {
        return table != CmsTable.CITY && table != CmsTable.ABOUT_COMPANY && table != CmsTable.CONSULTATION;
    }
}
