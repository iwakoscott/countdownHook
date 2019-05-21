import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";

function useCountdown(callback, timeout, options = { pauseOnReset: true }) {
  const [state, dispatch] = React.useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_TIMEOUT":
          return { ...state, countdown: action.timeout };
        case "TICK":
          return { ...state, countdown: state.countdown - 1000 };
        case "TOGGLE_COUNTDOWN":
          return { ...state, isActive: !state.isActive };
        case "END_COUNTDOWN":
          return { ...state, isActive: false, countdown: action.timeout };
        case "RESET_COUNTDOWN":
          return {
            ...state,
            isActive: options.pauseOnReset ? false : true,
            countdown: action.timeout
          };
        default:
          return state;
      }
    },
    {
      isActive: false,
      countdown: 0
    }
  );

  const intervalRef = React.useRef(null);

  React.useEffect(() => {
    if (state.isActive) {
      intervalRef.current = setInterval(() => {
        if (state.countdown === 0) {
          clearInterval(intervalRef.current);
          dispatch({ type: "END_COUNTDOWN", timeout });
          return callback(); // INVOKE CALLBACK
        } else dispatch({ type: "TICK" });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timeout, state.isActive, state.countdown, callback]);

  // sync countdown whenever timeout changes
  React.useEffect(() => {
    dispatch({ type: "SET_TIMEOUT", timeout });
  }, [timeout]);

  return {
    toggleCountdown: () => dispatch({ type: "TOGGLE_COUNTDOWN" }),
    resetCountdown: () => dispatch({ type: "RESET_COUNTDOWN", timeout }),
    isActive: state.isActive,
    countdown: state.countdown
  };
}

function App() {
  const [time, setTime] = React.useState(10000);
  const [complete, setComplete] = React.useState(false);
  const [pauseOnReset, setPauseOnReset] = React.useState(false);
  const { toggleCountdown, isActive, countdown, resetCountdown } = useCountdown(
    () => setComplete(true),
    time,
    { pauseOnReset }
  );

  if (complete) {
    return <h1>{"⏰ TIMES UP!"}</h1>;
  }

  return (
    <div className="App">
      <h1>{`${countdown / 1000} seconds`}</h1>
      <p>{isActive ? "COUNTING DOWN" : "PAUSED"}</p>
      <label htmlFor="timeout-slider">Time: </label>
      <input
        id="timeout-slider"
        step="1000"
        min="1000"
        max="20000"
        type="range"
        value={time}
        onChange={event => setTime(event.target.value)}
      />
      <button onClick={toggleCountdown}>{isActive ? "PAUSE" : "START"}</button>
      <button onClick={resetCountdown}>RESET</button>
      <button onClick={() => setPauseOnReset(prev => !prev)}>
        {pauseOnReset ? "👍" : "👎"}
      </button>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
