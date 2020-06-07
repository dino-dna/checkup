import { FunctionComponent, JSX, h } from "preact";
import { Heading } from "./Text";
import "./ErrorMessage.scss";

export const ErrorMessage: FunctionComponent<JSX.HTMLAttributes> = ({
  children,
  title,
  ...rest
}) => (
  <div className="ErrorMessage" {...rest}>
    <i className="ErrorMessage-icon icono-exclamationCircle" />
    {title && <Heading>{title}</Heading>}
    <div className="ErrorMessage-content">{children}</div>
  </div>
);
