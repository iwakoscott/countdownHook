# `useCountdown` Hook! 🕰

## How do I use `useCountdown`?

Great question! It is super simple to use. You will just need to provide the following:

1. `callback` to be called once the timer completes,
2. `timeout` is the time in milliseconds for the timer,
3. and an optional `options` object. So far, the only option that you can provide is a `pauseOnReset` which is a `boolean` value determining whether or not the countdown should pause after the `resetCountdown` handler is invoked.

The hook then provides four useful properties:

1. `isActive` is a `boolean` value that determines if the countdown is currently active.
2. `countdown` is the time left in milliseconds. This might be useful if you want to present the user how much time is left in the countdown.
3. `toggleCountdown` is a function that starts and stops the countdown.
4. `resetCountdown` will stop the countdown and reset the countdown to the initial `timeout`.

Heres an example usage:

```jsx
function App() {
  const [time, setTime] = React.useState(10000);
  const [complete, setComplete] = React.useState(false);

  const { toggleCountdown, isActive, countdown, resetCountdown } = useCountdown(
    () => setComplete(true),
    time
  );

  if (complete) {
    return <h1>{"⏰ TIMES UP!"}</h1>;
  }

  return (
    <div className="App">
      <h1>{`${countdown / 1000} seconds`}</h1>
      <p>{isActive ? "COUNTING DOWN" : "PAUSED"}</p>
      <input
        step="1000"
        min="1000"
        max="20000"
        type="range"
        value={time}
        onChange={event => setTime(event.target.value)}
      />
      <button onClick={toggleCountdown}>{isActive ? "PAUSE" : "START"}</button>
      <button onClick={resetCountdown}>RESET</button>
    </div>
  );
}
```
