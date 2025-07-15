export default function EventsCard({ event, onEdit, onDelete }: any) {
  const start = new Date(event.date);
  const now = new Date();
  const timeUntilStart = Math.max(0, start.getTime() - now.getTime());

  const days = Math.floor(timeUntilStart / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeUntilStart / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeUntilStart / (1000 * 60)) % 60);
  const startCountdown = `${days}d ${hours}h ${minutes}m`;

  // Logic to check when it shows on the website
  const websiteVisibilityCountdown = (() => {
    const visibilityTime = start.getTime() - 4 * 24 * 60 * 60 * 1000;
    const timeUntilVisible = visibilityTime - now.getTime();

    if (timeUntilVisible <= 0) {
      return "✅ Already visible on the website";
    }

    const visDays = Math.floor(timeUntilVisible / (1000 * 60 * 60 * 24));
    const visHours = Math.floor((timeUntilVisible / (1000 * 60 * 60)) % 24);
    const visMinutes = Math.floor((timeUntilVisible / (1000 * 60)) % 60);

    return `🕒 Will be visible in: ${visDays}d ${visHours}h ${visMinutes}m`;
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
            🕒 {event.startTime} - {event.endTime}
          </span>
          <span>📍 {event.location}</span>
        </div>

        <div className="actions">
          <button onClick={() => onEdit(event.title)}>✏️ Edit</button>
          <button onClick={() => onDelete(event.title)}>🗑️ Delete</button>
        </div>

        {/* <p className="countdown-label">Event starts in:</p>
        <div className="countdown-value">{startCountdown}</div> */}

        {websiteVisibilityCountdown && (
          <>
            <p className="countdown-label">Website visibility:</p>
            <div className="countdown-value">{websiteVisibilityCountdown}</div>
          </>
        )}
      </div>
    </div>
  );
}
