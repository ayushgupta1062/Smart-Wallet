# Stage 1: Compile and package using Maven with Eclipse Temurin OpenJDK 17
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
# Fetch dependencies (caching step)
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Lightweight runtime environment using Eclipse Temurin JRE 17
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/target/expense-tracker-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
