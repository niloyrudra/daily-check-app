import { LabelValueOption } from '@/types';
import React from 'react';
import DropDownComponent from '../form-components/DropDownComponent';

const options: LabelValueOption[] = [
  { label: "1 hr", value: "1" },
  { label: "2 hrs", value: "2" },
  { label: "3 hrs", value: "3" },
];

interface ComponentProps {
    existingData: string,
    handler: (e: string | undefined) => void
}

const ResponseTimeComponent: React.FC<ComponentProps> = ({handler, existingData="1"}) => {
    const [value, setValue] = React.useState<string>(existingData);    
    const responseTimeHandler = async (time: string) => {
        handler(time)
        setValue(time)
    }
    return (
        <DropDownComponent
            onSelectHanlder={responseTimeHandler}
            options={options}
            value={value}
            placeholder="Select your response time"
            title="Waiting period before we alert your safety contact(s):" // "Your Response Time:"
        />
    )
}

export default ResponseTimeComponent