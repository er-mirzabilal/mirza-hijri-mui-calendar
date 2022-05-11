import * as React from 'react';
import * as PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useForkRef } from '@material-ui/core/utils';
// @ts-ignore
import momentHijri from  'moment-hijri';
import moment from 'moment';
import { useUtils } from './hooks/useUtils';
import { CalendarIcon } from './icons/CalendarIcon';
import { useMaskedInput } from './hooks/useMaskedInput';
import { DateInputProps, DateInputRefs } from './PureDateInput';
import { getTextFieldAriaText } from '../_helpers/text-field-helper';

const HIJRI_MONTHS: any = [
  'Muharram',
  'Safar',
  'Rabi-ul-Awwal',
  'Rabi-us Sani',
  'Jamadi-ul-Awwal',
  'Jamadi-us-Sani',
  'Rajab',
  'Shaban',
  'Ramadan',
  'Shawal',
  'Zil-Qadah',
  'Zul-Hijah'
]
export const KeyboardDateInput: React.FC<DateInputProps & DateInputRefs> = ({
  containerRef,
  inputRef = null,
  forwardedRef = null,
  disableOpenPicker: hideOpenPickerButton,
  getOpenDialogAriaText = getTextFieldAriaText,
  InputAdornmentProps,
  InputProps,
  openPicker: onOpen,
  OpenPickerButtonProps,
  openPickerIcon = <CalendarIcon />,
  renderInput,
  ...other
}) => {
  const utils = useUtils();
  const inputRefHandle = useForkRef(inputRef, forwardedRef);
  const textFieldProps = useMaskedInput(other);
  const adornmentPosition = InputAdornmentProps?.position || 'end';

  const value = textFieldProps?.inputProps?.value;
  let updatedProps = textFieldProps;

  if(value && !textFieldProps.error) {
    const momentDate = moment(value);
    const hijriDate =  momentHijri(momentDate);
    const formattedHijriDate = `${hijriDate.iDate()} ${ HIJRI_MONTHS[hijriDate.iMonth()]} ${hijriDate.iYear()}`
    updatedProps = {...textFieldProps, inputProps: {
        ...textFieldProps.inputProps,
        value: textFieldProps?.inputProps?.value ? `${textFieldProps?.inputProps?.value  }  -  ${  formattedHijriDate}` : ''
      },
    }
  }

  return renderInput({
    ref: containerRef,
    inputRef: inputRefHandle,
    ...updatedProps,
    InputProps: {
      ...InputProps,
      [`${adornmentPosition}Adornment`]: hideOpenPickerButton ? undefined : (
        <InputAdornment position={adornmentPosition} {...InputAdornmentProps}>
          <IconButton
            edge={adornmentPosition}
            data-mui-test="open-picker-from-keyboard"
            disabled={other.disabled}
            aria-label={getOpenDialogAriaText(other.rawValue, utils)}
            {...OpenPickerButtonProps}
            onClick={onOpen}
          >
            {openPickerIcon}
          </IconButton>
        </InputAdornment>
      ),
    },
  });
};

KeyboardDateInput.propTypes = {
  acceptRegex: PropTypes.instanceOf(RegExp),
  getOpenDialogAriaText: PropTypes.func,
  mask: PropTypes.string,
  OpenPickerButtonProps: PropTypes.object,
  openPickerIcon: PropTypes.node,
  renderInput: PropTypes.func.isRequired,
  rifmFormatter: PropTypes.func,
};
