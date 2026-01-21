# Variables
APP_NAME = macos-web-desktop
DEV_COMPOSE = compose.dev.yml
PROD_COMPOSE = compose.yml

.PHONY: help

help: ## Show this help
	@echo ""
	@echo "Usage: make <commande>"
	@echo ""
	@echo "Commands available :"
	@grep -E '^[a-zA-Z0-9_-]+:.*##' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-22s\033[0m %s\n", $$1, $$2}'
	@echo ""

# -------------------------
# DEV (hot reload)
# -------------------------

dev: ## Start dev container (hot reload)
	docker compose -f $(DEV_COMPOSE) up --build

dev-d: ## Start dev container in background
	docker compose -f $(DEV_COMPOSE) up --build -d

dev-stop: ## Stop dev container
	docker compose -f $(DEV_COMPOSE) down

dev-restart: ## Restart dev container
	docker compose -f $(DEV_COMPOSE) down
	docker compose -f $(DEV_COMPOSE) up --build -d

dev-logs: ## Show dev logs
	docker compose -f $(DEV_COMPOSE) logs -f

dev-shell: ## Open a shell inside dev container
	docker compose -f $(DEV_COMPOSE) exec web sh

test-head: ## Run tests in headless mode
	yarn run test-head

test: ## Run tests in UI mode
	yarn run test-line

# -------------------------
# PROD
# -------------------------

prod: ## Start prod container
	docker compose -f $(PROD_COMPOSE) up --build -d

prod-stop: ## Stop prod container
	docker compose -f $(PROD_COMPOSE) down

prod-restart: ## Restart prod container
	docker compose -f $(PROD_COMPOSE) down
	docker compose -f $(PROD_COMPOSE) up --build -d

prod-logs: ## Show prod logs
	docker compose -f $(PROD_COMPOSE) logs -f

prod-shell: ## Open a shell inside prod container
	docker compose -f $(PROD_COMPOSE) exec web sh

# -------------------------
# Tools
# -------------------------

logs: ## Show all logs (prod compose by default)
	docker compose -f $(PROD_COMPOSE) logs -f

status: ## Show containers status
	docker ps -a

clean: ## Clean Docker (danger)
	docker system prune -af
	docker volume prune -f
