package com.authsphere_backend.common.helpers;


import com.authsphere_backend.common.helpers.RequestMetadataHelper;
import com.authsphere_backend.user.entity.User;
import jakarta.servlet.http.HttpServletRequest;

public final class RequestMetadataHelper {

    private RequestMetadataHelper() {
    }

    public static String extractClientIp(HttpServletRequest request) {
        if (request == null) return "127.0.0.1";

        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) {
            return xRealIp.trim();
        }

        return request.getRemoteAddr() != null ? request.getRemoteAddr() : "127.0.0.1";
    }

    public static String extractUserAgent(HttpServletRequest request) {
        if (request == null) return "Unknown";
        String ua = request.getHeader("User-Agent");
        return (ua != null && !ua.isBlank()) ? ua : "Unknown";
    }

    public static String parseOs(String userAgent) {
        if (userAgent == null) return "Unknown OS";
        String ua = userAgent.toLowerCase();
        if (ua.contains("windows")) return "Windows";
        if (ua.contains("mac os x") || ua.contains("macintosh")) return "macOS";
        if (ua.contains("android")) return "Android";
        if (ua.contains("iphone") || ua.contains("ipad") || ua.contains("ios")) return "iOS";
        if (ua.contains("linux")) return "Linux";
        return "Unknown OS";
    }

    public static String parseBrowser(String userAgent) {
        if (userAgent == null) return "Unknown Browser";
        String ua = userAgent.toLowerCase();
        if (ua.contains("edg/")) return "Edge";
        if (ua.contains("opr/") || ua.contains("opera")) return "Opera";
        if (ua.contains("chrome/") && !ua.contains("edg/")) return "Chrome";
        if (ua.contains("firefox/")) return "Firefox";
        if (ua.contains("safari/") && !ua.contains("chrome/")) return "Safari";
        if (ua.contains("postman")) return "Postman";
        if (ua.contains("curl")) return "cURL";
        return "Browser";
    }

    public static String parseDeviceName(String userAgent) {
        if (userAgent == null) return "Unknown Device";
        String ua = userAgent.toLowerCase();
        if (ua.contains("android")) return "Android Phone";
        if (ua.contains("iphone")) return "iPhone";
        if (ua.contains("ipad")) return "iPad Tablet";
        if (ua.contains("macintosh") || ua.contains("mac os x")) return "MacBook / Mac";
        if (ua.contains("windows")) return "Windows Desktop";
        if (ua.contains("linux")) return "Linux Desktop";
        if (ua.contains("postman") || ua.contains("curl")) return "API Client";
        return "Desktop Device";
    }

    public static String resolveLocation(HttpServletRequest request, String ip) {
        if (request != null) {
            String geoHeader = request.getHeader("X-Geo-Location");
            if (geoHeader != null && !geoHeader.isBlank()) {
                return geoHeader.trim();
            }
            String cfCountry = request.getHeader("CF-IPCountry");
            if (cfCountry != null && !cfCountry.isBlank() && !"XX".equalsIgnoreCase(cfCountry)) {
                return cfCountry.trim();
            }
        }
        if (ip == null || ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1") || ip.equals("::1")
                || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.16.")) {
            return "Local Network";
        }
        return "Unknown Region";
    }

    public static boolean isSecureRequest(HttpServletRequest request, String ip) {
        if (request == null) return true;
        if (request.isSecure()) return true;
        String proto = request.getHeader("X-Forwarded-Proto");
        if ("https".equalsIgnoreCase(proto)) return true;
        return "127.0.0.1".equals(ip) || "0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip);
    }
}
