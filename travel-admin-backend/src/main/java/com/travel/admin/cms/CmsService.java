package com.travel.admin.cms;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.travel.admin.audit.AuditService;
import com.travel.admin.common.BusinessException;
import com.travel.admin.common.PageResult;
import com.travel.admin.security.AdminPrincipal;
import com.travel.admin.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CmsService {

    private final CmsRepository cmsRepository;
    private final AuditService auditService;
    private final ObjectMapper objectMapper;

    public CmsService(CmsRepository cmsRepository, AuditService auditService, ObjectMapper objectMapper) {
        this.cmsRepository = cmsRepository;
        this.auditService = auditService;
        this.objectMapper = objectMapper;
    }

    public PageResult<Map<String, Object>> list(CmsTable table, int page, int pageSize, Long cityId,
                                                String keyword, String publishStatus, Long operatorId) {
        assertView();
        int offset = (page - 1) * pageSize;
        long total = cmsRepository.count(table, cityId, keyword, publishStatus, operatorId);
        List<Map<String, Object>> records = cmsRepository.list(table, cityId, keyword, publishStatus, operatorId, offset, pageSize);
        return new PageResult<>(records, total, page, pageSize);
    }

    public Map<String, Object> get(CmsTable table, Long id) {
        assertView();
        return cmsRepository.findById(table, id)
                .orElseThrow(() -> new BusinessException(404, "内容不存在"));
    }

    @Transactional
    public Map<String, Object> create(CmsTable table, Map<String, Object> body) {
        assertPermission("cms:create");
        AdminPrincipal user = SecurityUtils.currentUser();
        Map<String, Object> data = normalizeBody(table, body);
        validateForCreate(table, data);
        data.put("publishStatus", CmsConstants.STATUS_DRAFT);
        data.put("createdByAdminUserId", user.getUserId());
        data.put("updatedByAdminUserId", user.getUserId());
        Long id = cmsRepository.insert(table, data);
        audit("cms", "create", table.getContentType() + "#" + id);
        return get(table, id);
    }

    @Transactional
    public Map<String, Object> update(CmsTable table, Long id, Map<String, Object> body) {
        assertPermission("cms:update");
        Map<String, Object> existing = get(table, id);
        assertEditable(existing);
        AdminPrincipal user = SecurityUtils.currentUser();
        Map<String, Object> data = normalizeBody(table, body);
        data.put("updatedByAdminUserId", user.getUserId());
        cmsRepository.update(table, id, data);
        audit("cms", "update", table.getContentType() + "#" + id);
        return get(table, id);
    }

    @Transactional
    public void delete(CmsTable table, Long id) {
        assertPermission("cms:delete");
        Map<String, Object> existing = get(table, id);
        assertEditable(existing);
        cmsRepository.softDelete(table, id);
        audit("cms", "delete", table.getContentType() + "#" + id);
    }

    @Transactional
    public void batchDelete(CmsTable table, List<Long> ids) {
        assertPermission("cms:batch");
        cmsRepository.batchSoftDelete(table, ids);
        audit("cms", "batch_delete", table.getContentType() + " ids=" + ids);
    }

    @Transactional
    public void submit(CmsTable table, Long id) {
        assertPermission("cms:submit");
        Map<String, Object> existing = get(table, id);
        String status = str(existing.get("publish_status"));
        if (!CmsConstants.STATUS_DRAFT.equals(status) && !CmsConstants.STATUS_OFFLINE.equals(status)) {
            throw new BusinessException(400, "当前状态不可提交审核");
        }
        validateForSubmit(table, existing);
        cmsRepository.update(table, id, Map.of(
                "publishStatus", CmsConstants.STATUS_PENDING,
                "submittedAt", Timestamp.valueOf(LocalDateTime.now())
        ));
        logApproval(table, id, "SUBMIT", status, CmsConstants.STATUS_PENDING, null);
        audit("cms", "submit", table.getContentType() + "#" + id);
    }

    @Transactional
    public void batchSubmit(CmsTable table, List<Long> ids) {
        assertPermission("cms:batch");
        for (Long id : ids) {
            submit(table, id);
        }
    }

    @Transactional
    public void approve(CmsTable table, Long id, String comment) {
        assertPermission("cms:approve");
        Map<String, Object> existing = get(table, id);
        String status = str(existing.get("publish_status"));
        if (!CmsConstants.STATUS_PENDING.equals(status)) {
            throw new BusinessException(400, "仅待审核内容可通过");
        }
        AdminPrincipal user = SecurityUtils.currentUser();
        cmsRepository.updatePublishStatus(table, id, CmsConstants.STATUS_PUBLISHED, user.getUserId());
        logApproval(table, id, "APPROVE", status, CmsConstants.STATUS_PUBLISHED, comment);
        audit("cms", "approve", table.getContentType() + "#" + id);
    }

    @Transactional
    public void offline(CmsTable table, Long id) {
        assertPermission("cms:approve");
        Map<String, Object> existing = get(table, id);
        String status = str(existing.get("publish_status"));
        if (!CmsConstants.STATUS_PUBLISHED.equals(status)) {
            throw new BusinessException(400, "仅已上架内容可下架");
        }
        cmsRepository.updatePublishStatus(table, id, CmsConstants.STATUS_OFFLINE, null);
        logApproval(table, id, "OFFLINE", status, CmsConstants.STATUS_OFFLINE, null);
        audit("cms", "offline", table.getContentType() + "#" + id);
    }

    @Transactional
    public void batchPublishToggle(CmsTable table, List<Long> ids, boolean publish) {
        assertPermission("cms:batch");
        if (publish) {
            for (Long id : ids) {
                approve(table, id, "批量上架");
            }
        } else {
            cmsRepository.batchUpdatePublishStatus(table, ids, CmsConstants.STATUS_OFFLINE);
        }
    }

    @Transactional
    public void updateSort(CmsTable table, List<Map<String, Object>> items) {
        assertPermission("cms:update");
        cmsRepository.updateSortOrders(table, items);
    }

    public List<Map<String, Object>> approvalLogs(CmsTable table, Long id) {
        assertView();
        return cmsRepository.listApprovalLogs(table.getContentType(), id);
    }

    public List<Map<String, Object>> cities() {
        assertView();
        return cmsRepository.listCitiesAll();
    }

    public Map<String, Object> getSingleton(CmsTable table) {
        assertView();
        return cmsRepository.getSingleton(table);
    }

    @Transactional
    public Map<String, Object> saveSingleton(CmsTable table, Map<String, Object> body) {
        assertPermission("cms:update");
        Map<String, Object> data = normalizeBody(table, body);
        data.put("updatedByAdminUserId", SecurityUtils.currentUser().getUserId());
        cmsRepository.upsertSingleton(table, data);
        audit("cms", "update", table.getContentType() + "#1");
        return getSingleton(table);
    }

    @Transactional
    public void submitSingleton(CmsTable table) {
        assertPermission("cms:submit");
        Map<String, Object> existing = getSingleton(table);
        String status = str(existing.get("publish_status"));
        if (!CmsConstants.STATUS_DRAFT.equals(status) && !CmsConstants.STATUS_OFFLINE.equals(status)) {
            throw new BusinessException(400, "当前状态不可提交审核");
        }
        cmsRepository.update(table, 1L, Map.of(
                "publishStatus", CmsConstants.STATUS_PENDING,
                "submittedAt", Timestamp.valueOf(LocalDateTime.now())
        ));
        logApproval(table, 1L, "SUBMIT", status, CmsConstants.STATUS_PENDING, null);
    }

    @Transactional
    public void approveSingleton(CmsTable table, String comment) {
        assertPermission("cms:approve");
        Map<String, Object> existing = getSingleton(table);
        String status = str(existing.get("publish_status"));
        if (!CmsConstants.STATUS_PENDING.equals(status)) {
            throw new BusinessException(400, "仅待审核内容可通过");
        }
        cmsRepository.updatePublishStatus(table, 1L, CmsConstants.STATUS_PUBLISHED, SecurityUtils.currentUser().getUserId());
        logApproval(table, 1L, "APPROVE", status, CmsConstants.STATUS_PUBLISHED, comment);
    }

    private void validateForCreate(CmsTable table, Map<String, Object> data) {
        if (table == CmsTable.CITY && empty(data.get("name"))) {
            throw new BusinessException(400, "请填写城市名称");
        }
        if (table == CmsTable.BANNER && empty(data.get("imageUrl"))) {
            throw new BusinessException(400, "轮播图必须上传图片");
        }
        if ((table == CmsTable.SCENIC || table == CmsTable.HOTEL || table == CmsTable.CAR_RENTAL)
                && data.get("cityId") == null) {
            throw new BusinessException(400, "请选择所属城市");
        }
        if (table == CmsTable.MEDIA_CASE && empty(data.get("caseType"))) {
            throw new BusinessException(400, "请选择案例类型");
        }
        if ((table == CmsTable.SCENIC || table == CmsTable.HOTEL || table == CmsTable.CAR_RENTAL
                || table == CmsTable.PRODUCT || table == CmsTable.TRIP_REMINDER)
                && empty(data.get("title"))) {
            throw new BusinessException(400, "请填写标题");
        }
        if (table == CmsTable.GUIDE && empty(data.get("name"))) {
            throw new BusinessException(400, "请填写名称");
        }
    }

    private void validateForSubmit(CmsTable table, Map<String, Object> row) {
        if (table == CmsTable.BANNER && empty(row.get("image_url"))) {
            throw new BusinessException(400, "轮播图必须上传图片");
        }
        if (table == CmsTable.SCENIC || table == CmsTable.HOTEL || table == CmsTable.CAR_RENTAL || table == CmsTable.PRODUCT) {
            if (empty(row.get("cover_image"))) {
                throw new BusinessException(400, "请上传封面图");
            }
        }
        if (table == CmsTable.GUIDE && empty(row.get("avatar_url"))) {
            throw new BusinessException(400, "讲解员请上传头像");
        }
        if (table == CmsTable.MEDIA_CASE && empty(row.get("cover_image"))) {
            throw new BusinessException(400, "案例请上传截图");
        }
    }

    private void assertEditable(Map<String, Object> existing) {
        String status = str(existing.get("publish_status"));
        if (CmsConstants.STATUS_PENDING.equals(status)) {
            throw new BusinessException(400, "审核中不可编辑，请等待审核结果");
        }
        if (CmsConstants.STATUS_PUBLISHED.equals(status)) {
            AdminPrincipal user = SecurityUtils.currentUser();
            if (!user.hasPermission("cms:approve")) {
                throw new BusinessException(400, "已发布内容请修改后重新提交审核");
            }
        }
    }

    private Map<String, Object> normalizeBody(CmsTable table, Map<String, Object> body) {
        Map<String, Object> data = new HashMap<>(body);
        if (data.containsKey("galleryImages") && data.get("galleryImages") instanceof List) {
            try {
                data.put("galleryImages", objectMapper.writeValueAsString(data.get("galleryImages")));
            } catch (JsonProcessingException e) {
                throw new BusinessException(400, "图集格式错误");
            }
        }
        if (data.containsKey("homeRecommended")) {
            data.put("homeRecommended", Boolean.TRUE.equals(data.get("homeRecommended")) ? 1 : 0);
        }
        if (data.containsKey("enabled")) {
            data.put("enabled", Boolean.TRUE.equals(data.get("enabled")) ? 1 : 0);
        }
        return data;
    }

    private void logApproval(CmsTable table, Long id, String action, String from, String to, String comment) {
        cmsRepository.insertApprovalLog(table.getContentType(), id, action, from, to, comment,
                SecurityUtils.currentUser().getUserId());
    }

    private void assertView() {
        AdminPrincipal user = SecurityUtils.currentUser();
        if (!user.hasPermission("cms:view") && !user.hasRole("SUPER_ADMIN") && !user.hasRole("SENIOR_ADMIN") && !user.hasRole("SALES")) {
            throw new BusinessException(403, "无查看内容权限");
        }
    }

    private void assertPermission(String code) {
        if (!SecurityUtils.currentUser().hasPermission(code)) {
            throw new BusinessException(403, "无权限: " + code);
        }
    }

    private void audit(String module, String action, String detail) {
        AdminPrincipal user = SecurityUtils.currentUser();
        auditService.logOperation(user.getUserId(), user.getUsername(), module, action, detail, null);
    }

    private static String str(Object o) {
        return o == null ? "" : String.valueOf(o);
    }

    private static boolean empty(Object o) {
        return o == null || String.valueOf(o).isBlank();
    }
}
