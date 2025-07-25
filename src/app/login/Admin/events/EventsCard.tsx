import "bootstrap-icons/font/bootstrap-icons.css";
interface EventData {
  title: string;
  description: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
}
interface EventsCardProps {
  event: EventData;
  onEdit: (title: string) => void;
  onDelete: (title: string) => void;
}

export default function EventsCard({
  event,
  onEdit,
  onDelete,
}: EventsCardProps) {
  const start = new Date(event.date);
  const now = new Date();

  const websiteVisibilityCountdown = (() => {
    const visibilityTime = start.getTime() - 4 * 24 * 60 * 60 * 1000;
    const timeUntilVisible = visibilityTime - now.getTime();
    if (timeUntilVisible <= 0) {
      return "✅ Already visible on the website";
    }
    const d = Math.floor(timeUntilVisible / (1000 * 60 * 60 * 24));
    const h = Math.floor((timeUntilVisible / (1000 * 60 * 60)) % 24);
    const m = Math.floor((timeUntilVisible / (1000 * 60)) % 60);
    return `🕒 Will be visible in: ${d}d ${h}h ${m}m`;
  })();

  return (
    <div className="event-card">
      <div className="date-box">
        <p className="month">
          {start.toLocaleString("en-US", { month: "short" }).toUpperCase()}
        </p>
        <h2 className="day">{start.getDate()}</h2>
        <p className="year">{start.getFullYear()}</p>
      </div>

      <div className="event-content">
        <span className={`badge ${event.category.toLowerCase()}`}>
          {event.category}
        </span>
        <h3>{event.title}</h3>
        <p>{event.description}</p>

        <div className="meta">
          <span>
            <i className="bi bi-clock"></i> {event.startTime} - {event.endTime}
          </span>
          <span>
            <i className="bi bi-geo-alt"></i> {event.location}
          </span>
        </div>

        <div className="actions">
          <button className="btn-edit" onClick={() => onEdit(event.title)}>
            <i className="bi bi-pencil-square"></i> Edit
          </button>
          <button className="btn-delete" onClick={() => onDelete(event.title)}>
            <i className="bi bi-trash3"></i> Delete
          </button>
        </div>

        <p className="countdown-label">
          <i
            className="bi bi-globe2"
            style={{ marginRight: "6px", color: "#007acc" }}
          ></i>
          Website visibility:
        </p>
        <div className="countdown-value">{websiteVisibilityCountdown}</div>
      </div>
    </div>
  );
}
