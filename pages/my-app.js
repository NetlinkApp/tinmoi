import cheerio from "cheerio";
import axios from "axios";
import Head from "next/head";

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

  const $ = cheerio.load(response.data);
  var title, image, description, bodyOne, bodyTwo;
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
//   const filePath = "./datt.js";
//   const fileContent = `<div>
//   <Head>
//     <title>${title}</title>
//     <meta name="description" content={${description}} />
//     <meta property="og:title" content=${title} />
//     <meta property="og:description" content={${description}} />
//     <meta property="og:image" content={${image}} />
//   </Head>
//   <div dangerouslySetInnerHTML={{ __html: ${bodyOne} }} />;
//   <div
//     class="content-detail text-justify"
//     id="main-detail"
//     itemprop="articleBody"
//   >
//     <div dangerouslySetInnerHTML={{ __html: ${bodyTwo}  }} />;
//   </div>
// </div>`;
//   const fs = require("fs");
//   await fs.promises.writeFile(filePath, fileContent, "utf-8");
  return {
    props: {
      title,
      description,
      image,
      bodyOne,
      bodyTwo,
    },
  };
}

function Post(props) {
  return (
    <div>
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
