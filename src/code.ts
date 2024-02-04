if (figma.command == "removebgfunc") {
  async function checkFill(fill, apiKey) {
    if (fill.type === "IMAGE") {
      figma.showUI(__html__, { visible: false });

      const image = figma.getImageByHash(fill.imageHash);
      const bytes = await image.getBytesAsync();

      figma.ui.postMessage({
        type: "run",
        bytes: bytes,
        apikey: apiKey,
      });

      const response: { uint8Array: Uint8Array; credits: string } =
        await new Promise((resolve, reject) => {
          figma.ui.onmessage = (res) => {
            if (
              typeof res["errors"] !== "undefined" &&
              Array.isArray(res["errors"]) &&
              res["errors"].length > 0
            ) {
              figma.closePlugin(res["errors"][0].title);
            } else {
              resolve(res);
            }
          };
        });

      const newImageFill = JSON.parse(JSON.stringify(fill));
      newImageFill.imageHash = figma.createImage(response.uint8Array).hash;

      return {
        fill: newImageFill,
        credits: response.credits,
        updated: true,
      };
    }
    return {
      fill: fill,
      updated: false,
    };
  }

  async function removeBG(node, apiKey) {
    let types = ["RECTANGLE", "ELLIPSE", "POLYGON", "STAR", "VECTOR", "TEXT"];
    if (types.indexOf(node.type) > -1) {
      let newFills = [],
        updated = false,
        check;
      for (const fill of node.fills) {
        check = await checkFill(fill, apiKey);
        updated = check.updated || updated;
        newFills.push(check.fill);
      }
      node.fills = newFills;
      figma.closePlugin(
        updated
          ? `Image background removed${
              typeof check.credits !== "undefined" &&
              check.credits.toString().length > 0
                ? ` (${check.credits} ${
                    Number(check.credits) === 1 ? "credit" : "credits"
                  } charged)`
                : ""
            }.`
          : "Nothing changed (No credits charged)."
      );
    } else {
      figma.closePlugin("Select a node with image fill.");
    }
  }

  if (figma.currentPage.selection.length !== 1) {
    figma.closePlugin("Select a single node.");
  }

  figma.clientStorage.getAsync("removeBgApiKey").then((apiKey) => {
    if (apiKey) {
      removeBG(figma.currentPage.selection[0], apiKey);
    } else {
      figma.closePlugin("Set API Key first.");
    }
  });
} else if (figma.command == "removebgkey") {
  figma.clientStorage.getAsync("removeBgApiKey").then((apiKey) => {
    figma.showUI(__html__, {
      height: 220,
      width: 348,
      visible: true,
      themeColors: true,
    });
    figma.ui.postMessage({
      type: "key",
      apikey: apiKey,
    });
    figma.ui.onmessage = (response) => {
      figma.clientStorage.setAsync("removeBgApiKey", response).then(() => {
        figma.closePlugin("API Key set.");
      });
    };
  });
}
