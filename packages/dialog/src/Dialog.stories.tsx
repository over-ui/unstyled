import * as React from 'react';
import { Meta } from '@storybook/react';
import styled from '@emotion/styled';
import * as Dialog from './Dialog';
import mdx from './Dialog.mdx';

export default {
  title: 'over-ui/Dialog',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta;

export const Main = () => {
  return (
    <div
      style={{
        height: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Dialog.Root>
        <StyledTrigger>open</StyledTrigger>
        <Dialog.Portal>
          <StyledOverlay />
          <StyledContent>
            <StyledTitle>Make Reservation</StyledTitle>
            <StyledDescription>Fill the form to make reservation.</StyledDescription>
            <StyledFieldset>
              <StyledLabel htmlFor="name">Name</StyledLabel>
              <StyledInput id="name" />
            </StyledFieldset>
            <StyledFieldset>
              <StyledLabel htmlFor="phonenumber">PhoneNumber</StyledLabel>
              <StyledInput id="phonenumber" />
            </StyledFieldset>
            <StyledFieldset>
              <StyledLabel htmlFor="email">Email</StyledLabel>
              <StyledInput id="email" />
            </StyledFieldset>
            <StyledFieldset>
              <StyledLabel htmlFor="request">Request</StyledLabel>
              <StyledInput id="request" />
            </StyledFieldset>
            <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
              <StyledClose>close</StyledClose>
            </div>
          </StyledContent>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export const NonModal = () => {
  return (
    <>
      <Dialog.Root modal={false}>
        <StyledTrigger>open (non-modal)</StyledTrigger>
        <Dialog.Portal>
          <StyledOverlay />
          <StyledContent onInteractOutside={(event: Event) => event.preventDefault()}>
            <StyledTitle>This is non-modal</StyledTitle>
            <StyledDescription>It does not interfere with you.</StyledDescription>
            <StyledClose>close</StyledClose>
          </StyledContent>
        </Dialog.Portal>
      </Dialog.Root>

      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} style={{ marginTop: 20 }}>
          <textarea
            style={{ width: 800, height: 400 }}
            defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nobis at ipsa, nihil tempora debitis maxime dignissimos non amet, minima expedita alias et fugit voluptate laborum placeat odio dolore ab!"
          />
        </div>
      ))}
    </>
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

export const FocusTrap = () => {
  return (
    <>
      <Dialog.Root>
        <StyledTrigger>open</StyledTrigger>
        <Dialog.Portal>
          <StyledOverlay />
          <StyledContent>
            <StyledTitle>Make Reservation</StyledTitle>
            <StyledDescription>Fill the form to make reservation.</StyledDescription>
            <div>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="John" />

              <label htmlFor="phoneNumber">PhoneNumber</label>
              <input type="text" id="phoneNumber" placeholder="010-0000-0000" />

              <button type="submit">Send</button>
            </div>
            <StyledClose>close</StyledClose>
          </StyledContent>
        </Dialog.Portal>
      </Dialog.Root>

      <p>These elements cant be focused when the dialog is opened.</p>
      <button type="button">A button</button>
      <input type="text" placeholder="Another focusable element" />
    </>
  );
};

export const NoEscapeKeyDismiss = () => {
  return (
    <Dialog.Root>
      <StyledTrigger>open</StyledTrigger>
      <Dialog.Portal>
        <StyledOverlay />
        <StyledContent onEscapeKeyDown={(event: KeyboardEvent) => event.preventDefault()}>
          <StyledTitle>Make Reservation</StyledTitle>
          <StyledDescription>Fill the form to make reservation.</StyledDescription>
          <StyledClose>close</StyledClose>
        </StyledContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const NoPointerDownOutsideDismiss = () => {
  return (
    <Dialog.Root>
      <StyledTrigger>open</StyledTrigger>
      <Dialog.Portal>
        <StyledOverlay />
        <StyledContent onPointerDownOutside={(event: PointerEvent) => event.preventDefault()}>
          <StyledTitle>Make Reservation</StyledTitle>
          <StyledDescription>Fill the form to make reservation.</StyledDescription>
          <StyledClose>close</StyledClose>
        </StyledContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const WithPortalContainer = () => {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);

  return (
    <>
      <Dialog.Root>
        <StyledTrigger>open</StyledTrigger>
        <Dialog.Portal container={container}>
          <StyledOverlay />
          <StyledContent>
            <StyledTitle>Make Reservation</StyledTitle>
            <StyledDescription>Fill the form to make reservation.</StyledDescription>
            <StyledClose>close</StyledClose>
          </StyledContent>
        </Dialog.Portal>
      </Dialog.Root>
      <div ref={setContainer} />
    </>
  );
};

const StyledTrigger = styled(Dialog.Trigger)({
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  padding: '0 15px',
  fontSize: '15px',
  lineHeight: '1',
  fontWeight: '500',
  height: '35px',
  backgroundColor: 'white',
  color: '#000',
  boxShadow: '0 2px 10px gray',

  '&:hover': {
    backgroundColor: 'lightgray',
  },
});

const StyledOverlay = styled(Dialog.Overlay)({
  backgroundColor: 'lightgray',
  opacity: '0.4',
  position: 'fixed',
  inset: '0',
});

const StyledContent = styled(Dialog.Content)({
  backgroundColor: 'white',
  borderRadius: '6px',
  boxShadow: '0 2px 10px gray',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '450px',
  maxHeight: '85vh',
  padding: '25px',
  overflowY: 'scroll',
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

const StyledClose = styled(StyledTrigger)({
  backgroundColor: 'rgb(221, 243, 228)',
  color: 'rgb(24, 121, 78)',

  '&:focus': {
    boxShadow: '0 0 0 2px rgb(85, 143, 122)',
  },
  '&:hover': {
    backgroundColor: 'rgb(140, 210, 184)',
  },
});

const StyledFieldset = styled.fieldset`
  all: unset;
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 15px;
`;

const StyledLabel = styled.label`
  all: unset;
  font-size: 15px;
  color: #000;
  width: 90px;
  text-align: right;
`;

const StyledInput = styled.input`
  all: unset;
  width: 100%;
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 15px;
  line-height: 1;
  color: #000;
  box-shadow: 0 0 0 1px #94a3b8;
  height: 35px;

  &:focus {
    box-shadow: 0 0 0 2px #bae6fd;
  }
`;
