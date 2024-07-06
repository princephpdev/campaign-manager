import { registerDecorator, ValidationOptions } from 'class-validator';
import { InvalidScheduleDateTimeMessageError } from '../constants/custom-error-messages';

const allowedSchedules = {
  Monday: [
    { start: '12:00', end: '14:00' },
    { start: '20:00', end: '22:00' },
  ],
  Tuesday: [
    { start: '12:00', end: '14:00' },
    { start: '20:00', end: '22:00' },
  ],
  Saturday: [{ start: '15:00', end: '19:00' }],
};

function isWithinTimeRange(start: string, end: string, allowedRanges: { start: string; end: string }[]): boolean {
  return allowedRanges.some((range) => {
    return start >= range.start && end <= range.end;
  });
}

export function IsValidSchedule(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidSchedule',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(schedules: any[]) {
          return schedules.every((schedule) => {
            const allowedRanges = allowedSchedules[schedule.dayOfWeek];
            if (!allowedRanges) {
              return false;
            }
            return isWithinTimeRange(schedule.startTime, schedule.endTime, allowedRanges);
          });
        },
        defaultMessage() {
          return InvalidScheduleDateTimeMessageError;
        },
      },
    });
  };
}
