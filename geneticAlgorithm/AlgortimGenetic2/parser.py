# import re
#
# def parse_hours(hours_str):
#     days_map = {
#         "Mo": "Monday", "Tu": "Tuesday", "We": "Wednesday",
#         "Th": "Thursday", "Fr": "Friday", "Sa": "Saturday", "Su": "Sunday"
#     }
#
#     processed_hours = []
#
#     segments = hours_str.split(";")
#
#     for segment in segments:
#         if segment.strip() == "24/7":
#             for day in days_map.values():
#                 processed_hours.append({"day": day, "open": "00:00", "close": "23:59", "isOpenAllDay": True})
#             continue
#
#         day_pattern = r"([Mo|Tu|We|Th|Fr|Sa|Su]+)"
#         hours_pattern = r"(\d{2}:\d{2})-(\d{2}:\d{2})"
#
#         days_match = re.findall(day_pattern, segment)
#         hours_match = re.search(hours_pattern, segment)
#
#         if days_match and hours_match:
#             start_day, end_day = days_match[0], days_match[-1]
#             start_hour, end_hour = hours_match.groups()
#
#             day_range = []
#             start_index = False
#             for key, value in days_map.items():
#                 if key == start_day:
#                     start_index = True
#                 if start_index:
#                     day_range.append(value)
#                 if key == end_day:
#                     break
#
#             for day in day_range:
#                 processed_hours.append({"day": day, "open": start_hour, "close": end_hour, "isOpenAllDay": False})
#
#     return processed_hours
#
# hours_examples = [
#     "Mo-Su 12:00-22:30",
#     "Mo-Fr 12:00-20:00; Sa 12:00-15:00",
#     "24/7",
#     "Tu-Sa 10:00-23:59, Su 10:00-19:30",
#     "Mo-Su 12:00-14:30,19:00-00:30"
# ]
#
# for example in hours_examples:
#     print(f"Parsing: {example}")
#     result = parse_hours(example)
#     for entry in result:
#         print(entry)

import json

def parse_hours_v2(input_str):
    days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
    hours_dict = {day: [] for day in days}

    if input_str == "24/7":
        for day in days:
            hours_dict[day].append({"start": "00:00", "end": "24:00"})
        return json.dumps(hours_dict, indent=4)

    parts = input_str.split(";")
    for part in parts:
        part = part.strip()
        if "-" in part:
            day_part, hours = part.split(" ", 1)
            start_day, end_day = (day_part.split("-") + [day_part])[:2]
        else:
            start_day = end_day = part
            hours = "00:00-24:00"

        start_index = days.index(start_day) if start_day in days else 0
        end_index = days.index(end_day) if end_day in days else 6

        sessions = hours.split(",")
        for session in sessions:
            start_hour, end_hour = session.split("-")
            for i in range(start_index, end_index + 1):
                hours_dict[days[i]].append({"start": start_hour, "end": end_hour})

    return json.dumps(hours_dict, indent=4)

hours_examples = [
    "Mo-Su 12:00-22:30",
    "Mo-Fr 12:00-20:00; Sa 12:00-15:00",
    "24/7",
    "Tu-Sa 10:00-23:59; Su 10:00-19:30",
    "Mo-Su 12:00-14:30, 19:00-00:30"
]

for example in hours_examples:
    parsed_hours_json = parse_hours_v2(example)
    print(f"Input: {example}\nOutput: {parsed_hours_json}\n")


