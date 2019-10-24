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