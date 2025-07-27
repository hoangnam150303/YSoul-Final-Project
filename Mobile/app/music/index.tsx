import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { ArtistSlider } from '@/Components/Slider/ArtistSlider';
import { AlbumSlider } from '@/Components/Slider/AlbumSlider';
import { SingleSlider } from '@/Components/Slider/SingleSlider';
import { NavbarMusic } from '@/Components/Navbar/NavBarMusic';

export default function Index() {
    const [selectedType, setSelectedType] = useState<'All' | 'Artist' | 'Album' | 'Single'>('All');
    const [search, setSearch] = useState('');
    const category = [
        { id: 1, name: 'Newest' },
        { id: 2, name: 'Popular' },
    ];

    const renderSection = (
        title: string,
        Component: React.FC<{ category: string; search?: string }>
    ) => (
        <View className="mt-4">
            <Text className="text-xl font-bold text-white px-4 mt-6">{title}</Text>
            {category.map((item) => (
                <Component key={item.id} category={item.name} search={search} />
            ))}
        </View>
    );

    return (
        <View className="flex-1 bg-black">
            <NavbarMusic selectedType={selectedType} onTypeChange={setSelectedType} />

            {/* Search bar chỉ hiển thị khi xem Artist hoặc All */}
            {(selectedType === 'Artist' || selectedType === 'All') && (
                <TextInput
                    placeholder="Search artist..."
                    placeholderTextColor="#999"
                    value={search}
                    onChangeText={setSearch}
                    className="bg-white text-black mx-4 mt-4 rounded-md px-4 py-2"
                />
            )}

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
}
