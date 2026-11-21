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
  if(typeof(input) != "string"){
    var dateString = toLocalISOTime(input);
  }
  
  let dateArray = dateString.split("");
  let newDate: string = ``;

  for(let i in dateArray){
    if(dateArray[i] === "T"){
      dateArray[i] = " ";
    }
  }

  newDate = dateArray.slice(0, dateArray.length-5).reduce((acc, curr) => acc + curr.toString(), '');

  return newDate;
}