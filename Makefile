NODE_MODULES_PATH := $(shell pwd)/node_modules
PATH := $(NODE_MODULES_PATH)/.bin:$(PATH)
SHELL := /bin/bash

LINT := tslint
LINT_FLAGS := --config ./.tslintrc.json

CC := tsc
FLAGS := --module commonjs --target ES5 --noImplicitAny --noEmitOnError --suppressImplicitAnyIndexErrors --removeComments

PROJECT_NAME := express-formidable
SOURCE_NAMES := middleware

SOURCES := $(patsubst %, ./lib/%.ts, $(SOURCE_NAMES))
ROOT_DECLARE := $(patsubst %, ./lib/%.d.ts, $(PROJECT_NAME))
DECLARES := $(patsubst %, ./%.d.ts, $(SOURCE_NAMES))
JS := $(patsubst %.ts, %.js, $(SOURCES))

LAST_BUILD := ./.last_build

.PHONY: lint build all clean modules
.DEFAULT: build

build: modules $(LAST_BUILD) bundle

$(LAST_BUILD): $(SOURCES)
	$(CC) $(FLAGS) -d $?
	@touch $@

all: build

lint: modules lint-internal

lint-internal: $(SOURCES)
	$(LINT) $(LINT_FLAGS) $^

clean:
	rm -f $(JS) $(DECLARES) $(ROOT_DECLARE)
	@rm -f $(LAST_BUILD)

modules: $(NODE_MODULES_PATH)

$(NODE_MODULES_PATH):
	npm install

bundle:
	./script/bundle
