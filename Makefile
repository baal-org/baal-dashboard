.PHONY run:
	poetry run uvicorn baal_dashboard.app:app --reload



.PHONY: format
format:
	if [ -n "${POETRY_ACTIVE}" ]; then make _format $(LINT_FILES); else poetry run make _format $(LINT_FILES); fi

.PHONY: _format
_format:
	black $(LINT_FILES)
	isort --profile black $(LINT_FILES)
	$(MAKE) lint

test: lint mypy

LINT_FILES := baal_dashboard

.PHONY: lint
lint:
	@# calling make _lint within poetry make it so that we only init poetry once
	if [ -n "${POETRY_ACTIVE}" ]; then make _lint $(LINT_FILES); else poetry run make _lint $(LINT_FILES); fi

.PHONY: _lint
_lint:
	flake8 $(LINT_FILES)

.PHONY: mypy
mypy:
	poetry run mypy baal_dashboard