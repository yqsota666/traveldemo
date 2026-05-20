package com.travel.admin.rbac;

import com.travel.admin.rbac.model.AdminUserRecord;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class AdminUserRepository {

    private static final RowMapper<AdminUserRecord> ROW_MAPPER = (rs, rowNum) -> {
        AdminUserRecord record = new AdminUserRecord();
        record.setId(rs.getLong("id"));
        record.setUsername(rs.getString("username"));
        record.setPasswordHash(rs.getString("password_hash"));
        record.setRealName(rs.getString("real_name"));
        record.setPhone(rs.getString("phone"));
        record.setStatus(rs.getString("status"));
        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            record.setCreatedAt(createdAt.toLocalDateTime());
        }
        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            record.setUpdatedAt(updatedAt.toLocalDateTime());
        }
        Timestamp lastLoginAt = rs.getTimestamp("last_login_at");
        if (lastLoginAt != null) {
            record.setLastLoginAt(lastLoginAt.toLocalDateTime());
        }
        return record;
    };

    private final JdbcTemplate jdbcTemplate;

    public AdminUserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<AdminUserRecord> findByUsername(String username) {
        List<AdminUserRecord> list = jdbcTemplate.query(
                "SELECT * FROM admin_user WHERE username = ?",
                ROW_MAPPER,
                username
        );
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    public Optional<AdminUserRecord> findById(Long id) {
        List<AdminUserRecord> list = jdbcTemplate.query(
                "SELECT * FROM admin_user WHERE id = ?",
                ROW_MAPPER,
                id
        );
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    public List<String> findRoleCodesByUserId(Long userId) {
        return jdbcTemplate.queryForList(
                "SELECT r.role_code FROM admin_role r " +
                        "INNER JOIN admin_user_role ur ON ur.admin_role_id = r.id " +
                        "WHERE ur.admin_user_id = ?",
                String.class,
                userId
        );
    }

    public List<String> findPermissionCodesByUserId(Long userId) {
        return jdbcTemplate.queryForList(
                "SELECT DISTINCT p.permission_code FROM admin_permission p " +
                        "INNER JOIN admin_role_permission rp ON rp.admin_permission_id = p.id " +
                        "INNER JOIN admin_user_role ur ON ur.admin_role_id = rp.admin_role_id " +
                        "WHERE ur.admin_user_id = ?",
                String.class,
                userId
        );
    }

    public void updateLastLogin(Long userId) {
        jdbcTemplate.update(
                "UPDATE admin_user SET last_login_at = ? WHERE id = ?",
                Timestamp.valueOf(LocalDateTime.now()),
                userId
        );
    }

    public void updatePassword(Long userId, String passwordHash) {
        jdbcTemplate.update(
                "UPDATE admin_user SET password_hash = ?, updated_at = ? WHERE id = ?",
                passwordHash,
                Timestamp.valueOf(LocalDateTime.now()),
                userId
        );
    }

    public long countAdmins(String keyword, String roleCode) {
        StringBuilder sql = new StringBuilder(
                "SELECT COUNT(DISTINCT u.id) FROM admin_user u " +
                        "LEFT JOIN admin_user_role ur ON ur.admin_user_id = u.id " +
                        "LEFT JOIN admin_role r ON r.id = ur.admin_role_id WHERE 1=1"
        );
        java.util.List<Object> params = new java.util.ArrayList<>();
        if (keyword != null && !keyword.isBlank()) {
            sql.append(" AND (u.username LIKE ? OR u.real_name LIKE ?)");
            String like = "%" + keyword.trim() + "%";
            params.add(like);
            params.add(like);
        }
        if (roleCode != null && !roleCode.isBlank()) {
            sql.append(" AND r.role_code = ?");
            params.add(roleCode);
        }
        Long count = jdbcTemplate.queryForObject(sql.toString(), Long.class, params.toArray());
        return count == null ? 0 : count;
    }

    public List<AdminUserRecord> listAdmins(String keyword, String roleCode, int offset, int limit) {
        StringBuilder sql = new StringBuilder(
                "SELECT DISTINCT u.* FROM admin_user u " +
                        "LEFT JOIN admin_user_role ur ON ur.admin_user_id = u.id " +
                        "LEFT JOIN admin_role r ON r.id = ur.admin_role_id WHERE 1=1"
        );
        java.util.List<Object> params = new java.util.ArrayList<>();
        if (keyword != null && !keyword.isBlank()) {
            sql.append(" AND (u.username LIKE ? OR u.real_name LIKE ?)");
            String like = "%" + keyword.trim() + "%";
            params.add(like);
            params.add(like);
        }
        if (roleCode != null && !roleCode.isBlank()) {
            sql.append(" AND r.role_code = ?");
            params.add(roleCode);
        }
        sql.append(" ORDER BY u.id DESC LIMIT ? OFFSET ?");
        params.add(limit);
        params.add(offset);
        return jdbcTemplate.query(sql.toString(), ROW_MAPPER, params.toArray());
    }

    public Long insert(AdminUserRecord user) {
        GeneratedKeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO admin_user (username, password_hash, real_name, phone, status) VALUES (?,?,?,?,?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, user.getUsername());
            ps.setString(2, user.getPasswordHash());
            ps.setString(3, user.getRealName());
            ps.setString(4, user.getPhone());
            ps.setString(5, user.getStatus());
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        return key == null ? null : key.longValue();
    }

    public void update(AdminUserRecord user) {
        jdbcTemplate.update(
                "UPDATE admin_user SET real_name = ?, phone = ?, status = ?, updated_at = ? WHERE id = ?",
                user.getRealName(),
                user.getPhone(),
                user.getStatus(),
                Timestamp.valueOf(LocalDateTime.now()),
                user.getId()
        );
    }

    public void assignRole(Long userId, Long roleId) {
        jdbcTemplate.update(
                "INSERT IGNORE INTO admin_user_role (admin_user_id, admin_role_id) VALUES (?,?)",
                userId,
                roleId
        );
    }

    public void clearRoles(Long userId) {
        jdbcTemplate.update("DELETE FROM admin_user_role WHERE admin_user_id = ?", userId);
    }

    public Optional<Long> findRoleIdByCode(String roleCode) {
        List<Long> ids = jdbcTemplate.queryForList(
                "SELECT id FROM admin_role WHERE role_code = ?",
                Long.class,
                roleCode
        );
        return ids.isEmpty() ? Optional.empty() : Optional.of(ids.get(0));
    }
}
