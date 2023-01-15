import * as React from 'react';
import styled from 'styled-components';
import * as Dialog from './Dialog';
import mdx from './Dialog.mdx';

export default {
  title: 'stories/Dialog',
  component: Dialog,
  parameters: {
    docs: {
      page: mdx,
    },
  },
};

export const Styled = () => {
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

export const NonModal = () => {
  return (
    <>
      <Dialog.Root modal={false}>
        <StyledTrigger>open (non-modal)</StyledTrigger>
        <Dialog.Portal>
          <StyledOverlay />
          <StyledContent onInteractOutside={(event: Event) => event.preventDefault()}>
            <StyledTitle>Make Reservation</StyledTitle>
            <StyledDescription>Fill the form to make reservation.</StyledDescription>
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

export const CodeSandBox = () => {
  return (
    <>
      <iframe
        src="https://codesandbox.io/embed/clever-mendeleev-2lz7tn?fontsize=14&hidenavigation=1&theme=dark&editorsize=0&hidedevtools=1"
        style={{
          width: '100%',
          height: '500px',
          border: '0',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
        title="clever-mendeleev-2lz7tn"
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      ></iframe>
    </>
  );
};
