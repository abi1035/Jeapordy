import { useState } from "react";
import "./Homepage.css";

const units = [
  "Springbank Park",
  "Medway Park",
  "Fanshawe Park",
  "Victoria Park",
  "Gibbons Park",
  "Harris Park",
];

function Homepage({ onStartGame }) {
  const [participants, setParticipants] = useState([
    {
      name: "",
      unit: "",
    },
  ]);

  const updateParticipantName = (index, value) => {
    setParticipants((currentParticipants) =>
      currentParticipants.map((participant, participantIndex) =>
        participantIndex === index
          ? {
              ...participant,
              name: value,
            }
          : participant,
      ),
    );
  };

  const updateParticipantUnit = (index, value) => {
    setParticipants((currentParticipants) =>
      currentParticipants.map((participant, participantIndex) =>
        participantIndex === index
          ? {
              ...participant,
              unit: value,
            }
          : participant,
      ),
    );
  };

  const addParticipant = () => {
    setParticipants((currentParticipants) => [
      ...currentParticipants,
      {
        name: "",
        unit: "",
      },
    ]);
  };

  const removeParticipant = (index) => {
    setParticipants((currentParticipants) => {
      if (currentParticipants.length === 1) {
        return [
          {
            name: "",
            unit: "",
          },
        ];
      }

      return currentParticipants.filter(
        (_, participantIndex) => participantIndex !== index,
      );
    });
  };

  const completedParticipants = participants.filter(
    (participant) => participant.name.trim() !== "" && participant.unit !== "",
  );

  const canStart =
    participants.length > 0 &&
    completedParticipants.length === participants.length;

  const handleStartGame = () => {
    if (!canStart) {
      return;
    }

    const cleanedParticipants = participants.map((participant) => ({
      name: participant.name.trim(),
      unit: participant.unit,
    }));

    onStartGame(cleanedParticipants);
  };

  const enteredPlayerCount = participants.filter(
    (participant) => participant.name.trim() !== "",
  ).length;

  return (
    <div className="homepage">
      <section className="homepage__hero">
        <p className="homepage__eyebrow">Trivia Night</p>

        <h1 className="homepage__title">JEOPARDY!</h1>

        <p className="homepage__description">
          Add everyone playing, select their unit, and get ready to compete.
        </p>
      </section>

      <section className="homepage__setup-card">
        <div className="homepage__setup-header">
          <div>
            <p className="homepage__section-label">Game Setup</p>

            <h2>Who&apos;s playing?</h2>
          </div>

          <div className="homepage__player-count">
            {enteredPlayerCount}

            <span>Players</span>
          </div>
        </div>

        <div className="homepage__participants-header">
          <div>
            <p className="homepage__section-label">Participants</p>

            <h3>Add everyone playing</h3>
          </div>

          <button
            type="button"
            className="homepage__add-button"
            onClick={addParticipant}
          >
            + Add Player
          </button>
        </div>

        <div className="homepage__participant-list">
          {participants.map((participant, index) => (
            <div className="homepage__participant-row" key={index}>
              <div className="homepage__participant-number">{index + 1}</div>

              <div className="homepage__field">
                <label htmlFor={`participant-name-${index}`}>
                  Participant Name
                </label>

                <input
                  id={`participant-name-${index}`}
                  type="text"
                  value={participant.name}
                  placeholder="Enter participant name..."
                  onChange={(event) =>
                    updateParticipantName(index, event.target.value)
                  }
                />
              </div>

              <div className="homepage__field">
                <label htmlFor={`participant-unit-${index}`}>Unit</label>

                <select
                  id={`participant-unit-${index}`}
                  value={participant.unit}
                  onChange={(event) =>
                    updateParticipantUnit(index, event.target.value)
                  }
                >
                  <option value="">Select Unit</option>

                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="homepage__remove-button"
                onClick={() => removeParticipant(index)}
                aria-label={`Remove participant ${index + 1}`}
                title="Remove participant"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="homepage__start-button"
          disabled={!canStart}
          onClick={handleStartGame}
        >
          Start Jeopardy
          <span>→</span>
        </button>

        <p className="homepage__help">
          {canStart
            ? `Ready to play with ${participants.length} ${
                participants.length === 1 ? "participant" : "participants"
              }.`
            : "Enter a name and select a unit for every participant."}
        </p>
      </section>

      <section className="homepage__unit-section">
        <p>Participating Units</p>

        <div className="homepage__unit-badges">
          {units.map((unit) => (
            <span key={unit}>{unit}</span>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Homepage;
