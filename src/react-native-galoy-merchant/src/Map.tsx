/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable simple-import-sort/imports */
/* eslint-disable prettier/prettier */
import { gql, useQuery } from "@apollo/client"
import { useFocusEffect } from "@react-navigation/native"
// import { StackNavigationProp } from "@react-navigation/stack"
import * as React from "react"
import { useCallback, useState, useRef, useEffect } from "react"
import { PermissionsAndroid, StyleSheet, Text, View, useWindowDimensions, ScrollView, TouchableHighlight } from "react-native"
// import { Button } from "react-native-elements"
import MapView, { Callout, CalloutSubview, Marker } from "react-native-maps"
// import { PrimaryStackParamList } from "../../navigation/stack-param-lists"
// import { isIos } from "../../utils/helper"
// import { translateUnknown as translate } from "@galoymoney/client"
// import { palette } from "../../theme/palette"
// import { toastShow } from "../../utils/toast"
// import useToken from "../../utils/use-token"
import { SwipeablePanel } from 'rn-swipeable-panel';
import mapStyle from './mapStyle.json';



const QUERY_BUSINESSES = gql`
  query businessMapMarkers {
    businessMapMarkers {
      username
      mapInfo {
        title
        coordinates {
          longitude
          latitude
        }
      }
    }
  }
`

const QUERY_MERCHANTS = gql`
  query merchants {
    me {
      phone
      merchants {
        name
        acceptsBitcoin
        address
        longitude
        latitude
      }
    }
  }
`

type Props = {

}

export const Map = ({ }: Props) => {

    const { data, error, refetch } = useQuery(QUERY_MERCHANTS, {
        notifyOnNetworkStatusChange: true,
    })

    const { height, width } = useWindowDimensions();
    const styles = StyleSheet.create({
        android: { marginTop: 18 },
        customView: {
            alignItems: "center",
            margin: 12,
        },
        ios: { paddingTop: 12 },
        map: {
            height: "100%",
            width: width,
        },
        title: { color: 'grey', fontSize: 18 },
        slide: {
            backgroundColor: "white",
            borderRadius: 20,
            height: 90
        },
        scrollViewContainer: { maxWidth: "100%" },
        scrollView: {
            width: "100%",
            flex: 1
        }
    })

    const [isRefreshed, setIsRefreshed] = React.useState(false)
    //   const { data, error, refetch } = useQuery(QUERY_BUSINESSES, {
    //     notifyOnNetworkStatusChange: true,
    //   })
    const [panelProps, setPanelProps] = useState({
        fullWidth: true,
        noBackgroundOpacity: true,
        //showCloseButton: true,
        isPanelActive: true,
        styles: { zIndex: 100 },
        barContainerStyle: { backgroundColor: '#2f3948' },
        closeOnTouchOutside: false,
        onClose: () => closePanel(),
        onPressCloseButton: () => closePanel(),
    });
    const [isPanelActive, setIsPanelActive] = useState(false);
    const [smallPanelHeight, setSmallPanelHeight] = useState(250);
    const [canTouchMap, setCanTouchMap] = useState(true);
    const swipeMenuRef = useRef<any>();
    const maps = data?.businessMapMarkers ?? []

    useEffect(() => {
        openPanel();
    }, [])

    useFocusEffect(() => {
        if (!isRefreshed) {
            setIsRefreshed(true)
            refetch()
        }
    })

    useFocusEffect(
        useCallback(() => {
            requestLocationPermission()
        }, []),
    )

    if (error) {
        //toastShow(error.message)
    }


    const openPanel = () => {
        setIsPanelActive(true);
    };

    const closePanel = () => {
        setIsPanelActive(false);
        // todo debounce
        setTimeout(() => {
            setIsPanelActive(true);
        }, 500)

    };


    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the location")
            } else {
                console.log("Location permission denied")
            }
        } catch (err) {
            console.warn(err)
        }
    }


    const [poi, setPoi] = useState<any>(null);
    function onPoiClick(e: any) {
        const poiCopy = e.nativeEvent;
        setPoi(poiCopy);
    }

    const markers: JSX.Element[] = []
    maps.forEach((item: any) => {
        const onPress = () => { }
        markers.push(
            <Marker
                coordinate={item.mapInfo.coordinates}
                key={item.username}
                pinColor={'orange'}
            />
        )
    })

    data?.me?.merchants?.forEach((item: any) => {
        if (item?.latitude) {
            markers.push(
                <Marker
                    coordinate={{
                        latitude: item?.latitude,
                        longitude: item?.longitude
                    }}
                    key={item.name}
                    pinColor={'orange'}
                    onPress={ () =>{
                        setPoi({
                            name: item?.name,
                            address: item?.address,
                            acceptsBitcoin: item?.acceptsBitcoin
                        })
                    }}
                />
            )
        }
    })



    return (
        <View>
            <MapView
                style={styles.map}
                showsUserLocation={true}
                zoomEnabled={true}
                customMapStyle={mapStyle}
                initialRegion={{
                    latitude: 30.26421,
                    longitude: -97.74665,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
                scrollEnabled={canTouchMap}
                onPoiClick={onPoiClick}>
                {markers}
            </MapView>

            <View
                onTouchStart={() => { setCanTouchMap(false) }}
                onTouchEnd={() => { setCanTouchMap(true) }}>
                <SwipeablePanel
                    {...panelProps}
                    isActive={isPanelActive}
                    allowTouchOutside={true}
                    smallPanelHeight={smallPanelHeight}
                    ref={swipeMenuRef}>
                    <View
                        style={[styles.scrollViewContainer, { flex: 1, backgroundColor: '#2f3948', padding: 22, height: 700 }]}>
                        <ScrollView style={styles.scrollView} horizontal>
                            <TouchableHighlight style={{ flex: 1 }}>
                                <>
                                    {/* {data?.me?.merchants && (
                                        <Text>{JSON.stringify(data?.me?.merchants)}</Text>
                                    )} */}
                                    {poi && (
                                        <View style={{ flexDirection: "row" }}>
                                            <View style={{ backgroundColor: 'white', padding: 22, height: 100, width: 225, borderRadius: 25, marginRight: 8 }}>
                                                <Text style={{ color: 'black' }}>{poi?.name}</Text>
                                                {poi?.address && <Text style={{ color: 'black' }}>{poi.address}</Text>}
                                                {poi?.acceptsBitcoin && <Text style={{ color: 'black' }}>Accepts Bitcoin!</Text>}
                                            </View>
                                        </View>
                                    )}

                                </>
                            </TouchableHighlight>
                        </ScrollView>
                    </View>
                </SwipeablePanel>
            </View>
        </View>
    )
}
