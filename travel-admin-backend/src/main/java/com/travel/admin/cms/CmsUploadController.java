package com.travel.admin.cms;

import com.travel.admin.common.ApiResponse;
import com.travel.admin.common.BusinessException;
import com.travel.admin.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/v1/cms")
public class CmsUploadController {

    @Value("${admin.upload.dir:./uploads}")
    private String uploadDir;

    @Value("${admin.upload.max-bytes:2097152}")
    private long maxBytes;

    @Value("${admin.upload.public-prefix:/uploads/}")
    private String publicPrefix;

    @PostMapping("/upload")
    public ApiResponse<Map<String, String>> upload(@RequestParam("file") MultipartFile file) throws IOException {
        if (!SecurityUtils.currentUser().hasPermission("cms:create")
                && !SecurityUtils.currentUser().hasPermission("cms:update")) {
            throw new BusinessException(403, "无上传权限");
        }
        if (file.isEmpty()) {
            throw new BusinessException(400, "文件为空");
        }
        String contentType = file.getContentType();
        if (contentType == null || !(contentType.startsWith("image/jpeg") || contentType.startsWith("image/png"))) {
            throw new BusinessException(400, "仅支持 JPEG/PNG");
        }

        byte[] bytes = file.getBytes();
        if (bytes.length > maxBytes * 2) {
            throw new BusinessException(400, "文件过大");
        }

        BufferedImage image = ImageIO.read(file.getInputStream());
        if (image == null) {
            throw new BusinessException(400, "无法解析图片");
        }

        int maxDim = 1920;
        if (image.getWidth() > maxDim || image.getHeight() > maxDim) {
            image = scale(image, maxDim);
        }

        String ext = contentType.contains("png") ? "png" : "jpg";
        String date = LocalDate.now().toString();
        Path dir = Paths.get(uploadDir, date);
        Files.createDirectories(dir);
        String filename = UUID.randomUUID().toString().replace("-", "") + "." + ext;
        Path target = dir.resolve(filename);
        ImageIO.write(image, ext.equals("png") ? "png" : "jpeg", target.toFile());

        Map<String, String> result = new HashMap<>();
        result.put("url", publicPrefix + date + "/" + filename);
        return ApiResponse.ok(result);
    }

    private BufferedImage scale(BufferedImage src, int maxDim) {
        int w = src.getWidth();
        int h = src.getHeight();
        double ratio = Math.min((double) maxDim / w, (double) maxDim / h);
        int nw = (int) (w * ratio);
        int nh = (int) (h * ratio);
        Image scaled = src.getScaledInstance(nw, nh, Image.SCALE_SMOOTH);
        BufferedImage out = new BufferedImage(nw, nh, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = out.createGraphics();
        g.drawImage(scaled, 0, 0, null);
        g.dispose();
        return out;
    }
}
