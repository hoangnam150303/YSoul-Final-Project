import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ArtistSlider } from '@/Components/Slider/ArtistSlider';
import { AlbumSlider } from '@/Components/Slider/AlbumSlider';
import { SingleSlider } from '@/Components/Slider/SingleSlider';

import { NavbarMusic } from '@/Components/Navbar/NavBarMusic';

export default function index() {
    const [selectedType, setSelectedType] = useState<'All' | 'Artist' | 'Album' | 'Single'>('All');

    const category = [
        { id: 1, name: 'Newest' },
        { id: 2, name: 'Popular' },
    ];

    const renderSection = (title: string, Component: React.FC<{ category: string }>) => (
        <View className="mt-4">
            <Text className="text-xl font-bold text-white px-4 mt-6">{title}</Text>
            {category.map((item) => (
                <Component key={item.id} category={item.name} />
            ))}
        </View>
    );

    return (
        <View className="flex-1 bg-black">
            <NavbarMusic selectedType={selectedType} onTypeChange={setSelectedType} />
            <ScrollView className="pb-20">
                {selectedType === 'All' && (
                    <>
                        {renderSection('Artist', ArtistSlider)}
                        {renderSection('Album', AlbumSlider)}
                        {renderSection('Single', SingleSlider)}
                    </>
                )}

                {selectedType === 'Artist' && renderSection('Artist', ArtistSlider)}
                {selectedType === 'Album' && renderSection('Album', AlbumSlider)}
                {selectedType === 'Single' && renderSection('Single', SingleSlider)}
            </ScrollView>
        </View>
    );
};
