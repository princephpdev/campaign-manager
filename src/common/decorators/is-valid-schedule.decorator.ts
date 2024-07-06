import { registerDecorator, ValidationOptions } from 'class-validator';

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

function isValidTimeRange(start: string, end: string, allowedRanges: { start: string; end: string }[]): boolean {
  return allowedRanges.some((range) => range.start === start && range.end === end);
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
            return isValidTimeRange(schedule.startTime, schedule.endTime, allowedRanges);
          });
        },
        defaultMessage() {
          return `Invalid schedule. Allowed schedules are: ${JSON.stringify(allowedSchedules)}`;
        },
      },
    });
  };
}
