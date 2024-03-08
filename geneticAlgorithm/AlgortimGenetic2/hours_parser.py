import json


def parse_hours(input_str):
    days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
    hours_dict = {day: [] for day in days}

    if not input_str:
        for day in days:
            hours_dict[day].append({"start": "09:00", "end": "17:00"})
        return json.dumps(hours_dict, indent=4)

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
            hours = "09:00-17:00"

        start_index = days.index(start_day) if start_day in days else 0
        end_index = days.index(end_day) if end_day in days else 6

        sessions = hours.split(",")
        for session in sessions:
            start_hour, end_hour = session.split("-")
            for i in range(start_index, end_index + 1):
                hours_dict[days[i]].append({"start": start_hour, "end": end_hour})

    return json.dumps(hours_dict, indent=4)



hours_examples = [
    # "We 11:00-21:00; Th 11:00-23:00; Fr-Mo 11:00-21:00", - nu merge bine
    # "Mo-Th 08:00-24:00; Fr 08:00-02:00; Sa 12:00-02:00; Su 11:00-22:00",
    # "07:30-20:00",  - nu merge
    # "Mo-Sa 09:00-18:00; Su 09:00-15:00",
    # "Mo-Fr 10:00-23:00",
    # "Mo-Tu 09:00 - 23:30; Fr-Sa 09:00 - 00:30; Su 09:00 - 23:30",
    # "Mo-Fr 12:00-20:00; Sa 12:00-15:00",
    # "24/7",
    # "Tu-Sa 10:00-23:59; Su 10:00-19:30",
    # "Mo-Su 12:00-14:30, 19:00-00:30",
    # "Tu-Sa 12:00-13:15, 19:00-21:15",
    # "Mo-Fr 09:00-01:00; Sa-Su 08:00-01:00",
    # "Mo-Sa 12:00-15:00, 18:30-00:00; Su 12:00-15:00, 18:30-23:00",
    # "Tu-Fr 12:00-14:00; Tu-Sa 20:00-23:30",
    # "Mo-Fr 08:00-17:30; Sa 08:30-17:30; Su 09:00-17:30",
    # "Mo-Sa 10:00-12:00, 16:00-18:00, Su 10:00-11:00, 16:00-18:00", -- nu merge
    # "Mo-Fr 09:30-12:45,14:30-18:30; Sa 09:30-12:15,14:30-18:30; Su 11:30-12:45,14:30-18:30",
    # "Tu-Su 09:00-12:00, 15:00-18:00",
    # "Tu-Su 09:00-16:00; Mo off", -- nu merge
    # "Tu-Su 09:30-16:00; Th off", --nu merge
    # "7:00-12:30,16:00-19:00", -- nu merge
    # "Mo-Sa 10:00-12:30, 16:30-18:00; Su,PH 11:30-12:30" -- nu merge

]

for example in hours_examples:
    parsed_hours_json = parse_hours(example)
    print(f"Input: {example}\nOutput: {parsed_hours_json}\n")
