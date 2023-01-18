import * as React from 'react';
import styled from '@emotion/styled';
import * as AlertDialog from './AlertDialog';
import mdx from './AlertDialog.mdx';

export default {
  title: 'over-ui/AlertDialog',
  parameters: {
    docs: {
      page: mdx,
    },
  },
};

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

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);
  const [online, setOnline] = React.useState(false);

  return (
    <div>
      <div>current : {online ? 'Online Mode' : 'Offline Mode'}</div>
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <StyledTrigger>{online ? 'Change to Offline Mode' : 'Change to Online Mode'}</StyledTrigger>
        <AlertDialog.Portal>
          <StyledOverlay />
          <StyledContent>
            <StyledTitle>
              Are you sure change to {online ? 'OFFLINE MODE' : 'Change to ONLINE MODE'}?
            </StyledTitle>
            <StyledDescription>
              With offline mode, your friends cannot find you in online list
            </StyledDescription>
            <StyledAction onClick={() => setOnline(!online)}>
              {online ? 'yes, hide me' : "yes, i'm alive"}
            </StyledAction>
            <StyledCancel> stay current</StyledCancel>
          </StyledContent>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
};

const StyledTrigger = styled(AlertDialog.Trigger)({
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

const StyledOverlay = styled(AlertDialog.Overlay)({
  backgroundColor: 'lightgray',
  opacity: '0.4',
  position: 'fixed',
  inset: '0',
});

const StyledContent = styled(AlertDialog.Content)({
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

const StyledTitle = styled(AlertDialog.Title)({
  margin: '0',
  fontWeight: '500',
  color: '#000',
  fontSize: '17px',
});

const StyledDescription = styled(AlertDialog.Description)({
  margin: '10px 0 20px',
  color: 'lightgray',
  fontSize: '15px',
  lineHeight: '1.5',
});

const StyledAction = styled(StyledTrigger)({
  backgroundColor: 'rgb(221, 243, 228)',
  color: 'rgb(24, 121, 78)',
  border: 'none',

  '&:focus': {
    boxShadow: '0 0 0 2px rgb(85, 143, 122)',
  },
  '&:hover': {
    backgroundColor: 'rgb(140, 210, 184)',
  },
});
const StyledCancel = styled(StyledTrigger)({
  backgroundColor: 'rgb(201, 124, 145)',
  color: 'rgb(161, 27, 50)',
  border: 'none',

  '&:focus': {
    boxShadow: '0 0 0 2px rgb(158, 30, 64)',
  },
  '&:hover': {
    backgroundColor: 'rgb(180, 97, 119)',
  },
});
