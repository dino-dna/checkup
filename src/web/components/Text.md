User Interface text comes in a few sizes:

```jsx
import { Body, Caption, Heading, Subheading } from './Text'
;
<>
  <Heading>Heading</Heading>
  <Subheading>Subheading</Subheading>
  <Body>Body</Body>
  <Caption>Caption</Caption>
</>
```

Add the `bold` property for a bold version:

```jsx
import { Body } from './Text'
;
<Body bold>Very heavy stuff</Body>
```

Add the `center` property to center text:

```jsx
import { Heading } from './Text'
;
<Heading center>Lorem ispum dolor</Heading>
```

Use the `Text` export to style text within other text:

```jsx
import { Caption, Text } from './Text'
;
<Caption>Lorem ipsum <Text bold>dolor sit</Text> amet</Caption>
```

Use the `Code` export for pre-formatted code or machine output:

```jsx
import { Body, Code } from './Text'
;
<Body>Be careful with <Code>this</Code> and scope in JavaScript!</Body>
```

Use the `block` property for a styled `pre`:
```jsx
import { Code } from './Text'
;
<Code block>Something has happened</Code>
```
