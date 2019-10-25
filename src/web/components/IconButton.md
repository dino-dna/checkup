```jsx
import * as IconButtons from './IconButton'
;
<>
  {Object.keys(IconButtons)
    .filter(name => name !== 'IconButton')
    .map(name => {
      const Comp = IconButtons[name]
      return <Comp key={name} onClick={console.log} />
    })
  }
</>