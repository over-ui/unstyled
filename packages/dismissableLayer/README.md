# `over-dismissableLayer`

DismissableLayer는 모달 컴포넌트가 닫히는 동작을 위해 만들어진 레이어 컴포넌트 입니다
모달을 만들 때 마다 반복되는 부분이 있고, 관심사 분리를 위해 구현하게 됐습니다
모달의 content가 되는 부분을 감싸서 해당 부분이 아닌 부분을 클릭하거나, 포커스를 내보내거나, escape 키를 눌렀을 경우 onDismiss 함수를 실행시켜 모달을 닫는 방법으로 사용할 수 있습니다

## Usage
