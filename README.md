galoy-plugin-merchant
===================

This project contains two main projects:
1. The graphql subgraph for the merchants data `http://localhost:4003/graphql`
2. A frontend component that consumes the graphql data via the Supergraph `http://localhost:4000/graphql` using the apollo client
```
  me {
    phone
    merchants {
      address
      name
      acceptsBitcoin
    }
  }
```

This allow separations of concerns and for sub-components. The pliugins can be developed 
independently of the Galoy core banking application.

This enables a plugin and microservice architecure. 

![Image](./docs/SuperGraph.png?raw=true)

Run the merchants subgraph
---------------------
1. `make start`
2. This should start http://localhost:4003/graphql
3. you can test this query
```
{
  merchants {
    id
    name
    address
    acceptsBitcoin
  }
}
```

Install the react-native component
-------------------------
Now we can install the component into galoy-mobile app.

1. Add this to `galoy-mobile/tsconfig.json` (note that itsa relative link to the location you have
the galoy-plugin-merchant code)
```

"paths": {

  "@app/*": ["app/*"],
  "react-native-galoy-merchant": ["../galoy-plugin-merchant/src/react-native-galoy-merchant/src"]

}

```
2. Also add it to the package.json as a dependency
```
{

  "dependencies": {

    "react-native-galoy-merchant": "file:../galoy-plugin-merchant/src/react-native-galoy-merchant/src",

}

```
3. Add this to the metro.config
```

extraNodeModules: {
  
  "react-native-galoy-merchant": path.resolve(__dirname, "../galoy-plugin-merchant/src/react-native-galoy-merchant/src")

}

```
3. `yarn install`
4. Live reload does not yet work (@todo) so run `yarn upgrade react-native-galoy-merchant` to reflect changes in the galoy-mobile app.

Usage
```
import { Merchants } from "react-native-galoy-merchant"

export const MerchantsComponenet = () => {
  return (
    <Merchants />
  )
}
<Merchants>
```

NPM Package
-------------
If you deploy to npm or yarn you can, for example, run `yarn add react-native-galoy-merchant` 
in your project. 

Tooling
-------------
This was created using this templating tool: 
`react-native-module-template`. See docs here: https://github.com/demchenkoalex/react-native-module-template 




