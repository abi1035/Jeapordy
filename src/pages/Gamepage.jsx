import { useState } from "react";
import { categories, questionBank } from "../data/questions";
import { doubleJeopardyQuestions } from "../data/doubleJeopardyQuestions";

import "./Gamepage.css";

const values = [100, 200, 300, 400, 500];

/* =====================================================
   CREATE UNIQUE ID
===================================================== */

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

/* =====================================================
   CREATE RANDOM BOARD

   If there was a previous board, we try not to use
   the exact same clue in the same category/value slot.
===================================================== */

function createBoard(previousBoard = null) {
  const board = {};

  categories.forEach((category) => {
    board[category] = values.map((value) => {
      const possibleQuestions = questionBank[category].filter(
        (question) => question.value === value,
      );

      const previousQuestion = previousBoard?.[category]?.find(
        (question) => question.value === value,
      );

      let availableQuestions = possibleQuestions;

      /*
        Avoid immediately repeating the same question
        when we have another option available.
      */
      if (previousQuestion && possibleQuestions.length > 1) {
        const alternatives = possibleQuestions.filter(
          (question) => question.clue !== previousQuestion.clue,
        );

        if (alternatives.length > 0) {
          availableQuestions = alternatives;
        }
      }

      const randomQuestion =
        availableQuestions[
          Math.floor(Math.random() * availableQuestions.length)
        ];

      return {
        ...randomQuestion,
        id: createId(),
      };
    });
  });

  return board;
}

