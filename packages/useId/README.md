# `over-ui/use-id`

`React 18`버전에서 등장한 `useId` 훅이 존재하지 않을 시 커스텀훅으로 대체하기 위한 훅입니다.
`useId`가 존재한다면, `React.useId`를 사용하고 존재하지 않는다면 `useSafeId`를 사용해 고유한 `id`를 생성합니다.
