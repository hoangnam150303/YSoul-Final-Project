import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface SubMenuProps {
    type: 'music' | 'movie' | 'social' | 'market';
    onSelect?: (type: string) => void;
}

const allTypes = ['Movie', 'Music', 'Social', 'Market'];

const SubMenu: React.FC<SubMenuProps> = ({ type, onSelect }) => {
    const [open, setOpen] = useState(false);

    const menuItems = allTypes.filter(
        (item) => item.toLowerCase() !== type.toLowerCase()
    );

    return (
        <View style={styles.wrapper}>
            {/* Toggle Button */}
            <TouchableOpacity onPress={() => setOpen(!open)} style={styles.menuButton}>
                <Image
                    source={{
                        uri: 'https://res.cloudinary.com/dnv7bjvth/image/upload/v1752941832/menu_ihkfze.png',
                    }}
                    style={styles.icon}
                />
            </TouchableOpacity>

            {/* Dropdown */}
            {open && (
                <View style={styles.dropdown}>
                    {menuItems.map((item, idx) => (
                        <TouchableOpacity
                            key={item}
                            onPress={() => {
                                onSelect?.(item.toLowerCase());
                                setOpen(false);
                            }}
                            style={[
                                styles.menuItem,
                                idx === menuItems.length - 1 && { borderBottomWidth: 0 },
                            ]}
                        >
                            <Text style={styles.menuText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

export default SubMenu;

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 50,
    },
    menuButton: {
        padding: 8,
        borderRadius: 999,
        backgroundColor: '#4B5563', // gray-700
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    dropdown: {
        marginTop: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb', // gray-200
    },
    menuText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1f2937', // gray-800
    },
});
