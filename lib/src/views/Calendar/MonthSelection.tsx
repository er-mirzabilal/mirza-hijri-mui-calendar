import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Month, MonthProps } from './Month';
import { useUtils, useNow } from '../../_shared/hooks/useUtils';
import { PickerOnChangeFn } from '../../_shared/hooks/useViews';

export interface MonthSelectionProps<TDate> {
  date: TDate | null;
  minDate: TDate;
  maxDate: TDate;
  onChange: PickerOnChangeFn<TDate>;
  disablePast?: boolean | null | undefined;
  disableFuture?: boolean | null | undefined;
  onMonthChange?: (date: TDate) => void | Promise<void>;
  renderMonth?: (date: TDate, monthProps: MonthProps) => JSX.Element;
  hijri?: boolean | null | undefined;
}

export const useStyles = makeStyles(
  {
    root: {
      width: 310,
      display: 'flex',
      flexWrap: 'wrap',
      alignContent: 'stretch',
    },
  },
  { name: 'MuiPickersMonthSelection' }
);

export function MonthSelection<TDate>({
  date,
  disableFuture,
  disablePast,
  maxDate,
  minDate,
  onChange,
  onMonthChange,
  renderMonth,
  hijri
}: MonthSelectionProps<TDate>) {
  const utils = useUtils<TDate>();
  const now = useNow<TDate>();
  const classes = useStyles();
  const currentMonth = utils.getMonth(date || now);

  const shouldDisableMonth = (month: TDate) => {
    const firstEnabledMonth = utils.startOfMonth(
      disablePast && utils.isAfter(now, minDate) ? now : minDate
    );

    const lastEnabledMonth = utils.startOfMonth(
      disableFuture && utils.isBefore(now, maxDate) ? now : maxDate
    );

    const isBeforeFirstEnabled = utils.isBefore(month, firstEnabledMonth);
    const isAfterLastEnabled = utils.isAfter(month, lastEnabledMonth);

    return isBeforeFirstEnabled || isAfterLastEnabled;
  };

  const onMonthSelect = React.useCallback(
    (month: number) => {
      const newDate = utils.setMonth(date || now, month);

      onChange(newDate, 'finish');
      if (onMonthChange) {
        onMonthChange(newDate);
      }
    },
    [date, now, onChange, onMonthChange, utils]
  );

  console.log('hijri-month', hijri);
  return (
    <div className={classes.root}>
      {utils.getMonthArray(date || now).map((month) => {
        const monthNumber = utils.getMonth(month);
        const monthText = utils.format(month, 'monthShort');
        const monthProps = {
          key: monthText,
          value: monthNumber,
          selected: monthNumber === currentMonth,
          onSelect: onMonthSelect,
          disabled: shouldDisableMonth(month),
          children: monthText,
        };
        return renderMonth ? renderMonth(month, monthProps) : <Month {...monthProps} />;
        // return (
        //   <Month
        //     key={monthText}
        //     value={monthNumber}
        //     selected={monthNumber === currentMonth}
        //     onSelect={onMonthSelect}
        //     disabled={shouldDisableMonth(month)}
        //   >
        //     {monthText}
        //   </Month>
        // );
      })}
    </div>
  );
}
