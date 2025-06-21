import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const _layout = () => {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <>
                            <ImageBackground
                                src='https://res.cloudinary.com/dnv7bjvth/image/upload/v1750500141/2efba1d6-6674-42e7-b090-841ce822e81b.png'
                                className='flex flex-row w-full flex-1 min-w-[112px] min-h-14 mt-4 justify-center items-center rounded-full overflow-hidden'
                            >
                                <Image src='https://res.cloudinary.com/dnv7bjvth/image/upload/v1750500588/home-agreement_ajwoys.png' tintColor="#151312" className='size-5' />
                                <Text className='text-secondary text-base font-semibold ml-2'>Home</Text>
                            </ImageBackground>
                        </>
                    )
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="favourite"
                options={{
                    title: 'Favourite',
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false
                }}
            />
        </Tabs>
    )
}

export default _layout
