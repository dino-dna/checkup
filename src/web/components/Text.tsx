import React from 'react'
import clsx from 'clsx'
import './Text.scss'

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  bold?: boolean
  center?: boolean
  element?: keyof React.ReactHTML
}

export const Text: React.FC<TextProps> = ({
  bold,
  center,
  className,
  element: Component = 'span',
  ...rest
}) => (
  <Component
    className={clsx(
      'Text',
      {
        'Text-bold': bold,
        'Text-center': center
      },
      className
    )}
    {...rest}
  />
)

export const Heading: React.FC<TextProps> = ({
  className,
  element: Component = 'h1',
  ...rest
}) => <Text className={clsx('Text-heading', className)} {...rest} />

export const Subheading: React.FC<TextProps> = ({
  className,
  element: Component = 'h2',
  ...rest
}) => <Text className={clsx('Text-subheading', className)} {...rest} />

export const Body: React.FC<TextProps> = ({
  className,
  element: Component = 'p',
  ...rest
}) => <Text className={clsx('Text-body', className)} {...rest} />

export const Caption: React.FC<TextProps> = ({ className, ...rest }) => (
  <Text className={clsx('Text-caption', className)} {...rest} />
)

export const Code: React.FC<TextProps & { block?: boolean }> = ({
  block,
  children,
  className,
  ...rest
}) =>
  block ? (
    <pre className={clsx('Text-code', className)} {...rest}>
      <code>{children}</code>
    </pre>
  ) : (
    <code className={clsx('Text-code', className)} {...rest}>
      {children}
    </code>
  )
