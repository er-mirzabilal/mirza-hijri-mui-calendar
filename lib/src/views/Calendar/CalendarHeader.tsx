import * as React from 'react';
import * as PropTypes from 'prop-types';
import clsx from 'clsx';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
// @ts-ignore
import momentHijri from  'moment-hijri';
import moment from 'moment';
import { DatePickerView } from '../../DatePicker';
import { SlideDirection } from './SlideTransition';
import { useUtils } from '../../_shared/hooks/useUtils';
import { FadeTransitionGroup } from './FadeTransitionGroup';
import { DateValidationProps } from '../../_helpers/date-utils';
import { ArrowDropDownIcon } from '../../_shared/icons/ArrowDropDown';
import { ArrowSwitcher, ExportedArrowSwitcherProps } from '../../_shared/ArrowSwitcher';
import {
  usePreviousMonthDisabled,
  useNextMonthDisabled,
} from '../../_shared/hooks/date-helpers-hooks';

export type ExportedCalendarHeaderProps<TDate> = Pick<
  CalendarHeaderProps<TDate>,
  | 'leftArrowIcon'
  | 'rightArrowIcon'
  | 'leftArrowButtonProps'
  | 'rightArrowButtonProps'
  | 'leftArrowButtonText'
  | 'rightArrowButtonText'
  | 'getViewSwitchingButtonText'
>;

export interface CalendarHeaderProps<TDate>
  extends ExportedArrowSwitcherProps,
    Omit<DateValidationProps<TDate>, 'shouldDisableDate'> {
  view: DatePickerView;
  views: DatePickerView[];
  currentMonth: TDate;
  /**
   * Get aria-label text for switching between views button.
   */
  getViewSwitchingButtonText?: (currentView: DatePickerView) => string;
  reduceAnimations: boolean;
  changeView: (view: DatePickerView) => void;
  onMonthChange: (date: TDate, slideDirection: SlideDirection) => void;
  hijri: boolean
}

export const useStyles = makeStyles(
  (theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 8,
      paddingLeft: 24,
      paddingRight: 12,
      // prevent jumping in safari
      maxHeight: 30,
      minHeight: 30,
    },
    yearSelectionSwitcher: {
      marginRight: 'auto',
    },
    previousMonthButton: {
      marginRight: 24,
    },
    switchViewDropdown: {
      willChange: 'transform',
      transition: theme.transitions.create('transform'),
      transform: 'rotate(0deg)',
    },
    switchViewDropdownDown: {
      transform: 'rotate(180deg)',
    },
    monthTitleContainer: {
      display: 'flex',
      maxHeight: 30,
      overflow: 'hidden',
      cursor: 'pointer',
      marginRight: 'auto',
    },
    monthText: {
      marginRight: 4,
    },
    hijriDate: {
      marginLeft: 24
    }
  }),
  { name: 'MuiPickersCalendarHeader' }
);

function getSwitchingViewAriaText(view: DatePickerView) {
  return view === 'year'
    ? 'year view is open, switch to calendar view'
    : 'calendar view is open, switch to year view';
}
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
export function CalendarHeader<TDate>(props: CalendarHeaderProps<TDate>) {
  const {
    view: currentView,
    views,
    currentMonth: month,
    changeView,
    minDate,
    maxDate,
    disablePast,
    disableFuture,
    onMonthChange,
    reduceAnimations,
    leftArrowButtonProps,
    rightArrowButtonProps,
    leftArrowIcon,
    rightArrowIcon,
    leftArrowButtonText = 'previous month',
    rightArrowButtonText = 'next month',
    getViewSwitchingButtonText = getSwitchingViewAriaText,
    hijri
  } = props;

  const utils = useUtils<TDate>();
  const classes = useStyles();

  const selectNextMonth = () => onMonthChange(utils.getNextMonth(month), 'left');
  const selectPreviousMonth = () => onMonthChange(utils.getPreviousMonth(month), 'right');

  const isNextMonthDisabled = useNextMonthDisabled(month, { disableFuture, maxDate });
  const isPreviousMonthDisabled = usePreviousMonthDisabled(month, { disablePast, minDate });

  const toggleView = () => {
    if (views.length === 1) {
      return;
    }

    if (views.length === 2) {
      changeView(views.find((view) => view !== currentView) || views[0]);
    } else {
      // switching only between first 2
      const nextIndexToOpen = views.indexOf(currentView) !== 0 ? 0 : 1;
      changeView(views[nextIndexToOpen]);
    }
  };
  const daysInMonth = moment(month).daysInMonth();
  const hijriMonths: any[] = [];
  const hijriMonthYears = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < daysInMonth; i++ ){
    const formattedDate = moment(month);
    formattedDate.add(i, 'days');
    const hijriMonth =  momentHijri(formattedDate).iMonth();
    const hijriYear  =  momentHijri(formattedDate).iYear();
    if(!hijriMonths.includes(hijriMonth)){
      hijriMonths.push(hijriMonth);
      hijriMonthYears.push({'month': hijriMonth, 'year': hijriYear});
    }
  }
  return (
    <React.Fragment>
      <div className={classes.root}>
        <div className={classes.monthTitleContainer} onClick={toggleView}>
          <FadeTransitionGroup
            reduceAnimations={reduceAnimations}
            transKey={utils.format(month, 'month')}
          >
            <Typography
              aria-live="polite"
              data-mui-test="calendar-month-text"
              align="center"
              variant="subtitle1"
              className={classes.monthText}
            >
              {utils.format(month, 'month')}
            </Typography>
          </FadeTransitionGroup>
          <FadeTransitionGroup
            reduceAnimations={reduceAnimations}
            transKey={utils.format(month, 'year')}
          >
            <Typography
              aria-live="polite"
              data-mui-test="calendar-year-text"
              align="center"
              variant="subtitle1"
            >
              {utils.format(month, 'year')}
            </Typography>
          </FadeTransitionGroup>
          {views.length > 1 && (
            <IconButton
              size="small"
              data-mui-test="calendar-view-switcher"
              onClick={toggleView}
              className={classes.yearSelectionSwitcher}
              aria-label={getViewSwitchingButtonText(currentView)}
            >
              <ArrowDropDownIcon
                className={clsx(classes.switchViewDropdown, {
                  [classes.switchViewDropdownDown]: currentView === 'year',
                })}
              />
            </IconButton>
          )}
        </div>
        <Fade in={currentView === 'date'}>
          <ArrowSwitcher
            leftArrowButtonProps={leftArrowButtonProps}
            rightArrowButtonProps={rightArrowButtonProps}
            leftArrowButtonText={leftArrowButtonText}
            rightArrowButtonText={rightArrowButtonText}
            leftArrowIcon={leftArrowIcon}
            rightArrowIcon={rightArrowIcon}
            onLeftClick={selectPreviousMonth}
            onRightClick={selectNextMonth}
            isLeftDisabled={isPreviousMonthDisabled}
            isRightDisabled={isNextMonthDisabled}
          />
        </Fade>
      </div>
      {hijri ? (
        <div className={classes.hijriDate}>
          {hijriMonthYears.map((item) => (<Typography variant="caption" color="secondary"> {`${HIJRI_MONTHS[item.month]  } ${  item.year  },`}</Typography>))}
        </div>
      ): ''}

    </React.Fragment>
  );
}

CalendarHeader.displayName = 'PickersCalendarHeader';

CalendarHeader.propTypes = {
  leftArrowButtonText: PropTypes.string,
  leftArrowIcon: PropTypes.node,
  rightArrowButtonText: PropTypes.string,
  rightArrowIcon: PropTypes.node,
};

export default CalendarHeader;
