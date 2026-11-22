export function toLocalISOTime(input: Date | string): string {
  const d = new Date(input);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:00.000Z`
  );
}

export function toReadableTime(input: Date | string): string {
  var dateString = String(input);
  if (typeof input != "string") {
    var dateString = toLocalISOTime(input);
  }

  let dateArray = dateString.split("");
  let newDate: string = ``;

  let datePart = "";
  let hourPart = "";

  for (let i=0; i < dateArray.length; i++) {
    if (dateArray[i] === "T") {
      dateArray.map((letter: string, idx: number) => {
        if (idx < i && dateArray[i] !== undefined) {
          if(letter == "-"){
            letter = "/";
          }
          datePart += letter;
        }
        if (idx > i && dateArray[i] !== undefined && letter != "Z") {
          hourPart += letter;
        }
      });
    }
  }

  newDate = datePart + ", " + hourPart.slice(0, hourPart.length - 4);

  return newDate;
}
