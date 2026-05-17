FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["sh", "-c", "profile=${SPRING_PROFILES_ACTIVE:-prod}; case \"$profile\" in *'$'*|*'{'*|*'}'*|'') profile=prod ;; esac; exec java -Dspring.profiles.active=\"$profile\" -jar app.jar"]
