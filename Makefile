NODE_MODULES_PATH := $(shell pwd)/node_modules
PATH := $(NODE_MODULES_PATH)/.bin:$(PATH)
SHELL := /bin/bash

LINT := tslint
LINT_FLAGS := --config ./.tslintrc.json

CC := tsc
FLAGS := --module commonjs --target ES5 --noImplicitAny --noEmitOnError --suppressImplicitAnyIndexErrors --removeComments

SOURCE_NAMES := middleware
LIB_NAMES := express \
	formidable \
	underscore

SOURCES := $(patsubst %, ./lib/%.ts, $(SOURCE_NAMES))
DECLARES := $(patsubst %, ./lib/%.d.ts, $(SOURCE_NAMES))
LIBS := $(foreach LIB, $(LIB_NAMES), ./lib.d/$(LIB)/$(LIB).d.ts)
JS := $(patsubst %.ts, %.js, $(SOURCES))

LAST_BUILD := ./.last_build

.PHONY: lint build all clean modules
.DEFAULT: build

build: modules $(LAST_BUILD)

$(LAST_BUILD): $(SOURCES)
	$(CC) $(FLAGS) -d $? $(LIBS)
	@touch $@

all: build

lint: modules lint-internal

lint-internal: $(SOURCES)
	$(LINT) $(LINT_FLAGS) $^

clean:
	rm -f $(JS) $(DECLARES)
	@rm -f $(LAST_BUILD)

modules: $(NODE_MODULES_PATH)

$(NODE_MODULES_PATH):
	npm install
