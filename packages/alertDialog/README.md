# `over-alertDialog`

`AlertDailog`는 유저의 동작을 막으며 중요한 내용을 표시하고, 유저의 응답을 받는 모달 컴포넌트입니다.

## Installation

```
npm install @over-ui/alert-dialog
or
yarn add @over-ui/alert-dialog
```

## Usage

```tsx
import React from 'react';
import * as AlertDialog from '@over-ui/alert-dialog';

const DemoAlertDialog = () => {
  return (
    <div
      style={{
        height: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <AlertDialog.Root>
        <StyledTrigger>Leave Chatroom</StyledTrigger>
        <AlertDialog.Portal>
          <StyledOverlay />
          <StyledContent>
            <StyledTitle>Are you sure?</StyledTitle>
            <StyledDescription>
              If you leave now, you will lose entire chat history and cannot restore it.
            </StyledDescription>
            <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end', gap: 10 }}>
              <StyledAction>Yes</StyledAction>
              <StyledCancel>Nope</StyledCancel>
            </div>
          </StyledContent>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
};

export default DemoAlertDialog;
```
