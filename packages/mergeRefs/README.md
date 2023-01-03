# `over-ui/mergeRefs`

`mergeRefs` 패키지는, `over-ui` 에서 `ref` 를 병합하기 위한 유틸함수입니다.
내부에서만 사용하는 패키지입니다.

## Usage

```
const Toggle = React.forwardRef((props, ref) => {
  const innerRef = React.useRef(null);
  return <button ref={mergeRefs([innerRef, ref])}>토글</button>;
});

```

위와 같은 상황에서 주로 사용합니다. 부모로부터 내려받은 `ref`와 내부에 있는 `innerRef`를 병합할 수 있습니다.

```
const Toggle = React.forwardRef((props, ref) => {
  return <button ref={mergeRefs([(node) => node?.focus(), ref])}>토글</button>;
});
```

`ref Callback`의 사용또한 가능합니다.
