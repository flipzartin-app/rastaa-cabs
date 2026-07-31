FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B package -DskipTests

FROM eclipse-temurin:17-jre-jammy AS runtime
WORKDIR /app
COPY --from=builder /app/target/fare-engine-1.0.0.jar ./fare-engine.jar
EXPOSE 8080
CMD ["java", "-jar", "fare-engine.jar"]
