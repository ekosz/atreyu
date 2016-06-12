# Atreyu - The hero that connects Falcor to React

Atreyu is a library to help Falcor and React pass data from one another and
create rich applications.

## API

### `<Provider falcor>`

Makes falcor available to the `withQuery()` calls in the component hierarchy
below. Normally, you can't use `withQuery()` without wrapping the root
component in `<Provider>`.

#### Props

* `falcor` (*[Falcor Model](https://netflix.github.io/falcor/doc/Model.html)*):
  The single Falcor model in your application.
* `children` (*ReactElement*) The root of your component hierarchy.

### `withQuery([query], [options])`

#### Arguments

* [`query`] \(*String* or *Array* or *Function*): If provided, Atreyu will
  fetch this query from its Falcor source on mount and prop update. The query
  can be a single [falcor
  path](https://netflix.github.io/falcor/documentation/paths.html) or an array
  of them. If a function is given, it will be called with the current props and
  expects to get a path or pathSet back. See below for examples of different
  queries.
* [`options`] *(Object)*
  * [`pure = true`] *(Boolean)*: If true, implements `shouldComponentUpdate`
    and shallowly compares the incoming data, preventing unnecessary updates,
    assuming that the component is a “pure” component and does not rely on any
    input or state other than its props and the data returned from Falcor.
    *Defaults to `true`.*
  * [`deferRendering = true`] *(Boolean)*: If true, defers the rendering of
    a component until the initial data comes back from Falcor. Until then the
    component will `return null;` *Defaults to `true`.*
  * [`throwOnError = true`] *(Boolean)*: If true, the container will throw an
    error if the fetching from falcor fails. If false, the error will be passed
    down as a prop instead. *Defaults to `true`.*

## Basic Examples

### Example: Static path

```jsx
import { withQuery } from 'atreyu';

function Avatar({ size = 100, data: { name, email, avatarUrl } }) {
  if (avatarUrl) return <img width="100" src={avatarUrl} alt={name} />

  return <Gravatar alt={name} size={size} email={email} />;
}

export default withQuery(`my["name", "email", "avatarUrl"]`)(Avatar);
```

### Example: Dynamic paths

```js
function UserPage({ userId, data: { usersById }}) {
  const user = usersById[userId];

  return (
    <div>
      <h1>{user.name} - {user.email}</h1>
      <h3>Works at {user.company.name}</h3>
    </div>
  );
}

export default withQuery(props => ([
  ['usersById', props.userId, ['name', 'email'],
  ['usersById', props.userId, 'company', ['name']
]))(UserPage),
```

## Advanced Examples

### Example: Delegating paths to children

```js
// In InfoBar.js
function InfoBar({ status }) {
  const colorMap = { good: 'green', bad: 'red' };

  return <div style={{ backgroundColor: colorMap[status] }} />;
}

InfoBar.queries = {
  user: () => ['status'],
};

// In UserPage.js
function UserPage({ userId, data: { usersById }}) {
  const user = usersById[userId];

  return (
    <div>
      <h1>{user.name} - {user.email}</h1>
      <InfoBar {...user} />
    </div>
  );
}

export default withQuery(props => ([
  ['usersById', props.userId, ['name', 'email'].concat(InfoBar.queries.user())]
]))(UserPage);
```

### Example: Combining with recompose

As can be seen in the `UserPage` examples sometimes dealing with the data prop
can be a pain and requires business logic to be put into the React view to
consume it. [`recompose`](https://github.com/acdlite/recompose) is a library for
creating higher order components that can easily transform props as they flow
through the components. This can greatly simplify your React components.

```js
import { compose, mapProps } from 'recompose';

const UserPage = ({ name, email, company }) =>
  <div>
    <h1>{name} - {email}</h1>
    <h3>Works at {company.name}</h3>
  </div>

export default compose(
  withQuery(props => [
    ['usersById', props.userId, ['name', 'email']],
    ['usersById', props.userId, 'company', 'name'],
  ]),
  mapProps(props => ({
    ...props.data.usersById[props.userId],
  }))
)(UserPage);
```

### Example: Multiple fetches

Sometimes you need the results of a previous fetch to perform another one. To do
that with Atreyu you just need to compose multiple `withQuery`s together. The
component will automatically defer the second fetch until the first one is done.

```js
import { compose } from 'recompose';
import { range } from 'lodash';

function Items({ data: { items } }) {
  return (
    <div>
      {range(items.length).map(idx => {
        const item = items[idx];
        return item && <Item {...item} />;
      })}
    </div>
  );
}

export default compose(
  withQuery(['items', 'length']),
  withQuery(props => ({
    const length = props.data.items.length;
    return [
      ['items', 'length'],
      ['items', { length }, Item.queries.item()]
    ];
  }))
)(Items);
```

### Example: Using ES7 decorator syntax

**WARNING**: The decorator syntax is still in flux and is prone to change. You
may not want to use it just yet. But if you want to live on the bleeding edge
this would be how to do it.

```js
@withQuery(['my', ['name', 'email', 'avatarUrl']])
export default function Avatar({ size = 100, data: { name, email, avatarUrl } }) {
  if (avatarUrl) return <img width="100" src={avatarUrl} alt={name} />

  return <Gravatar alt={name} size={size} email={email} />;
}
```

## Inspiration

* [relay](https://github.com/facebook/relay) - This library tries to emulate
  a lot of the things relay does for GraphQL backed React applications. It
  served as a great guidepost of how to to design the library.
* [falcor-react](https://github.com/giovannicalo/falcor-react) - This library
  already does a lot that Atreyu is attempting.
  [giovannicalo](https://github.com/giovannicalo) had done a lot of the leg
  work, I just wanted to architect the solution a little differently.
* [redux](https://github.com/reactjs/redux) - The Redux codebase is a constant
  source of reference material of how to structure a well run library.
