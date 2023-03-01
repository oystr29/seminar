import Time from "./Time";

export default function MyCountDown({ formatted }) {
  const { days, hours, minutes, seconds } = formatted;
  return (
    <div className="flex">
      <Time time="Hari" count={days} />
      <Time time="Jam" count={hours} />
      <Time time="Menit" count={minutes} />
      <Time time="Detik" count={seconds} />
    </div>
  );
}
