import datetime
import json
import re

# 19:00
def is_format0(input_str):
    pattern = r'^\d{2}:\d{2}$'
    return bool(re.match(pattern, input_str))
# 7:30-20:00
def is_format1(input_str):
    pattern = r'^\d{2}:\d{2}-\d{2}:\d{2}$'
    return bool(re.match(pattern, input_str))

# 7:00-12:30,16:00-19:00
def is_format2(input_str):
    pattern = r'^(\d{1,2}:\d{2}-\d{1,2}:\d{2},)*(\d{1,2}:\d{2}-\d{1,2}:\d{2})$'
    return bool(re.match(pattern, input_str))

# Mo-Sa 10:00-12:00, 16:00-18:00, Su 10:00-11:00, 16:00-18:00 trb transformat in:
# Mo-Sa 10:00-12:00, 16:00-18:00; Su 10:00-11:00, 16:00-18:00
def is_format3(input_str):
    parts = input_str.split("; ")
    for part in parts:
        if "-" not in part or "," not in part:
            return False
        day_range, hours = part.split(" ", 1)
        days = day_range.split("-")
        if len(days) != 2:
            return False
        day_start, day_end = days
        if day_start not in ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] or day_end not in ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]:
            return False
        time_ranges = hours.split(", ")
        for time_range in time_ranges:
            if "-" not in time_range:
                return False
    return True



def parse_hours(input_str):
    days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
    hours_dict = {day: [] for day in days}

    if is_format1(input_str):
        start_time, end_time = input_str.split("-")
        for day in days:
            hours_dict[day].append({"start": start_time, "end": end_time})
        return json.dumps(hours_dict)

    if is_format2(input_str):
        time_ranges = input_str.split(",")
        for time_range in time_ranges:
            start_time, end_time = time_range.split("-")
            for day in days:
                hours_dict[day].append({"start": start_time, "end": end_time})
        return json.dumps(hours_dict)

    if is_format3(input_str):
        parts = input_str.split(", ")
        text = ", ".join(parts[:2]) + "; " + ", ".join(parts[2:])
        input_str = text

    if not input_str:
        for day in days:
            hours_dict[day].append({"start": "09:00", "end": "17:00"})
        return json.dumps(hours_dict)

    if input_str == "24/7":
        for day in days:
            hours_dict[day].append({"start": "00:00", "end": "24:00"})
        return json.dumps(hours_dict)

    parts = input_str.split(";")
    for part in parts:
        part = part.strip()
        if " off" in part:
            off_day = part.replace(" off", "")
            if "-" in off_day:
                start_day, end_day = (off_day.split("-") + [off_day])[:2]
                start_index = days.index(start_day) if start_day in days else 0
                end_index = days.index(end_day) if end_day in days else 6
                for i in range(start_index, end_index + 1):
                    hours_dict[days[i]] = []
            else:
                if off_day in days:
                    hours_dict[off_day] = []

        elif "-" in part and ":" in part:
            day_range, hours = part.split(" ", 1)
            start_day, end_day = (day_range.split("-") + [day_range])[:2]
            start_index = days.index(start_day) if start_day in days else 0
            end_index = days.index(end_day) if end_day in days else 6

            sessions = hours.split(",")
            for session in sessions:
                start_hour, end_hour = session.split("-")
                for i in range(start_index, end_index + 1):
                    hours_dict[days[i]].append({"start": start_hour, "end": end_hour})

        elif " off" in part:
            off_day = part.replace(" off", "")
            if off_day in days:
                hours_dict[off_day] = []

    return json.dumps(hours_dict)


def find_first_day_of_week(day_of_week):
    days_dict = {"Mo": 0, "Tu": 1, "We": 2, "Th": 3, "Fr": 4, "Sa": 5, "Su": 6}
    current_date = datetime.datetime.now()
    current_day_of_week = current_date.weekday()
    days_difference = (days_dict[day_of_week] - current_day_of_week) % 7
    first_day_of_week = current_date + datetime.timedelta(days=days_difference)
    return first_day_of_week
