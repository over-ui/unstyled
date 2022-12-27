# `over-ui/focusTrapLayer`

`focusTrapLayer` 패키지는, `over-ui`내부에서만 사용되는 패키지입니다.

over-ui 상의 Dialog 등 모달을 사용하는 컴포넌트에서는, 컴포넌트 `밖으로 포커스가 나가면 모달이 닫히게` 됩니다. 이러한 의도치 않은 동작을 막기 위해 FocusTrapLayer 컴포넌트를 개발하게 되었습니다. `FocusTrapLayer`는 container 안에서 `focusable하고 조건에 맞는 엘리먼트들`을 모아 해당 엘리먼트들만 포커스가 되도록 `포커스를 가둠`으로써 포커스가 밖으로 튀어 나가 모달을 닫는 동작을 방지합니다.

## Usage

```tsx
import * as React from 'react';
import { FocusTrapLayer } from '@over-ui/focusTrapLayer';

const DemoPage = () => {
  return (
    <>
      <FocusTrapLayer loop>
        <h2 tabIndex={0}>title</div>
        <div>description</div>
        <input id="id"/>
        <input id="password"/>
        <input id="nickname"tabIndex={-1}/>
        <button>cancel</button>
        <button>submit</button>
      </FocusTrapLayer>
    </>
  );
};

export default DemoPage;
```

## Result

FocusTrapLayer 내부에 있는 포커스가 가능한 요소들, 위와 같은 영우에는 `h2, input(id), input(password), button(cancel), button(submit)` 총 5개의 요소가 포커스가 가능하기때문에 이 5개의 요소 안에 포커스를 가두게되고 밖으로 포커스가 나가지 않게 된다.  
또한 loop 옵션을 줬기 때문에 마지막 submit가 포커스 된 상태로 tab키를 누르면 첫 번째인 h2로 포커스가 이동하고, h2에 포커스가 된 상태로 shift키와 tab키를 같이 누르면 마지막 요소인 submit으로 포커스가 이동하게 된다.
