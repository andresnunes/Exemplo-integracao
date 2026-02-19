terraform {
  required_providers {
    kubernetes = {
      source = "hashicorp/kubernetes"
      version = ">= 2.0.0"
    }
  }
}

# Configura o Terraform para usar o seu cluster local (Kind)
provider "kubernetes" {
  config_path    = "~/.kube/config"
  config_context = "kind-todo-cluster" # Garante que está no cluster certo
}

# 1. Namespace (Para organizar)
resource "kubernetes_namespace" "todo_ns" {
  metadata {
    name = "todo-terraform-ns"
  }
}

# 2. Secret (Senhas do Banco)
resource "kubernetes_secret" "db_credentials" {
  metadata {
    name      = "db-credentials"
    namespace = kubernetes_namespace.todo_ns.metadata[0].name
  }

  data = {
    username = "postgres"
    password = "postgres"
  }

  type = "Opaque"
}

# 3. PostgreSQL Service (Rede)
resource "kubernetes_service" "postgres" {
  metadata {
    name      = "postgres-svc"
    namespace = kubernetes_namespace.todo_ns.metadata[0].name
  }
  spec {
    selector = {
      app = "postgres"
    }
    port {
      port        = 5432
      target_port = 5432
    }
  }
}

# 4. PostgreSQL Deployment (Aplicação)
resource "kubernetes_deployment" "postgres" {
  metadata {
    name      = "postgres-deploy"
    namespace = kubernetes_namespace.todo_ns.metadata[0].name
    labels = {
      app = "postgres"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "postgres"
      }
    }
    template {
      metadata {
        labels = {
          app = "postgres"
        }
      }
      spec {
        container {
          image = "postgres:16-alpine"
          name  = "postgres"

          env {
            name  = "POSTGRES_DB"
            value = "todo_db"
          }
          env {
            name = "POSTGRES_USER"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.db_credentials.metadata[0].name
                key  = "username"
              }
            }
          }
          env {
            name = "POSTGRES_PASSWORD"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.db_credentials.metadata[0].name
                key  = "password"
              }
            }
          }
          port {
            container_port = 5432
          }
        }
      }
    }
  }
}

# 5. Java API Service (Rede)
resource "kubernetes_service" "java_api" {
  metadata {
    name      = "java-api-svc"
    namespace = kubernetes_namespace.todo_ns.metadata[0].name
  }
  spec {
    selector = {
      app = "java-api"
    }
    port {
      port        = 8080
      target_port = 8080
    }
    type = "ClusterIP"
  }
}

# 6. Java API Deployment (Aplicação)
resource "kubernetes_deployment" "java_api" {
  metadata {
    name      = "java-api-deploy"
    namespace = kubernetes_namespace.todo_ns.metadata[0].name
    labels = {
      app = "java-api"
    }
  }

  spec {
    replicas = 1 # Alterar aqui se quiser escalar
    selector {
      match_labels = {
        app = "java-api"
      }
    }
    template {
      metadata {
        labels = {
          app = "java-api"
        }
      }
      spec {
        container {
          image = "todo-java-api:latest"
          name  = "java-api"
          
          # CRUCIAL PARA KIND: Não tentar baixar da internet
          image_pull_policy = "Never" 

          port {
            container_port = 8080
          }

          # Configuração de conexão dinâmica
          env {
            name  = "SPRING_DATASOURCE_URL"
            # O Terraform injeta o nome correto do serviço do banco automaticamente aqui:
            value = "jdbc:postgresql://${kubernetes_service.postgres.metadata[0].name}.${kubernetes_namespace.todo_ns.metadata[0].name}:5432/todo_db"
          }
          env {
            name = "SPRING_DATASOURCE_USERNAME"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.db_credentials.metadata[0].name
                key  = "username"
              }
            }
          }
          env {
            name = "SPRING_DATASOURCE_PASSWORD"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.db_credentials.metadata[0].name
                key  = "password"
              }
            }
          }
          # Garante que o Java espera o Dialeto correto
          env {
            name  = "SPRING_DATASOURCE_DRIVER_CLASS_NAME"
            value = "org.postgresql.Driver"
          }
          env {
            name  = "SPRING_JPA_HIBERNATE_DDL_AUTO"
            value = "update"
          }
        }
      }
    }
  }
  
  # Garante que o Java só sobe depois que o serviço do banco foi criado
  depends_on = [kubernetes_service.postgres]
}