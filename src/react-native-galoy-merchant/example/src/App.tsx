/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'
import { View } from 'react-native'
import RNGaloyMerchantModule, {
  Counter,
  Merchants,
} from 'react-native-galoy-merchant'

const App = () => {
  useEffect(() => {
    console.log(RNGaloyMerchantModule)
  })

  return (
    <View style={{ flex:1 }}>
      <Counter />
      <Merchants />
    </View>
  )
}

export default App
