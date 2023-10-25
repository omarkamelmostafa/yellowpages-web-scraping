export const sleep = async () => {
  var DEFAULT_MIN_SLEEP_TIME = 1;
  var DEFAULT_MAX_SLEEP_TIME = 20;

  var sleepDuration =
    Math.floor(
      Math.random() * (DEFAULT_MAX_SLEEP_TIME - DEFAULT_MIN_SLEEP_TIME + 1) +
        DEFAULT_MIN_SLEEP_TIME
    ) * 1000;
  console.log(`😴 Zzz... sleeping for ${sleepDuration / 1000} seconds... 😴`);
  const sleepPromise = new Promise((resolve) => {
    setTimeout(resolve, sleepDuration);
  });
  await sleepPromise;
};

// const main = async () => {
//   console.log(`seconds: ${new Date().getSeconds()}`);
//   await sleep();
//   console.log(`seconds: ${new Date().getSeconds()}`);
//   await sleep();
//   console.log(`seconds: ${new Date().getSeconds()}`);
// };

// main();
