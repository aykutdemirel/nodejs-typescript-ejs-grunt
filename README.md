# nodejs-typescript-ejs-grunt
Typescript

## Dependencies

* [Node.js](http://nodejs.org)
* [Grunt](http://gruntjs.com)
* [Ruby](http://rubyinstaller.org/)

## Installation

1. Get a copy of the code.
1. Install the dependencies if you don't already have them.

### Node

Bring up a terminal and type `node --version`.
If Node responds with a version at or above v0.10.x then you are ok.
If you require Node, go to [nodejs.org](http://nodejs.org/) and click on the big green Install button.

### Grunt

Bring up a terminal and type `grunt --version`.
If Grunt is installed it should return a version number at or above 3.5.x.
If you need to install Grunt, open up a terminal and type in the following:

```sh
$ npm install --global grunt-cli
```
This will install Grunt globally. Depending on your user account, you may need to gain elevated permissions using `sudo` (i.e `sudo npm install --global grunt-cli`). Next, install the local dependencies:

```sh
$ sudo npm install
```

### Bower

If you need to install Bower, open up a terminal and type in the following:

```sh
$ npm install --global bower
```

This will install Bower globally. Depending on your user account, you may need to gain elevated permissions using `sudo` (i.e `sudo npm install --global bower`). Next, install the local dependencies:

```sh
$ bower install
```

### Ruby
If you require sass, go to [ruby](http://rubyinstaller.org/) and click on the big red button.
After installation open up a terminal and type in the following:

```sh
$ gem install sass
```

There are many commands available to help you build. Here are a few highlights to get started with.

## Commands

## Watch For Changes & Automatically Refresh

```sh
$ grunt serve
```

## Build & Optimize

```sh
$ grunt
```