/* =====================================================
   GAME PAGE
===================================================== */
function Gamepage() {
  /* ===================================================
     BOARD
  =================================================== */

  const [board, setBoard] = useState(() => createBoard());

  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());

  const [gameNumber, setGameNumber] = useState(1);
  const [doubleJeopardyUsed, setDoubleJeopardyUsed] = useState(false);

  /* ===================================================
     QUESTION MODAL
  =================================================== */

  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [showAnswer, setShowAnswer] = useState(false);

  /* ===================================================
     TEAMS
  =================================================== */

  const [teams, setTeams] = useState([
    {
      name: "Resident",
      score: 0,
    },
  ]);
  /* ===================================================
     OPEN QUESTION
  =================================================== */

  const openQuestion = (category, question) => {
    if (answeredQuestions.has(question.id)) {
      return;
    }

    setSelectedQuestion({
      ...question,
      category,
    });

    setShowAnswer(false);
  };

  /* ===================================================
     FINISH QUESTION
  =================================================== */

  const finishQuestion = () => {
    if (selectedQuestion && !selectedQuestion.isDoubleJeopardy) {
      setAnsweredQuestions((currentQuestions) => {
        const updatedQuestions = new Set(currentQuestions);

        updatedQuestions.add(selectedQuestion.id);

        return updatedQuestions;
      });
    }

    setSelectedQuestion(null);
    setShowAnswer(false);
  };

  /* ===================================================
     CLOSE WITHOUT USING QUESTION
  =================================================== */

  const cancelQuestion = () => {
    setSelectedQuestion(null);
    setShowAnswer(false);
  };

  /* ===================================================
     TEAM NAME
  =================================================== */

  /* ===================================================
     CORRECT ANSWER
  =================================================== */

  const awardPoints = (teamIndex) => {
    if (!selectedQuestion) {
      return;
    }

    setTeams((currentTeams) =>
      currentTeams.map((team, index) =>
        index === teamIndex
          ? {
              ...team,

              score: team.score + selectedQuestion.value,
            }
          : team,
      ),
    );

    finishQuestion();
  };

  /* ===================================================
     INCORRECT ANSWER

     Subtract the score but keep the question open so
     another team can still answer.
  =================================================== */

  const subtractPoints = (teamIndex) => {
    if (!selectedQuestion) {
      return;
    }

    setTeams((currentTeams) =>
      currentTeams.map((team, index) =>
        index === teamIndex
          ? {
              ...team,

              score: team.score - selectedQuestion.value,
            }
          : team,
      ),
    );
  };

  /* ===================================================
     NEW GAME

     This now:
       - generates a fresh board
       - restores every tile
       - resets scores
       - closes modal
       - increments Game #
  =================================================== */

  const openDoubleJeopardy = () => {
    if (doubleJeopardyUsed) {
      return;
    }

    const randomQuestion =
      doubleJeopardyQuestions[
        Math.floor(Math.random() * doubleJeopardyQuestions.length)
      ];

    setDoubleJeopardyUsed(true);

    setSelectedQuestion({
      id: createId(),

      category: randomQuestion.topic,

      clue: randomQuestion.clue,

      answer: randomQuestion.answer,

      value: 1000,

      isDoubleJeopardy: true,
    });

    setShowAnswer(false);
  };

  const resetGame = () => {
    setBoard((currentBoard) => createBoard(currentBoard));

    setAnsweredQuestions(new Set());

    setSelectedQuestion(null);

    setShowAnswer(false);

    setTeams((currentTeams) =>
      currentTeams.map((team) => ({
        ...team,
        score: 0,
      })),
    );

    setGameNumber((currentNumber) => currentNumber + 1);
    setDoubleJeopardyUsed(false);
  };

  /* ===================================================
     CALCULATIONS
  =================================================== */

  const totalQuestions = categories.length * values.length;

  const remainingQuestions = totalQuestions - answeredQuestions.size;

  /* ===================================================
     PAGE
  =================================================== */

  return (
    <div className="gamepage">
      {/* ===============================================
          HEADER
      =============================================== */}

      <header className="gamepage__header">
        <div>
          <p className="gamepage__eyebrow">Trivia Night</p>

          <h1 className="gamepage__title">JEOPARDY!</h1>

          <div className="gamepage__game-meta">
            <span>Game #{gameNumber}</span>
          </div>
        </div>

        <div className="gamepage__header-actions">
          <div className="gamepage__remaining">
            <strong>{remainingQuestions}</strong>

            <span>Questions Remaining</span>
          </div>

          <button
            type="button"
            className="gamepage__double-jeopardy-button"
            disabled={doubleJeopardyUsed}
            onClick={openDoubleJeopardy}
          >
            {doubleJeopardyUsed ? "Double Jeopardy Used" : "⚡ Double Jeopardy"}
          </button>
          <button
            type="button"
            className="gamepage__new-game-button"
            onClick={resetGame}
          >
            ↻ New Game
          </button>
        </div>
      </header>

      {/* ===============================================
    RESIDENT SCORE
=============================================== */}

      <section className="gamepage__scoreboard">
        <article className="gamepage__team-card">
          <div className="gamepage__team-details">
            <label>Current Score</label>

            <strong className="gamepage__team-name">Resident</strong>
          </div>

          <div className="gamepage__team-score">
            ${teams[0].score.toLocaleString()}
          </div>
        </article>
      </section>

      {/* ===============================================
          BOARD
      =============================================== */}

      <main className="gamepage__board">
        {categories.map((category) => (
          <section className="gamepage__category" key={category}>
            <div className="gamepage__category-title">{category}</div>

            {board[category].map((question) => {
              const answered = answeredQuestions.has(question.id);

              return (
                <button
                  type="button"
                  key={question.id}
                  disabled={answered}
                  className={`gamepage__question-tile ${
                    answered ? "gamepage__question-tile--answered" : ""
                  }`}
                  onClick={() => openQuestion(category, question)}
                >
                  {!answered && `$${question.value}`}
                </button>
              );
            })}
          </section>
        ))}
      </main>

      {/* ===============================================
          QUESTION MODAL
      =============================================== */}

      {selectedQuestion && (
        <div className="gamepage__modal-backdrop">
          <section className="gamepage__question-modal">
            <div className="gamepage__modal-header">
              <div>
                {selectedQuestion.isDoubleJeopardy && (
                  <div className="gamepage__double-banner">
                    ⚡ DOUBLE JEOPARDY
                  </div>
                )}

                <p>{selectedQuestion.category}</p>

                <strong>${selectedQuestion.value}</strong>
              </div>

              <button
                type="button"
                className="gamepage__modal-close"
                onClick={cancelQuestion}
                aria-label="Close question"
                title="Return question to board"
              >
                ×
              </button>
            </div>

            {/* CLUE */}

            <div className="gamepage__clue">
              <p>{selectedQuestion.clue}</p>
            </div>

            {!showAnswer ? (
              <div className="gamepage__reveal-area">
                <button
                  type="button"
                  className="gamepage__reveal-button"
                  onClick={() => setShowAnswer(true)}
                >
                  Reveal Answer
                </button>
              </div>
            ) : (
              <div className="gamepage__answer-area">
                <p className="gamepage__correct-label">Correct Response</p>

                <h2>{selectedQuestion.answer}</h2>

                {/* CORRECT */}

                <div className="gamepage__score-section">
                  <p>Correct</p>

                  <div className="gamepage__correct-buttons">
                    {teams.map((team, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={() => awardPoints(index)}
                      >
                        +$
                        {selectedQuestion.value} to{" "}
                        {team.name || `Team ${index + 1}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* INCORRECT */}

                {!selectedQuestion.isDoubleJeopardy && (
                  <div className="gamepage__score-section">
                    <p>Incorrect</p>

                    <div className="gamepage__incorrect-buttons">
                      {teams.map((team, index) => (
                        <button
                          type="button"
                          key={index}
                          onClick={() => subtractPoints(index)}
                        >
                          -${selectedQuestion.value} from {team.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="gamepage__no-score-button"
                  onClick={finishQuestion}
                >
                  No Score / Continue
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default Gamepage;
