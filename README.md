# graphiql-ui

[![Build Status](https://travis-ci.org/faazshift/graphiql-ui.svg?branch=master)](https://travis-ci.org/faazshift/graphiql-ui)

A minimal, electron-based, desktop user interface for the GraphiQL IDE

# Quick Start Guide

Currently there are no installers. You will have to install the package manually. However, it's pretty quick and simple to do so:

1. Download the code:
    * GitHub: `$ git clone https://github.com/faazshift/graphiql-ui.git && cd graphiql-ui`
    * NPM: `$ npm install --global graphiql-ui && cd /usr/local/lib/node_modules/graphiql-ui`
2. Build the app:
    * `$ npm run release`
3. Optionally move the built package to a more fitting location:
    * `$ mv ./bin/graphiql-ui-linux-x64 /opt/graphiql-ui`
4. Create a symlink:
    * `$ ln -s /opt/graphiql-ui/graphiql-ui /usr/local/bin/graphiql-ui`

This app was developed on Linux, and has only been tested on that platform. However, it should build and run on OS X and Windows.