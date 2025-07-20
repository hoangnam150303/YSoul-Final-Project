import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

interface Props {
    selectedType: 'All' | 'Artist' | 'Album' | 'Single';
    onTypeChange: (type: 'All' | 'Artist' | 'Album' | 'Single') => void;
}

export const NavbarMusic: React.FC<Props> = ({ selectedType, onTypeChange }) => {
    const types: ('All' | 'Artist' | 'Album' | 'Single')[] = ['All', 'Artist', 'Album', 'Single'];

    return (
        <View className="flex-row justify-around pt-4 pb-2 bg-zinc-900">
            {types.map((type) => (
                <TouchableOpacity key={type} onPress={() => onTypeChange(type)}>
                    <Text
                        className={`text-sm font-bold ${selectedType === type ? 'text-purple-400' : 'text-white'
                            }`}
                    >
                        {type}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};
