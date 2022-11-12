const getContent = async (page, element) => {
  const contentStr = await page.evaluate((element) => {
    const contentEl = document.querySelector(element);
    const content = contentEl?.getAttribute("content");

    if (content != null && content.length > 0) {
      return content;
    } else {
      return null;
    }
  }, element);
  return contentStr;
};
