import pandas as pd
import matplotlib.pyplot as plt
import json

file_path = "/mnt/data/modified_visitor_data.csv"
df_new = pd.read_csv(file_path)

df_new["Time"] = df_new["Time"].astype(str)
df_filtered = df_new[df_new["Time"] <= "21:00"]

# day labels
day_labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
queue_data = {}

# grouped by day of the week
plt.figure(figsize=(12, 6))

for day in range(7):
    daily_data = df_filtered[df_filtered["DayOfWeek"] == day]
    plt.plot(daily_data["Time"], daily_data["Queue_Length"], label=day_labels[day])

    # Store JSON data
    queue_data[day_labels[day]] = {
        time: queue for time, queue in zip(daily_data["Time"], daily_data["Queue_Length"])
    }

#half-hour intervals
unique_times = df_filtered["Time"].unique()
half_hour_labels = [t for i, t in enumerate(unique_times) if i % 3 == 0]
plt.xticks(half_hour_labels, rotation=45, fontsize=8)

plt.xlabel("Time of Day")
plt.ylabel("Queue Length")
plt.title("Queue Length Trends by Day of the Week (Cutoff at 9 PM)")
plt.legend(title="Day of Week", fontsize=7)
plt.grid(True)
plt.show()

# JSON format
queue_json = json.dumps(queue_data, indent=4)
print(queue_json)
