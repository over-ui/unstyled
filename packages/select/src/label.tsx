import * as React from 'react';

import { useActionContext } from './root';

// `Label`태그는, 다른 태그로 바뀌지 않아야 된다고 생각해 `Poly`를 적용하지 않았습니다.
interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
  /**
   * Label을 clip-pattern으로 안보이게 감출 수 있는 속성입니다.
   * @defaultValue - false
   */
  hidden?: boolean;
}

const LABEL_DISPLAY_NAME = 'Select.Label';
const Label = (props: LabelProps) => {
  const { children, hidden = false } = props;
  const id = React.useId();
  const { dispatch } = useActionContext(LABEL_DISPLAY_NAME);

  React.useEffect(() => {
    dispatch({ type: 'REGISTER_LABEL', payload: id });
  }, [id, dispatch]);

  const style = hidden
    ? ({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: '1px',
        overflow: 'hidden',
        position: 'absolute',
        whiteSpace: 'nowrap',
        width: '1px',
      } as React.CSSProperties)
    : undefined;
  return (
    <label id={id} style={style}>
      {children}
    </label>
  );
};

Label.displayName = LABEL_DISPLAY_NAME;

const SelectLabel = Label;

export { SelectLabel, Label };
