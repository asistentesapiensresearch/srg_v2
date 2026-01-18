import useAutocomplete, {
    AutocompleteGetItemProps,
    UseAutocompleteProps,
} from '@mui/material/useAutocomplete';
import CheckIcon from '@mui/icons-material/Check';
import { XIcon } from 'lucide-react';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { useLogo } from '@src/hooks/useLogo';
import { useState } from 'react';

// ---------- STYLES ----------
const Root = styled('div')(({ theme }) => ({
    color: 'rgba(0,0,0,0.85)',
    fontSize: '14px',
}));

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled('div')(({ theme }) => ({
    border: '1px solid #c3c3c3',
    backgroundColor: '#fff',
    borderRadius: '4px',
    display: 'flex',
    flexWrap: 'wrap',
    '&.focused': {
        borderColor: '#212121'
    },
    '& input': {
        backgroundColor: '#fff',
        color: 'rgba(0,0,0,.85)',
        height: '1.4375em',
        minWidth: '30px',
        flexGrow: 1,
        border: 0,
        outline: 0,
    },
}));

// ---------- ITEM ----------
interface ItemProps extends ReturnType<AutocompleteGetItemProps<true>> {
    option: LogoOptionType;
    onDelete: () => void;
}

function Item({ option, onDelete, ...other }: ItemProps) {
    return (
        <div {...other} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <StorageImage
                alt={option.name}
                path={option.key}
                className="rounded-full"
                style={{ height: 22 }}
            />
            <XIcon onClick={onDelete} style={{ cursor: "pointer" }} className='w-6' />
        </div>
    );
}

const StyledItem = styled(Item)(({ theme }) => ({
    alignItems: 'center',
    margin: '2px',
    backgroundColor: '#fafafa',
    border: `1px solid #e8e8e8`,
    borderRadius: '2px',
    padding: '0 4px 0 10px',
    '& svg': {
        fontSize: '12px',
        padding: '4px',
    },
}));

// ---------- LISTBOX ----------
const Listbox = styled('ul')(({ theme }) => ({
    width: '300px',
    margin: '2px 0 0',
    padding: 0,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: '#fff',
    maxHeight: '250px',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgb(0 0 0 / 0.15)',
    zIndex: 2,
    '& li': {
        padding: '5px 12px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
    },
}));

// ---------- MAIN COMPONENT ----------
function LogoComponentFN<Value extends LogoOptionType>(
    props: UseAutocompleteProps<Value, true, false, false>,
) {
    const {
        getRootProps,
        getInputLabelProps,
        getInputProps,
        getItemProps,
        getListboxProps,
        getOptionProps,
        groupedOptions,
        value,
        focused,
        setAnchorEl,
    } = useAutocomplete({
        multiple: true,
        ...props,
    });

    return (
        <Root>
            <div {...getRootProps()}>
                <Label {...getInputLabelProps()}>Logos</Label>

                <InputWrapper ref={setAnchorEl} className={`${focused && 'focused'} w-full p-3 border-[#c3c3c3]`}>
                    {value.map((option, index) => {
                        const { key, ...itemProps } = getItemProps({ index });

                        return (
                            <StyledItem
                                key={key}
                                {...itemProps}
                                option={option}
                                onDelete={() => {
                                    const newValue = value.filter((v, i) => i !== index);
                                    props.onChange?.(
                                        null,                    // event
                                        newValue as any,         // value
                                        'removeOption',          // reason
                                        { option }               // details
                                    );
                                }}
                            />
                        );
                    })}

                    <input {...getInputProps()} />
                </InputWrapper>
            </div>

            {groupedOptions.length > 0 && (
                <Listbox {...getListboxProps()}>
                    {groupedOptions.map((option, index) => {
                        const { key, ...optionProps } = getOptionProps({ option, index });
                        return (
                            <li key={key} {...optionProps} className='cursor-pointer'>
                                <StorageImage
                                    alt={option.name}
                                    path={option.key}
                                    style={{ height: 20 }}
                                />
                            </li>
                        );
                    })}
                </Listbox>
            )}
        </Root>
    );
}

// ---------- EXPORT ----------
export default function LogoComponent({
    onChange
}) {
    const { logos } = useLogo();

    const [selectedLogos, setSelectedLogos] = useState<LogoOptionType[]>([]);

    return (
        <LogoComponentFN<LogoOptionType>
            options={logos}
            value={selectedLogos}
            onChange={(_, newValue) => {
                setSelectedLogos(newValue)
                if(onChange) onChange(newValue)
            }}
            getOptionLabel={(option) => option.name}
        />
    );
}

interface LogoOptionType {
    id: string;
    name: string;
    key: string; // path en Storage
}
