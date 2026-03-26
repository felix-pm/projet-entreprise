export async function getElement(pathData, title, key) {
  try {
    const rawData = await fs.promises.readFile(
      path.join(pathData, `${title}.json`),
    );
    const data = JSON.parse(rawData);
    console.log(data[key]);
    return data[key];
  } catch (err) {
    console.error(err);
  }
}
