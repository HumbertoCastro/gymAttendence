import { GymAttendanceData } from "../Jsons/Frequency";

export default function Participant({
    participant,
}: {
    participant: GymAttendanceData;
}) {
  return (
    <div key={participant.name} className="participant-goal">
      <h3 className="name">{participant.name}: </h3>
      <div className="info-div">
        <p>Peso Inicial ( kg ) </p>
        <h1 className="info">{participant.participant.weight.current}</h1>
      </div>
      <div className="info-div">
        <p>Peso Desejado ( kg ) </p>
        <h1 className="info-red">{participant.participant.weight.desired}</h1>
      </div>
      <div className="info-div">
        <p>BF ( % ) Atual </p>
        <h1 className="info">
          {participant.participant.bodyFatPercentage.current}
        </h1>
      </div>
      <div className="info-div">
        <p>BF ( % ) Desejado </p>
        <h1 className="info-red">
          {participant.participant.bodyFatPercentage.desired}
        </h1>
      </div>
      <div className="info-div">
        <p>Frequência Semanal </p>
        <h1 className="info-red">
          {participant.participant.attendanceDaysPerWeek}
        </h1>
      </div>
    </div>
  );
}
