package n7.back_project_appli_web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BackProjectAppliWebApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackProjectAppliWebApplication.class, args);
	}

}
