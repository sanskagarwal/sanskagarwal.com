"use client";

import React, { useEffect } from "react";

// @ts-ignore
const insertScript = (id, parentElement) => {
    const script = window.document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.id = id;
    let url = window.location.origin + window.location.pathname;
    if (url.endsWith("/")) {
        url = url.slice(0, -1);
    }

    // Now the actual config and script-fetching function:
    script.innerHTML = `
    var remark_config = {
      host: "https://commento.sanskagarwal.com",
      site_id: "remark",
      url: "${url}",
      components: ["embed"],
      show_rss_subscription: false,
      no_footer: true
    };
    !function(e,n){for(var o=0;o<e.length;o++){var r=n.createElement("script"),c=".js",d=n.head||n.body;"noModule"in r?(r.type="module",c=".mjs"):r.async=!0,r.defer=!0,r.src=remark_config.host+"/web/"+e[o]+c,d.appendChild(r)}}(remark_config.components||["embed"],document);`;
    parentElement.appendChild(script);
};

// @ts-ignore
const removeScript = (id, parentElement) => {
    const script = window.document.getElementById(id);
    if (script) {
        parentElement.removeChild(script);
    }
};

const manageScript = () => {
    if (!window) {
        return;
    }
    const document = window.document;
    if (document.getElementById("remark42")) {
        insertScript("comments-script", document.body);
    }
    return () => removeScript("comments-script", document.body);
};

const recreateRemark42Instance = () => {
    if (!window) {
        return;
    }

    // @ts-ignore
    const remark42 = window.REMARK42;
    if (remark42) {
        remark42.destroy();

        // @ts-ignore
        remark42.createInstance(window.remark_config);
    }
};

const Remark42: React.FC = () => {
    useEffect(() => {
        manageScript();
    }, []);

    useEffect(() => {
        recreateRemark42Instance();
    });

    return (
        <div>
            <div id="remark42" />
        </div>
    );
};

export default Remark42;
