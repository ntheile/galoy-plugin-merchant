/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable simple-import-sort/imports */
/* eslint-disable prettier/prettier */
import { gql, useQuery } from "@apollo/client"
import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Map } from './Map'


export const Merchants = () => {


  return (
    <Map />
    // <View style={styles.container}>
    //   <Text style={{ color: 'red' }}>
    //     Merchants
        
    //   </Text>
    // </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
})