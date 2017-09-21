package com.revature;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.revature.controllers.Helper;

@SpringBootApplication
public class SlackMicroserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(SlackMicroserviceApplication.class, args);
	}
}