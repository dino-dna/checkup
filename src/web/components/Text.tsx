import { FunctionComponent, JSX, h } from "preact";
import clsx from "clsx";
import "./Text.scss";

export interface TextProps extends JSX.HTMLAttributes {
  bold?: boolean;
  center?: boolean;
  element?: keyof JSX.IntrinsicElements;
}

export const Text: FunctionComponent<TextProps> = ({
  bold,
  center,
  className,
  element: Component = "span",
  ...rest
}) => (
  <Component
    className={clsx(
      "Text",
      {
        "Text-bold": bold,
        "Text-center": center,
      },
      className
    )}
    {...rest}
  />
);

export const Heading: FunctionComponent<TextProps> = ({
  className,
  element: Component = "h1",
  ...rest
}) => <Text className={clsx("Text-heading", className)} {...rest} />;

export const Subheading: FunctionComponent<TextProps> = ({
  className,
  element: Component = "h2",
  ...rest
}) => <Text className={clsx("Text-subheading", className)} {...rest} />;

export const Body: FunctionComponent<TextProps> = ({
  className,
  element: Component = "p",
  ...rest
}) => <Text className={clsx("Text-body", className)} {...rest} />;

export const Caption: FunctionComponent<TextProps> = ({
  className,
  ...rest
}) => <Text className={clsx("Text-caption", className)} {...rest} />;

export const Code: FunctionComponent<TextProps & { block?: boolean }> = ({
  block,
  children,
  className,
  ...rest
}) =>
  block ? (
    <pre className={clsx("Text-code-block", className)} {...rest}>
      <code>{children}</code>
    </pre>
  ) : (
    <code className={clsx("Text-code", className)} {...rest}>
      {children}
    </code>
  );
