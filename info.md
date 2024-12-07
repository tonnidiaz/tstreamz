Turborepo does not support nested packages like apps/** or packages/**. Using a structure that would put a package at apps/a and another at apps/a/b will result in an error.

If you'd like to group packages by directory, you can do this using globs like packages/* and packages/group/* and not creating a packages/group/package.json file.