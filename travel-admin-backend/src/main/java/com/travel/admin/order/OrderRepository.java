package com.travel.admin.order;

import com.travel.admin.order.model.OrderDeleteRequestRecord;
import com.travel.admin.order.model.TravelOrderRecord;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class OrderRepository {

    private static final RowMapper<TravelOrderRecord> ORDER_MAPPER = (rs, rowNum) -> mapOrder(rs);

    private static TravelOrderRecord mapOrder(java.sql.ResultSet rs) throws java.sql.SQLException {
        TravelOrderRecord record = new TravelOrderRecord();
        record.setId(rs.getLong("id"));
        record.setOrderNo(rs.getString("order_no"));
        record.setCustomerName(rs.getString("customer_name"));
        record.setCustomerPhone(rs.getString("customer_phone"));
        record.setDestinationCity(rs.getString("destination_city"));
        Date travelDate = rs.getDate("travel_date");
        if (travelDate != null) {
            record.setTravelDate(travelDate.toLocalDate());
        }
        record.setTravelerCount(rs.getInt("traveler_count"));
        record.setTotalAmount(rs.getBigDecimal("total_amount"));
        record.setOrderStatus(rs.getString("order_status"));
        record.setSalesAdminUserId(rs.getLong("sales_admin_user_id"));
        record.setCreatedByAdminUserId(rs.getLong("created_by_admin_user_id"));
        record.setDeletedFlag(rs.getInt("deleted_flag"));
        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            record.setCreatedAt(createdAt.toLocalDateTime());
        }
        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            record.setUpdatedAt(updatedAt.toLocalDateTime());
        }
        try {
            record.setSalesAdminName(rs.getString("sales_admin_name"));
            record.setCreatedByName(rs.getString("created_by_name"));
        } catch (java.sql.SQLException ignored) {
        }
        return record;
    }

    private final JdbcTemplate jdbcTemplate;

    public OrderRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<TravelOrderRecord> findById(Long id) {
        List<TravelOrderRecord> list = jdbcTemplate.query(
                "SELECT o.*, s.real_name AS sales_admin_name, c.real_name AS created_by_name " +
                        "FROM travel_order o " +
                        "LEFT JOIN admin_user s ON s.id = o.sales_admin_user_id " +
                        "LEFT JOIN admin_user c ON c.id = o.created_by_admin_user_id " +
                        "WHERE o.id = ? AND o.deleted_flag = 0",
                ORDER_MAPPER,
                id
        );
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    public long countOrders(Long salesUserId, String keyword, String status) {
        StringBuilder sql = new StringBuilder(
                "SELECT COUNT(*) FROM travel_order o WHERE o.deleted_flag = 0"
        );
        List<Object> params = buildOrderFilters(sql, salesUserId, keyword, status);
        Long count = jdbcTemplate.queryForObject(sql.toString(), Long.class, params.toArray());
        return count == null ? 0 : count;
    }

    public List<TravelOrderRecord> listOrders(Long salesUserId, String keyword, String status, int offset, int limit) {
        StringBuilder sql = new StringBuilder(
                "SELECT o.*, s.real_name AS sales_admin_name, c.real_name AS created_by_name " +
                        "FROM travel_order o " +
                        "LEFT JOIN admin_user s ON s.id = o.sales_admin_user_id " +
                        "LEFT JOIN admin_user c ON c.id = o.created_by_admin_user_id " +
                        "WHERE o.deleted_flag = 0"
        );
        List<Object> params = buildOrderFilters(sql, salesUserId, keyword, status);
        sql.append(" ORDER BY o.id DESC LIMIT ? OFFSET ?");
        params.add(limit);
        params.add(offset);
        return jdbcTemplate.query(sql.toString(), ORDER_MAPPER, params.toArray());
    }

    private List<Object> buildOrderFilters(StringBuilder sql, Long salesUserId, String keyword, String status) {
        List<Object> params = new ArrayList<>();
        if (salesUserId != null) {
            sql.append(" AND o.sales_admin_user_id = ?");
            params.add(salesUserId);
        }
        if (keyword != null && !keyword.isBlank()) {
            sql.append(" AND (o.order_no LIKE ? OR o.customer_name LIKE ? OR o.destination_city LIKE ?)");
            String like = "%" + keyword.trim() + "%";
            params.add(like);
            params.add(like);
            params.add(like);
        }
        if (status != null && !status.isBlank()) {
            sql.append(" AND o.order_status = ?");
            params.add(status);
        }
        return params;
    }

    public Long insert(TravelOrderRecord order) {
        GeneratedKeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO travel_order (order_no, customer_name, customer_phone, destination_city, travel_date, " +
                            "traveler_count, total_amount, order_status, sales_admin_user_id, created_by_admin_user_id) " +
                            "VALUES (?,?,?,?,?,?,?,?,?,?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, order.getOrderNo());
            ps.setString(2, order.getCustomerName());
            ps.setString(3, order.getCustomerPhone());
            ps.setString(4, order.getDestinationCity());
            ps.setDate(5, Date.valueOf(order.getTravelDate()));
            ps.setInt(6, order.getTravelerCount());
            ps.setBigDecimal(7, order.getTotalAmount());
            ps.setString(8, order.getOrderStatus());
            ps.setLong(9, order.getSalesAdminUserId());
            ps.setLong(10, order.getCreatedByAdminUserId());
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        return key == null ? null : key.longValue();
    }

    public void update(TravelOrderRecord order) {
        jdbcTemplate.update(
                "UPDATE travel_order SET customer_name=?, customer_phone=?, destination_city=?, travel_date=?, " +
                        "traveler_count=?, total_amount=?, order_status=?, updated_at=? WHERE id=? AND deleted_flag=0",
                order.getCustomerName(),
                order.getCustomerPhone(),
                order.getDestinationCity(),
                Date.valueOf(order.getTravelDate()),
                order.getTravelerCount(),
                order.getTotalAmount(),
                order.getOrderStatus(),
                Timestamp.valueOf(LocalDateTime.now()),
                order.getId()
        );
    }

    public void softDelete(Long orderId) {
        jdbcTemplate.update(
                "UPDATE travel_order SET deleted_flag = 1, updated_at = ? WHERE id = ?",
                Timestamp.valueOf(LocalDateTime.now()),
                orderId
        );
    }

    public boolean hasPendingDeleteRequest(Long orderId) {
        Long count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM order_delete_request WHERE order_id = ? AND request_status = 'PENDING'",
                Long.class,
                orderId
        );
        return count != null && count > 0;
    }

    public Long createDeleteRequest(Long orderId, Long requesterId, String reason) {
        GeneratedKeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO order_delete_request (order_id, requested_by_admin_user_id, reason, request_status) VALUES (?,?,?,?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setLong(1, orderId);
            ps.setLong(2, requesterId);
            ps.setString(3, reason);
            ps.setString(4, "PENDING");
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        return key == null ? null : key.longValue();
    }

    public Optional<OrderDeleteRequestRecord> findDeleteRequestById(Long id) {
        List<OrderDeleteRequestRecord> list = jdbcTemplate.query(
                "SELECT dr.*, o.order_no, o.customer_name, req.real_name AS requested_by_name, app.real_name AS approver_name " +
                        "FROM order_delete_request dr " +
                        "INNER JOIN travel_order o ON o.id = dr.order_id " +
                        "LEFT JOIN admin_user req ON req.id = dr.requested_by_admin_user_id " +
                        "LEFT JOIN admin_user app ON app.id = dr.approver_admin_user_id " +
                        "WHERE dr.id = ?",
                deleteRequestMapper(),
                id
        );
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    public long countDeleteRequests(String status) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM order_delete_request dr WHERE 1=1");
        List<Object> params = new ArrayList<>();
        if (status != null && !status.isBlank()) {
            sql.append(" AND dr.request_status = ?");
            params.add(status);
        }
        Long count = jdbcTemplate.queryForObject(sql.toString(), Long.class, params.toArray());
        return count == null ? 0 : count;
    }

    public List<OrderDeleteRequestRecord> listDeleteRequests(String status, int offset, int limit) {
        StringBuilder sql = new StringBuilder(
                "SELECT dr.*, o.order_no, o.customer_name, req.real_name AS requested_by_name, app.real_name AS approver_name " +
                        "FROM order_delete_request dr " +
                        "INNER JOIN travel_order o ON o.id = dr.order_id " +
                        "LEFT JOIN admin_user req ON req.id = dr.requested_by_admin_user_id " +
                        "LEFT JOIN admin_user app ON app.id = dr.approver_admin_user_id WHERE 1=1"
        );
        List<Object> params = new ArrayList<>();
        if (status != null && !status.isBlank()) {
            sql.append(" AND dr.request_status = ?");
            params.add(status);
        }
        sql.append(" ORDER BY dr.id DESC LIMIT ? OFFSET ?");
        params.add(limit);
        params.add(offset);
        return jdbcTemplate.query(sql.toString(), deleteRequestMapper(), params.toArray());
    }

    public void processDeleteRequest(Long requestId, Long approverId, String status) {
        jdbcTemplate.update(
                "UPDATE order_delete_request SET request_status = ?, approver_admin_user_id = ?, processed_at = ? WHERE id = ?",
                status,
                approverId,
                Timestamp.valueOf(LocalDateTime.now()),
                requestId
        );
    }

    public List<java.util.Map<String, Object>> listOrderLogs(Long orderId) {
        return jdbcTemplate.queryForList(
                "SELECT l.*, u.real_name AS operator_name FROM order_operation_log l " +
                        "LEFT JOIN admin_user u ON u.id = l.operator_admin_user_id " +
                        "WHERE l.order_id = ? ORDER BY l.id DESC",
                orderId
        );
    }

    public long countDashboardOrders(Long salesUserId) {
        String sql = "SELECT COUNT(*) FROM travel_order WHERE deleted_flag = 0";
        if (salesUserId != null) {
            Long count = jdbcTemplate.queryForObject(sql + " AND sales_admin_user_id = ?", Long.class, salesUserId);
            return count == null ? 0 : count;
        }
        Long count = jdbcTemplate.queryForObject(sql, Long.class);
        return count == null ? 0 : count;
    }

    public long countPendingDeleteRequests() {
        Long count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM order_delete_request WHERE request_status = 'PENDING'",
                Long.class
        );
        return count == null ? 0 : count;
    }

    private RowMapper<OrderDeleteRequestRecord> deleteRequestMapper() {
        return (rs, rowNum) -> {
            OrderDeleteRequestRecord record = new OrderDeleteRequestRecord();
            record.setId(rs.getLong("id"));
            record.setOrderId(rs.getLong("order_id"));
            record.setOrderNo(rs.getString("order_no"));
            record.setCustomerName(rs.getString("customer_name"));
            record.setRequestedByAdminUserId(rs.getLong("requested_by_admin_user_id"));
            record.setRequestedByName(rs.getString("requested_by_name"));
            long approverId = rs.getLong("approver_admin_user_id");
            if (!rs.wasNull()) {
                record.setApproverAdminUserId(approverId);
            }
            record.setApproverName(rs.getString("approver_name"));
            record.setReason(rs.getString("reason"));
            record.setRequestStatus(rs.getString("request_status"));
            Timestamp createdAt = rs.getTimestamp("created_at");
            if (createdAt != null) {
                record.setCreatedAt(createdAt.toLocalDateTime());
            }
            Timestamp processedAt = rs.getTimestamp("processed_at");
            if (processedAt != null) {
                record.setProcessedAt(processedAt.toLocalDateTime());
            }
            return record;
        };
    }
}
