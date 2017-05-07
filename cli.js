#!/usr/bin/env node
'use strict';
const meow = require('meow');
const pokedecss = require('.');
const globby = require('globby');

const cli = meow(`
	Usage
	  $ pokedecss <glob>
`);
/*
{
	input: ['unicorns'],
	flags: {rainbow: true},
	...
}
*/

pokedecss(cli.input);
