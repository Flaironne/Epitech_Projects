import { Pressable, View } from 'react-native';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState(colorScheme || 'light');

  const handleToggle = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    setColorScheme(newTheme);
  };

  return (
    <Pressable onPress={handleToggle}>
      <View style={{ 
        backgroundColor: '#0088CE', 
        padding: 8, 
        borderRadius: 20,
        marginLeft: 8,
      }}>
        {currentTheme === 'dark' ? (
          <SunIcon size={20} color="white" />
        ) : (
          <MoonStarIcon size={20} color="white" />
        )}
      </View>
    </Pressable>
  );
}
