/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import { gql, useQuery } from "@apollo/client"
import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const QUERY_MERCHANTS = gql`
  query merchants {
    me {
      id
      phone
      defaultAccount {
        wallets {
          balance
        }
      }
      merchants {
        name
        acceptsBitcoin
        address
      }
    }
  }
`

export const Merchants = () => {

  const { data, error , refetch } = useQuery(QUERY_MERCHANTS, {
    notifyOnNetworkStatusChange: true,
  })
 

  useEffect(() => {
    
  }, [data])

  return (
    <View style={styles.container}>
      <Text style={{ color: 'red' }}>
        Merchants
        {data ? JSON.stringify(data) : 'loading...'}
      </Text>
    </View>
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