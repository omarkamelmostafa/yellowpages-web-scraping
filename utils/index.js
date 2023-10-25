export const writeExcel = async (data) => {
  const fileDir = `./data/excel/`;
  createDirIfNotExists(fileDir);
  const fileName = `./data/excel/quotes-${generateFileName()}.xlsx`;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Quotes");

  // data.map(quote => {
  //   return quote;
  // });

  sheet.columns = [
    { header: "ID", key: "ID", name: "ID" },
    { header: "Quote Content", key: "quoteContent", name: "quoteContent" },
    { header: "Quote Author", key: "quoteAuthor", name: "quoteAuthor" },
    { header: "Quote Tags", key: "quoteTags", name: "quoteTags" },
  ];
  sheet.addRows(data);

  try {
    await workbook.xlsx.writeFile(fileName);
    console.log("Excel file created: ", fileName);
  } catch (err) {
    console.log(err);
  }
};

export const writeJson = async (data) => {
  // write array of data to json file and write it to file
  const fileDir = `./data/json/`;
  createDirIfNotExists(fileDir);
  const fileName = `./data/json/quotes-${generateFileName()}.json`;

  try {
    await fs.writeFile(fileName, JSON.stringify(data, null, 2));
    console.log("JSON file created: ", fileName);
  } catch (err) {
    console.error(err);
  }
};
