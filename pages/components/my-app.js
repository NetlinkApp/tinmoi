import cheerio from "cheerio";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { saveAs } from "file-saver";

export async function getServerSideProps(context) {
  const { data } = context.query;

  if (!data) {
    return {
      redirect: {
        destination: "/error-page",
        permanent: false,
      },
    };
  }
  var response;
  if (data.endsWith(".html")) {
    response = await axios.get(data);
  } else {
    response = await axios.get(data + ".html");
  }
  // const response = await axios.get('https://tinmoi.vn/bo-gddt-du-kien-thoi-gian-cong-bo-ket-qua-thi-tot-nghiep-thpt-011623026.html');

  const $ = cheerio.load(response.data, {
    xmlMode: true,
  });
  var title, image, description, bodyOne, bodyTwo, filePath;
  $("center").remove();
  $("head").map((index, el) => {
    title = $(el).find("title").text(); //title
    image = $(el).find('meta[property="og:image"]').attr("content");
    description = $(el).find('meta[name="description"]').attr("content");
  });
  $(".main-content-detail").map((i, el) => {
    bodyOne = $(el).find(".title-page-detail").html(); //title
    bodyTwo = $(el).find(".content-detail.text-justify").html();
  });

  //wirte file
  filePath = `./${title
    .toLowerCase()
    .replace(/[.,]/g, "")
    .replace(/\s+/g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

    .replace(/[đĐ]/g, "d")}.js`;
  // const fileContent = `<div></div>`;
  // const fs = require("fs");
  // await fs.promises.writeFile(filePath, fileContent, "utf-8");
  return {
    props: {
      title,
      description,
      image,
      bodyOne,
      bodyTwo,
      filePath,
    },
  };
}

function Post(props) {
  function downloadFile() {
    var text = `<div>
   
    <Head>
      <title>"${props.title}"</title>
      <meta name="description" content="${props.description}" />
      <meta property="og:title" content="${props.title}" />
      <meta property="og:description" content="${props.description}" />
      <meta property="og:image" content="${props.image}"/>
    </Head>
    <div> ${props.bodyOne} </div>;
    <div
      class="content-detail text-justify"
      id="main-detail"
      itemprop="articleBody"
    >
       ${props.bodyTwo.replace(/<[^>]+>/g, "\n$&")} 
    </div>
   
  </div>`;
    const blob = new Blob([text], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = props.filePath;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  return (
    <div>
      <button onClick={downloadFile} className="fixed-button">
        Download
      </button>
      <Head>
        <title>{props.title}</title>
        <meta name="description" content={props.description} />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.description} />
        <meta property="og:image" content={props.image} />
      </Head>
      <div dangerouslySetInnerHTML={{ __html: props.bodyOne }} />;
      <div
        class="content-detail text-justify"
        id="main-detail"
        itemprop="articleBody"
      >
        <div dangerouslySetInnerHTML={{ __html: props.bodyTwo }} />;
      </div>
      <style type="text/css">
        {`
            body { background: #fff !important; }
            .title-page-detail, .content-detail, h1, a { color: #000 !important; display: block !important; }
          `}
      </style>
    </div>
  );
}

export default Post;
