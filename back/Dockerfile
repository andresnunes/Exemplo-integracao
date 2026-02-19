# Estágio 1: Build (Compilação)
# Usamos uma imagem com JDK completo para compilar
FROM eclipse-temurin:25-jdk-alpine AS build

WORKDIR /app

# Copiamos apenas os arquivos de dependência primeiro para aproveitar o cache do Docker
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Baixa as dependências (se o pom.xml não mudou, essa etapa é pulada pelo cache)
RUN ./mvnw dependency:go-offline

# Copia o código fonte
COPY src ./src

# Compila o projeto e gera o JAR (pula testes para ser mais rápido no build de container)
RUN ./mvnw clean package -DskipTests

# Estágio 2: Runtime (Execução)
# Usamos uma imagem JRE (apenas runtime) para ficar mais leve
FROM eclipse-temurin:25-jre-alpine

WORKDIR /app

# Cria um usuário não-root para segurança (boas práticas)
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copia apenas o JAR gerado no estágio anterior
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta padrão do Spring Boot
EXPOSE 8080

# Comando para rodar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]