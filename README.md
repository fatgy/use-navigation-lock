# useNavigationLock

> Navigation lock hook for next.js

## Install

```sh
npm install @fatgy/use-navigation-lock
```

## Usage

```js
import {useNavigationLock} from '@fatgy/use-navigation-lock';

useNavigationLock(true);
//=> Show confirm dialog

useNavigationLock(false);
//=> Not show confirm dialog
```

## API

### useNavigationLock(isEnabled, warningText, onConfirm)

#### isEnabled

Type: `boolean` | `undefined`

Default: `false`

#### warningText

Type: `string` | `undefined`

Default: `Are you sure you want to leave this page? You have unsaved changes. Do you want to leave?`

#### onConfirm

Type: `function` | `undefined`
