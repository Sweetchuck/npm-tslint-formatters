# tslint-formatters

[![Build Status](https://travis-ci.org/Sweetchuck/npm-tslint-formatters.svg?branch=)](https://travis-ci.org/Sweetchuck/npm-tslint-formatters)
[![Dependency Status](https://david-dm.org/Sweetchuck/npm-tslint-formatters.svg)](https://david-dm.org/Sweetchuck/npm-tslint-formatters)
[![devDependency Status](https://david-dm.org/Sweetchuck/npm-tslint-formatters/dev-status.svg)](https://david-dm.org/Sweetchuck/npm-tslint-formatters#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/Sweetchuck/npm-tslint-formatters/badge.svg?branch=master&service=github)](https://coveralls.io/github/Sweetchuck/npm-tslint-formatters?branch=master)


Implements various formatters for tslint.

## Install

`npm install --save-dev tslint-formatters`


## Executables


### Bin - tslint-formatters-convert

Convert yaml to checkstyle.
This is a walkaround for this problem https://github.com/palantir/tslint/issues/680

For more information run `node bin/tslint-formatters-convert --help`

__Original output is YAML and it is converted to checkstyle__

`tslint --formatters-dir ./node_modules/tslint-formatters/lib/tslint/formatters --format yaml foo.ts | tslint-formatters-convert yaml2checkstyle`

or

__Original output is an incorrect checkstyle and it is fixed with a simple string replace.__

`tslint --formatters-dir ./node_modules/tslint-formatters/lib/tslint/formatters --format checkstyle foo.ts | tslint-formatters-convert checkstyle2checkstyle`


## Contributing

Contributions welcome; Please submit all pull requests against _master_ branch.
If your pull request contains TypeScript patches or features, you should include
relevant unit tests.

__To start run__:

`npm install`

`npm run get-started`

__Before \`git commit\` run__:

`npm test`

__To check the content of the package__:

If you have added new files then run the following command and review _manually_
the content of the _tmp/package_ directory.

`npm run unpack`


## Author

**Andor Dávid**

* [GitHub](https://github.com/Sweetchuck)
* [Twitter](http://twitter.com/andor_david)
* [LinkedIn](https://hu.linkedin.com/pub/andor-dávid/5b/484/b83)


## Release History

* **v0.1.0** - 2015-12-04
  * Initial release with basic functionality.


## License

Available under GPL-2.0+

