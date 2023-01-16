# `over-ui/dialog`

일반적인 모달의 역할을 하는 컴포넌트 입니다. 현재 열려있는 주 창(primary window)이나 또 다른 Dialog 창을 비활성화시키고, 그 위로 겹쳐져 그려집니다.

## Usage

```tsx
import * as React from 'react';
import styled from 'styled-components';
import * as Dialog from '@over-ui/dialog';

export const Uncontrolled = () => {
  return (
    <Dialog.Root>
      <StyledTrigger>open</StyledTrigger>
      <Dialog.Portal>
        <StyledOverlay />
        <StyledContent>
          <StyledTitle>Make Reservation</StyledTitle>
          <StyledDescription>Fill the form to make reservation.</StyledDescription>
          <StyledClose>close</StyledClose>
        </StyledContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <StyledTrigger>{open ? 'close' : 'open'}</StyledTrigger>
      <Dialog.Portal>
        <StyledOverlay />
        <StyledContent>
          <StyledTitle>Make Reservation</StyledTitle>
          <StyledDescription>Fill the form to make reservation.</StyledDescription>
          <StyledClose>close</StyledClose>
        </StyledContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const StyledTrigger = styled(Dialog.Trigger)({
  backgroundColor: '#e5e7eb',
  color: '#000',
});

const StyledOverlay = styled(Dialog.Overlay)({
  overflow: 'auto',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  backgroundColor: 'lightgray',
  opacity: '0.4',
});

const StyledContent = styled(Dialog.Content)({
  minWidth: 300,
  minHeight: 150,
  padding: 50,
  borderRadius: 10,
  backgroundColor: '#e5e7eb',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
});

const StyledTitle = styled(Dialog.Title)({
  margin: '0',
  fontWeight: '500',
  color: '#000',
  fontSize: '17px',
});

const StyledDescription = styled(Dialog.Description)({
  margin: '10px 0 20px',
  color: 'lightgray',
  fontSize: '15px',
  lineHeight: '1.5',
});

const StyledClose = styled(Dialog.Close)({});
```
