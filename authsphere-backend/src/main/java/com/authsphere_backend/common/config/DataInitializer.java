package com.authsphere_backend.common.config;


import com.authsphere_backend.common.config.AppConstants;
import com.authsphere_backend.common.config.DataInitializer;
import com.authsphere_backend.user.entity.User;
import com.authsphere_backend.user.entity.Role;
import com.authsphere_backend.user.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        seedRole(AppConstants.ROLE_USER);
        seedRole(AppConstants.ROLE_ADMIN);
    }

    private void seedRole(String roleName) {
        if (!roleRepository.existsByName(roleName)) {
            Role role = Role.builder()
                    .name(roleName)
                    .build();
            roleRepository.save(role);
            logger.info("Seeded default role: {}", roleName);
        }
    }
}
