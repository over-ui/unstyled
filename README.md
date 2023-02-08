# over-ui
`over-ui`는 재사용이 가능하며, 접근성을 지킨 리액트 컴포넌트 라이브러리 입니다.


## packages

| 패키지 이름   | 패키지 설명                                                   | 
| ------------- | ------------------------------------------------------------- | 
| [@over-ui/core](https://github.com/over-ui/unstyled/tree/main/packages/core) | over-ui 에 모두에 대다수 적용되는 유틸을 모아둔 패키지입니다. <br /> 다형적 컴포넌트를 쉽게 구성할 수 있는 Poly 타입, context 를 안전하게 불러올 수 있는 useSafeContext 등이 있습니다. |  |
| [@over-ui/use-controlled](https://github.com/over-ui/unstyled/tree/main/packages/useControlled) | 외부의 상태를 이용하거나, 또는 내부의 상태만을 이용할 수 있도록 작성한 훅입니다. | github [npm](https://www.npmjs.com/package/@over-ui/use-controlled) |
| [@over-ui/create-roving-context](https://github.com/over-ui/unstyled/tree/main/packages/createRovingContext) | toggleGroup 컴포넌트의 접근성을 구현할 때 roving tabIndex를 구현하기 위한 패키지입니다. | github https://www.npmjs.com/package/@over-ui/create-**roving**-context |
| [@over-ui/use-id](https://github.com/over-ui/unstyled/tree/main/packages/useId) | 리액트 18버전에 등장한 React.useId 훅을 이전 버전에서도 안전하게 사용할 수 있도록 작성한 패키지입니다. | 
| [@over-ui/use-outside-click](https://github.com/over-ui/unstyled/tree/main/packages/useOutsideClick) | 바깥을 클릭했을 때 인터렉션이 가능하도록 작성한 패키지 입니다. | g
| [@over-ui/merge-refs](https://github.com/over-ui/unstyled/tree/main/packages/mergeRefs) | ref를 함칠 수 있는 유틸 패키지입니다. |
| [@over-ui/toggle](https://github.com/over-ui/unstyled/tree/main/packages/toggle) | 재사용 가능하며, 접근성을 지킨 toggle 컴포넌트 패키지입니다. | 
| [@over-ui/toggle-group](https://github.com/over-ui/unstyled/tree/main/packages/toggleGroup) | 재사용 가능하며, 접근성을 지킨 toggleGroup 컴포넌트 패키지입니다. | 
| [@over-ui/select](https://github.com/over-ui/unstyled/tree/main/packages/select) | 재사용 가능하며, 접근성을 지킨 select 컴포넌트 패키지입니다. | 


## usages
각 패키지 `README.MD` 를 통해 `usage`를 확인해 볼 수 있습니다.  
컴포넌트는 [여기 스토리북](https://63bba467b98099ff5c8b92b6-qdciptjqgm.chromatic.com/?path=/story/over-ui-alertdialog--main)에서 확인하실 수 있습니다.