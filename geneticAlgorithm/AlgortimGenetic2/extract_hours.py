import re
from datetime import datetime, timedelta


def extract_hours(opening_hours):
    hours_dict = {}
    for hours_str in opening_hours:
        match = re.match(r'([A-Za-z]+): (.+)', hours_str)
        if match:
            day, hours_range = match.groups()
            if 'Closed' in hours_range:
                hours_dict.setdefault(day[:2], [])
                continue

            if 'Open 24 hours' in hours_range:
                hours_dict.setdefault(day[:2], []).append({'start': '00:00', 'end': '24:00'})
                continue

            hours_list = hours_range.split('–')

            start_time = hours_list[0]
            end_time = hours_list[1]


            start_time=f(start_time)
            end_time=f(end_time)


            am_pm_start = start_time.find('AM') if 'AM' in start_time else start_time.find('PM')
            if am_pm_start != -1:
                start_time = start_time[:am_pm_start] + ' ' + start_time[am_pm_start:]

            am_pm_end = end_time.find('AM') if 'AM' in end_time else end_time.find('PM')
            if am_pm_end != -1:
                end_time = end_time[:am_pm_end] + ' ' + end_time[am_pm_end:]

            start_time = convert24(start_time)
            end_time = convert24(end_time)

            if end_time == '00:00':
                end_time = '24:00'

            hours_dict.setdefault(day[:2], []).append({'start': start_time, 'end': end_time})
    return hours_dict


def f(time):
    k = time.find('AM') if 'AM' in time else time.find('PM')
    if k != -1:
        t = time.strip().replace('\u2009', '')
        t = t.strip().replace('\u202f', '')
    else:
        j = time.find('\u2009')
        if j != -1:
            time += ' PM'
        else:
            time += ' AM'

        t = time.strip().replace('\u2009', '')
        t = t.strip().replace('\u202f', '')
    return t


def convert24(time):
    t = datetime.strptime(time, '%I:%M %p')
    return t.strftime('%H:%M')


def is_format0(input_str):
    pattern = r'^\d{2}:\d{2}$'
    return bool(re.match(pattern, input_str))

def find_first_day_of_week(day_of_week):
    days_dict = {"Mo": 0, "Tu": 1, "We": 2, "Th": 3, "Fr": 4, "Sa": 5, "Su": 6}
    current_date = datetime.now()
    current_day_of_week = current_date.weekday()
    days_difference = (days_dict[day_of_week] - current_day_of_week) % 7
    first_day_of_week = current_date + timedelta(days=days_difference)
    return first_day_of_week
#
# opening_hours_list = ['Monday: 12:30\u2009–\u200912:00\u202fAM',
#                       'Tuesday: 9:00\u202fAM\u2009–\u200912:00\u202fAM',
#                       'Wednesday: 9:00\u202fAM\u2009–\u200912:00\u202fAM',
#                       'Thursday: 9:00\u202fAM\u2009–\u200912:00\u202fAM',
#                       'Friday: 9:00\u202fAM\u2009–\u20091:00\u202fAM',
#                       'Saturday: Open 24 hours',
#                       'Sunday: Closed']
#
# result_dict = extract_hours(opening_hours_list)

