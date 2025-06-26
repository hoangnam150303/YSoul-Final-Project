import { Image, ImageBackground, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
const _layout = () => {
    const TabIcon = ({ focused, icon, title }: any) => {
        if (focused) {
            return (
                <ImageBackground
                    src='https://res.cloudinary.com/dnv7bjvth/image/upload/v1750500141/2efba1d6-6674-42e7-b090-841ce822e81b.png'
                    className='flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden'
                >
                    <Image src={icon} tintColor="#151312" className='size-5' />
                    <Text className='text-secondary text-base font-semibold ml-2'>{title}</Text>
                </ImageBackground>
            )
        } else {
            return (
                <View className='size-full justify-center items-center mt-4 rounded-full'>
                    <Image src={icon} tintColor="#A8B5DB" className='size-5' />
                </View>
            )
        }
    }

    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                tabBarStyle: {
                    backgroundColor: '#0f0D23',
                    borderRadius: 50,
                    marginHorizontal: 10,
                    marginBottom: 36,
                    height: 52,
                    position: 'absolute',
                    overflow: 'hidden',
                    borderColor: '0f0d23'
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <>
                            <TabIcon focused={focused} icon='https://res.cloudinary.com/dnv7bjvth/image/upload/v1750500588/home-agreement_ajwoys.png' title='Home' />
                        </>
                    )
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <>
                            <TabIcon focused={focused} icon='https://res.cloudinary.com/dnv7bjvth/image/upload/v1750571925/search_i8qaaa.png' title='Search' />
                        </>
                    )
                }}
            />
            <Tabs.Screen
                name="favourite"
                options={{
                    title: 'Favourite',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <>
                            <TabIcon focused={focused} icon='https://res.cloudinary.com/dnv7bjvth/image/upload/v1750571924/heart_iysae0.png' title='Favourite' />
                        </>
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <>
                            <TabIcon focused={focused} icon='https://res.cloudinary.com/dnv7bjvth/image/upload/v1750571924/account_wwflfb.png' title='Profile' />
                        </>
                    )
                }}
            />


        </Tabs>
    )
}
export default _layout
