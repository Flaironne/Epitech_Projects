const fs = require("fs");
const readme = `
# Projet cybersécurité

## Progession des rooms (%rooms_total%)
![](https://progress-bar.dev/%rooms%/)

## Progession des flags (%flags_total%)
![](https://progress-bar.dev/%flags%/)
`;

const __rooms = __dirname + "/rooms";

const roomsCount = 12;
const flagsCount = 26;

const updateReadme = (rooms) => {
  const roomsDone = rooms.filter((room) => room.done).length;
  const flagsDone = rooms.reduce((acc, room) => acc + room.flagsDone, 0);

  const percentageRooms = Math.round((roomsDone / roomsCount) * 100);
  const percentageFlags = Math.round((flagsDone / flagsCount) * 100);

  const newReadme = readme
    .replace(/%rooms_total%/, `${roomsDone}/${roomsCount}`)
    .replace(/%flags_total%/, `${flagsDone}/${flagsCount}`)
    .replace(/%rooms%/, percentageRooms)
    .replace(/%flags%/, percentageFlags);

  fs.writeFileSync("README.md", newReadme);
};

const retrieveRooms = () => {
  const files = fs
    .readdirSync(__rooms)
    .filter((file) => file.endsWith(".md") && file !== "README.md");

  const firstLines = files.map((file) => {
    const content = fs.readFileSync(`${__rooms}/${file}`, "utf8");
    return content.split("\n")[0];
  });

  const rooms = [];

  firstLines.map((line) => {
    const name = line.split("# ")[1]?.split("🔳")[0]?.split("⬜")[0].trim();
    const flags =
      [...line.matchAll(/🔳/g), ...line.matchAll(/⬜/g)].map(
        (match) => match[0]
      ) || [];
    const flagsDone = line.match(/🔳/g) || [];

    rooms.push({
      name,
      flags: flags.length,
      flagsDone: flagsDone ? flagsDone.length : 0,
      done: flags.length === flagsDone.length,
    });
  });

  return rooms;
};

updateReadme(retrieveRooms());
