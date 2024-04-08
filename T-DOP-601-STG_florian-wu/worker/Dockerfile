# First stage: Compilation
FROM maven:3.8.4-jdk-11-slim AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the pom.xml file into the container
COPY pom.xml .

# Resolve application dependencies
RUN mvn dependency:resolve

# Copy the application source code into the container
COPY src ./src

# Package the Worker application
RUN mvn package



# Second stage: Run
FROM openjdk:11-jre-slim

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file from the previous stage into the current stage
COPY --from=builder /app/target/worker-jar-with-dependencies.jar .



# Run the Worker application
CMD ["java", "-jar", "worker-jar-with-dependencies.jar"]
