package com.travel.admin.cms;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class CmsRepository {

    private final JdbcTemplate jdbcTemplate;

    public CmsRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public long count(CmsTable table, Long cityId, String keyword, String publishStatus, Long operatorId) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM ").append(table.getTableName())
                .append(" WHERE deleted_flag = 0");
        List<Object> params = buildFilters(sql, table, cityId, keyword, publishStatus, operatorId);
        Long c = jdbcTemplate.queryForObject(sql.toString(), Long.class, params.toArray());
        return c == null ? 0 : c;
    }

    public List<Map<String, Object>> list(CmsTable table, Long cityId, String keyword, String publishStatus,
                                          Long operatorId, int offset, int limit) {
        StringBuilder sql = new StringBuilder("SELECT t.*");
        if (hasCityIdColumn(table)) {
            sql.append(", c.name AS city_name");
        }
        sql.append(", cb.real_name AS created_by_name, ub.real_name AS updated_by_name ")
                .append("FROM ").append(table.getTableName()).append(" t ");
        if (hasCityIdColumn(table)) {
            sql.append("LEFT JOIN cms_city c ON c.id = t.city_id ");
        }
        sql.append("LEFT JOIN admin_user cb ON cb.id = t.created_by_admin_user_id ")
                .append("LEFT JOIN admin_user ub ON ub.id = t.updated_by_admin_user_id ")
                .append("WHERE t.deleted_flag = 0");
        List<Object> params = buildFilters(sql, table, cityId, keyword, publishStatus, operatorId);
        sql.append(" ORDER BY t.sort_order ASC, t.id DESC LIMIT ? OFFSET ?");
        params.add(limit);
        params.add(offset);
        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

    private List<Object> buildFilters(StringBuilder sql, CmsTable table, Long cityId, String keyword,
                                      String publishStatus, Long operatorId) {
        List<Object> params = new ArrayList<>();
        if (cityId != null && hasCityIdColumn(table)) {
            sql.append(" AND t.city_id = ?");
            params.add(cityId);
        }
        if (publishStatus != null && !publishStatus.isBlank()) {
            sql.append(" AND t.publish_status = ?");
            params.add(publishStatus.trim());
        }
        if (operatorId != null) {
            sql.append(" AND t.created_by_admin_user_id = ?");
            params.add(operatorId);
        }
        if (keyword != null && !keyword.isBlank()) {
            String like = "%" + keyword.trim() + "%";
            if (table == CmsTable.GUIDE || table == CmsTable.CITY) {
                sql.append(" AND (t.name LIKE ?)");
                params.add(like);
            } else {
                sql.append(" AND (t.title LIKE ?)");
                params.add(like);
            }
        }
        return params;
    }

    private boolean hasCityIdColumn(CmsTable table) {
        return table != CmsTable.CITY && table != CmsTable.ABOUT_COMPANY && table != CmsTable.CONSULTATION;
    }

    public Optional<Map<String, Object>> findById(CmsTable table, Long id) {
        List<Map<String, Object>> rows;
        if (table == CmsTable.ABOUT_COMPANY || table == CmsTable.CONSULTATION) {
            rows = jdbcTemplate.queryForList(
                    "SELECT * FROM " + table.getTableName() + " WHERE id = ?", id
            );
        } else if (table == CmsTable.CITY) {
            rows = jdbcTemplate.queryForList(
                    "SELECT * FROM " + table.getTableName() + " WHERE id = ? AND deleted_flag = 0", id
            );
        } else {
            rows = jdbcTemplate.queryForList(
                    "SELECT t.*, c.name AS city_name FROM " + table.getTableName() + " t " +
                            "LEFT JOIN cms_city c ON c.id = t.city_id WHERE t.id = ? AND t.deleted_flag = 0",
                    id
            );
        }
        return rows.isEmpty() ? Optional.empty() : Optional.of(rows.get(0));
    }

    public Long insert(CmsTable table, Map<String, Object> data) {
        List<String> cols = new ArrayList<>();
        List<Object> vals = new ArrayList<>();
        for (Map.Entry<String, Object> e : data.entrySet()) {
            if (e.getValue() != null && !"id".equals(e.getKey())) {
                cols.add(camelToSnake(e.getKey()));
                vals.add(e.getValue());
            }
        }
        String sql = "INSERT INTO " + table.getTableName() + " (" +
                String.join(",", cols) + ") VALUES (" +
                String.join(",", cols.stream().map(c -> "?").toArray(String[]::new)) + ")";
        GeneratedKeyHolder kh = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            for (int i = 0; i < vals.size(); i++) {
                ps.setObject(i + 1, vals.get(i));
            }
            return ps;
        }, kh);
        Number key = kh.getKey();
        return key == null ? null : key.longValue();
    }

    public void update(CmsTable table, Long id, Map<String, Object> data) {
        List<String> sets = new ArrayList<>();
        List<Object> vals = new ArrayList<>();
        for (Map.Entry<String, Object> e : data.entrySet()) {
            if (e.getValue() != null && !"id".equals(e.getKey())) {
                sets.add(camelToSnake(e.getKey()) + " = ?");
                vals.add(e.getValue());
            }
        }
        sets.add("updated_at = ?");
        vals.add(Timestamp.valueOf(LocalDateTime.now()));
        vals.add(id);
        String sql = "UPDATE " + table.getTableName() + " SET " + String.join(", ", sets) + " WHERE id = ?";
        if (table != CmsTable.ABOUT_COMPANY && table != CmsTable.CONSULTATION) {
            sql += " AND deleted_flag = 0";
        }
        jdbcTemplate.update(sql, vals.toArray());
    }

    public void softDelete(CmsTable table, Long id) {
        jdbcTemplate.update(
                "UPDATE " + table.getTableName() + " SET deleted_flag = 1, updated_at = ? WHERE id = ?",
                Timestamp.valueOf(LocalDateTime.now()), id
        );
    }

    public void batchSoftDelete(CmsTable table, List<Long> ids) {
        if (ids == null || ids.isEmpty()) return;
        String placeholders = String.join(",", ids.stream().map(i -> "?").toArray(String[]::new));
        List<Object> params = new ArrayList<>();
        params.add(Timestamp.valueOf(LocalDateTime.now()));
        params.addAll(ids);
        jdbcTemplate.update(
                "UPDATE " + table.getTableName() + " SET deleted_flag = 1, updated_at = ? WHERE id IN (" + placeholders + ")",
                params.toArray()
        );
    }

    public void updatePublishStatus(CmsTable table, Long id, String status, Long approverId) {
        if (CmsConstants.STATUS_PUBLISHED.equals(status)) {
            jdbcTemplate.update(
                    "UPDATE " + table.getTableName() + " SET publish_status = ?, approved_at = ?, approved_by_admin_user_id = ?, updated_at = ? WHERE id = ?",
                    status, Timestamp.valueOf(LocalDateTime.now()), approverId, Timestamp.valueOf(LocalDateTime.now()), id
            );
        } else {
            jdbcTemplate.update(
                    "UPDATE " + table.getTableName() + " SET publish_status = ?, updated_at = ? WHERE id = ?",
                    status, Timestamp.valueOf(LocalDateTime.now()), id
            );
        }
    }

    public void batchUpdatePublishStatus(CmsTable table, List<Long> ids, String status) {
        if (ids == null || ids.isEmpty()) return;
        String placeholders = String.join(",", ids.stream().map(i -> "?").toArray(String[]::new));
        List<Object> params = new ArrayList<>();
        params.add(status);
        params.add(Timestamp.valueOf(LocalDateTime.now()));
        params.addAll(ids);
        jdbcTemplate.update(
                "UPDATE " + table.getTableName() + " SET publish_status = ?, updated_at = ? WHERE id IN (" + placeholders + ")",
                params.toArray()
        );
    }

    public void updateSortOrders(CmsTable table, List<Map<String, Object>> items) {
        for (Map<String, Object> item : items) {
            Long id = ((Number) item.get("id")).longValue();
            Integer sort = ((Number) item.get("sortOrder")).intValue();
            jdbcTemplate.update(
                    "UPDATE " + table.getTableName() + " SET sort_order = ?, updated_at = ? WHERE id = ? AND deleted_flag = 0",
                    sort, Timestamp.valueOf(LocalDateTime.now()), id
            );
        }
    }

    public void insertApprovalLog(String contentType, Long contentId, String action, String fromStatus,
                                 String toStatus, String comment, Long operatorId) {
        jdbcTemplate.update(
                "INSERT INTO cms_approval_log (content_type, content_id, action, from_status, to_status, comment, operator_admin_user_id) VALUES (?,?,?,?,?,?,?)",
                contentType, contentId, action, fromStatus, toStatus, comment, operatorId
        );
    }

    public List<Map<String, Object>> listApprovalLogs(String contentType, Long contentId) {
        return jdbcTemplate.queryForList(
                "SELECT l.*, u.real_name AS operator_name FROM cms_approval_log l " +
                        "LEFT JOIN admin_user u ON u.id = l.operator_admin_user_id " +
                        "WHERE l.content_type = ? AND l.content_id = ? ORDER BY l.id DESC",
                contentType, contentId
        );
    }

    public List<Map<String, Object>> listCitiesAll() {
        return jdbcTemplate.queryForList(
                "SELECT id, name, display_no FROM cms_city WHERE deleted_flag = 0 ORDER BY sort_order ASC, id ASC"
        );
    }

    public Map<String, Object> getSingleton(CmsTable table) {
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT * FROM " + table.getTableName() + " WHERE id = 1"
        );
        if (rows.isEmpty()) {
            Map<String, Object> empty = new LinkedHashMap<>();
            empty.put("id", 1L);
            empty.put("publishStatus", CmsConstants.STATUS_DRAFT);
            return empty;
        }
        return rows.get(0);
    }

    public void upsertSingleton(CmsTable table, Map<String, Object> data) {
        Map<String, Object> existing = getSingleton(table);
        if (existing.size() <= 2) {
            data.put("id", 1L);
            insert(table, data);
        } else {
            update(table, 1L, data);
        }
    }

    private String camelToSnake(String key) {
        return key.replaceAll("([a-z])([A-Z])", "$1_$2").toLowerCase();
    }
}
