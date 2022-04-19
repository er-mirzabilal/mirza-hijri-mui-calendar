/* eslint-disable no-console */
import * as React from 'react';
import Badge from '@material-ui/core/Badge';
import TextField from '@material-ui/core/TextField';
import { DatePicker, PickersDay,Month } from '@material-ui/pickers';
// @ts-ignore
import { CalendarSkeleton } from '@material-ui/pickers/CalendarSkeleton';
import CustomMonth from './CustomMonth'
// TODO remove relative import
import { makeJSDateObject } from '../../../utils/helpers';

export default function ServerRequest() {
  const requestAbortController = React.useRef<AbortController | null>(null);
  const [highlightedDays, setHighlightedDays] = React.useState([1, 2, 15]);
  const [value, setValue] = React.useState<Date | null>(new Date());

  React.useEffect(() => {
    // abort request on unmount
    return () => requestAbortController.current?.abort();
  }, []);

  const handleMonthChange = (date: Date) => {
    if (requestAbortController.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
      requestAbortController.current.abort();
    }

    setHighlightedDays([]);

    const controller = new AbortController();
    fetch(`/fakeApi/randomDate?month=${date.toString()}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then(({ daysToHighlight }) => setHighlightedDays(daysToHighlight))
      .catch(() => console.log('Wow, you are switching months too quickly 🐕'));

    requestAbortController.current = controller;
  };

  // @ts-ignore
  // @ts-ignore

  return (
    <DatePicker
      views={['year', 'month', 'date']}
      value={value}
      loading={highlightedDays === null}
      onChange={(newValue) => setValue(newValue)}
      onMonthChange={handleMonthChange}
      // loading
      renderInput={(props) => <TextField {...props} />}
      renderLoading={() => <CalendarSkeleton />}
      renderMonth={(month: any, MonthComponentProps: any) => {
        console.log("renderMonth", month, MonthComponentProps);
        return <CustomMonth {...MonthComponentProps} />;
      }}
      hijri={true}
      renderDay={(day, value, DayComponentProps) => {
        const date = makeJSDateObject(day ?? new Date()); // skip this step, it is required to support date libs
        const isSelected =
          DayComponentProps.inCurrentMonth && highlightedDays.includes(date.getDate());

        return (
          <Badge
            key={date.toString()}
            overlap="circle"
            badgeContent={isSelected ? '🌚' : undefined}
          >
            <PickersDay {...DayComponentProps} />
          </Badge>
        );
      }}
    />
  );
}
