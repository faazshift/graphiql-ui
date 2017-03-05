# graphiql-ui

[![Build Status](https://travis-ci.org/faazshift/graphiql-ui.svg?branch=master)](https://travis-ci.org/faazshift/graphiql-ui)
[![Build status](https://ci.appveyor.com/api/projects/status/j4tqlfkg9i9r43pw?svg=true)](https://ci.appveyor.com/project/faazshift/graphiql-ui)

A minimal, electron-based desktop user interface for the GraphiQL IDE

# Downloads

For 64-bit Windows and Linux, there are prebuilt packages attached to the releases on Github. See [this](https://github.com/faazshift/graphiql-ui/releases) page. Download the appropriate release for your platform, extract it where you'd like, optionally create a symlink/shortcut to the executable, and enjoy.

For other platforms, use the guide below to get started.

# Quick Start Guide

1. Download the code:
    * GitHub: `$ git clone https://github.com/faazshift/graphiql-ui.git && cd graphiql-ui`
    * NPM: `$ npm install --global graphiql-ui && cd /usr/local/lib/node_modules/graphiql-ui`
2. Build the app:
    * `$ npm run release`
3. Optionally move the built package to a more fitting location:
    * `$ mv ./bin/graphiql-ui-linux-x64 /opt/graphiql-ui`
4. Create a symlink:
    * `$ ln -s /opt/graphiql-ui/graphiql-ui /usr/local/bin/graphiql-ui`

This app was developed on Linux. However, it should build and run on OS X and Windows.