import { Theme } from '@/constants/theme';
import { LabelValueOption } from '@/types';
import React from 'react';
import { View } from 'react-native';
import { Dropdown } from 'react-native-paper-dropdown';
import ActivityIndicatorComponent from '../ActivityIndicatorComponent';
import TitleComponent from '../TitleComponent';

interface NumberDropdownProps {
  onSelectHanlder: (value: string) => void;
  options: LabelValueOption[];
  value: string;
  loading?: boolean;
  title?: string;
  label?: string;
  placeholder?: string;
}

const NumberDropdown: React.FC<NumberDropdownProps> = ({ onSelectHanlder, options, value, loading, title, placeholder }) => {
  return (
    <View style={{gap:10, marginBottom: 20}}>
      <TitleComponent
        // title="Your Response Time:"
        title={title || ""}
        titleStyle={{textAlign:"center"}}
      />

      <View style={{gap:20 }}>
        <View style={{ backgroundColor: '#FFFFFF' }}>

          <Dropdown
            label=""
            placeholder={placeholder || ""}
            mode="outlined" // "outlined" / "flat"
            value={value}
            options={options}
            onSelect={ (time: string | undefined) => (time) && onSelectHanlder(time) }
            maxMenuHeight={300}
            menuContentStyle={{
              borderColor: Theme.primary,
              borderRadius: 30
            }}
          />
        </View>

        {loading && (<ActivityIndicatorComponent />)}

      </View>
    </View>
  );
};

export default NumberDropdown;