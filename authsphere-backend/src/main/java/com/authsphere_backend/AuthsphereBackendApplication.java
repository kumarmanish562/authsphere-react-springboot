package com.authsphere_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AuthsphereBackendApplication {

	public static void main(String[] args) {

        SpringApplication.run(AuthsphereBackendApplication.class, args);
	}

}
