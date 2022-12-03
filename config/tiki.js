const { URL, URLSearchParams } = require("url");
const assert = require("assert");
const { response } = require("express");

module.exports = {
  website: "Tiki",
  domain: "tiki.vn",
  color: "#189eff",
  logo: "https://i.imgur.com/Tqa8FCc.png",
  time_check: 15,
  active: true,
  // Get productId
  productId: async (url) => {
    try {
      const parsed = new URL(url);
      const regexURL = /[0-9]+/i;
      // Index of URL include productId 
      const lastIndexUrl = parsed.pathname.split('-').at(-1);
      const productId = lastIndexUrl.match(regexURL);
      // const spId = parsed.searchParams.get('spid');
      // assert(spId !== null);
      // console.log(spId);
      return productId;
    } catch {}
  },


  product_api: `https://tiki.vn/api/v2/products/{product_id}/info`,
  format_func: (json) => {
    let { price, is_deal, qty, product_id, inventory_status } = json;
    inventory_status = inventory_status == "available" ? true : false;
    if (DEBUG) price = price - Math.round(Math.random() * 1000);
    return { price, is_deal, qty, product_id, inventory_status };
  },

  // TODO: rename this attr
  product_info_api: async (params) => {
    const url = params.url;
    let html = await fetchContent(url);
    if (!html) return false;

    // Fix tiki ?spid=<product_id> redirect
    if (html.indexOf("window.location.href = urlTarget") > -1) {
      const regex = /var\surlTarget\s=\s"([^"]+)";/gm;
      let m;
      while ((m = regex.exec(html)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        let newUrl = m[1];
        html = await fetchContent(newUrl);
      }
    }
    const dom = new JSDOM(html);

    let currency = "VND";
    let name = (dom.window.document.getElementById("product-name") || {})
      .textContent;
    if (name) name = name.trim();

    let description = "";
    try {
      description = dom.window.document
        .querySelector(".top-feature-item")
        .textContent.trim();
      description = description.replace(/\s{2,}/g, " ");
    } catch (e) {
      console.error(e, url);
    }

    let image = (dom.window.document.querySelector(".product-image img") || {})
      .src;

    return {
      name,
      description,
      currency,
      image,
    };
  },
  
  format_product_info: (json) => json,

  // init_data: async (params) => {
  //   console.log(initDataJajum);
  //   return await initDataJajum("tiki.vn", params);
  // },
};
