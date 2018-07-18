package com.worldtree.finance;

import com.worldtree.finance.token.TokenFilter;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
@MapperScan("com.worldtree.finance.dao")
public class FinanceApplication {

	@Value("${jwt.exceptUrl}")
	private String exceptUrl;
	@Autowired
	private TokenFilter tokenFilter;
	@Bean
	public FilterRegistrationBean jwtFilter() {
		final FilterRegistrationBean registrationBean = new FilterRegistrationBean();
		registrationBean.setFilter(tokenFilter);
		//添加需要拦截的url
		List<String> urlPatterns = new ArrayList<>();
		urlPatterns.add(exceptUrl);
		registrationBean.addUrlPatterns(urlPatterns.toArray(new String[urlPatterns.size()]));
		return registrationBean;
	}

	public static void main(String[] args) {
		SpringApplication.run(FinanceApplication.class, args);
	}
}
