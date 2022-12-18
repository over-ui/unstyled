type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

export type Props<C extends React.ElementType, Props = {}> = Props &
  AsProp<C> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

export type Ref<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>["ref"];

export type PropsWithRef<C extends React.ElementType, P = {}> = Props<C, P> & {
  ref?: Ref<C>;
};

type DisplayName = {
  displayName?: string;
};

export type Component<C extends React.ElementType, _Props> = (<
  T extends React.ElementType = C,
>(
  props: PropsWithRef<T, _Props>,
) => React.ReactElement | null) &
  DisplayName;
