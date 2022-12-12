# For Testing Before Publish

## add symlink

```
yarn workspace playground add <YOUR PACKAGE NAME>@<WITH VERSION>
```

or

```
// playground package.json

  "dependencies": {
    ...
    "@over-ui/template-test": "^1.0.0"
  },
```

check your package is driven by watch mode.

## start

```
yarn dev

(lerna run)
yarn playground
```
