package com.authsphere_backend.security.service;


import com.authsphere_backend.security.service.SecurityService;
import com.authsphere_backend.security.dto.SecurityOverviewDto;

import java.util.UUID;

public interface SecurityService {

    SecurityOverviewDto getSecurityOverview(UUID userId);
}
