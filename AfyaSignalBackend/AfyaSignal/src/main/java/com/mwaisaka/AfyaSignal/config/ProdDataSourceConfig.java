package com.mwaisaka.AfyaSignal.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Configuration
@Profile("prod")
public class ProdDataSourceConfig {

    @Bean
    public DataSource dataSource(Environment env) {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");

        String springUrl = env.getProperty("SPRING_DATASOURCE_URL");
        String renderUrl = env.getProperty("DATABASE_URL");

        if (hasText(springUrl)) {
            dataSource.setJdbcUrl(springUrl);
            dataSource.setUsername(firstPresent(env, "SPRING_DATASOURCE_USERNAME", "DB_USERNAME"));
            dataSource.setPassword(firstPresent(env, "SPRING_DATASOURCE_PASSWORD", "DB_PASSWORD"));
            return dataSource;
        }

        if (hasText(renderUrl)) {
            configureFromDatabaseUrl(dataSource, renderUrl);
            return dataSource;
        }

        String host = required(env, "DB_HOST");
        String port = env.getProperty("DB_PORT", "5432");
        String database = required(env, "DB_NAME");

        dataSource.setJdbcUrl("jdbc:postgresql://" + host + ":" + port + "/" + database);
        dataSource.setUsername(required(env, "DB_USERNAME"));
        dataSource.setPassword(required(env, "DB_PASSWORD"));
        return dataSource;
    }

    private static void configureFromDatabaseUrl(HikariDataSource dataSource, String databaseUrl) {
        if (databaseUrl.startsWith("jdbc:postgresql://")) {
            dataSource.setJdbcUrl(databaseUrl);
            return;
        }

        URI uri = URI.create(databaseUrl.replaceFirst("^postgres://", "postgresql://"));
        String database = uri.getPath() == null ? "" : uri.getPath().replaceFirst("^/", "");
        String query = uri.getQuery() == null ? "" : "?" + uri.getQuery();
        int port = uri.getPort() == -1 ? 5432 : uri.getPort();

        dataSource.setJdbcUrl("jdbc:postgresql://" + uri.getHost() + ":" + port + "/" + database + query);

        String userInfo = uri.getUserInfo();
        if (hasText(userInfo)) {
            String[] parts = userInfo.split(":", 2);
            dataSource.setUsername(urlDecode(parts[0]));
            if (parts.length > 1) {
                dataSource.setPassword(urlDecode(parts[1]));
            }
        }
    }

    private static String firstPresent(Environment env, String... keys) {
        for (String key : keys) {
            String value = env.getProperty(key);
            if (hasText(value)) {
                return value;
            }
        }
        return null;
    }

    private static String required(Environment env, String key) {
        String value = env.getProperty(key);
        if (!hasText(value)) {
            throw new IllegalStateException("Missing required environment variable: " + key);
        }
        return value;
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private static String urlDecode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }
}
