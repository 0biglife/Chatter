export const unixTimeToDate = (unixTime: number) => {
  const date = new Date(unixTime);
  date.setDate(date.getDate() - 1);
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let secounds = date.getSeconds();

  if (hour.toString().length < 2) {
    hour = `0${hour}`;
  }
  if (minutes.toString().length < 2) {
    minutes = `0${minutes}`;
  }
  if (secounds.toString().length < 2) {
    secounds = `0${secounds}`;
  }
  return hour + ':' + minutes + ':' + secounds;
};
